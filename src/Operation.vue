<script setup>
import { computed, ref } from "vue"

import { operations, processInstance } from "./state.js"
import { executeRequest } from "./app.js"

import PlayRequest from "./PlayRequest.vue"
import PlayResponse from "./PlayResponse.vue"
import TabButton from "./components/TabButton.vue"

import { components, descriptions, names } from "./components/openapi/operation/index.js"

// determines if the operation form is disabled
const formDisabled = ref(false)
// active tab
const tab = ref("form")

function execute(request) {
  formDisabled.value = true

  const selectedIndex = operations.getSelectedIndex()

  executeRequest(request, (response, is2xx) => {
    let responseBodyJson = null
    if (response.body.length != 0) {
      responseBodyJson = JSON.stringify(response.body, null, 2)
    }

    operations.patch(selectedIndex, {
      responseBodyJson
    })

    formDisabled.value = is2xx
    tab.value = "response"
  }, () => {
    operations.patch(selectedIndex, {
      request: request
    })

    formDisabled.value = false
  })
}

function activateTab(newTab) {
  tab.value = newTab
}

function choose() {
  operations.patch(operations.getSelectedIndex(), {
    component: null,
  })
}

const operation = computed(() => {
  const selected = operations.getSelected()

  // activate form tab, if selected operation has no request or response yet
  // but the request or response tab is activated
  if ((tab.value == "request" && !selected.request) || tab.value == "response" && !selected.response) {
    tab.value = "form"
  }

  formDisabled.value = selected.is2xx

  return selected
})
</script>

<template>
  <div class="w-full max-w-md mx-auto p-3">
    <div class="flex border-b border-gray-200">
      <TabButton label="Form"     :active="tab == 'form'"     :onClick="activateTab.bind(this, 'form')" />
      <TabButton label="Request"  :active="tab == 'request'"  :onClick="activateTab.bind(this, 'request')"  v-if="operation.request" />
      <TabButton label="Response" :active="tab == 'response'" :onClick="activateTab.bind(this, 'response')" v-if="operation.response" />
    </div>
  </div>

  <div class="relative p-6 w-full bg-white">
    <div v-if="processInstance.getId() && !operation.is2xx" class="absolute right-0 top-0 pr-6">
      <button
        class="
          px-3 py-1.5 border border-gray-200 text-gray-900 opacity-70 rounded-md cursor-pointer
          hover:bg-gray-50
        "
        title="Choose different operation"
        @click="choose"
      >
        <svg class="w-6 h-6"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14.5 8.046H11V6.119c0-.921-.9-1.446-1.524-.894l-5.108 4.49a1.2 1.2 0 0 0 0 1.739l5.108 4.49c.624.556 1.524.027 1.524-.893v-1.928h2a3.023 3.023 0 0 1 3 3.046V19a5.593 5.593 0 0 0-1.5-10.954Z"
          />
        </svg>
      </button>
    </div>
    <div v-if="operation.is2xx" class="absolute right-0 top-0 pr-6">
      <span class="px-3 py-1.5 text-gray-900 opacity-70"># {{ operations.getSelectedIndex() + 1 }}</span>
    </div>

    <h2 class="mb-4 text-center text-2xl">{{ names[operation.component] }}</h2>

    <div class="block mb-2 text-gray-700 text-center whitespace-pre-wrap" v-html="descriptions[operation.component]" />

    <div v-if="tab == 'form'">
      <component
        :is="components[operation.component]"
        :disabled="formDisabled"
        :execute="execute"
        :operation="operation"
      ></component>
    </div>

    <PlayRequest  v-if="tab == 'request'"  :operation="operation" />
    <PlayResponse v-if="tab == 'response'" :operation="operation" />
  </div>
</template>
