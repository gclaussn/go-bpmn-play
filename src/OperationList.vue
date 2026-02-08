<script setup>
import { computed } from "vue";

import { operations } from "./state.js"

import { names } from "./components/openapi/operation/index.js"

const state = computed(() => {
  const selectedIndex = operations.getSelectedIndex()
  const all = operations.getAll()

  const before = 5 - Math.min(5, selectedIndex)

  const beforeElements = []
  for (let i = Math.max(0, selectedIndex - 5); i < selectedIndex; i++) {
    beforeElements.push({index: i, name: names[all[i].component]})
  }

  const element = {index: selectedIndex, name: names[all[selectedIndex].component]}

  const afterElements = []
  for (let i = selectedIndex + 1; i < Math.min(all.length, (selectedIndex + 5) + 1); i++) {
    afterElements.push({index: i, name: names[all[i].component]})
  }

  const after = 5 - Math.min(5, (all.length - 1) - selectedIndex)

  return {
    before,
    beforeElements,
    element,
    afterElements,
    after,
  }
})

function first() {
  operations.setSelected(0)
}

function prev() {
  const selectedIndex = operations.getSelectedIndex()
  if (selectedIndex > 0) {
    operations.setSelected(selectedIndex - 1)
  }
}

function next() {
  const selectedIndex = operations.getSelectedIndex()
  if (selectedIndex < operations.size() - 1) {
    operations.setSelected(selectedIndex + 1)
  }
}

function last() {
  operations.setSelected(operations.size() - 1)
}
</script>

<template>
  <div class="text-center">
    <button
      class="
        mb-3 px-3 py-1.5 border border-gray-200 text-gray-900 opacity-70 rounded-md cursor-pointer
        hover:bg-gray-100
      "
      title="Show first"
      @click="first"
    >
      <svg
        class="w-6 h-6"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 17-4-4-4 4m8-6-4-4-4 4" />
      </svg>
    </button>
  </div>
  <div class="text-center">
    <button
      class="
        mb-3 px-3 py-1.5 border border-gray-200 text-gray-900 opacity-70 rounded-md cursor-pointer
        hover:bg-gray-100
      "
      title="Show previous"
      @click="prev"
    >
      <svg
        class="w-6 h-6"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 14-4-4-4 4" />
      </svg>
    </button>
  </div>

  <div v-for="_ in state.before" class="px-4 py-2 border text-sm invisible">!</div>

  <div v-for="element in state.beforeElements">
    <div
      class="
        px-4 py-2 text-center text-sm text-slate-600 border border-slate-300 transition-all shadow-sm cursor-pointer select-none
        hover:shadow-lg
      "
      v-on:click="operations.setSelected(element.index)"
    >
      {{ element.name || "?" }}
    </div>
  </div>

  <div
    class="
      px-4 py-2 bg-slate-800 text-center text-sm text-white border border-slate-800 transition-all shadow-sm cursor-pointer select-none
    "
  >
    {{ state.element.name || "?" }}
  </div>

  <div v-for="element in state.afterElements">
    <div
      class="
      px-4 py-2 text-center text-sm text-slate-600 border border-slate-300 transition-all shadow-sm cursor-pointer select-none
        hover:shadow-lg
      "
      v-on:click="operations.setSelected(element.index)"
    >
      {{ element.name || "?" }}
    </div>
  </div>

  <div v-for="_ in state.after" class="px-4 py-2 border text-sm invisible">!</div>

  <div class="text-center">
    <button
      class="
        mt-3 px-3 py-1.5 border border-gray-200 text-gray-900 opacity-70 rounded-md transition-all cursor-pointer
        hover:bg-gray-100
      "
      title="Show next"
      @click="next"
    >
      <svg
        class="w-6 h-6"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4" />
      </svg>
    </button>
  </div>
  <div class="text-center">
    <button
      class="
        mt-3 px-3 py-1.5 border border-gray-200 text-gray-900 opacity-70 rounded-md transition-all cursor-pointer
        hover:bg-gray-100
      "
      title="Show last"
      @click="last"
    >
      <svg
        class="w-6 h-6"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 7 4 4 4-4m-8 6 4 4 4-4" />
      </svg>
    </button>
  </div>
</template>
