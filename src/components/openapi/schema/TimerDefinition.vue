<script setup>
// generated, see template schema.vue.tpl
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
    description="Element ID of the timer event within the BPMN XML."
    name="bpmnElementId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.bpmnElementId"
  />
  <div>
    <label
      class="block text-gray-700 mb-2"
      for="name"
    >
      <span>timer</span>
      <span class="text-red-600">*</span>
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
