<script setup>
const { operation } = defineProps(["operation"])
</script>

<template>
  <div class="block mb-3">
    <label class="block text-gray-700 mb-1">HTTP method</label>
    <pre class="p-3 bg-gray-600 text-white overflow-x-auto text-sm">{{ operation.request.method }}</pre>
  </div>

  <div class="block mb-3">
    <label class="block text-gray-700 mb-1">Request URI</label>
    <pre class="p-3 bg-gray-600 text-white overflow-x-auto text-sm">{{ operation.request.uri }}</pre>
  </div>

  <div class="block mb-3" v-if="operation.request.body">
    <label class="block text-gray-700 mb-1">Request body</label>
    <pre class="p-3 bg-gray-600 text-white overflow-x-auto text-sm">{{ operation.request.body }}</pre>
  </div>
</template>
