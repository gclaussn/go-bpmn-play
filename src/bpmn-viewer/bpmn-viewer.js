import { operations } from "../state.js"

const MARKER_STYLE = "viewer-marker-"

const OVERLAY_STYLES = {
  "CAUSED_INCIDENT": "bg-red-300",
  "CREATED": "bg-gray-300",
  "DUE": "bg-yellow-200",
  "LOCKED": "bg-cyan-200"
}

// work stats that should be shown in the overlay
const OVERLAY_WORK_STATES = new Set([
  "CAUSED_INCIDENT",
  "CREATED",
  "DUE",
  "LOCKED",
])

// markers mark element instances of certain states
let markers = {}

/**
 * Collects annotations for jobs that should be shown in the overlay.
 * 
 * @param {Array} jobs The operation's jobs.
 * @returns A mapping between BPMN element ID and annotation.
 */
function collectJobs(jobs) {
  if (!jobs) {
    return {}
  }

  return jobs.reduce((results, job) => {
    const { bpmnElementId, id, partition, state, type } = job

    if (!OVERLAY_WORK_STATES.has(state)) {
      return results
    }

    results[bpmnElementId] = {
      style: OVERLAY_STYLES[state],
      title: `Job ${partition}/${id}, Type: ${type}, State: ${state}`,
    }

    return results
  }, {})
}

/**
 * Collects markers for the given element instances - e.g. "viewer-marker-STARTED".
 * 
 * @param {Array} elementInstances The operation's element instances.
 * @returns A mapping between BPMN element ID and marker style.
 */
function collectMarkers(elementInstances) {
  if (!elementInstances) {
    return {}
  }

  if (elementInstances.length != 0 && elementInstances[0].state == "COMPLETED") { // if process instance completed
    const results = {}

    for (let i = 1; i < elementInstances.length; i++) {
      const { bpmnElementId, bpmnElementType, state } = elementInstances[i]
      if (state == "COMPLETED" && bpmnElementType != "SUB_PROCESS") {
        results[bpmnElementId] = MARKER_STYLE + "COMPLETED"
      }
    }

    return results
  }

  return elementInstances.reduce((results, elementInstance) => {
    const { bpmnElementId, bpmnElementType, state } = elementInstance
    if (bpmnElementType == "PROCESS") {
      return results // exclude process
    }
    if (state != "CREATED" && state != "STARTED" && state != "SUSPENDED") {
      return results // exclude CANCELED, COMPLETED, QUEUED and TERMINATED
    }
    if (bpmnElementType == "SUB_PROCESS" && state != "CREATED") {
      return results // exclude sub-process that is not in state CREATED
    }

    results[bpmnElementId] = MARKER_STYLE + state
    return results
  }, {})
}

/**
 * Collects annotations for tasks that should be shown in the overlay.
 * 
 * @param {Array} jobs The operation's tasks.
 * @returns A mapping between BPMN element ID and annotation.
 */
function collectTasks(tasks) {
  if (!tasks) {
    return {}
  }

  return tasks.reduce((results, task) => {
    const { bpmnElementId, id, partition, state, type } = task

    if (!OVERLAY_WORK_STATES.has(state)) {
      return results
    }

    results[bpmnElementId] = {
      style: OVERLAY_STYLES[state],
      title: `Task ${partition}/${id}, Type: ${type}, State: ${state}`,
    }

    return results
  }, {})
}

/**
 * Updates markers and overlay, using element instances, jobs and tasks of the selected operation.
 * 
 * @param {Object} canvas Canvas of the BPMN JS viewer.
 * @param {Object} overlays Overlays of the BPMN JS viewer.
 */
function update(canvas, overlays) {
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

  markers = collectMarkers(operation.elementInstances)
  for (const [bpmnElementId, style] of Object.entries(markers)) {
    canvas.addMarker(bpmnElementId, style);
  }

  const annotations = {}
  Object.assign(annotations, collectJobs(operation.jobs))
  Object.assign(annotations, collectTasks(operation.tasks))

  for (const [bpmnElementId, annotation] of Object.entries(annotations)) {
    overlays.add(bpmnElementId, {
      html: `<div class="viewer-annotation inline-block rounded-full border-1 ${annotation.style}" title="${annotation.title}"></div>`,
      position: { left: -17, bottom: 13 }
    })
  }

  overlays.show()
}

export {
  update,

  // for testing
  collectJobs,
  collectMarkers,
  collectTasks,
}
