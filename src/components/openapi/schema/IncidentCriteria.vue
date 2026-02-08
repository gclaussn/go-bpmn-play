<script setup>
// generated, see template schema.vue.tpl
import StringProperty from "../StringProperty.vue"

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
    description="Incident filter."
    name="id"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.id"
  />
  <StringProperty
    description="Job filter."
    name="jobId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.jobId"
  />
  <StringProperty
    description="Process instance filter."
    name="processInstanceId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.processInstanceId"
  />
  <StringProperty
    description="Process filter."
    name="taskId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.taskId"
  />
</template>
