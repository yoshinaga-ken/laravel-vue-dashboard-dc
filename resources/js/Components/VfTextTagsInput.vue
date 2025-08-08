<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type { FilterTagInput, TagPaginator } from '@/Types/types-graphql'

defineProps({
  disabled: Boolean,
  inputPlaceholder: {
    type: String,
    default: 'Search Tag',
  },
  clearable: {
    type: Boolean,
    default: true,
  },
})

const selectedTags = defineModel<string[]>({
  default: () => [],
})

const inputValue = ref('')

const { result } = useQuery<{ tags: TagPaginator }>(
  gql`
    query FilterTags($input: FilterTagInput) {
      tags(input: $input, first: 512) {
        data {
          name
        }
      }
    }
  `,
  {
    variables: {
      input: {
        name: '',
      } satisfies FilterTagInput,
    },
  }
)

const availableTags = computed(() => {
  if (!result.value?.tags?.data) return []
  return result.value.tags.data.map(tag => tag.name)
})

const handleInputConfirm = () => {
  const currentInput = inputValue.value
  if (currentInput && !selectedTags.value.includes(currentInput)) {
    selectedTags.value.push(currentInput)
  }
  inputValue.value = ''
}
</script>

<template>
  <v-autocomplete
    v-model="selectedTags"
    v-model:search="inputValue"
    :items="availableTags"
    :placeholder="inputPlaceholder"
    :disabled="disabled"
    :clearable="clearable"
    chips
    multiple
    closable-chips
    class="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
    variant="outlined"
    @keyup.enter="handleInputConfirm"
  />
</template>

<style>
.v-autocomplete #tags-messages {
  display: none;
}
.v-autocomplete input {
  @apply rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300;
}
</style>
