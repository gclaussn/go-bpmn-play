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
    description="Element ID of the signal event within the BPMN XML."
    name="bpmnElementId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.bpmnElementId"
  />
  <StringProperty
    description="Name of a BPMN signal."
    name="signalName"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.signalName"
  />
</template>
