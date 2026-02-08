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
    description="Tag name."
    name="name"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.name"
  />
  <StringProperty
    description="Tag value."
    name="value"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.value"
  />
</template>
