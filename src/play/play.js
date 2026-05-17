function getBpmnXml(processId) {
  const responseJson = window.playExecute(JSON.stringify({
    method: "GET",
    uri: `/processes/${processId}/bpmn-xml`,
  }))
  if (responseJson === null) {
    throw new Error(`failed to get BPMN XML of process ${processId}: ${window.playError}`)
  }

  const response = JSON.parse(responseJson)
  if (response.status != 200) {
    throw new Error(`failed to get BPMN XML of process ${processId}: ${response}`)
  }

  return response.body
}

function queryElementInstanceByParent(parent) {
  const elementInstances = _query("element-instances", {partition: parent.partition, parentId: parent.id})
  return elementInstances.length != 0 ? elementInstances[0] : undefined
}

function queryIncidentByJob(job) {
  return _query("incidents", {partition: job.partition, jobId: job.id})[0]
}

function queryIncidentByTask(task) {
  return _query("incidents", {partition: task.partition, taskId: task.id})[0]
}

function _query(entity, criteria) {
  const responseJson = window.playExecute(JSON.stringify({
    method: "POST",
    uri: `/${entity}/query`,
    body: JSON.stringify(criteria),
  }))
  if (responseJson === null) {
    throw new Error(`failed to query ${entity}: ${window.playError}`)
  }

  const response = JSON.parse(responseJson)
  if (response.status != 200) {
    throw new Error(`failed to query ${entity}: ${response}`)
  }

  const responseBody = JSON.parse(response.body)
  return responseBody.results
}

export {
  getBpmnXml,
  queryElementInstanceByParent,
  queryIncidentByJob,
  queryIncidentByTask,
}
