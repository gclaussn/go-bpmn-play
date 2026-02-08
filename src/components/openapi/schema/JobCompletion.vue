<script setup>
// generated, see template schema.vue.tpl
import StringListProperty from "../StringListProperty.vue"
import StringProperty from "../StringProperty.vue"
import Timer from "./Timer.vue"

const {
  disabled,
} = defineProps({
  disabled: Boolean,
})

const model = defineModel()
</script>

<template>
  <StringProperty
    description="Code of a BPMN error, used to specify or trigger a BPMN error. Applicable when job type is <code class='description-code'>SET_ERROR_CODE</code> or <code class='description-code'>EXECUTE</code>."
    name="errorCode"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.errorCode"
  />
  <StringProperty
    description="Code of a BPMN escalation, used to specify or trigger a BPMN escalation. Applicable when job type is <code class='description-code'>SET_ESCALATION_CODE</code> or <code class='description-code'>EXECUTE</code>."
    name="escalationCode"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.escalationCode"
  />
  <StringProperty
    description="Evaluated BPMN element ID to continue with after the exclusive gateway. Applicable when job type is <code class='description-code'>EVALUATE_EXCLUSIVE_GATEWAY</code>."
    name="exclusiveGatewayDecision"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.exclusiveGatewayDecision"
  />
  <StringListProperty
    description="Evaluated BPMN element IDs to continue with after the inclusive gateway. Applicable when job type is <code class='description-code'>EVALUATE_INCLUSIVE_GATEWAY</code>."
    name="inclusiveGatewayDecision"
    :disabled="disabled"
    :required="false"
    v-model="model.inclusiveGatewayDecision"
  />
  <StringProperty
    description="Key, used to correlate a message subscription with a message. Applicable when job type is <code class='description-code'>SUBSCRIBE_MESSAGE</code>."
    name="messageCorrelationKey"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.messageCorrelationKey"
  />
  <StringProperty
    description="Name of the message to subscribe to. Applicable when job type is <code class='description-code'>SUBSCRIBE_MESSAGE</code>."
    name="messageName"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.messageName"
  />
  <StringProperty
    description="Name of the signal to subscribe to. Applicable when job type is <code class='description-code'>SUBSCRIBE_SIGNAL</code>."
    name="signalName"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.signalName"
  />
  <div>
    <label
      class="block text-gray-700 mb-2"
      for="name"
    >
      <span>timer</span>
      <br />
      <span class="text-sm">A timer defines a point in time using a time value, a CRON expression or a duration.</span>
    </label>
    <div class="pl-4">
      <Timer
        :disabled="disabled"
        v-model="model.timer"
      />
    </div>
  </div>
</template>
