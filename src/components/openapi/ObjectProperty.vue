<script setup>
import { ref } from "vue"

import ArrayProperty from "./ArrayProperty.vue"
import BooleanProperty from "./BooleanProperty.vue"
import FileProperty from "./FileProperty.vue"
import IntegerProperty from "./IntegerProperty.vue"
import StringProperty from "./StringProperty.vue"

const {
  data,
  disabled,
  properties,
} = defineProps({
  data: Object,
  disabled: Boolean,
  properties: Object,
})

const propertyRefs = ref([])

function getData() {
  const data = {}

  let isUndefined = true // determines if the data of all properties is undefined

  let i = 0
  for (const propertyRef of propertyRefs.value) {
    const property = properties[i]
    const propertyData = propertyRef.getData()
    if (propertyData) {
      data[property.name] = propertyData
      isUndefined = false
    }
    i++
  }

  return isUndefined ? undefined : data
}

defineExpose({ getData })
</script>

<template>
  <div>
    <div class="mb-4" v-for="property in properties" :key="property.name">
      <label class="block text-gray-700 mb-2" v-if="property.name">
        <span>{{ property.name }}</span>
        <span v-if="property.required" class="text-red-600">*</span>
        <br />
        <span class="text-sm" v-html="property.description" />
      </label>

      <StringProperty v-if="property.type == 'string'"
        ref="propertyRefs"
        :data="data[property.name] || ''"
        :disabled="disabled"
        :property="property"
      />
      <IntegerProperty v-else-if="property.type == 'integer'"
        ref="propertyRefs"
        :data="data[property.name] || 0"
        :disabled="disabled"
        :property="property"
      />
      <BooleanProperty v-else-if="property.type == 'boolean'"
        ref="propertyRefs"
        :data="data[property.name] || false"
        :disabled="disabled"
        :property="property"
      />
      <ArrayProperty v-else-if="property.type == 'array'"
        ref="propertyRefs"
        :data="data[property.name] || []"
        :disabled="disabled"
        :property="property"
      />
      <div class="pl-4" v-else-if="property.type == 'object'">
        <ObjectProperty
          ref="propertyRefs"
          :data="data[property.name] || {}"
          :disabled="disabled"
          :properties="property.properties"
        />
      </div>
      <FileProperty v-if="property.type == 'file'"
        ref="propertyRefs"
        :data="data[property.name] || null"
        :disabled="disabled"
      />
    </div>
  </div>
</template>
