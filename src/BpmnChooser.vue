<script setup>
import { onMounted, useTemplateRef } from "vue"

import { bpmnXml, bpmnXmlError } from "./state.js"

const fileChooserRef = useTemplateRef("bpmn-file-chooser")

onMounted(() => {
  const fileChooser = fileChooserRef.value

  fileChooser.addEventListener("change", function(event) {
    const file = event.target.files[0]
    if (!file) {
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = function(e) {
      bpmnXml.value = e.target.result
    }

    fileReader.readAsText(file)
  })
})
</script>

<template>
  <div class="h-screen flex flex-col justify-center items-center">
    <div class="grid grid-cols-1 mb-24 text-center">
      <p>
        <a href="https://github.com/gclaussn/go-bpmn-play" target="_blank" class="text-blue-600">go-bpmn-play</a> is a playground to try out and experiment with <a href="https://gclaussn.github.io/go-bpmn/" target="_blank" class="text-blue-600">go-bpmn</a>.
        <br />
        The playground is a static app, running an in-memory process engine. All data resides in your browser - there is no server involved!
      </p>
      <p class="mt-4">
        <span class="pr-2">1. Choose a BPMN file</span>
        <span class="pr-2">2. Create a process</span>
        <span class="">3. Execute a process instance, using the engine's operations</span>
      </p>
    </div>
    <div class="grid grid-cols-1 gap-4">
      <div class="p-8 rounded-lg shadow-lg text-center">
        <div class="block mb-6 text-gray-700 whitespace-pre-wrap">
          Choose a BPMN file to create a process.
        </div>

        <label
          class="
            px-4 py-2 text-sm text-slate-600 text-center border border-slate-300 rounded-md shadow-sm cursor-pointer
            hover:shadow-lg hover:text-white hover:bg-slate-800 hover:border-slate-800
            active:border-slate-800 active:text-white active:bg-slate-800
          "
          for="bpmn-file-chooser" 
        >
          Choose file
        </label>
        <input type="file" id="bpmn-file-chooser" ref="bpmn-file-chooser" />
      </div>
    </div>

    <div v-if="bpmnXmlError" class="mt-4" :title="bpmnXmlError">
      <div class="px-5 py-4 w-full rounded-lg bg-red-600/10 border border-red-600 text-red-800">
        <div class="flex items-start gap-3">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">!</div>
          <div class="flex-1">
            <p class="font-semibold">Failed to import BPMN XML</p>
            <p class="mt-1 text-sm text-red-700 truncate w-120">{{ bpmnXmlError }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
