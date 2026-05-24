<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import SignalSubscriptionCriteria from "../schema/SignalSubscriptionCriteria.vue"

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
  name: operation.data["name"] || "",
  processInstanceId: operation.data["processInstanceId"],
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/signals/subscriptions/query"

  execute({
    operationId: "querySignalSubscriptions",
    method: "POST",
    uri: uri,
    body: {
      partition: data["partition"] === "" ? undefined : data["partition"],
      name: data["name"] === "" ? undefined : data["name"],
      processInstanceId: data["processInstanceId"] === 0 || data["processInstanceId"] === "" ? undefined : data["processInstanceId"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <SignalSubscriptionCriteria
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
