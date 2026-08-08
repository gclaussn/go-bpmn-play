<script setup>
import { onMounted, useTemplateRef } from "vue"

const {
  data,
  disabled,
  property,
} = defineProps({
  data: Boolean,
  disabled: Boolean,
  property: Object,
})

const input = useTemplateRef("input")

function getData() {
  return input.value.checked
}

defineExpose({ getData })

onMounted(() => {
  input.value.checked = data
})
</script>

<template>
  <input
    class="
      h-4 w-4 shrink-0 rounded border border-gray-400  bg-white outline-none transition
      checked:border-blue-600 checked:bg-blue-600
      focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
      disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100
    "
    ref="input"
    type="checkbox"
    :disabled="disabled"
  />
</template>
