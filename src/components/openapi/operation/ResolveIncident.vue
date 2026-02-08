<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import ResolveIncidentCmd from "../schema/ResolveIncidentCmd.vue"
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
  retryTimer: operation.data["retryTimer"] || "",
  workerId: operation.data["workerId"] || "",
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/incidents/{partition}/{id}/resolve"
    .replace("{partition}", data["partition"] || "-")
    .replace("{id}", Number.isInteger(data["id"]) ? data["id"] : "-")

  execute({
    operationId: "resolveIncident",
    method: "PATCH",
    uri: uri,
    body: {
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
    description="Incident partition."
    name="partition"
    placeholder="2006-01-02"
    :disabled="disabled"
    :required="true"
    v-model="model.partition"
  />
  <StringProperty
    description="Incident ID."
    name="id"
    placeholder="0"
    :disabled="disabled"
    :required="true"
    v-model.number="model.id"
  />
  <ResolveIncidentCmd
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
