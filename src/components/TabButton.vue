<script setup>
import { computed } from "vue"

const props = defineProps({
  active: Boolean,
  label: String,
  onClick: Function,
})

const classes = computed(() => ({
  "border-blue-600": props.active,
  "border-transparent": !props.active,
  "cursor-pointer": !props.active,
  "text-blue-600": props.active,
  "text-gray-600": !props.active,
}))
</script>

<template>
  <button
    class="
      flex-1 py-2 text-center text-sm border-b-2 font-medium
      hover:text-blue-600
      focus:outline-none
    "
    type="button"
    :class="classes"
    @click="props.onClick"
    >
      {{ props.label }}
  </button>
</template>
