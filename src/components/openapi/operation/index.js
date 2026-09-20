// generated, see template operation.index.js.tpl
import CompleteJob from "./CompleteJob.vue"
import CreateProcess from "./CreateProcess.vue"
import CreateProcessInstance from "./CreateProcessInstance.vue"
import ExecuteTasks from "./ExecuteTasks.vue"
import GetElementVariables from "./GetElementVariables.vue"
import GetProcessVariables from "./GetProcessVariables.vue"
import LockJobs from "./LockJobs.vue"
import QueryElementInstances from "./QueryElementInstances.vue"
import QueryElements from "./QueryElements.vue"
import QueryIncidents from "./QueryIncidents.vue"
import QueryJobs from "./QueryJobs.vue"
import QueryMessageSubscriptions from "./QueryMessageSubscriptions.vue"
import QueryMessages from "./QueryMessages.vue"
import QueryProcessInstances from "./QueryProcessInstances.vue"
import QueryProcesses from "./QueryProcesses.vue"
import QuerySignalSubscriptions from "./QuerySignalSubscriptions.vue"
import QueryTasks from "./QueryTasks.vue"
import QueryUserTasks from "./QueryUserTasks.vue"
import QueryVariables from "./QueryVariables.vue"
import ResolveIncident from "./ResolveIncident.vue"
import ResumeProcessInstance from "./ResumeProcessInstance.vue"
import SendMessage from "./SendMessage.vue"
import SendSignal from "./SendSignal.vue"
import SetElementVariables from "./SetElementVariables.vue"
import SetProcessVariables from "./SetProcessVariables.vue"
import SetTime from "./SetTime.vue"
import SuspendProcessInstance from "./SuspendProcessInstance.vue"
import UnlockJobs from "./UnlockJobs.vue"
import UnlockTasks from "./UnlockTasks.vue"
import UpdateUserTask from "./UpdateUserTask.vue"

export const components = {
  CompleteJob,
  CreateProcess,
  CreateProcessInstance,
  ExecuteTasks,
  GetElementVariables,
  GetProcessVariables,
  LockJobs,
  QueryElementInstances,
  QueryElements,
  QueryIncidents,
  QueryJobs,
  QueryMessageSubscriptions,
  QueryMessages,
  QueryProcessInstances,
  QueryProcesses,
  QuerySignalSubscriptions,
  QueryTasks,
  QueryUserTasks,
  QueryVariables,
  ResolveIncident,
  ResumeProcessInstance,
  SendMessage,
  SendSignal,
  SetElementVariables,
  SetProcessVariables,
  SetTime,
  SuspendProcessInstance,
  UnlockJobs,
  UnlockTasks,
  UpdateUserTask,
}

export const descriptions = {
  CompleteJob: "Completes a locked job.",
  CreateProcess: "Creates a process that is modeled as BPMN XML.<br /><br />If a process with the same BPMN process ID and version exists, the BPMN XML is compared. When the BPMN XML equals, the existing process is returned. When the BPMN XML differs, a problem of type <code class='description-code'>CONFLICT</code> is returned.",
  CreateProcessInstance: "Creates a process instance from an existing process.",
  ExecuteTasks: "Locks and executes due tasks, which match the specified conditions.<br /><br />Due tasks are normally handled by a task executor, running inside the engine. When waiting for a due task to be completed during testing, this operation must be called!",
  GetElementVariables: "Gets variables of an active or ended element instance.",
  GetProcessVariables: "Gets variables of an active or ended process instance.",
  LockJobs: "Locks due jobs, which match the specified conditions.",
  QueryElementInstances: "Performs an element instance query.",
  QueryElements: "Performs an element query.",
  QueryIncidents: "Performs an incident query.",
  QueryJobs: "Performs a job query.",
  QueryMessageSubscriptions: "Performs a message subscription query.",
  QueryMessages: "Performs a message query.",
  QueryProcessInstances: "Performs a process instance query.",
  QueryProcesses: "Performs a process query.",
  QuerySignalSubscriptions: "Performs a signal subscription query.",
  QueryTasks: "Performs a task query.",
  QueryUserTasks: "Performs a user task query.",
  QueryVariables: "Performs a variable query.",
  ResolveIncident: "Resolves a job or task related incident.<br /><br />When an incident is resolved, a retry job or task is created. The retry count is set to <code class='description-code'>0</code>.",
  ResumeProcessInstance: "Resumes a suspended process instance.",
  SendMessage: "Sends a message to notify a message subscriber or to buffer the message.<br /><br />A subscriber can be a message start, boundary or catch event. In case of a message start event, a new process instance is created. In case of a message boundary or catch event, an existing process instance is continued.<br /><br />If a message is correlated, a message subscriber has been notified. Otherwise a message is buffered (waiting to be correlated) until it expires.",
  SendSignal: "Sends a signal to notify signal subscribers.<br /><br />A subscriber can be a signal start, boundary or catch event. In case of a signal start event, a new process instance is created. In case of a signal boundary or catch event, an existing process instance is continued.",
  SetElementVariables: "Sets or deletes variables of an active element instance.<br /><br />A variable's BPMN element ID can be used to determine at which scope an element variable should be set or deleted. It could be the element instance itself, the direct or an indirect parent element instance. If not specified, a variable is set or deleted at the scope of element instance itself.",
  SetProcessVariables: "Sets or deletes variables of an active process instance.",
  SetTime: "Increases the engine's time for testing purposes.<br /><br /><b>Please note</b>: to enable the operation, set environment variable <code class='description-code'>GO_BPMN_SET_TIME_ENABLED</code> to <code class='description-code'>true</code> at the process engine daemon.",
  SuspendProcessInstance: "Suspends a started process instance.",
  UnlockJobs: "Unlocks locked, but uncompleted jobs that are currently locked by a specific worker.",
  UnlockTasks: "Unlocks locked, but uncompleted tasks that are currently locked by a specific engine.",
  UpdateUserTask: "Updates a user task's state, variables and/or tags. To avoid concurrent updates, the user task's current revision must be specified.<br /><br />If a user task is completed, the execution continues and the state is changed to <code class='description-code'>COMPLETED</code>.<br /><br />If a BPMN error is thrown, the execution continues at the related error boundary event and the user task is terminated - state is changed to <code class='description-code'>TERMINATED</code>.<br /><br />If a user task is escalated, the execution continues at the related escalation boundary event. In case the boundary event is non-interrupting, the user task remains in state <code class='description-code'>STARTED</code>. Otherwise the user task is terminated - state is changed to <code class='description-code'>TERMINATED</code>.",
}

export const names = {
  CompleteJob: "Complete job",
  CreateProcess: "Create process",
  CreateProcessInstance: "Create process instance",
  ExecuteTasks: "Execute tasks",
  GetElementVariables: "Get element variables",
  GetProcessVariables: "Get process variables",
  LockJobs: "Lock jobs",
  QueryElementInstances: "Query element instances",
  QueryElements: "Query elements",
  QueryIncidents: "Query incidents",
  QueryJobs: "Query jobs",
  QueryMessageSubscriptions: "Query message subscriptions",
  QueryMessages: "Query messages",
  QueryProcessInstances: "Query process instances",
  QueryProcesses: "Query processes",
  QuerySignalSubscriptions: "Query signal subscriptions",
  QueryTasks: "Query tasks",
  QueryUserTasks: "Query user tasks",
  QueryVariables: "Query variables",
  ResolveIncident: "Resolve incident",
  ResumeProcessInstance: "Resume process instance",
  SendMessage: "Send message",
  SendSignal: "Send signal",
  SetElementVariables: "Set element variables",
  SetProcessVariables: "Set process variables",
  SetTime: "Set time",
  SuspendProcessInstance: "Suspend process instance",
  UnlockJobs: "Unlock jobs",
  UnlockTasks: "Unlock tasks",
  UpdateUserTask: "Update user task",
}
