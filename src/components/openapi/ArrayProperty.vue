<script setup>
import { ref } from "vue"

import IntegerProperty from "./IntegerProperty.vue"
import ObjectProperty from "./ObjectProperty.vue"
import StringProperty from "./StringProperty.vue"

const {
  data,
  disabled,
  property,
} = defineProps({
  data: Array,
  disabled: Boolean,
  property: Object,
})

const items = ref(data)
const itemRefs = ref([])

function add() {
  if (property.items.type == "object") {
    items.value.push({})
  } else if (property.items.type == "string") {
    items.value.push("")
  } else if (property.items.type == "integer") {
    items.value.push(0)
  } else {
    throw new Error(`unsupported property type ${property.items.type}`)
  }
}
function remove() {
  items.value.pop()
}

function getData() {
  const data = []
  for (const itemRef of itemRefs.value) {
    data.push(itemRef.getData())
  }
  return data.length != 0 ? data : undefined
}

defineExpose({ getData })
</script>

<template>
  <div class="mb-4">
    <div v-for="(item, index) in items" :key="index">
      <span class="py-1.5 text-gray-900 opacity-70"># {{ index + 1 }}</span>

      <div class="pl-4">
        <ObjectProperty v-if="property.items.type == 'object'"
          ref="itemRefs"
          :data="item"
          :disabled="disabled"
          :properties="property.items.properties"
        />
        <div class="mb-4" v-else-if="property.items.type == 'string'">
          <StringProperty
            ref="itemRefs"
            :data="item"
            :disabled="disabled"
            :property="property"
          />
        </div>
        <div class="mb-4" v-else-if="property.items.type == 'integer'">
          <IntegerProperty
            ref="itemRefs"
            :data="item"
            :disabled="disabled"
            :property="property"
          />
        </div>
      </div>
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
        :class="{ 'invisible': items == 0 }"
        @click="remove"
      >
        Remove
      </button>
    </div>
  </div>
</template>
