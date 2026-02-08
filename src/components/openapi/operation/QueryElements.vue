<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import ElementCriteria from "../schema/ElementCriteria.vue"

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
  bpmnElementId: operation.data["bpmnElementId"] || "",
  processId: operation.data["processId"],
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/elements/query"

  execute({
    operationId: "queryElements",
    method: "POST",
    uri: uri,
    body: {
      bpmnElementId: data["bpmnElementId"] === "" ? undefined : data["bpmnElementId"],
      processId: data["processId"] === 0 || data["processId"] === "" ? undefined : data["processId"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <ElementCriteria
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
