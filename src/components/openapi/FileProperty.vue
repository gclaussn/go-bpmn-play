<script setup>
import { onMounted, useTemplateRef, ref } from "vue"

const {
  data,
  disabled,
} = defineProps({
  data: String,
  disabled: Boolean,
})

const fileChooserRef = useTemplateRef("file-chooser")
const fileText = ref(data)

function getData() {
  return fileText.value || undefined
}

defineExpose({ getData })

onMounted(() => {
  if (data) {
    return
  }

  const fileChooser = fileChooserRef.value

  fileChooser.addEventListener("change", function(event) {
    const file = event.target.files[0]
    if (!file) {
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = function(e) {
      fileText.value = e.target.result
    }

    fileReader.readAsText(file)
  })
})
</script>

<template>
  <div>
    <div class="mb-4 text-center" v-if="fileText === null">
      <label
        class="
          px-4 py-2.5 text-sm text-slate-600 text-center border border-slate-300 rounded-md shadow-sm cursor-pointer
          hover:shadow-lg hover:text-white hover:bg-slate-800 hover:border-slate-800
          active:border-slate-800 active:text-white active:bg-slate-800
        "
        for="file-chooser"
      >
        Choose file
      </label>
      <input type="file" id="file-chooser" ref="file-chooser" />
    </div>

    <input
      class="
        w-full px-3 py-2 border border-gray-300 rounded-md
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-80 disabled:bg-gray-200 disabled:text-gray-900
      "
      type="text"
      disabled="disabled"
      v-model="fileText"
    />
  </div>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
