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
    description="Encoding of the value - e.g. <code class='description-code'>json</code>."
    name="encoding"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.encoding"
  />
  <BooleanProperty
    description="Determines if a value is encrypted before it is stored."
    name="encrypted"
    :disabled="disabled"
    :required="false"
    v-model="model.encrypted"
  />
  <StringProperty
    description="Value, encoded as a string."
    name="value"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.value"
  />
</template>
