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
    description="Partition condition."
    name="partition"
    placeholder="2006-01-02"
    :disabled="disabled"
    :required="false"
    v-model="model.partition"
  />
  <StringProperty
    description="Task condition - must be used in combination with a partition."
    name="id"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.id"
  />
  <StringProperty
    description="Condition that restricts the tasks, to be locked by a specific engine."
    name="engineId"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.engineId"
  />
</template>
