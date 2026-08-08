<script setup>
import { onMounted, useTemplateRef } from "vue"

const {
  data,
  disabled,
  property,
} = defineProps({
  data: Number,
  disabled: Boolean,
  property: Object,
})

const input = useTemplateRef("input")

function getData() {
  const value = parseInt(input.value.value)
  return isNaN(value) || value == 0 ? undefined : value
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
    type="number"
    :disabled="disabled"
    :placeholder="!disabled && property.placeholder ? property.placeholder : ''"
  />
</template>
