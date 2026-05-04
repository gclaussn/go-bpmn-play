<script setup>
import { computed, onBeforeMount } from "vue"

import { bpmnXml, bpmnXmlError } from "./state.js"

import BpmnChooser from "./BpmnChooser.vue"
import Play from "./Play.vue";

onBeforeMount(async () => {
  if (!window.location.search) {
    return
  }

  const searchParams = new URLSearchParams(window.location.search)

  const fetchParam = searchParams.get("fetch")
  if (!fetchParam) {
    return
  }

  try {
    const response = await fetch(fetchParam)
    if (!response.ok) {
      bpmnXmlError.value = `HTTP ${response.status} when fetching ${fetchParam}`
      bpmnXml.value = null
      return
    }

    bpmnXml.value = await response.text()
  } catch (err) {
    bpmnXmlError.value = err
    bpmnXml.value = null
  }
})

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
