<script setup>
// generated, see template schema.list.vue.tpl
import MessageDefinition from "./MessageDefinition.vue";

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

function add() {
  model.value.push({
    bpmnElementId: "",
    messageName: "",
  })
}
function remove() {
  if (model.value.length != 0) {
    model.value.pop()
  }
}
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
      <span class="text-sm">{{ description }}</span>
    </label>
    <div v-for="(_, index) in model" class="pl-4">
      <MessageDefinition
        :disabled="disabled"
        v-model="model[index]"
      />
    </div>

    <div v-if="!disabled" class="flex space-x-2 justify-center">
      <button
        class="
          px-6 py-1 bg-green-600 rounded-md text-white cursor-pointer
          hover:bg-green-700
          focus:outline-none focus:ring-2 focus:ring-green-500
        "
        type="button"
        @click="add"
      >
        Add
      </button>
      <button
        class="
          px-6 py-1 bg-red-500 rounded-md text-white cursor-pointer
          hover:bg-red-600
          focus:outline-none focus:ring-2 focus:ring-red-500
        "
        type="button"
        :class="{ 'invisible': model.length == 0 }"
        @click="remove"
      >
        Remove
      </button>
    </div>
  </div>
</template>
