<script setup>
import { onMounted, watch } from "vue"

import { bpmnProcessId, bpmnXml, bpmnXmlError, operations } from "./state.js"

const overlayStyles = {
  "CAUSED_INCIDENT": "bg-red-300",
  "CREATED": "bg-gray-300",
  "DUE": "bg-yellow-200",
  "LOCKED": "bg-cyan-200"
}

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

// markers showing element instances of certain states
let markers = {}

watch(operations, () => {
  let operation = operations.getSelected()
  if (!operation.is2xx) {
    // if current operation has not been successfully executed yet, take previous one
    operation = operations.get(operations.getSelectedIndex() - 1)
  }

  overlays.hide()
  overlays.clear()

  for (const [bpmnElementId, style] of Object.entries(markers)) {
    canvas.removeMarker(bpmnElementId, style);
  }

  if (!operation) {
    return
  }

  markers = determineMarkers(operation.elementInstances)
  for (const [bpmnElementId, style] of Object.entries(markers)) {
    canvas.addMarker(bpmnElementId, style);
  }

  const overlay = {}

  Object.assign(overlay, determineJobOverlay(operation.jobs))
  Object.assign(overlay, determineTaskOverlay(operation.tasks))

  for (const [bpmnElementId, annotation] of Object.entries(overlay)) {
    overlays.add(bpmnElementId, {
      html: `<div class="viewer-annotation inline-block rounded-full border-1 ${annotation.style}" title="${annotation.title}"></div>`,
      position: { left: -17, bottom: 13 }
    })
  }

  overlays.show()
})

function determineMarkers(elementInstances) {
  if (!elementInstances) {
    return {}
  }

  if (elementInstances[0].state == "COMPLETED") {
    const results = {}
    for (let i = 1; i < elementInstances.length; i++) {
      const { bpmnElementId, bpmnElementType, state } = elementInstances[i]
      if (state == "COMPLETED" && bpmnElementType != "SUB_PROCESS") {
        results[bpmnElementId] = "viewer-marker-COMPLETED"
      }
    }
    return results
  }

  return elementInstances.reduce((results, elementInstance) => {
    const { bpmnElementId, bpmnElementType, parentId, state } = elementInstance
    if (!parentId) {
      return results
    }
    if (state != "CREATED" && state != "STARTED" && state != "SUSPENDED") {
      return results
    }
    if (bpmnElementType == "SUB_PROCESS" && state != "CREATED") {
      return results
    }

    results[bpmnElementId] = `viewer-marker-${state}`
    return results
  }, {})
}

function determineJobOverlay(jobs) {
  if (!jobs) {
    return {}
  }

  return jobs.reduce((results, job) => {
    const { bpmnElementId, id, partition, state, type } = job
    if (state != "CREATED" && state != "DUE" && state != "LOCKED" && state != "CAUSED_INCIDENT") {
      delete results[bpmnElementId]
      return results
    }

    results[bpmnElementId] = {
      style: overlayStyles[state],
      title: `Job ${partition}/${id}, Type: ${type}, State: ${state}`
    }
    return results
  }, {})
}

function determineTaskOverlay(tasks) {
  if (!tasks) {
    return {}
  }

  return tasks.reduce((results, task) => {
    const { bpmnElementId, id, partition, state, type } = task
    if (state != "CREATED" && state != "DUE" && state != "LOCKED" && state != "CAUSED_INCIDENT") {
      delete results[bpmnElementId]
      return results
    }

    results[bpmnElementId] = {
      style: overlayStyles[state],
      title: `Task ${partition}/${id}, Type: ${type}, State: ${state}`
    }
    return results
  }, {})
}
</script>

<template>
  <div class="flex-1" id="bpmn-viewer"></div>
</template>
