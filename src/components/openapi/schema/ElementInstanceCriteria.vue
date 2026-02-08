<script setup>
// generated, see template schema.vue.tpl
import InstanceStateList from "./InstanceStateList.vue"
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
    description="Partition filter."
    name="partition"
    placeholder="2006-01-02"
    :disabled="disabled"
    :required="false"
    v-model="model.partition"
  />
  <StringProperty
    description="Element instance filter."
    name="id"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.id"
  />
  <StringProperty
    description="BPMN element ID filter."
    name="bpmnElementId"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.bpmnElementId"
  />
  <StringProperty
    description="Process filter."
    name="processId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.processId"
  />
  <StringProperty
    description="Process instance filter."
    name="processInstanceId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.processInstanceId"
  />
  <InstanceStateList
    description="States to include."
    name="states"
    :disabled="disabled"
    :required="false"
    v-model="model.states"
  />
</template>
