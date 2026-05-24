<script setup>
// generated, see template schema.vue.tpl
import ErrorDefinitionList from "./ErrorDefinitionList.vue"
import EscalationDefinitionList from "./EscalationDefinitionList.vue"
import FileProperty from "../FileProperty.vue"
import MessageDefinitionList from "./MessageDefinitionList.vue"
import SignalDefinitionList from "./SignalDefinitionList.vue"
import StringProperty from "../StringProperty.vue"
import TagList from "./TagList.vue"
import TimerDefinitionList from "./TimerDefinitionList.vue"

const {
  disabled,
} = defineProps({
  disabled: Boolean,
})

const model = defineModel()
</script>

<template>
  <StringProperty
    description="ID of the process element within the BPMN XML."
    name="bpmnProcessId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.bpmnProcessId"
  />
  <StringProperty v-if="model.bpmnXml.length != 0"
    description="Model of the BPMN process as XML."
    name="bpmnXml"
    placeholder=""
    :disabled="true"
    :required="true"
    v-model="model.bpmnXml"
  />
  <FileProperty v-if="model.bpmnXml.length == 0"
    description="Model of the BPMN process as XML."
    name="bpmnXml"
    :required="true"
    v-model="model.bpmnXml"
  />
  <ErrorDefinitionList
    description="Error event definitions."
    name="errors"
    :disabled="disabled"
    :required="false"
    v-model="model.errors"
  />
  <EscalationDefinitionList
    description="Escalation event definitions."
    name="escalations"
    :disabled="disabled"
    :required="false"
    v-model="model.escalations"
  />
  <MessageDefinitionList
    description="Message event definitions."
    name="messages"
    :disabled="disabled"
    :required="false"
    v-model="model.messages"
  />
  <StringProperty
    description="Maximum number of parallel process instances being executed. If <code class='description-code'>0</code>, the number of parallel process instances is unlimited."
    name="parallelism"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.parallelism"
  />
  <SignalDefinitionList
    description="Signal event definitions."
    name="signals"
    :disabled="disabled"
    :required="false"
    v-model="model.signals"
  />
  <TagList
    description="Tags."
    name="tags"
    :disabled="disabled"
    :required="false"
    v-model="model.tags"
  />
  <TimerDefinitionList
    description="Timer event definitions."
    name="timers"
    :disabled="disabled"
    :required="false"
    v-model="model.timers"
  />
  <StringProperty
    description="Any process version."
    name="version"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.version"
  />
  <StringProperty
    description="ID of the worker that created the process."
    name="workerId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.workerId"
  />
</template>
