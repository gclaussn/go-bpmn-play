import { newOperation } from "../app.js"
import { bpmnXml, operations, processInstance } from "../state.js"
import { getBpmnXml, queryElementInstanceByParent, queryIncidentByJob, queryIncidentByTask } from "../play/play.js"

const MARKER_STYLE = "viewer-marker-"

const OVERLAY_CLASS = "viewer-annotation inline-block rounded-full border-1 "
const OVERLAY_CLICKABLE_CLASS = OVERLAY_CLASS + "cursor-pointer hover:border-2 "

const OVERLAY_STYLES = {
  "CAUSED_INCIDENT": "bg-red-300",
  "CREATED": "bg-gray-300",
  "DUE": "bg-yellow-200",
  "LOCKED": "bg-cyan-200"
}

const OVERLAY_CLICKABLE_STYLES = {
  "CAUSED_INCIDENT": "bg-red-300 hover:bg-red-400",
  "CREATED": "bg-gray-300 hover:bg-gray-400",
  "DUE": "bg-yellow-200 hover:bg-yellow-300",
  "LOCKED": "bg-cyan-200 hover:bg-cyan-300"
}

// work stats that should be shown in the overlay
const OVERLAY_WORK_STATES = new Set([
  "CAUSED_INCIDENT",
  "CREATED",
  "DUE",
  "LOCKED",
])

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
      delete results[bpmnElementId]
      return results
    }

    results[bpmnElementId] = {
      job: job,
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

  if (_isEnded(elementInstances)) { // if process instance is ended
    const results = {}

    for (let i = 1; i < elementInstances.length; i++) {
      const { bpmnElementId, bpmnElementType, state } = elementInstances[i]
      if (state == "COMPLETED" && bpmnElementType != "SUB_PROCESS") {
        if (bpmnElementType == "CALL_ACTIVITY") {
          results[bpmnElementId] = MARKER_STYLE + "call-activity-COMPLETED"
        } else {
          results[bpmnElementId] = MARKER_STYLE + "COMPLETED"
        }
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
      delete results[bpmnElementId]
      return results // exclude CANCELED, COMPLETED, QUEUED and TERMINATED
    }
    if (bpmnElementType == "SUB_PROCESS" && state != "CREATED") {
      delete results[bpmnElementId]
      return results // exclude sub-process that is not in state CREATED
    }

    if (bpmnElementType == "CALL_ACTIVITY" && state == "STARTED") {
      results[bpmnElementId] = MARKER_STYLE + "call-activity-" + state
    } else {
      results[bpmnElementId] = MARKER_STYLE + state
    }

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
      delete results[bpmnElementId]
      return results
    }

    results[bpmnElementId] = {
      task: task,
      title: `Task ${partition}/${id}, Type: ${type}, State: ${state}`,
    }

    return results
  }, {})
}

function navigateToChild(event) {
  const { element } = event
  if (element.type != "bpmn:CallActivity") {
    return
  }

  let operation = operations.getSelected()
  if (!operation.is2xx) {
    // if current operation has not been successfully executed yet, take previous one
    operation = operations.get(operations.getSelectedIndex() - 1)
  }

  if (!operation || !operation.elementInstances) {
    return
  }

  const elementInstances = _filterByProcessInstance(operation.elementInstances)

  const elementInstance = elementInstances.findLast(e => e.bpmnElementId == element.id)
  if (!elementInstance) {
    return
  }

  const child = queryElementInstanceByParent(elementInstance)
  if (!child) {
    return
  }

  bpmnXml.value = getBpmnXml(child.processId)
  processInstance.add(child.partition, child.processInstanceId, child.processId)
}

function onJobClicked(job) {
  // ensure latest operation is selected
  const index = operations.size() - 1
  operations.setSelected(index)

  const { state, id } = job

  if (state == "DUE") {
    const operation =  newOperation("LockJobs")
    operation.data.id = id
    operations.patch(index, operation)
  } else if (state == "LOCKED") {
    const operation =  newOperation("CompleteJob")
    operation.data.id = id
    operations.patch(index, operation)
  } else if (state == "CAUSED_INCIDENT") {
    // query related incident
    const incident = queryIncidentByJob(job)

    const operation =  newOperation("ResolveIncident")
    operation.data.id = incident.id
    operations.patch(index, operation)
  } else if (state == "CREATED") {
    const operation =  newOperation("SetTime")
    operation.data.time = job.dueAt
    operations.patch(index, operation)
  }
}

function onTaskClicked(task) {
  // ensure latest operation is selected
  const index = operations.size() - 1
  operations.setSelected(index)

  const { state, id } = task

  if (state == "DUE") {
    const operation =  newOperation("ExecuteTasks")
    operation.data.id = id
    operations.patch(index, operation)
  } else if (state == "CAUSED_INCIDENT") {
    // query related incident
    const incident = queryIncidentByTask(task)

    const operation =  newOperation("ResolveIncident")
    operation.data.id = incident.id
    operations.patch(index, operation)
  } else if (state == "CREATED") {
    const operation =  newOperation("SetTime")
    operation.data.time = task.dueAt
    operations.patch(index, operation)
  }
}

/**
 * Updates markers and overlay, using element instances, jobs and tasks of the selected operation.
 * 
 * @param {Object} canvas Canvas of the BPMN JS viewer.
 * @param {Object} overlays Overlays of the BPMN JS viewer.
 */
function update(canvas, overlays, markers) {
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
    return {}
  }

  const isOverlayClickable = operations.isLatest()

  const elementInstances = _filterByProcessInstance(operation.elementInstances)
  const newMarkers = collectMarkers(elementInstances)
  for (const [bpmnElementId, style] of Object.entries(newMarkers)) {
    canvas.addMarker(bpmnElementId, style);
  }

  if (_isEnded(operation.elementInstances)) {
    return newMarkers
  }

  const annotations = {}

  const jobs = _filterByProcessInstance(operation.jobs)
  Object.assign(annotations, collectJobs(jobs))

  const tasks = _filterByProcessInstance(operation.tasks)
  Object.assign(annotations, collectTasks(tasks))

  for (const [bpmnElementId, annotation] of Object.entries(annotations)) {
    const element = document.createElement("div")
    element.setAttribute("title", annotation.title)

    const { job, task } = annotation
    if (job) {
      if (isOverlayClickable) {
        element.setAttribute("class", OVERLAY_CLICKABLE_CLASS + OVERLAY_CLICKABLE_STYLES[job.state])
        element.addEventListener("click", onJobClicked.bind(this, job))
      } else {
        element.setAttribute("class", OVERLAY_CLASS + OVERLAY_STYLES[job.state])
      }
    } else if (task) {
      if (isOverlayClickable) {
        element.setAttribute("class", OVERLAY_CLICKABLE_CLASS + OVERLAY_CLICKABLE_STYLES[task.state])
        element.addEventListener("click", onTaskClicked.bind(this, task))
      } else {
        element.setAttribute("class", OVERLAY_CLASS + OVERLAY_STYLES[task.state])
      }
    }

    overlays.add(bpmnElementId, {
      html: element,
      position: { left: -17, bottom: 13 }
    })
  }

  overlays.show()

  return newMarkers
}

/**
 * Determines if the process instance is ended.
 * 
 * @param {Array} elementInstances The operation's element instances.
 * @returns true, if the root element instance is ended. Otherwise false.
 */
function _isEnded(elementInstances) {
  return elementInstances && elementInstances.length != 0 && elementInstances[0].endedAt
}

/**
 * Filters the given entities by the currently set process instance.
 * 
 * @param {Array} entities An array of element instances, jobs or tasks.
 * @returns A filteted array of entities, related to the set process instance.
 */
function _filterByProcessInstance(entities) {
  if (!entities) {
    return
  }

  return entities.filter(entity => {
    const { partition, processInstanceId } = entity
    return processInstance.getPartition() == partition && processInstance.getId() == processInstanceId
  })
}

export {
  navigateToChild,
  update,

  // for testing
  collectJobs,
  collectMarkers,
  collectTasks,
}
