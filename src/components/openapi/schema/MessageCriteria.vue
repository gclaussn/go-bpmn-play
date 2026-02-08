<script setup>
// generated, see template schema.vue.tpl
import BooleanProperty from "../BooleanProperty.vue"
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
    description="Message filter."
    name="id"
    placeholder="0"
    :disabled="disabled"
    :required="false"
    v-model.number="model.id"
  />
  <BooleanProperty
    description="Determines if expired messages are returned."
    name="excludeExpired"
    :disabled="disabled"
    :required="false"
    v-model="model.excludeExpired"
  />
  <StringProperty
    description="Message name filter."
    name="name"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.name"
  />
</template>
