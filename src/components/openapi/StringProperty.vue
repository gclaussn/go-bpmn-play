<script setup>
const {
  description,
  disabled,
  name,
  placeholder,
  required,
} = defineProps({
  description: String,
  disabled: Boolean,
  name: String,
  placeholder: String,
  required: Boolean,
})

const model = defineModel()
</script>

<template>
  <div class="mb-4">
    <label
      v-if="name"
      class="block text-gray-700 mb-2"
      for="name"
    >
      <span>{{ name }}</span>
      <span v-if="required" class="text-red-600">*</span>
      <br />
      <span class="text-sm" v-html="description" />
    </label>
    <input
      autocomplete="off"
      class="
        w-full px-3 py-2 border border-gray-300 rounded-md
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-80 disabled:bg-gray-200 disabled:text-gray-900
      "
      type="text"
      :disabled="disabled"
      :name="name"
      :placeholder="!disabled ? placeholder : ''"
      v-model="model"
    />
  </div>
</template>
