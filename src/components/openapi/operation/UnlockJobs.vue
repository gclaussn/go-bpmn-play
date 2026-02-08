<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import UnlockJobsCmd from "../schema/UnlockJobsCmd.vue"

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
  workerId: operation.data["workerId"] || "",
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/jobs/unlock"

  execute({
    operationId: "unlockJobs",
    method: "POST",
    uri: uri,
    body: {
      partition: data["partition"] === "" ? undefined : data["partition"],
      id: data["id"] === 0 || data["id"] === "" ? undefined : data["id"],
      workerId: data["workerId"] === "" ? undefined : data["workerId"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <UnlockJobsCmd
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
