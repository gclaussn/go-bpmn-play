<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import ExecuteTasksCmd from "../schema/ExecuteTasksCmd.vue"

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
  limit: operation.data["limit"],
  processId: operation.data["processId"],
  processInstanceId: operation.data["processInstanceId"],
  type: operation.data["type"] || "",
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/tasks/execute"

  execute({
    operationId: "executeTasks",
    method: "POST",
    uri: uri,
    body: {
      partition: data["partition"] === "" ? undefined : data["partition"],
      id: data["id"] === 0 || data["id"] === "" ? undefined : data["id"],
      limit: data["limit"] === 0 || data["limit"] === "" ? undefined : data["limit"],
      processId: data["processId"] === 0 || data["processId"] === "" ? undefined : data["processId"],
      processInstanceId: data["processInstanceId"] === 0 || data["processInstanceId"] === "" ? undefined : data["processInstanceId"],
      type: Object.keys(data["type"]).length == 0 ? undefined : data["type"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <ExecuteTasksCmd
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
