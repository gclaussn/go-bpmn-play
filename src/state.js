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
  _partition: null,
  _id: null,
  _processId: null,

  getPartition() {
    return this._partition
  },

  getId() {
    return this._id
  },

  getProcessId() {
    return this._processId
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
