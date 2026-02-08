<script setup>
import { viewerExpanded } from "../state.js"

function toggle() {
  viewerExpanded.value = !viewerExpanded.value
}
</script>

<template>
  <button
    class="
      px-3 py-1.5 border border-gray-200 text-gray-900 opacity-70 rounded-md cursor-pointer
      hover:bg-gray-50
    "
    :title="viewerExpanded ? 'Shrink viewer' : 'Expand viewer'"
    @click="toggle"
  >
    <svg
      v-if="!viewerExpanded"
      class="w-6 h-6"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 16 4-4-4-4m6 8 4-4-4-4" />
    </svg>
    <svg
      v-if="viewerExpanded"
      class="w-6 h-6"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 16-4-4 4-4m-6 8-4-4 4-4" />
    </svg>
  </button>
</template>
