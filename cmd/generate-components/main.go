package main

import (
	"bytes"
	"embed"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"regexp"
	"slices"
	"strings"
	"text/template"
	"time"

	"gopkg.in/yaml.v3"
)

//go:embed templates
var resources embed.FS

var exludedOperations = []string{
	"checkReadiness",
	"getBpmnXml",
}

var inlineCodeRegexp *regexp.Regexp = regexp.MustCompile("`([A-Z]+)`")

func main() {
	log.SetFlags(0)

	flags := flag.NewFlagSet("generate-components", flag.ContinueOnError)
	flags.SetOutput(log.Writer())

	var sourcePath string
	flags.StringVar(&sourcePath, "source-path", ".", "path to the OpenAPI YAML file")
	var outputPath string
	flags.StringVar(&outputPath, "output-path", ".", "path to the output directory")

	if err := flags.Parse(os.Args[1:]); err != nil {
		if err == flag.ErrHelp {
			os.Exit(0)
		} else {
			os.Exit(1)
		}
	}

	if sourcePath == "" {
		log.Fatal("missing option: -source-path")
	}
	if outputPath == "" {
		log.Fatal("missing option: -output-path")
	}

	g := newGenerator(sourcePath, outputPath)

	schemas := make(map[string]*VueSchema)

	// generate operations
	operations := g.mapOperations()

	operationIndexJs := g.generateOperationIndexJs(operations)
	writeFile(outputPath, "operation/index.js", operationIndexJs)

	for _, operation := range operations {
		if operation.Schema != nil {
			// collect related schemas
			for _, schemaId := range g.collectSchemaIds(operation.Schema.Id) {
				if _, ok := schemas[schemaId]; !ok {
					schemas[schemaId] = g.mapSchema(schemaId)
				}
			}

			schemas[operation.Schema.Id] = operation.Schema
		}

		vue := g.generateOperationVue(operation)
		writeFile(outputPath, fmt.Sprintf("operation/%s.vue", operation.Component), vue)
	}

	// generate schemas
	for schemaId, schema := range schemas {
		for i, property := range schema.Properties {
			if property.Type == "object" {
				targetSchema := schemas[property.SchemaId]

				schema.Properties[i].Description = targetSchema.Description
			}
		}

		vue := g.generateSchemaVue(schema)
		writeFile(outputPath, fmt.Sprintf("schema/%s.vue", schemaId), vue)
	}

	// generate list schemas
	for _, schema := range schemas {
		for _, property := range schema.Properties {
			if property.Type == "array" && property.SchemaId != "" {
				targetSchema := schemas[property.SchemaId]

				vue := g.generateSchemaListVue(targetSchema)
				writeFile(outputPath, fmt.Sprintf("schema/%sList.vue", property.SchemaId), vue)
			}
		}
	}
}

func newGenerator(sourcePath string, outputPath string) generator {
	sourceFile, err := os.Open(sourcePath)
	if err != nil {
		log.Fatalf("failed to open file %s: %v", sourcePath, err)
	}

	defer sourceFile.Close()

	source, err := io.ReadAll(sourceFile)
	if err != nil {
		log.Fatalf("failed to read file %s: %v", sourcePath, err)
	}

	var openApi OpenApi
	if err := yaml.Unmarshal(source, &openApi); err != nil {
		log.Fatalf("failed to unmarshal OpenAPI YAML: %v", err)
	}

	g := generator{
		outputPath: outputPath,

		openApi: openApi,
	}

	operationIndexJs, err := template.New("operation.index.js.tpl").ParseFS(resources, "templates/operation.index.js.tpl")
	if err != nil {
		log.Fatalf("failed to parse template: %v", err)
	}

	operationVueFuncs := template.FuncMap{
		"defaultValue": getDefaultValue,
		"imports":      getOperationImports,
		"placeholder":  getPlaceholder,
	}

	operationVue, err := template.New("operation.vue.tpl").Funcs(operationVueFuncs).ParseFS(resources, "templates/operation.vue.tpl")
	if err != nil {
		log.Fatalf("failed to parse template: %v", err)
	}

	schemaVueFuncs := template.FuncMap{
		"imports":     getSchemaImports,
		"placeholder": getPlaceholder,
	}

	schemaVue, err := template.New("schema.vue.tpl").Funcs(schemaVueFuncs).ParseFS(resources, "templates/schema.vue.tpl")
	if err != nil {
		log.Fatalf("failed to parse template: %v", err)
	}

	schemaListVueFuncs := template.FuncMap{
		"defaultValue": getDefaultValue,
	}

	schemaListVue, err := template.New("schema.list.vue.tpl").Funcs(schemaListVueFuncs).ParseFS(resources, "templates/schema.list.vue.tpl")
	if err != nil {
		log.Fatalf("failed to parse template: %v", err)
	}

	g.operationIndexJs = operationIndexJs
	g.operationVue = operationVue
	g.schemaVue = schemaVue
	g.schemaListVue = schemaListVue

	return g
}

type generator struct {
	outputPath string

	openApi OpenApi

	operationIndexJs *template.Template
	operationVue     *template.Template
	schemaVue        *template.Template
	schemaListVue    *template.Template
}

func (g generator) collectSchemaIds(schemaId string) []string {
	ids := []string{schemaId}

	i := 0
	for i < len(ids) {
		schema, ok := g.openApi.Components.Schemas[ids[i]]
		if !ok {
			log.Fatalf("schema %s: unknown schema", ids[i])
		}

		for _, property := range schema.Properties {
			if property.Reference != "" {
				ids = append(ids, extractId(property.Reference))
			}
			if property.Items != nil && property.Items.Reference != "" {
				ids = append(ids, extractId(property.Items.Reference))
			}
		}

		i++
	}

	return ids
}

func (g generator) generateOperationVue(operation VueOperation) string {
	var b bytes.Buffer
	if err := g.operationVue.Execute(&b, operation); err != nil {
		log.Fatalf("failed to execute template: %v", err)
	}
	return b.String()
}

func (g generator) generateOperationIndexJs(operations []VueOperation) string {
	var b bytes.Buffer
	if err := g.operationIndexJs.Execute(&b, map[string]any{
		"operations": operations,
	}); err != nil {
		log.Fatalf("failed to execute template: %v", err)
	}
	return b.String()
}

func (g generator) generateSchemaVue(schema *VueSchema) string {
	var b bytes.Buffer
	if err := g.schemaVue.Execute(&b, schema); err != nil {
		log.Fatalf("failed to execute template: %v", err)
	}
	return b.String()
}

func (g generator) generateSchemaListVue(targetSchema *VueSchema) string {
	var b bytes.Buffer
	if err := g.schemaListVue.Execute(&b, targetSchema); err != nil {
		log.Fatalf("failed to execute template: %v", err)
	}
	return b.String()
}

func (g generator) mapOperations() []VueOperation {
	var results []VueOperation

	for requestUri, path := range g.openApi.Paths {
		var operations []Operation
		if path.Get.Id != "" {
			operations = append(operations, path.Get)
		}
		if path.Patch.Id != "" {
			operations = append(operations, path.Patch)
		}
		if path.Post.Id != "" {
			operations = append(operations, path.Post)
		}
		if path.Put.Id != "" {
			operations = append(operations, path.Put)
		}

		for _, operation := range operations {
			if slices.Contains(exludedOperations, operation.Id) {
				continue
			}

			var method string
			switch {
			case operation.Id == path.Get.Id:
				method = "GET"
			case operation.Id == path.Patch.Id:
				method = "PATCH"
			case operation.Id == path.Post.Id:
				method = "POST"
			case operation.Id == path.Put.Id:
				method = "PUT"
			default:
				log.Fatalf("operation %s: unknown method", operation.Id)
			}

			var (
				pathParameters  []VueParameter
				queryParameters []VueParameter
			)
			for _, parameter := range operation.Parameters {
				if parameter.Reference != "" {
					parameterId := extractId(parameter.Reference)

					p, ok := g.openApi.Components.Parameters[parameterId]
					if !ok {
						log.Fatalf("parameter %s: unknown", parameterId)
					}

					parameter = p
				}

				vueParameter := VueParameter{
					Name:        parameter.Name,
					Required:    parameter.Required,
					Description: slugDescription(parameter.Description),
					Type:        parameter.Schema.Type,
					Format:      parameter.Schema.Format,
				}

				if parameter.In == "path" {
					pathParameters = append(pathParameters, vueParameter)
				} else if parameter.In == "query" {
					queryParameters = append(queryParameters, vueParameter)
				}
			}

			var schemaId string
			if contentType, ok := operation.RequestBody.ContentTypes["application/json"]; ok {
				schemaId = extractId(contentType.Schema.Reference)
			}

			results = append(results, VueOperation{
				Id:          operation.Id,
				Component:   strings.ToUpper(operation.Id[:1]) + operation.Id[1:],
				Name:        operation.Summary,
				Description: slugDescription(operation.Description),

				Method:     method,
				RequestUri: requestUri,

				PathParameters:  pathParameters,
				QueryParameters: queryParameters,
				Schema:          g.mapSchema(schemaId),
			})
		}
	}

	slices.SortFunc(results, func(a VueOperation, b VueOperation) int {
		return strings.Compare(a.Id, b.Id)
	})

	return results
}

func (g generator) mapSchema(id string) *VueSchema {
	if id == "" {
		return nil
	}

	schema, ok := g.openApi.Components.Schemas[id]
	if !ok {
		log.Fatalf("schema %s: unknown", id)
	}

	var properties []VueProperty

	for propertyName, property := range schema.Properties {
		var (
			schemaId string
			items    *VueProperty
		)

		if property.Type == "array" {
			if property.Items.Reference != "" {
				schemaId = extractId(property.Items.Reference)
			} else {
				items = &VueProperty{
					Type:   property.Items.Type,
					Format: property.Items.Format,
				}
			}
		} else if property.Type == "" {
			property.Type = "object"
			schemaId = extractId(property.Reference)
		}

		properties = append(properties, VueProperty{
			Name:        propertyName,
			Required:    slices.Contains(schema.Required, propertyName),
			Description: slugDescription(property.Description),
			Type:        property.Type,
			Format:      property.Format,

			SchemaId: schemaId,

			Items: items,
		})
	}

	slices.SortFunc(properties, func(a VueProperty, b VueProperty) int {
		if a.Name == "partition" {
			return -1
		}
		if b.Name == "partition" {
			return 1
		}
		if a.Name == "id" {
			return -1
		}
		if b.Name == "id" {
			return 1
		}

		return strings.Compare(a.Name, b.Name)
	})

	return &VueSchema{
		Id:          id,
		Description: slugDescription(schema.Description),
		Type:        schema.Type,

		Properties: properties,
	}
}

func extractId(reference string) string {
	// e.g. #/components/schemas/CreateProcessCmd
	a := strings.LastIndex(reference, "/")
	if a == -1 {
		return ""
	}

	// e.g. CreateProcessCmd
	return reference[a+1:]
}

func getDefaultValue(valueType string) string {
	switch valueType {
	case "array":
		return "[]"
	case "boolean":
		return "false"
	case "integer":
		return "0"
	case "object":
		return "{}"
	default:
		return "\"\""
	}
}

func getPlaceholder(valueType string, format string) string {
	switch valueType {
	case "string":
		if format == "date" {
			return time.DateOnly
		}
		if format == "date-time" {
			return time.RFC3339
		}
	case "integer":
		return "0"
	}
	return ""
}

func getSchemaImports(schema *VueSchema) []VueImport {
	importMap := make(map[string]string)

	if schema.Type == "string" {
		name := "StringProperty"
		importMap[name] = "../" + name
	}

	for _, property := range schema.Properties {
		switch property.Type {
		case "string", "integer":
			name := "StringProperty"
			importMap[name] = "../" + name
		case "array":
			if property.SchemaId != "" {
				name := property.SchemaId + "List"
				importMap[name] = "./" + name
			} else {
				name := "StringListProperty"
				importMap[name] = "../" + name
			}
		case "boolean":
			name := "BooleanProperty"
			importMap[name] = "../" + name
		case "object":
			name := property.SchemaId
			importMap[name] = "./" + name
		default:
			log.Printf("schema %s: unsupported import %s\n", schema.Id, property.Name)
		}
	}

	imports := make([]VueImport, 0, len(importMap))
	for name, path := range importMap {
		imports = append(imports, VueImport{
			Name: name,
			Path: path,
		})
	}

	slices.SortFunc(imports, func(a VueImport, b VueImport) int {
		return strings.Compare(a.Name, b.Name)
	})

	return imports
}

func getOperationImports(operation VueOperation) []VueImport {
	importMap := make(map[string]string)

	for _, parameter := range operation.PathParameters {
		switch parameter.Type {
		case "string", "integer":
			name := "StringProperty"
			importMap[name] = "../" + name
		default:
			log.Printf("operation %s: unsupported import %s\n", operation.Id, parameter.Name)
		}
	}

	if operation.Schema != nil {
		name := operation.Schema.Id
		importMap[name] = "../schema/" + name
	}

	imports := make([]VueImport, 0, len(importMap))
	for name, path := range importMap {
		imports = append(imports, VueImport{
			Name: name,
			Path: path,
		})
	}

	slices.SortFunc(imports, func(a VueImport, b VueImport) int {
		return strings.Compare(a.Name, b.Name)
	})

	return imports
}

func slugDescription(description string) string {
	var sb strings.Builder

	var code bool
	for _, r := range strings.TrimSpace(description) {
		switch r {
		case '`':
			if code {
				sb.WriteString("</code>")
				code = false
			} else {
				sb.WriteString("<code class='description-code'>")
				code = true
			}
		case '\n':
			sb.WriteString("<br />")
		default:
			sb.WriteRune(r)
		}
	}

	return sb.String()
}

func writeFile(outputPath string, name string, output string) {
	f, err := os.OpenFile(fmt.Sprintf("%s/%s", outputPath, name), os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0755)
	if err != nil {
		log.Fatalf("failed to open %s file: %v", name, err)
	}

	defer f.Close()

	_, err = f.WriteString(output)
	if err != nil {
		log.Fatalf("failed to write %s file: %v", name, err)
	}
}

// OpenAPI

type OpenApi struct {
	Paths      map[string]Path `yaml:"paths"`
	Components Components      `yaml:"components"`
}

type Path struct {
	Get   Operation `yaml:"get"`
	Patch Operation `yaml:"patch"`
	Post  Operation `yaml:"post"`
	Put   Operation `yaml:"put"`
}

type Operation struct {
	Id          string `yaml:"operationId"`
	Summary     string `yaml:"summary"`
	Description string `yaml:"description"`

	Parameters  []Parameter `yaml:"parameters"`
	RequestBody RequestBody `yaml:"requestBody"`
}

type RequestBody struct {
	ContentTypes map[string]ContentType `yaml:"content"`
}

type ContentType struct {
	Schema Schema `yaml:"schema"`
}

type Components struct {
	Parameters map[string]Parameter `yaml:"parameters"`
	Schemas    map[string]Schema    `yaml:"schemas"`
}

type Parameter struct {
	Name        string          `yaml:"name"`
	In          string          `yaml:"in"`
	Description string          `yaml:"description"`
	Required    bool            `yaml:"required"`
	Schema      ParameterSchema `yaml:"schema"`

	Reference string `yaml:"$ref"`
}

type ParameterSchema struct {
	Type   string `yaml:"type"`
	Format string `yaml:"format"`
}

type Schema struct {
	Description string            `yaml:"description"`
	Type        string            `yaml:"type"`
	Format      string            `yaml:"format"`
	Required    []string          `yaml:"required"`
	Properties  map[string]Schema `yaml:"properties"`

	Reference string `yaml:"$ref"`

	Items *Schema `yaml:"items"`
}

// Vue

type VueOperation struct {
	Id          string
	Component   string
	Name        string
	Description string

	Method     string
	RequestUri string

	PathParameters  []VueParameter
	QueryParameters []VueParameter
	Schema          *VueSchema
}

type VueParameter struct {
	Name        string
	Required    bool
	Description string
	Type        string
	Format      string
}

type VueSchema struct {
	Id          string
	Description string
	Type        string

	Properties []VueProperty
}

type VueProperty struct {
	Name        string
	Required    bool
	Description string
	Type        string
	Format      string

	SchemaId string

	Items *VueProperty
}

type VueImport struct {
	Name string
	Path string
}
