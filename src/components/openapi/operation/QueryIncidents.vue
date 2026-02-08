<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import IncidentCriteria from "../schema/IncidentCriteria.vue"

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
  jobId: operation.data["jobId"],
  processInstanceId: operation.data["processInstanceId"],
  taskId: operation.data["taskId"],
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/incidents/query"

  execute({
    operationId: "queryIncidents",
    method: "POST",
    uri: uri,
    body: {
      partition: data["partition"] === "" ? undefined : data["partition"],
      id: data["id"] === 0 || data["id"] === "" ? undefined : data["id"],
      jobId: data["jobId"] === 0 || data["jobId"] === "" ? undefined : data["jobId"],
      processInstanceId: data["processInstanceId"] === 0 || data["processInstanceId"] === "" ? undefined : data["processInstanceId"],
      taskId: data["taskId"] === 0 || data["taskId"] === "" ? undefined : data["taskId"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <IncidentCriteria
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
