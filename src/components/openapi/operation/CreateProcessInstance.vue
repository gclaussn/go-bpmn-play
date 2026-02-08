<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import CreateProcessInstanceCmd from "../schema/CreateProcessInstanceCmd.vue"

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
  bpmnProcessId: operation.data["bpmnProcessId"] || "",
  correlationKey: operation.data["correlationKey"] || "",
  tags: operation.data["tags"] || [],
  variables: operation.data["variables"] || [],
  version: operation.data["version"] || "",
  workerId: operation.data["workerId"] || "",
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/process-instances"

  execute({
    operationId: "createProcessInstance",
    method: "POST",
    uri: uri,
    body: {
      bpmnProcessId: data["bpmnProcessId"] === "" ? undefined : data["bpmnProcessId"],
      correlationKey: data["correlationKey"] === "" ? undefined : data["correlationKey"],
      tags: data["tags"].length == 0 ? undefined : data["tags"],
      variables: data["variables"].length == 0 ? undefined : data["variables"],
      version: data["version"] === "" ? undefined : data["version"],
      workerId: data["workerId"] === "" ? undefined : data["workerId"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <CreateProcessInstanceCmd
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
