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
    description="Message correlation key."
    name="correlationKey"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.correlationKey"
  />
  <StringProperty
    description="Message name."
    name="name"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.name"
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
