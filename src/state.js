import { reactive, ref } from "vue"

/**
 * ID of the imported BPMN process or an empty string, if the BPMN provides no process.
 * 
 * see BpmnViewer.
 */
const bpmnProcessId = ref(null)

/**
 * XML of the choosen BPMN file.
 * 
 * see BpmnChooser.
 */
const bpmnXml = ref(null)

/**
 * Possible error that can occur when importing the BPMN XML.
 * 
 * see BpmnViewer.
 */
const bpmnXmlError = ref(null)

const operations = reactive({
  _array: [],
  _index: -1,

  add(operation) {
    this._array.push(operation)
    this._index = this._index == -1 ? 0 : this._index // select initial operation or do nothing
  },

  addEmpty() {
    this._array.push({
      component: null
    })
  },

  get(index) {
    return this._array[index]
  },

  getAll() {
    return this._array
  },

  getSelected() {
    return this._array[this._index]
  },

  getSelectedIndex() {
    return this._index
  },

  /**
   * Determines if the selected operation provides the engine's latest state (regarding element instances, jobs and tasks).
   * 
   * @returns true, if the selected or the next operation have not received a response with status code 2xx yet. Otherwise false.
   */
  isLatest() {
    return !this._array[this._index].is2xx || !this._array[this._index + 1].is2xx
  },

  patch(index, patch) {
    Object.assign(this._array[index], patch)
  },

  setSelected(index) {
    this._index = index
  },

  size() {
    return this._array.length
  },
})

const processInstance = reactive({
  _parents: [],
  _partition: null,
  _id: null,
  _processId: null,

  add(partition, id, processId) {
    this._parents.push({
      partition: this._partition,
      id: this._id,
      processId: this._processId,
    })

    this._partition = partition
    this._id = id
    this._processId = processId
  },

  getParents() {
    return this._parents
  },

  getPartition() {
    return this._partition
  },

  getId() {
    return this._id
  },

  getProcessId() {
    return this._processId
  },

  remove() {
    const parent = this._parents.pop()

    this._partition = parent.partition
    this._id = parent.id
    this._processId = parent.processId
  },

  set(partition, id, processId) {
    this._partition = partition
    this._id = id
    this._processId = processId
  },
})

/**
 * Determines if the Viewer is expanded or not.
 */
const viewerExpanded = ref(false)

export {
  bpmnProcessId,
  bpmnXml,
  bpmnXmlError,
  operations,
  processInstance,
  viewerExpanded,
}
