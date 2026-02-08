import { operations, processInstance } from "./state.js"

function executeRequest(request, onSuccess, onError) {
  const selectedIndex = operations.getSelectedIndex()

  request.body = _cleanRequestBody(request)
  request.body = JSON.stringify(request.body, null, 2)

  const requestJson = JSON.stringify(request)

  const responseJson = window.playExecute(requestJson)
  if (!responseJson) {
    console.error(window.playError)

    if (onError) {
      onError()
    }

    return
  }

  const response = JSON.parse(responseJson)
  if (response.body.length != 0) {
    response.body = JSON.parse(response.body)
  }

  const is2xx = response.status >= 200 && response.status < 300
  const is4xx = response.status >= 400 && response.status < 500

  operations.patch(selectedIndex, {
    request,
    response,
    is2xx,
    is4xx,
  })

  if (onSuccess) {
    onSuccess(response, is2xx)
  }

  if (!is2xx) {
    return
  }

  if (!processInstance.getId()) {
    _processResponse(response, request, selectedIndex)
  }
  if (!processInstance.getId()) {
    return
  }

  operations.addEmpty()

  const { partition, id } = processInstance

  const criteria = {
    partition: partition,
    processInstanceId: id
  }

  operations.patch(selectedIndex, {
    elementInstances: _queryElementInstances(criteria),
    jobs: _queryJobs(criteria),
    tasks: _queryTasks(criteria)
  })
}

function newOperation(component) {
  return {
    component: component,
    data: _newData(component)
  }
}

export {
  executeRequest,
  newOperation,
}

function _processResponse(response, request, selectedIndex) {
  const { body } = response

  const tasks = _queryTasks({ type: "TRIGGER_EVENT" })
  if (request.operationId === "createProcess") {
    const elements = _queryElements({ processId: body.id })

    const noneStartEvent = elements.find(element => {
      return element.parentBpmnElementId === body.bpmnProcessId && element.bpmnElementType == "NONE_START_EVENT"
    })
    const messageStartEvents = elements.filter(element => {
      return element.parentBpmnElementId === body.bpmnProcessId && element.bpmnElementType == "MESSAGE_START_EVENT"
    })
    const signalStartEvents = elements.filter(element => {
      return element.parentBpmnElementId === body.bpmnProcessId && element.bpmnElementType == "SIGNAL_START_EVENT"
    })
    const timerStartEvents = elements.filter(element => {
      return element.parentBpmnElementId === body.bpmnProcessId && element.bpmnElementType == "TIMER_START_EVENT"
    })

    let startEventTypeCount = 0
    startEventTypeCount += noneStartEvent ? 1 : 0
    startEventTypeCount += messageStartEvents.length != 0 ? 1 : 0
    startEventTypeCount += signalStartEvents.length != 0 ? 1 : 0
    startEventTypeCount += timerStartEvents.length != 0 ? 1 : 0

    if (startEventTypeCount > 1) {
      operations.addEmpty()
    } else if (noneStartEvent) {
      operations.add({
        component: "CreateProcessInstance",
        data: {
          bpmnProcessId: body.bpmnProcessId,
          version: body.version,
          workerId: body.createdBy
        },
      })
    } else if (messageStartEvents.length != 0) {
      const operation = newOperation("SendMessage")
      operation.data.correlationKey = "any key"
      operation.data.name = messageStartEvents[0].eventDefinition.messageName
      operations.add(operation)
    } else if (signalStartEvents.length != 0) {
      const operation = newOperation("SendSignal")
      operation.data.name = signalStartEvents[0].eventDefinition.signalName
      operations.add(operation)
    } else if (timerStartEvents.length != 0) {
      const operation = newOperation("SetTime")
      operation.data.time = tasks[0].dueAt
      operations.add(operation)
    }
  } else if (request.operationId == "createProcessInstance") {
    processInstance.set(body.partition, body.id, body.processId)
  } else if (request.operationId == "executeTasks") {
    if (body.completed > 0) {
      processInstance.set(body.completedTasks[0].partition, body.completedTasks[0].processInstanceId, body.completedTasks[0].processId)
    } else {
      operations.add({
        component: "ExecuteTasks",
        data: {
          partition: tasks[0].partition,
          limit: 1
        }
      })
    }
  } else if (request.operationId == "sendMessage") {
    const dueTask = tasks.find(task => task.state === "DUE")

    if (dueTask) {
      operations.add({
        component: "ExecuteTasks",
        data: {
          partition: tasks[0].partition,
          limit: 1
        }
      })
    } else {
      operations.add(newOperation("SendMessage"))
    }
  } else if (request.operationId == "sendSignal") {
    const dueTask = tasks.find(task => task.state === "DUE")

    if (dueTask) {
      operations.add({
        component: "ExecuteTasks",
        data: {
          partition: tasks[0].partition,
          limit: 1
        }
      })
    } else {
      operations.add(newOperation("SendSignal"))
    }
  } else if (request.operationId == "setTime") {
    const dueTask = tasks.find(task => task.state === "DUE")

    if (dueTask) {
      operations.add({
        component: "ExecuteTasks",
        data: {
          partition: tasks[0].partition,
          limit: 1
        }
      })
    } else {
      operations.add(newOperation("SetTime"))
    }
  } else {
    operations.addEmpty()
  }

  if (tasks.length != 0) {
    operations.patch(selectedIndex, { tasks })
  }
}

function _query(entity, criteria) {
  const responseJson = window.playExecute(JSON.stringify({
    method: "POST",
    uri: `/${entity}/query`,
    body: JSON.stringify(criteria),
  }))
  if (responseJson === null) {
    console.error(window.playError)
    return
  }

  const response = JSON.parse(responseJson)
  if (response.status != 200) {
    console.error(response)
    return
  }

  const responseBody = JSON.parse(response.body)
  return responseBody.results
}

const _queryElements = _query.bind(this, "elements")
const _queryElementInstances = _query.bind(this, "element-instances")
const _queryJobs = _query.bind(this, "jobs")
const _queryTasks = _query.bind(this, "tasks")

function _newData(component) {
  const partition = processInstance.getPartition()
  const id = processInstance.getId()

  if (component == "CompleteJob") {
    return {
      partition: partition,
      completion: {
        inclusiveGatewayDecision: [],
        timer: {}
      },
      workerId: "play"
    }
  } else if (component == "ExecuteTasks") {
    return {
      partition: partition,
      limit: 1,
      processInstanceId: id
    }
  } else if (component == "GetElementVariables") {
    return {
      partition: partition
    }
  } else if (component == "GetProcessVariables") {
    return {
      partition: partition,
      id: id
    }
  } else if (component == "LockJobs") {
    return {
      partition: partition,
      processIds: [ processInstance.getProcessId() ],
      limit: 1,
      workerId: "play"
    }
  } else if (component == "ResolveIncident") {
    return {
      partition: partition,
      workerId: "play"
    }
  } else if (component == "ResumeProcessInstance") {
    return {
      partition: partition,
      id: id,
      workerId: "play"
    }
  } else if (component == "SendMessage") {
    return {
      workerId: "play"
    }
  } else if (component == "SendSignal") {
    return {
      workerId: "play"
    }
  } else if (component == "SetElementVariables") {
    return {
      partition: partition,
      workerId: "play"
    }
  } else if (component == "SetProcessVariables") {
    return {
      partition: partition,
      id: id,
      workerId: "play"
    }
  } else if (component == "SetTime") {
    return {
      time: new Date().toISOString()
    }
  } else if (component == "SuspendProcessInstance") {
    return {
      partition: partition,
      id: id,
      workerId: "play"
    }
  } else if (component == "UnlockJobs") {
    return {
      partition: partition,
      workerId: "play"
    }
  } else if (component == "UnlockTasks") {
    return {
      partition: partition,
      engineId: "default-engine"
    }
  } else {
    return {}
  }
}

function _cleanRequestBody(request) {
  const { body, operationId } = request 
  if (!body) {
    return
  }

  const copy = JSON.parse(JSON.stringify(body))
  if (operationId == "completeJob") {
    const { completion } = copy

    if (completion.inclusiveGatewayDecision.length == 0) {
      delete completion.inclusiveGatewayDecision
    }
    if (Object.keys(completion.timer).length == 0) {
      delete completion.timer
    }

    if (Object.keys(completion).length == 0) {
      delete copy.completion
    }
  }

  return copy
}
