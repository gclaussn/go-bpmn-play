<script setup>
// generated, see template schema.vue.tpl
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
    description="A point in time."
    name="time"
    placeholder="2006-01-02T15:04:05Z07:00"
    :disabled="disabled"
    :required="false"
    v-model="model.time"
  />
  <StringProperty
    description="CRON expression that specifies a cyclic timer."
    name="timeCycle"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.timeCycle"
  />
  <StringProperty
    description="Duration based timer that uses the engine's time to calculate a point in time."
    name="timeDuration"
    placeholder=""
    :disabled="disabled"
    :required="false"
    v-model="model.timeDuration"
  />
</template>
