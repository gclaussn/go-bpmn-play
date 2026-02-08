<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import SendSignalCmd from "../schema/SendSignalCmd.vue"

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
  name: operation.data["name"] || "",
  variables: operation.data["variables"] || [],
  workerId: operation.data["workerId"] || "",
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/events/signals"

  execute({
    operationId: "sendSignal",
    method: "POST",
    uri: uri,
    body: {
      name: data["name"] === "" ? undefined : data["name"],
      variables: data["variables"].length == 0 ? undefined : data["variables"],
      workerId: data["workerId"] === "" ? undefined : data["workerId"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <SendSignalCmd
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
