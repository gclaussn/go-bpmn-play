<script setup>
// generated, see template schema.vue.tpl
import StringListProperty from "../StringListProperty.vue"
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
    description="Partition condition."
    name="partition"
    placeholder="2006-01-02"
    :disabled="disabled"
    :required="false"
    v-model="model.partition"
  />
  <StringProperty
    description="Job condition - must be used in combination with a partition."
    name="id"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.id"
  />
  <StringProperty
    description="Maximum number of jobs to lock."
    name="limit"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.limit"
  />
  <StringListProperty
    description="IDs of processes to include."
    name="processIds"
    :disabled="true"
    :required="false"
    v-model="model.processIds"
  />
  <StringProperty
    description="Process instance condition - must be used in combination with a partition."
    name="processInstanceId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.processInstanceId"
  />
  <StringProperty
    description="ID of the worker that locks the jobs."
    name="workerId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.workerId"
  />
</template>
