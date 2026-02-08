<script setup>
// generated, see template schema.vue.tpl
import Data from "./Data.vue"
import StringProperty from "../StringProperty.vue"

const {
  disabled,
} = defineProps({
  disabled: Boolean,
})

const model = defineModel()
</script>

<template>
  <div>
    <label
      class="block text-gray-700 mb-2"
      for="name"
    >
      <span>data</span>
      <br />
      <span class="text-sm">Data is used to store any data within an engine.</span>
    </label>
    <div class="pl-4">
      <Data
        :disabled="disabled"
        v-model="model.data"
      />
    </div>
  </div>
  <StringProperty
    description="Variable name."
    name="name"
    placeholder=""
    :disabled="disabled"
    :required="true"
    v-model="model.name"
  />
</template>
