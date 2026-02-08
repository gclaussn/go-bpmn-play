<script setup>
import { computed } from "vue"

import { bpmnXml } from "./state.js"

import BpmnChooser from "./BpmnChooser.vue"
import Play from "./Play.vue";

const current = computed(() => {
  if (bpmnXml.value) {
    return "Play"
  } else {
    return "BpmnChooser"
  }
})

const components = {
  BpmnChooser,
  Play,
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <component :is="components[current]"></component>
  </div>
</template>
