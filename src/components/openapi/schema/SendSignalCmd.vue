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
  <StringProperty
    description="Signal name."
    name="name"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.name"
  />
  <VariableDataList
    description="Variables to set or delete at process instance scope. For a variable deletion, no data must be provided."
    name="variables"
    :disabled="disabled"
    :required="false"
    v-model="model.variables"
  />
  <StringProperty
    description="ID of the worker that sent the signal."
    name="workerId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.workerId"
  />
</template>
