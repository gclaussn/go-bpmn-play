<script setup>
import { onMounted, useTemplateRef } from "vue"

const {
  description,
  disabled,
  name,
  placeholder,
  required,
} = defineProps({
  description: String,
  disabled: Boolean,
  name: String,
  placeholder: String,
  required: Boolean,
})

const model = defineModel()

const fileChooserRef = useTemplateRef("file-chooser")

onMounted(() => {
  const fileChooser = fileChooserRef.value

  fileChooser.addEventListener("change", function(event) {
    const file = event.target.files[0]
    if (!file) {
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = function(e) {
      model.value = e.target.result
    }

    fileReader.readAsText(file)
  })
})
</script>

<template>
  <div>
    <div class="mb-4">
      <label
        v-if="name"
        class="block text-gray-700 mb-2"
        for="name"
      >
        <span>{{ name }}</span>
        <span v-if="required" class="text-red-600">*</span>
        <br />
        <span class="text-sm" v-html="description" />
      </label>
    </div>
    <div class="mb-4 text-center">
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
  </div>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
