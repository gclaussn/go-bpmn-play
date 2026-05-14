<script setup>
import { onMounted, watch } from "vue"

import { bpmnProcessId, bpmnXml, bpmnXmlError, operations } from "../state.js"
import { update } from "./bpmn-viewer.js"

let canvas
let overlays

onMounted(async () => {
  const viewer = new BpmnJS({
    container: "#bpmn-viewer"
  })

  try {
    await viewer.importXML(bpmnXml.value)

    // center diagram
    canvas = viewer.get("canvas")
    canvas.zoom("fit-viewport")

    const { inner } = canvas.viewbox()
    const center = {
      x: inner.x + inner.width / 2,
      y: inner.y + inner.height / 2
    }
    canvas.zoom("fit-viewport", center)

    // try to find BPMN process ID
    const elementRegistry = viewer.get("elementRegistry")
    const process = elementRegistry.find(element => element.type === "bpmn:Process")
    if (process) {
      bpmnProcessId.value = process.businessObject.id
    } else {
      bpmnProcessId.value = ""
    }

    overlays = viewer.get("overlays")
  } catch (err) {
    bpmnXmlError.value = err
    bpmnXml.value = null
  }
})

watch(operations, () => update(canvas, overlays))
</script>

<template>
  <div class="flex-1" id="bpmn-viewer"></div>
</template>
