<script setup>
const {
  description,
  disabled,
  name,
  required,
} = defineProps({
  description: String,
  disabled: Boolean,
  name: String,
  required: Boolean,
})

const model = defineModel()
</script>

<template>
  <div class="mb-4">
    <label
      class="block text-gray-700 mb-2"
      for="name"
    >
      <span>{{ name }}</span>
      <span v-if="required" class="text-red-600">*</span>
      <br />
      <span class="text-sm" v-html="description" />
    </label>
    <input
      class="
        h-4 w-4 shrink-0 rounded border border-gray-400  bg-white outline-none transition
        checked:border-blue-600 checked:bg-blue-600
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100
      "
      type="checkbox"
      :disabled="disabled"
      :name="name"
      v-model="model"
    />
  </div>
</template>
