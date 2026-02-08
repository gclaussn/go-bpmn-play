<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import VariableCriteria from "../schema/VariableCriteria.vue"

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
  elementInstanceId: operation.data["elementInstanceId"],
  names: operation.data["names"] || [],
  processInstanceId: operation.data["processInstanceId"],
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/variables/query"

  execute({
    operationId: "queryVariables",
    method: "POST",
    uri: uri,
    body: {
      partition: data["partition"] === "" ? undefined : data["partition"],
      elementInstanceId: data["elementInstanceId"] === 0 || data["elementInstanceId"] === "" ? undefined : data["elementInstanceId"],
      names: data["names"].length == 0 ? undefined : data["names"],
      processInstanceId: data["processInstanceId"] === 0 || data["processInstanceId"] === "" ? undefined : data["processInstanceId"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <VariableCriteria
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
