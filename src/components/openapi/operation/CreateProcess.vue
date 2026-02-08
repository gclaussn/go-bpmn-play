<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import CreateProcessCmd from "../schema/CreateProcessCmd.vue"

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
  bpmnXml: operation.data["bpmnXml"] || "",
  errors: operation.data["errors"] || [],
  escalations: operation.data["escalations"] || [],
  messages: operation.data["messages"] || [],
  parallelism: operation.data["parallelism"],
  signals: operation.data["signals"] || [],
  tags: operation.data["tags"] || [],
  timers: operation.data["timers"] || [],
  version: operation.data["version"] || "",
  workerId: operation.data["workerId"] || "",
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/processes"

  execute({
    operationId: "createProcess",
    method: "POST",
    uri: uri,
    body: {
      bpmnProcessId: data["bpmnProcessId"] === "" ? undefined : data["bpmnProcessId"],
      bpmnXml: data["bpmnXml"] === "" ? undefined : data["bpmnXml"],
      errors: data["errors"].length == 0 ? undefined : data["errors"],
      escalations: data["escalations"].length == 0 ? undefined : data["escalations"],
      messages: data["messages"].length == 0 ? undefined : data["messages"],
      parallelism: data["parallelism"] === 0 || data["parallelism"] === "" ? undefined : data["parallelism"],
      signals: data["signals"].length == 0 ? undefined : data["signals"],
      tags: data["tags"].length == 0 ? undefined : data["tags"],
      timers: data["timers"].length == 0 ? undefined : data["timers"],
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
  <CreateProcessCmd
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
