<script setup>
// generated, see template schema.vue.tpl
import StringProperty from "../StringProperty.vue"

const {
  disabled,
} = defineProps({
  disabled: Boolean,
})

const model = defineModel()
</script>

<template>
  <StringProperty
    description="Element ID of the escalation event within the BPMN XML."
    name="bpmnElementId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.bpmnElementId"
  />
  <StringProperty
    description="Code of a BPMN escalation."
    name="escalationCode"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.escalationCode"
  />
</template>
