<script setup>
// generated, see template schema.vue.tpl
{{- range $import := imports .}}
import {{$import.Name}} from "{{$import.Path}}.vue"
{{- end}}

const {
  disabled,
} = defineProps({
  disabled: Boolean,
})

const model = defineModel()
</script>

<template>
{{- range $property := .Properties}}
  {{- if and (eq $property.Type "array") (not $property.SchemaId)}}
  <StringListProperty
    description="{{$property.Description}}"
    name="{{$property.Name}}"
    {{- if eq $property.Name "processIds"}}
    :disabled="true"
    {{- else}}
    :disabled="disabled"
    {{- end}}
    :required="{{$property.Required}}"
    v-model="model.{{$property.Name}}"
  />
  {{- else if eq $property.Type "array"}}
  <{{$property.SchemaId}}List
    description="{{$property.Description}}"
    name="{{$property.Name}}"
    :disabled="disabled"
    :required="{{$property.Required}}"
    v-model="model.{{$property.Name}}"
  />
  {{- else if eq $property.Type "object"}}
  <div>
    <label
      class="block text-gray-700 mb-2"
      for="name"
    >
      <span>{{$property.Name}}</span>
      {{- if $property.Required}}
      <span class="text-red-600">*</span>
      {{- end}}
      <br />
      <span class="text-sm">{{$property.Description}}</span>
    </label>
    <div class="pl-4">
      <{{$property.SchemaId}}
        :disabled="disabled"
        v-model="model.{{$property.Name}}"
      />
    </div>
  </div>
  {{- else if eq $property.Type "boolean"}}
  <BooleanProperty
    description="{{$property.Description}}"
    name="{{$property.Name}}"
    :disabled="disabled"
    :required="{{$property.Required}}"
    v-model="model.{{$property.Name}}"
  />
  {{- else if eq $property.Name "bpmnXml"}}
  <StringProperty v-if="model.bpmnXml.length != 0"
    description="{{$property.Description}}"
    name="{{$property.Name}}"
    placeholder="{{placeholder $property.Type $property.Format}}"
    :disabled="true"
    :required="{{$property.Required}}"
    v-model="model.bpmnXml"
  />
  <FileProperty v-if="model.bpmnXml.length == 0"
    description="{{$property.Description}}"
    name="{{$property.Name}}"
    :required="{{$property.Required}}"
    v-model="model.bpmnXml"
  />
  {{- else}}
  <StringProperty
    description="{{$property.Description}}"
    name="{{$property.Name}}"
    placeholder="{{placeholder $property.Type $property.Format}}"
    :disabled="disabled"
    :required="{{$property.Required}}"
    {{- if eq $property.Type "integer"}}
    v-model.number="model.{{$property.Name}}"
    {{- else}}
    v-model="model.{{$property.Name}}"
    {{- end}}
  />
  {{- end}}
{{- end}}
{{- if eq .Type "string"}}
  <StringProperty
    :disabled="disabled"
    v-model="model"
  />
{{- end}}
</template>
