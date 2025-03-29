<script lang="ts" setup>
import { nextTick, ref, computed } from 'vue'
import { ElTag, ElInput, ElButton, ElAutocomplete } from 'element-plus'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const props = defineProps({
  disabled: Boolean,
});

const inputValue = ref('')
const dynamicTags = defineModel<string[]>({
  default: () => []
});
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const { result } = useQuery(gql`
  query SearchTags($keyword: String) {
    searchTags(keyword: $keyword, limit: 512) {
      name
    }
  }
`, {
  query: ''
})

const availableTags = computed(() => {
  if (!result.value?.searchTags) return []
  return result.value.searchTags.map((tag: any) => tag.name)
})

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    setTimeout(() => {
      InputRef.value?.focus()
    }, 200)
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? availableTags.value
      .filter(tag => tag.toLowerCase().includes(queryString.toLowerCase()))
      .map(tag => ({ value: tag }))
    : availableTags.value.map(tag => ({ value: tag }))
  cb(results)
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
    <ElAutocomplete
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      :fetch-suggestions="querySearch"
      class="w-20"
      size="small"
      clearable
      @keyup.enter="handleInputConfirm"
      @keydown.enter.prevent
      @blur="handleInputConfirm"
    />
    <ElButton v-else-if="!disabled" class="button-new-tag" size="small" @click="showInput">
      + New Tag
    </ElButton>
  </div>
</template>
