<script setup>
import { viewerExpanded } from "./state.js"

const columns = [
  "ID",
  "BPMN element ID",
  "Type",
  "State",
  "Due at",
  "Completed at"
]

const expandedColumns = [
  "ID",
  "Element instance ID",
  "BPMN element ID",
  "Type",
  "State",
  "Created at",
  "Created by",
  "Due at",
  "Locked at",
  "Completed at"
]

const stateClasses = {
  "CANCELED": ["bg-red-200", "text-red-700"],
  "CAUSED_INCIDENT": ["bg-red-200", "text-red-700"],
  "CAUSED_RETRY": ["bg-red-200", "text-red-700"],
  "CREATED": ["bg-gray-200", "text-gray-700"],
  "DONE": ["bg-green-100", "text-green-700"],
  "DUE": ["bg-yellow-100", "text-yellow-700"],
  "LOCKED": ["bg-cyan-100", "text-cyan-700"]
}

const { results } = defineProps(["results"])
</script>

<template>
  <div v-if="results" class="pl-5 pr-5">
    <table v-if="!viewerExpanded" class="min-w-full">
      <colgroup>
        <col span="1" style="width: 6%;" />
        <col span="1" style="width: 21%;" />
        <col span="1" style="width: 19%;" />
        <col span="1" style="width: 12%;" />
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
          <td class="px-2 py-2">{{ result.type }}</td>
          <td class="px-2 py-2">
            <span
              class="px-2 py-1 inline-block rounded-full"
              :class="stateClasses[result.state]"
            >
              {{ result.state }}
            </span>
          </td>
          <td class="px-2 py-2">{{ result.dueAt || "-" }}</td>
          <td class="px-2 py-2">{{ result.completedAt || "-" }}</td>
        </tr>
      </tbody>
    </table>

    <table v-if="viewerExpanded" class="min-w-full">
      <colgroup>
        <col span="1" style="width: 6%;" />
        <col span="1" style="width: 9%;" />
        <col span="1" style="width: 11%;" />
        <col span="1" style="width: 11%;" />
        <col span="1" style="width: 8%;" />
        <col span="1" style="width: 11%;" />
        <col span="1" style="width: 11%;" />
        <col span="1" style="width: 11%;" />
        <col span="1" style="width: 11%;" />
        <col span="1" style="width: 11%;" />
      </colgroup>
      <thead class="sticky top-0 bg-white">
        <tr>
          <th v-for="column in expandedColumns" :key="column">
            <div class="p-2 text-left text-sm text-gray-900 opacity-70 font-normal font-sans border-y border-gray-100">
              {{ column }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="text-sm text-gray-800">
        <tr v-for="result in results" class="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
          <td class="px-2 py-2">{{ result.id }}</td>
          <td class="px-2 py-2">{{ result.elementInstanceId || "-" }}</td>
          <td class="px-2 py-2">{{ result.bpmnElementId }}</td>
          <td class="px-2 py-2">{{ result.type }}</td>
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
          <td class="px-2 py-2">{{ result.dueAt || "-" }}</td>
          <td class="px-2 py-2">{{ result.lockedAt || "-" }}</td>
          <td class="px-2 py-2">{{ result.completedAt || "-" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
