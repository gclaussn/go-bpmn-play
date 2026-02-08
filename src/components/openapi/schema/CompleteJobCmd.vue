<script setup>
// generated, see template schema.vue.tpl
import JobCompletion from "./JobCompletion.vue"
import StringProperty from "../StringProperty.vue"
import VariableDataList from "./VariableDataList.vue"

const {
  disabled,
} = defineProps({
  disabled: Boolean,
})

const model = defineModel()
</script>

<template>
  <div>
    <label
      class="block text-gray-700 mb-2"
      for="name"
    >
      <span>completion</span>
      <br />
      <span class="text-sm">A job completion is used to complete jobs of various types.</span>
    </label>
    <div class="pl-4">
      <JobCompletion
        :disabled="disabled"
        v-model="model.completion"
      />
    </div>
  </div>
  <VariableDataList
    description="Variables to set or delete at element instance scope. For a variable deletion, no data must be provided."
    name="elementVariables"
    :disabled="disabled"
    :required="false"
    v-model="model.elementVariables"
  />
  <StringProperty
    description="Optional error, used to fail a job due to a technical problem."
    name="error"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.error"
  />
  <VariableDataList
    description="Variables to set or delete at process instance scope. For a variable deletion, no data must be provided."
    name="processVariables"
    :disabled="disabled"
    :required="false"
    v-model="model.processVariables"
  />
  <StringProperty
    description="Maximum number of retries. If the retry count is less than the retry limit, a retry job is created. Otherwise, an incident is created."
    name="retryLimit"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.retryLimit"
  />
  <StringProperty
    description="Duration until a retry job becomes due. At this point in time a retry job can be locked by a worker."
    name="retryTimer"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.retryTimer"
  />
  <StringProperty
    description="ID of the worker that locked and completed the job."
    name="workerId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.workerId"
  />
</template>
