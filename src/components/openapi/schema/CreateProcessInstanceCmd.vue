<script setup>
// generated, see template schema.vue.tpl
import StringProperty from "../StringProperty.vue"
import TagList from "./TagList.vue"
import VariableDataList from "./VariableDataList.vue"

const {
  disabled,
} = defineProps({
  disabled: Boolean,
})

const model = defineModel()
</script>

<template>
  <StringProperty
    description="BPMN ID of an existing process."
    name="bpmnProcessId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.bpmnProcessId"
  />
  <StringProperty
    description="Optional key, used to correlate a process instance with a business entity."
    name="correlationKey"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.correlationKey"
  />
  <TagList
    description="Tags."
    name="tags"
    :disabled="disabled"
    :required="false"
    v-model="model.tags"
  />
  <VariableDataList
    description="Variables to set at process instance scope."
    name="variables"
    :disabled="disabled"
    :required="false"
    v-model="model.variables"
  />
  <StringProperty
    description="Version of an existing process."
    name="version"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.version"
  />
  <StringProperty
    description="ID of the worker that created the process instance."
    name="workerId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.workerId"
  />
</template>
