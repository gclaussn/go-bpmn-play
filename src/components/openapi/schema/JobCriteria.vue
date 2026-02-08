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
    description="Partition filter."
    name="partition"
    placeholder="2006-01-02"
    :disabled="disabled"
    :required="false"
    v-model="model.partition"
  />
  <StringProperty
    description="Job filter."
    name="id"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.id"
  />
  <StringProperty
    description="Element filter."
    name="elementId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.elementId"
  />
  <StringProperty
    description="Element instance filter."
    name="elementInstanceId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.elementInstanceId"
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
</template>
