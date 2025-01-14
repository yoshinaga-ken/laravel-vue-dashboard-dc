<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { ElTag, ElInput, ElButton } from 'element-plus'

const props = defineProps({
  disabled: Boolean,
});

const inputValue = ref('')
const dynamicTags = defineModel<string []>();
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()


const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>

<template>
  <div class="flex gap-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
    <ElTag
      v-for="tag in dynamicTags"
      :key="tag"
      :closable="!disabled"
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </ElTag>
    <ElInput
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <ElButton v-else-if="!disabled" class="button-new-tag" size="small" @click="showInput">
      + New Tag
    </ElButton>
  </div>
</template>
