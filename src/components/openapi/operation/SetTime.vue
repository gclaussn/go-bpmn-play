<script setup>
// generated, see template operation.vue.tpl
import { onUnmounted, reactive, toRaw } from "vue"
import SetTimeCmd from "../schema/SetTimeCmd.vue"

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
  time: operation.data["time"] || "",
  timeCycle: operation.data["timeCycle"] || "",
  timeDuration: operation.data["timeDuration"] || "",
})

function onExecute() {
  const data = toRaw(model)

  const uri = "/time"

  execute({
    operationId: "setTime",
    method: "PATCH",
    uri: uri,
    body: {
      time: data["time"] === "" ? undefined : data["time"],
      timeCycle: data["timeCycle"] === "" ? undefined : data["timeCycle"],
      timeDuration: data["timeDuration"] === "" ? undefined : data["timeDuration"],
    }
  })
}

onUnmounted(() => {
  operation.data = toRaw(model)
})
</script>

<template>
  <SetTimeCmd
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
