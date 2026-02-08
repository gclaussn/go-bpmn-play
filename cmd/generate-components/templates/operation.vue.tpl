<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"

{{- range $import := imports .}}
import {{$import.Name}} from "{{$import.Path}}.vue"
{{- end}}

const {
  disabled,
  execute,
  operation,
} = defineProps({
  disabled: Boolean,
  execute: Function,
  operation: Object,
})

const model = reactive({
{{- range $parameter := .PathParameters}}
  {{- if eq $parameter.Type "integer"}}
  {{$parameter.Name}}: operation.data["{{$parameter.Name}}"],
  {{- else}}
  {{$parameter.Name}}: operation.data["{{$parameter.Name}}"] || {{defaultValue $parameter.Type}},
  {{- end}}
{{- end}}
{{- if .Schema}}
  {{- range $property := .Schema.Properties}}
    {{- if eq $property.Type "integer"}}
  {{$property.Name}}: operation.data["{{$property.Name}}"],
    {{- else if and (eq $property.Type "object") (eq $property.SchemaId "TaskType")}}
  {{$property.Name}}: operation.data["{{$property.Name}}"] || "",
    {{- else}}
  {{$property.Name}}: operation.data["{{$property.Name}}"] || {{defaultValue $property.Type}},
    {{- end}}
  {{- end}}
{{- end}}
})

function onExecute() {
  const data = toRaw(model)

  const uri = "{{.RequestUri}}"
{{- range $parameter := .PathParameters}}
  {{- if eq $parameter.Type "integer"}}
    .replace("{{ "{" }}{{$parameter.Name}}{{ "}" }}", Number.isInteger(data["{{$parameter.Name}}"]) ? data["{{$parameter.Name}}"] : "-")
  {{- else}}
    .replace("{{ "{" }}{{$parameter.Name}}{{ "}" }}", data["{{$parameter.Name}}"] || "-")
  {{- end}}
{{- end}}

  execute({
    operationId: "{{.Id}}",
    method: "{{.Method}}",
    uri: uri,
{{- if .Schema}}
    body: {
  {{- range $property := .Schema.Properties}}
    {{- if eq $property.Type "array"}}
      {{$property.Name}}: data["{{$property.Name}}"].length == 0 ? undefined : data["{{$property.Name}}"],
    {{- else if eq $property.Type "integer"}}
      {{$property.Name}}: data["{{$property.Name}}"] === 0 || data["{{$property.Name}}"] === "" ? undefined : data["{{$property.Name}}"],
    {{- else if eq $property.Type "object"}}
      {{$property.Name}}: Object.keys(data["{{$property.Name}}"]).length == 0 ? undefined : data["{{$property.Name}}"],
    {{- else if eq $property.Type "string"}}
      {{$property.Name}}: data["{{$property.Name}}"] === "" ? undefined : data["{{$property.Name}}"],
    {{- else}}
      {{$property.Name}}: data["{{$property.Name}}"],
    {{- end}}
  {{- end}}
    }
{{- end}}
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
{{- range $parameter := .PathParameters}}
  <StringProperty
    description="{{$parameter.Description}}"
    name="{{$parameter.Name}}"
    placeholder="{{placeholder $parameter.Type $parameter.Format}}"
    :disabled="disabled"
    :required="{{$parameter.Required}}"
    {{- if eq $parameter.Type "integer"}}
    v-model.number="model.{{$parameter.Name}}"
    {{- else}}
    v-model="model.{{$parameter.Name}}"
    {{- end}}
  />
{{- end}}

{{- if .Schema}}
  <{{.Schema.Id}}
    :disabled="disabled"
    v-model="model"
  />
{{- end}}

  <div v-if="!disabled" class="flex justify-center">
    <button
      class="
        px-6 py-2 bg-blue-600 rounded-md text-white cursor-pointer
        hover:bg-blue-700
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
      type="button"
      @click="onExecute"
    >
      Execute
    </button>
  </div>
</template>
