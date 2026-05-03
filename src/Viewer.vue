<script setup>
import { computed, ref } from "vue"

import { operations } from "./state.js"

import BpmnViewer from "./BpmnViewer.vue"
import ElementInstanceList from "./ElementInstanceList.vue"
import ExpandViewerButton from "./components/ExpandViewerButton.vue";
import JobList from "./JobList.vue"
import TabButton from "./components/TabButton.vue"
import TaskList from "./TaskList.vue"

const tab = ref("diagram")

const results = computed(() => {
  if (operations.size() <= 1) {
    return
  }

  let operation = operations.getSelected()
  if (!operation.is2xx) {
    // if current operation has not been successfully executed yet, take previous one
    operation = operations.get(operations.getSelectedIndex() - 1)
  }
  return operation[tab.value]
})

function activateTab(newTab) {
  tab.value = newTab
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <div
      class="w-full mx-auto p-3"
      :class="{ 'max-w-md': operations.size() <= 1 }"
    >
      <div class="flex border-b border-gray-200">
        <TabButton label="Diagram"           :active="tab == 'diagram'"          :onClick="activateTab.bind(this, 'diagram')" />
        <TabButton label="Element instances" :active="tab == 'elementInstances'" :onClick="activateTab.bind(this, 'elementInstances')" v-if="operations.size() > 1" />
        <TabButton label="Jobs"              :active="tab == 'jobs'"             :onClick="activateTab.bind(this, 'jobs')"             v-if="operations.size() > 1" />
        <TabButton label="Tasks"             :active="tab == 'tasks'"            :onClick="activateTab.bind(this, 'tasks')"            v-if="operations.size() > 1" />
      </div>
    </div>
    <div class="w-full mx-auto pr-3 pl-3">
      <div class="relative">
        <div class="mb-2 p-2 text-gray-700 text-center">
          <span v-if="results">Count: {{ results.length }}</span>
          <span v-else-if="tab != 'diagram'">No data available!</span>
          <span v-else>&nbsp;</span>
        </div>

        <div class="absolute right-0 top-0 pr-5">
          <ExpandViewerButton />
        </div>
      </div>
    </div>

    <KeepAlive>
      <BpmnViewer v-if="tab == 'diagram'" />
    </KeepAlive>

    <div class="h-screen overflow-y-scroll" style="direction: rtl" v-if="tab == 'elementInstances'">
      <div style="direction: ltr">
        <ElementInstanceList :results="results" />
      </div>
    </div>
    <div class="h-screen overflow-y-scroll" style="direction: rtl" v-if="tab == 'jobs'">
      <div style="direction: ltr">
        <JobList :results="results" />
      </div>
    </div>
    <div class="h-screen overflow-y-scroll" style="direction: rtl" v-if="tab == 'tasks'">
      <div style="direction: ltr">
        <TaskList :results="results" />
      </div>
    </div>
  </div>
</template>
