<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import ProcessCriteria from "../schema/ProcessCriteria.vue"

const {
  disabled,
  execute,
  operation,
} = defineProps({
  disabled: Boolean,
  execute: Function,
  operation: Object,
})

const model = reactive({
  id: operation.data["id"],
  tags: operation.data["tags"] || [],
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/processes/query"

  execute({
    operationId: "queryProcesses",
    method: "POST",
    uri: uri,
    body: {
      id: data["id"] === 0 || data["id"] === "" ? undefined : data["id"],
      tags: data["tags"].length == 0 ? undefined : data["tags"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <ProcessCriteria
    :disabled="disabled"
    v-model="model"
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
