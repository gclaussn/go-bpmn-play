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
    description="Duration until the retry job or task becomes due."
    name="retryTimer"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.retryTimer"
  />
  <StringProperty
    description="ID of the worker that resolved the incident"
    name="workerId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.workerId"
  />
</template>
