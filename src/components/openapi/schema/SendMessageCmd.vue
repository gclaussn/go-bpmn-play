<script setup>
// generated, see template schema.vue.tpl
import StringProperty from "../StringProperty.vue"
import Timer from "./Timer.vue"
import VariableDataList from "./VariableDataList.vue"

const {
  disabled,
} = defineProps({
  disabled: Boolean,
})

const model = defineModel()
</script>

<template>
  <StringProperty
    description="Key, used to correlate a message subscription with the message."
    name="correlationKey"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.correlationKey"
  />
  <div>
    <label
      class="block text-gray-700 mb-2"
      for="name"
    >
      <span>expirationTimer</span>
      <br />
      <span class="text-sm">A timer defines a point in time using a time value, a CRON expression or a duration.</span>
    </label>
    <div class="pl-4">
      <Timer
        :disabled="disabled"
        v-model="model.expirationTimer"
      />
    </div>
  </div>
  <StringProperty
    description="Message name."
    name="name"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.name"
  />
  <StringProperty
    description="Optional key that uniquely identifies the message. If a message with the same name, correlation key and unique key already exists, the message is discarded."
    name="uniqueKey"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.uniqueKey"
  />
  <VariableDataList
    description="Variables to set or delete at process instance scope. For a variable deletion, no data must be provided."
    name="variables"
    :disabled="disabled"
    :required="false"
    v-model="model.variables"
  />
  <StringProperty
    description="ID of the worker that sent the message."
    name="workerId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.workerId"
  />
</template>
