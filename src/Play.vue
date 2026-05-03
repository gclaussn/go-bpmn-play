<script setup>
import { computed, ref, watch } from "vue";

import { bpmnProcessId, bpmnXml, operations, viewerExpanded } from "./state.js"

import Operation from "./Operation.vue"
import OperationChooser from "./OperationChooser.vue";
import OperationList from "./OperationList.vue"
import Viewer from "./Viewer.vue"

const wasm = "play.wasm"
const wasmLoaded = ref(false)
const wasmError = ref(null)

watch(bpmnProcessId, () => {
  const go = new Go()

  WebAssembly.instantiateStreaming(fetch(wasm), go.importObject).then((result) => {
    go.run(result.instance)
    wasmLoaded.value = true

    operations.add({
      component: "CreateProcess",
      data: {
        bpmnProcessId: bpmnProcessId.value,
        bpmnXml: bpmnXml.value,
        version: "1",
        workerId: "play"
      },
    })
  }).catch(err => {
    wasmError.value = err
  })
})

const showOrChoose = computed(() => {
  const selectedIndex = operations.getSelectedIndex()

  if (selectedIndex == -1) {
    return null
  }

  const operation = operations.getSelected()
  if (operation.component) {
    return "show"
  } else {
    return "choose"
  }
})
</script>

<template>
  <div class="h-screen grid" :class="{ 'grid-cols-2': !viewerExpanded, 'grid-cols-[90%_10%]': viewerExpanded }">
    <Viewer />

    <div v-if="!wasmError && !wasmLoaded" class="h-screen flex flex-col justify-center items-center">
      <span class="text-gray-700">Loading WebAssembly {{ wasm }}...</span>
    </div>

    <div v-if="!wasmError && wasmLoaded" class="h-screen grid" :class="{ 'grid-cols-[20%_80%]': !viewerExpanded }">
      <div class="h-screen flex flex-col justify-center bg-gray-50" v-if="showOrChoose">
        <OperationList />
      </div>
      <div class="overflow-y-scroll" :class="{ 'hidden': viewerExpanded }" v-if="showOrChoose === 'show'">
        <Operation />
      </div>
      <div class="overflow-y-scroll" :class="{ 'hidden': viewerExpanded }" v-if="showOrChoose === 'choose'">
        <OperationChooser />
      </div>
    </div>

    <div v-if="wasmError" class="h-screen flex flex-col justify-center items-center">
      <div :title="wasmError">
        <div class="px-5 py-4 w-full rounded-lg bg-red-600/10 border border-red-600 text-red-800">
          <div class="flex items-start gap-3">
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">!</div>
            <div class="flex-1">
              <p class="font-semibold">Failed to load or instantiate WebAssembly {{ wasm }}</p>
              <p class="mt-1 text-sm text-red-700 truncate w-120">{{ wasmError }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
