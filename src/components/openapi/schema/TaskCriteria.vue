<script setup>
// generated, see template schema.vue.tpl
import StringProperty from "../StringProperty.vue"
import TaskType from "./TaskType.vue"

const {
  disabled,
} = defineProps({
  disabled: Boolean,
})

const model = defineModel()
</script>

<template>
  <StringProperty
    description="Partition filter."
    name="partition"
    placeholder="2006-01-02"
    :disabled="disabled"
    :required="false"
    v-model="model.partition"
  />
  <StringProperty
    description="Task filter."
    name="id"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.id"
  />
  <StringProperty
    description="Element filter."
    name="elementId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.elementId"
  />
  <StringProperty
    description="Element instance filter."
    name="elementInstanceId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.elementInstanceId"
  />
  <StringProperty
    description="Process filter."
    name="processId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.processId"
  />
  <StringProperty
    description="Process instance filter."
    name="processInstanceId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.processInstanceId"
  />
  <div>
    <label
      class="block text-gray-700 mb-2"
      for="name"
    >
      <span>type</span>
      <br />
      <span class="text-sm">TaskType describes the different types of tasks, an engine needs to execute.<br /><br />  - <code class='description-code'>DEQUEUE_PROCESS_INSTANCE</code> dequeues a queued process instance<br />  - <code class='description-code'>JOIN_PARALLEL_GATEWAY</code> continues a parallel gateway by joining executions<br />  - <code class='description-code'>START_PROCESS_INSTANCE</code> starts a queued process instance<br />  - <code class='description-code'>TERMINATE_PROCESS_INSTANCE</code> terminates a process instance<br />  - <code class='description-code'>TRIGGER_EVENT</code> triggers an event (error, escalation, message, signal or timer)<br /><br />Management related types, that are only relevant for a pg engine:<br /><br />  - <code class='description-code'>CREATE_PARTITION</code> creates a table partition for a specific date<br />  - <code class='description-code'>DETACH_PARTITION</code> detaches a completed table partition<br />  - <code class='description-code'>DROP_PARTITION</code> drops a detached table partition<br />  - <code class='description-code'>PURGE_MESSAGES</code> purges messages that are expired<br />  - <code class='description-code'>PURGE_SIGNALS</code> purges signals that have no active subscribers anymore</span>
    </label>
    <div class="pl-4">
      <TaskType
        :disabled="disabled"
        v-model="model.type"
      />
    </div>
  </div>
</template>
