<script setup>
import { viewerExpanded } from "./state.js"

const columns = [
  "ID",
  "BPMN element ID",
  "BPMN element type",
  "State",
  "Started at",
  "Ended at"
]

const expandedColumns = [
  "ID",
  "Parent ID",
  "Element ID",
  "BPMN element ID",
  "BPMN element type",
  "State",
  "Created at",
  "Created by",
  "Started at",
  "Ended at"
]

const stateClasses = {
  "CANCELED": ["bg-red-200", "text-red-700"],
  "COMPLETED": ["bg-green-100", "text-green-700"],
  "CREATED": ["bg-gray-200", "text-gray-700"],
  "QUEUED": ["bg-gray-200", "text-gray-700"],
  "STARTED": ["bg-blue-100", "text-blue-700"],
  "SUSPENDED": ["bg-amber-100", "text-amber-700"],
  "TERMINATED": ["bg-red-200", "text-red-700"]
}

const { results } = defineProps(["results"])
</script>

<template>
  <div v-if="results" class="pl-5 pr-5">
    <table v-if="!viewerExpanded" class="min-w-full">
      <colgroup>
        <col span="1" style="width: 6%;" />
        <col span="1" style="width: 21%;" />
        <col span="1" style="width: 21%;" />
        <col span="1" style="width: 10%;" />
        <col span="1" style="width: 21%;" />
        <col span="1" style="width: 21%;" />
      </colgroup>
      <thead class="sticky top-0 bg-white">
        <tr>
          <th v-for="column in columns" :key="column">
            <div class="p-2 text-left text-sm text-gray-900 opacity-70 font-normal font-sans border-y border-gray-100">
              {{ column }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="text-sm text-gray-800">
        <tr v-for="result in results" class="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
          <td class="px-2 py-2">{{ result.id }}</td>
          <td class="px-2 py-2">{{ result.bpmnElementId }}</td>
          <td class="px-2 py-2">{{ result.bpmnElementType }}</td>
          <td class="px-2 py-2">
            <span
              class="px-2 py-1 inline-block rounded-full"
              :class="stateClasses[result.state]"
            >
              {{ result.state }}
            </span>
          </td>
          <td class="px-2 py-2">{{ result.startedAt || "-" }}</td>
          <td class="px-2 py-2">{{ result.endedAt || "-" }}</td>
        </tr>
      </tbody>
    </table>

    <table v-if="viewerExpanded" class="min-w-full">
      <colgroup>
        <col span="1" style="width: 7%;" />
        <col span="1" style="width: 8%;" />
        <col span="1" style="width: 8%;" />
        <col span="1" style="width: 11%;" />
        <col span="1" style="width: 11%;" />
        <col span="1" style="width: 8%;" />
        <col span="1" style="width: 11%;" />
        <col span="1" style="width: 11%;" />
        <col span="1" style="width: 11%;" />
        <col span="1" style="width: 11%;" />
      </colgroup>
      <thead class="sticky top-0 bg-white">
        <tr>
          <th v-for="column in expandedColumns" :key="column" class="p-2 border-y border-gray-100">
            <div class="p-2 text-left text-sm text-gray-900 opacity-70 font-normal font-sans border-y border-gray-100">
              {{ column }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="text-sm text-gray-800">
        <tr v-for="result in results" class="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
          <td class="px-2 py-2">{{ result.id }}</td>
          <td class="px-2 py-2">{{ result.parentId || "-" }}</td>
          <td class="px-2 py-2">{{ result.elementId }}</td>
          <td class="px-2 py-2">{{ result.bpmnElementId }}</td>
          <td class="px-2 py-2">{{ result.bpmnElementType }}</td>
          <td class="px-2 py-2">
            <span
              class="px-2 py-1 inline-block rounded-full"
              :class="stateClasses[result.state]"
            >
              {{ result.state }}
            </span>
          </td>
          <td class="px-2 py-2">{{ result.createdAt }}</td>
          <td class="px-2 py-2">{{ result.createdBy }}</td>
          <td class="px-2 py-2">{{ result.startedAt || "-" }}</td>
          <td class="px-2 py-2">{{ result.endedAt || "-" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
