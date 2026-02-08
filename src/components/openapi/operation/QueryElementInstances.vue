<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import ElementInstanceCriteria from "../schema/ElementInstanceCriteria.vue"

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
  partition: operation.data["partition"] || "",
  id: operation.data["id"],
  bpmnElementId: operation.data["bpmnElementId"] || "",
  processId: operation.data["processId"],
  processInstanceId: operation.data["processInstanceId"],
  states: operation.data["states"] || [],
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/element-instances/query"

  execute({
    operationId: "queryElementInstances",
    method: "POST",
    uri: uri,
    body: {
      partition: data["partition"] === "" ? undefined : data["partition"],
      id: data["id"] === 0 || data["id"] === "" ? undefined : data["id"],
      bpmnElementId: data["bpmnElementId"] === "" ? undefined : data["bpmnElementId"],
      processId: data["processId"] === 0 || data["processId"] === "" ? undefined : data["processId"],
      processInstanceId: data["processInstanceId"] === 0 || data["processInstanceId"] === "" ? undefined : data["processInstanceId"],
      states: data["states"].length == 0 ? undefined : data["states"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <ElementInstanceCriteria
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
