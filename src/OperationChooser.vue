<script setup>
import { computed, onMounted, ref, useTemplateRef } from "vue"

import { operations, processInstance } from "./state.js"
import { newOperation } from "./app.js"

import { descriptions, names } from "./components/openapi/operation/index.js"

const common = [
  "CompleteJob",
  "CreateProcess",
  "CreateProcessInstance",
  "ExecuteTasks",
  "LockJobs",
  "ResolveIncident",
  "SendMessage",
  "SendSignal",
  "SetTime",
]

function newSection(label) {
  return {
    label: label,
    components: [],
    names: [],
    filter: true,
    filters: []
  }
}

const commonSection = newSection("COMMON")
const variablesSection = newSection("VARIABLES")
const querySection = newSection("QUERY")
const otherSection = newSection("OTHER")

for (const [component, name] of Object.entries(names)) {
  let section
  if (common.includes(component)) {
    section = commonSection
  } else if (component.startsWith("Query")) {
    section = querySection
  } else if (component.includes("Variables")) {
    section = variablesSection
  } else {
    section = otherSection
  }

  section.components.push(component)
  section.names.push(name.toLowerCase())
  section.filters.push(true)
}

const sections = [ commonSection, variablesSection, querySection, otherSection ]

const search = ref("")
const searchInput = useTemplateRef("search-input")

onMounted(() => {
  searchInput.value.focus()
})

const filteredSections = computed(() => {
  const value = search.value.trim().toLowerCase()

  for (let i = 0; i < sections.length; i++) {
    const { components, names, filters } = sections[i]

    let filterSection = false
    for (let j = 0; j < components.length; j++) {
      filters[j] = !value || names[j].includes(value)
  
      // exclude CreateProcessInstance operation, if process instance has already been created
      // this condition is needed, since CreateProcessInstance cannot be excluded
      // in case a BPMN processes with multiple start event types has been created
      if (i == 0 && filters[j] && components[j] == "CreateProcessInstance" && processInstance.getId()) {
        filters[j] = false
      }

      if (filters[j]) {
        filterSection = true
      }
    }
    sections[i].filter = filterSection
  }

  return sections
})

function choose(component) {
  operations.patch(operations.getSelectedIndex(), newOperation(component))
}
</script>

<template>
  <div class="block mt-4 mb-2 text-gray-700 text-center">
    <span>Choose an operation to perform next.</span>
  </div>

  <div class="w-full max-w-xl mx-auto py-3">
    <div class="border border-gray-100 shadow-lg ring-1 ring-gray-200">
      <div class="flex items-center gap-2 px-3 py-2.5">
        <svg
          class="h-4 w-4 text-gray-900 opacity-70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="20" y2="20" />
        </svg>
        <input
          autocomplete="off"
          class="w-full text-sm outline-none"
          placeholder="Search an operation..."
          ref="search-input"
          type="text"
          v-model="search"
        />
      </div>

      <div v-for="section in filteredSections">
        <div v-if="section.filter" class="px-2 pt-1 pb-2 border-t border-gray-200">
          <div class="px-2 py-2 text-sm text-gray-900 opacity-70 font-normal font-sans">
            {{ section.label }}
          </div>

          <div v-for="(component, index) in section.components" :key="component">
            <button
              class="w-full px-2 py-2 text-left text-gray-700 cursor-pointer hover:bg-gray-50"
              v-on:click="choose(component)"
              v-if="section.filters[index]"
            >
              <div>
                <div class="mb-1 text-sm font-medium">{{ names[component] }}</div>
                <div class="text-xs" v-html="descriptions[component]" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
