<script setup>
const { operation } = defineProps(["operation"])
</script>

<template>
  <div class="block mb-3">
    <label class="block text-gray-700 mb-1">HTTP status</label>
    <pre
      class="p-3 bg-gray-600 overflow-x-auto text-sm"
      :class="{ 'text-green-400': operation.is2xx, 'text-red-400': !operation.is2xx }"
    >{{ operation.response.status }}</pre>
  </div>

  <div class="block mb-3" v-if="operation.responseBodyJson">
    <label class="block text-gray-700 mb-1">Response body</label>
    <pre class="p-3 bg-gray-600 text-white overflow-x-auto text-sm">{{ operation.responseBodyJson }}</pre>
  </div>
</template>
