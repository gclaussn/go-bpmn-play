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
    description="A future point in time."
    name="time"
    placeholder="2006-01-02T15:04:05Z07:00"
    :disabled="disabled"
    :required="true"
    v-model="model.time"
  />
</template>
