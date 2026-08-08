<script setup>
// generated, see template operation.vue.tpl
import OperationForm from "../OperationForm.vue"

import definition from "../definition/completeJob.json"

const {
  disabled,
  execute,
  operation,
} = defineProps({
  disabled: Boolean,
  execute: Function,
  operation: Object,
})
</script>

<template>
  <OperationForm
    :definition="definition"
    :disabled="disabled"
    :execute="execute"
    :operation="operation"
  />
</template>
