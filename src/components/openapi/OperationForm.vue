<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue"

import { buildUri } from "../../app.js"

import ObjectProperty from "./ObjectProperty.vue"

const {
  definition,
  disabled,
  execute,
  operation,
} = defineProps({
  definition: Object,
  disabled: Boolean,
  execute: Function,
  operation: Object,
})

const rootRef = ref(null)

let getData

function onExecute() {
  let data = getData()
  if (!data) {
    data = {}
  }

  const uri = buildUri(definition, data)

  execute({
    operationId: definition.id,
    method: definition.method,
    uri: uri,
    body: data,
  })
}

onMounted(() => {
  getData = rootRef.value.getData
})

onBeforeUnmount(() => {
  operation.data = getData()
})
</script>

<template>
  <ObjectProperty
    ref="rootRef"
    :data="operation.data || {}"
    :disabled="disabled"
    :properties="definition.properties"
  />

  <div v-if="!disabled" class="flex justify-center">
    <button
      class="
        px-6 py-2 bg-blue-600 rounded-md text-white cursor-pointer
        hover:bg-blue-700
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
      type="button"
      @click="onExecute"
    >
      Execute
    </button>
  </div>
</template>
