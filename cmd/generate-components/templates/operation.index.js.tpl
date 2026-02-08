// generated, see template operation.index.js.tpl
{{- range $operation := .operations}}
import {{$operation.Component}} from "./{{$operation.Component}}.vue"
{{- end}}

export const components = {
{{- range $operation := .operations}}
  {{$operation.Component}},
{{- end}}
}

export const descriptions = {
{{- range $operation := .operations}}
  {{$operation.Component}}: "{{$operation.Description}}",
{{- end}}
}

export const names = {
{{- range $operation := .operations}}
  {{$operation.Component}}: "{{$operation.Name}}",
{{- end}}
}
