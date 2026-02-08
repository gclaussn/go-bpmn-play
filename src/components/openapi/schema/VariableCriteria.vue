<script setup>
// generated, see template schema.vue.tpl
import StringListProperty from "../StringListProperty.vue"
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
    name="elementInstanceId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.elementInstanceId"
  />
  <StringListProperty
    description="Names of variables to include."
    name="names"
    :disabled="disabled"
    :required="false"
    v-model="model.names"
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
