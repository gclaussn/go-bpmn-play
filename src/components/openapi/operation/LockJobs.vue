<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import LockJobsCmd from "../schema/LockJobsCmd.vue"

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
  processIds: operation.data["processIds"] || [],
  processInstanceId: operation.data["processInstanceId"],
  workerId: operation.data["workerId"] || "",
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/jobs/lock"

  execute({
    operationId: "lockJobs",
    method: "POST",
    uri: uri,
    body: {
      partition: data["partition"] === "" ? undefined : data["partition"],
      id: data["id"] === 0 || data["id"] === "" ? undefined : data["id"],
      limit: data["limit"] === 0 || data["limit"] === "" ? undefined : data["limit"],
      processIds: data["processIds"].length == 0 ? undefined : data["processIds"],
      processInstanceId: data["processInstanceId"] === 0 || data["processInstanceId"] === "" ? undefined : data["processInstanceId"],
      workerId: data["workerId"] === "" ? undefined : data["workerId"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <LockJobsCmd
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
