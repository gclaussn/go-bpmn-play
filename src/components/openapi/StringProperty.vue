<script setup>
import { onMounted, useTemplateRef } from "vue"

const {
  data,
  disabled,
  property,
} = defineProps({
  data: String,
  disabled: Boolean,
  property: Object,
})

let placeholder
if (property.format == "date") {
  placeholder = "2006-01-02"
} else if (property.format == "date-time") {
  placeholder = "2006-01-02T15:04:05Z07:00"
}

const input = useTemplateRef("input")

function getData() {
  return input.value.value || undefined
}

defineExpose({ getData })

onMounted(() => {
  input.value.value = data
})
</script>

<template>
  <input
    autocomplete="off"
    class="
      w-full px-3 py-2 border border-gray-300 rounded-md
      focus:outline-none focus:ring-2 focus:ring-blue-500
      disabled:opacity-80 disabled:bg-gray-200 disabled:text-gray-900
    "
    ref="input"
    type="text"
    :disabled="disabled"
    :placeholder="!disabled && placeholder ? placeholder : ''"
  />
</template>
