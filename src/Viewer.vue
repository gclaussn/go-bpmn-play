<script setup>
import { ref } from "vue"

import { operations } from "./state.js"

import BpmnViewer from "./BpmnViewer.vue"
import ElementInstanceList from "./ElementInstanceList.vue"
import JobList from "./JobList.vue"
import TabButton from "./components/TabButton.vue"
import TaskList from "./TaskList.vue"

const tab = ref("diagram")

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
        <TabButton label="Diagram"           :active="tab == 'diagram'"           :onClick="activateTab.bind(this, 'diagram')" />
        <TabButton label="Element instances" :active="tab == 'element-instances'" :onClick="activateTab.bind(this, 'element-instances')" v-if="operations.size() > 1" />
        <TabButton label="Jobs"              :active="tab == 'jobs'"              :onClick="activateTab.bind(this, 'jobs')"              v-if="operations.size() > 1" />
        <TabButton label="Tasks"             :active="tab == 'tasks'"             :onClick="activateTab.bind(this, 'tasks')"             v-if="operations.size() > 1" />
      </div>
    </div>

    <KeepAlive>
      <BpmnViewer v-if="tab == 'diagram'" />
    </KeepAlive>

    <div class="h-screen overflow-y-scroll" style="direction: rtl" v-if="tab == 'element-instances'">
      <div style="direction: ltr">
        <ElementInstanceList />
      </div>
    </div>
    <div class="h-screen overflow-y-scroll" style="direction: rtl" v-if="tab == 'jobs'">
      <div style="direction: ltr">
        <JobList />
      </div>
    </div>
    <div class="h-screen overflow-y-scroll" style="direction: rtl" v-if="tab == 'tasks'">
      <div style="direction: ltr">
        <TaskList />
      </div>
    </div>
  </div>
</template>
