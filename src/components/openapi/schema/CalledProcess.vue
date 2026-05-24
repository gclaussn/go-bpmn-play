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
    description="BPMN ID of the process to call."
    name="bpmnProcessId"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.bpmnProcessId"
  />
  <StringProperty
    description="Optional key, used to correlate the child process instance with a business entity."
    name="correlationKey"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.correlationKey"
  />
  <TagList
    description="Tags to apply to the child process instance."
    name="tags"
    :disabled="disabled"
    :required="false"
    v-model="model.tags"
  />
  <VariableDataList
    description="Variables to set at child process instance scope."
    name="variables"
    :disabled="disabled"
    :required="false"
    v-model="model.variables"
  />
  <StringProperty
    description="Version of the process to call."
    name="version"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.version"
  />
</template>
