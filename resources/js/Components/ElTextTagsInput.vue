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
const inputRef = ref<InstanceType<typeof ElAutocomplete> | null>(null)


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
      inputRef.value?.focus()
    }, 200)
  })
}

const handleInputConfirm = (inputValueVisible: boolean = true) => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputValue.value = ''

  if (inputValueVisible) {
    inputVisible.value = false
    setTimeout(() => {
      showInput()
    }, 10)
  } else {
    inputVisible.value = false
  }
}

const handleBackspace = (event: KeyboardEvent) => {
  if (event.key === 'Backspace' && inputValue.value === '' && dynamicTags.value.length > 0) {
    dynamicTags.value.pop()
  }
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
      ref="inputRef"
      v-model="inputValue"
      :fetch-suggestions="querySearch"
      class="w-20"
      size="small"
      clearable
      @keyup.enter="handleInputConfirm(true)"
      @keydown.enter.prevent
      @keydown="handleBackspace"
      @blur="handleInputConfirm(false)"
    />
    <ElButton v-else-if="!disabled" class="button-new-tag" size="small" @click="showInput">
      + New Tag
    </ElButton>
  </div>
</template>
