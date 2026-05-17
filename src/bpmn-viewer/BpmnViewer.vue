<script setup>
import { onMounted, watch } from "vue"

import { bpmnProcessId, bpmnXml, bpmnXmlError, operations, processInstance } from "../state.js"
import { navigateToChild, update } from "./bpmn-viewer.js"

let canvas
let overlays

// markers mark element instances of certain states
let markers

async function create() {
  if (bpmnXml.value === null) {
    return
  }

  markers = {}

  const viewer = new BpmnJS({
    container: "#bpmn-viewer"
  })

  try {
    await viewer.importXML(bpmnXml.value)
  } catch (err) {
    bpmnXmlError.value = err
    bpmnXml.value = null
  }

  canvas = viewer.get("canvas")
  overlays = viewer.get("overlays")

  // center diagram
  canvas.zoom("fit-viewport")

  const { inner } = canvas.viewbox()
  const center = {
    x: inner.x + inner.width / 2,
    y: inner.y + inner.height / 2
  }
  canvas.zoom("fit-viewport", center)

  // try to find BPMN process ID
  if (bpmnProcessId.value === null) {
    const elementRegistry = viewer.get("elementRegistry")
    const process = elementRegistry.find(element => element.type === "bpmn:Process")
    if (process) {
      bpmnProcessId.value = process.businessObject.id
    } else {
      bpmnProcessId.value = ""
    }
  }

  // register handler for navigation to child process instance
  const eventBus = viewer.get("eventBus")
  eventBus.on("element.click", navigateToChild)
}

// create initial viewer
onMounted(create)

// on navigation between parent and child process instance
watch(processInstance, async () => {
  // destroy viewer
  canvas = null
  overlays = null

  const element = document.getElementById("bpmn-viewer")
  element.innerHTML = ""

  // recreate viewer
  await create()

  // update markers and overlay
  markers = update(canvas, overlays, markers)
})

watch(operations, () => {
  if (!canvas && !overlays) {
    return
  }

  markers = update(canvas, overlays, markers)
})
</script>

<template>
  <div class="flex-1" id="bpmn-viewer"></div>
</template>
