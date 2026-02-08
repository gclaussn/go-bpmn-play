<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import CompleteJobCmd from "../schema/CompleteJobCmd.vue"
import StringProperty from "../StringProperty.vue"

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
  completion: operation.data["completion"] || {},
  elementVariables: operation.data["elementVariables"] || [],
  error: operation.data["error"] || "",
  processVariables: operation.data["processVariables"] || [],
  retryLimit: operation.data["retryLimit"],
  retryTimer: operation.data["retryTimer"] || "",
  workerId: operation.data["workerId"] || "",
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/jobs/{partition}/{id}/complete"
    .replace("{partition}", data["partition"] || "-")
    .replace("{id}", Number.isInteger(data["id"]) ? data["id"] : "-")

  execute({
    operationId: "completeJob",
    method: "PATCH",
    uri: uri,
    body: {
      completion: Object.keys(data["completion"]).length == 0 ? undefined : data["completion"],
      elementVariables: data["elementVariables"].length == 0 ? undefined : data["elementVariables"],
      error: data["error"] === "" ? undefined : data["error"],
      processVariables: data["processVariables"].length == 0 ? undefined : data["processVariables"],
      retryLimit: data["retryLimit"] === 0 || data["retryLimit"] === "" ? undefined : data["retryLimit"],
      retryTimer: data["retryTimer"] === "" ? undefined : data["retryTimer"],
      workerId: data["workerId"] === "" ? undefined : data["workerId"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <StringProperty
    description="Job partition."
    name="partition"
    placeholder="2006-01-02"
    :disabled="disabled"
    :required="true"
    v-model="model.partition"
  />
  <StringProperty
    description="Job ID."
    name="id"
    placeholder="0"
    :disabled="disabled"
    :required="true"
    v-model.number="model.id"
  />
  <CompleteJobCmd
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
