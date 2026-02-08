<script setup>
// generated, see template schema.vue.tpl
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
  <VariableDataList
    description="Variables to set or delete. For a variable deletion, no data must be provided."
    name="variables"
    :disabled="disabled"
    :required="false"
    v-model="model.variables"
  />
  <StringProperty
    description="ID of the worker that set the variables."
    name="workerId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.workerId"
  />
</template>
