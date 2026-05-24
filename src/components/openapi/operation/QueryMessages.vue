<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import MessageCriteria from "../schema/MessageCriteria.vue"

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
  id: operation.data["id"],
  excludeExpired: operation.data["excludeExpired"] || false,
  name: operation.data["name"] || "",
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/messages/query"

  execute({
    operationId: "queryMessages",
    method: "POST",
    uri: uri,
    body: {
      id: data["id"] === 0 || data["id"] === "" ? undefined : data["id"],
      excludeExpired: data["excludeExpired"],
      name: data["name"] === "" ? undefined : data["name"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <MessageCriteria
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
