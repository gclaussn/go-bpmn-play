package main

import (
	"bytes"
	"embed"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"slices"
	"strings"
	"text/template"

	"gopkg.in/yaml.v3"
)

//go:embed templates
var resources embed.FS

var exludedOperations = []string{
	"checkReadiness",
	"getBpmnXml",
}

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

	// generate operations
	operations := g.mapOperations()

	operationIndexJs := g.generateOperationIndexJs(operations)
	writeFile(outputPath, "operation/index.js", operationIndexJs)

	for _, operation := range operations {
		vue := g.generateOperationVue(operation)
		writeFile(outputPath, fmt.Sprintf("operation/%s.vue", operation.Component), vue)
	}

	// generate definitions
	for _, operation := range operations {
		var properties []VueSchema

		for _, pathParameter := range operation.pathParameters {
			properties = append(properties, VueSchema{
				Name:        pathParameter.Name,
				Required:    pathParameter.Required,
				Description: pathParameter.Description,

				Type:   pathParameter.Type,
				Format: pathParameter.Format,

				InPath: true,
			})
		}

		if operation.schemaId != "" {
			schema := g.mapSchema(operation.schemaId)

			properties = append(properties, schema.Properties...)
		}

		for _, queryParameter := range operation.queryParameters {
			properties = append(properties, VueSchema{
				Name:        queryParameter.Name,
				Description: queryParameter.Description,

				Type:   queryParameter.Type,
				Format: queryParameter.Format,

				InQuery: true,
			})
		}

		definition := VueDefinition{
			Id:         operation.Id,
			Method:     operation.method,
			RequestUri: operation.requestUri,

			Properties: properties,
		}

		definitionJson, err := json.MarshalIndent(definition, "", "  ")
		if err != nil {
			log.Fatalf("failed to marshal definition: %v", err)
		}

		writeFile(outputPath, fmt.Sprintf("definition/%s.json", operation.Id), string(definitionJson))
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

	operationVue, err := template.New("operation.vue.tpl").ParseFS(resources, "templates/operation.vue.tpl")
	if err != nil {
		log.Fatalf("failed to parse template: %v", err)
	}

	g.operationIndexJs = operationIndexJs
	g.operationVue = operationVue

	return g
}

type generator struct {
	outputPath string

	openApi OpenApi

	operationIndexJs *template.Template
	operationVue     *template.Template
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
			switch operation.Id {
			case path.Get.Id:
				method = "GET"
			case path.Patch.Id:
				method = "PATCH"
			case path.Post.Id:
				method = "POST"
			case path.Put.Id:
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

				switch parameter.In {
				case "path":
					pathParameters = append(pathParameters, vueParameter)
				case "query":
					queryParameters = append(queryParameters, vueParameter)
				}
			}

			var schemaId string
			if contentType, ok := operation.RequestBody.ContentTypes["application/json"]; ok {
				schemaId = extractId(contentType.Schema.Reference)
			}

			results = append(results, VueOperation{
				Id:               operation.Id,
				Component:        strings.ToUpper(operation.Id[:1]) + operation.Id[1:],
				Name:             operation.Summary,
				Description:      slugDescription(operation.Description),
				ShortDescription: extractShortDescription(operation.Description),

				method:     method,
				requestUri: requestUri,

				pathParameters:  pathParameters,
				queryParameters: queryParameters,
				schemaId:        schemaId,
			})
		}
	}

	slices.SortFunc(results, func(a VueOperation, b VueOperation) int {
		return strings.Compare(a.Id, b.Id)
	})

	return results
}

func (g generator) mapSchema(id string) VueSchema {
	schema, ok := g.openApi.Components.Schemas[id]
	if !ok {
		log.Fatalf("schema %s: unknown", id)
	}

	var properties []VueSchema

	for propertyName, property := range schema.Properties {
		propertyType := property.Type
		if id == "CreateProcessCmd" && propertyName == "bpmnXml" {
			propertyType = "file"
		}

		vueSchema := VueSchema{
			Name:        propertyName,
			Required:    slices.Contains(schema.Required, propertyName),
			Description: slugDescription(property.Description),
			Type:        propertyType,
			Format:      property.Format,
		}

		switch property.Type {
		case "array":
			if property.Items.Reference != "" {
				referenceId := extractId(property.Items.Reference)
				referenceSchema := g.mapSchema(referenceId)

				vueSchema.Items = &referenceSchema
			} else {
				vueSchema.Items = &VueSchema{
					Type:   property.Items.Type,
					Format: property.Items.Format,
				}
			}
		case "":
			referenceId := extractId(property.Reference)
			referenceSchema := g.mapSchema(referenceId)

			vueSchema.Type = "object"
			vueSchema.Description = referenceSchema.Description
			vueSchema.Properties = referenceSchema.Properties
		}

		properties = append(properties, vueSchema)
	}

	slices.SortFunc(properties, func(a VueSchema, b VueSchema) int {
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

		// updateUserTask
		if a.Name == "revision" {
			return -1
		}
		if b.Name == "revision" {
			return 1
		}

		return strings.Compare(a.Name, b.Name)
	})

	return VueSchema{
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

func extractShortDescription(description string) string {
	a := strings.Index(description, "\n")
	if a == -1 {
		return description
	}
	return description[:a]
}

func slugDescription(description string) string {
	var sb strings.Builder

	var (
		bold         bool
		boldCount    int
		code         bool
		newLineCount int
	)
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
			if newLineCount < 2 {
				sb.WriteString("<br />")
			}
			newLineCount++
		case '*':
			boldCount++

			if boldCount == 2 {
				if bold {
					sb.WriteString("</b>")
					bold = false
				} else {
					bold = true
					sb.WriteString("<b>")
				}
			}
		default:
			sb.WriteRune(r)

			boldCount = 0
			newLineCount = 0
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
	Id               string
	Component        string
	Name             string
	ShortDescription string
	Description      string

	method     string
	requestUri string

	pathParameters  []VueParameter
	queryParameters []VueParameter
	schemaId        string
}

type VueParameter struct {
	Name        string
	Required    bool
	Description string
	Type        string
	Format      string
}

type VueDefinition struct {
	Id         string `json:"id"`
	Method     string `json:"method"`
	RequestUri string `json:"requestUri"`

	Properties []VueSchema `json:"properties"`
}

type VueSchema struct {
	Name        string `json:"name,omitempty"`
	Required    bool   `json:"required,omitempty"`
	Description string `json:"description,omitempty"`
	Type        string `json:"type"`
	Format      string `json:"format,omitempty"`

	Properties []VueSchema `json:"properties,omitempty"`

	Items *VueSchema `json:"items,omitempty"`

	InPath  bool `json:"inPath,omitempty"`
	InQuery bool `json:"inQuery,omitempty"`
}
