<script setup>
// generated, see template schema.vue.tpl
import StringProperty from "../StringProperty.vue"
import TagList from "./TagList.vue"

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
    description="Process instance filter."
    name="id"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.id"
  />
  <StringProperty
    description="Process filter."
    name="processId"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.processId"
  />
  <TagList
    description="Tags, a process instance must have, to be included."
    name="tags"
    :disabled="disabled"
    :required="false"
    v-model="model.tags"
  />
</template>
