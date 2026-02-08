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
    description="Process filter."
    name="id"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.id"
  />
  <TagList
    description="Tags, a process must have, to be included."
    name="tags"
    :disabled="disabled"
    :required="false"
    v-model="model.tags"
  />
</template>
