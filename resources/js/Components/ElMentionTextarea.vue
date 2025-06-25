<script lang="ts" setup>
import { ref, onBeforeUnmount, computed } from 'vue'
import { ElMention } from 'element-plus'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type { MentionOption } from 'element-plus'
import type { FilterTagInput, TagPaginator, FilterUserInput, UserPaginator } from '@/Types/types-graphql'

const props = withDefaults(defineProps<{
  /** @description プレースホルダーテキスト */
  placeholder?: string
  /** @description 無効状態 */
  disabled?: boolean
  /** @description 行数 */
  rows?: number
}>(), {
  placeholder: 'input @ to mention people, # to mention tag',
  disabled: false,
  rows: 4
})

/** @description v-model対応 */
const modelValue = defineModel<string>({
  default: ''
})

const loading = ref(false)
const options = ref<MentionOption[]>([])

/** @description 検索のデバウンス時間（ミリ秒） */
const SEARCH_DEBOUNCE_MS = 300

/** @description キャッシュ戦略の閾値 */
const CACHE_THRESHOLD = 512

/** @description データ取得モード */
const useUserCache = ref(true)
const useTagCache = ref(true)

// タグ取得用GraphQLクエリ
const { result: tagsResult, refetch: refetchTags } = useQuery<{ tags: TagPaginator }>(gql`
  query FilterTags($input: FilterTagInput) {
    tags(input: $input, first: 512) {
      data {
        name
      }
      paginatorInfo {
        count
        total
      }
    }
  }
`, {
  variables: {
    input: {
      name: ''
    } satisfies FilterTagInput
  }
})

// ユーザー取得用GraphQLクエリ
const { result: usersResult, refetch: refetchUsers } = useQuery<{ users: UserPaginator }>(gql`
  query FilterUsers($input: FilterUserInput) {
    users(input: $input, first: 512) {
      data {
        name
        email
      }
      paginatorInfo {
        count
        total
      }
    }
  }
`, {
  variables: {
    input: {
      name: ''
    } satisfies FilterUserInput
  }
})

/** @description 利用可能なタグ一覧 */
const availableTags = computed(() => {
  if (!tagsResult.value?.tags?.data) return []

  // 初回取得時にキャッシュ戦略を決定
  const total = tagsResult.value.tags.paginatorInfo?.total || 0
  if (total > CACHE_THRESHOLD) {
    useTagCache.value = false
  }

  return tagsResult.value.tags.data
    .filter(tag => tag && typeof tag.name === 'string')
    .map(tag => tag.name)
})

/** @description 利用可能なユーザー一覧 */
const availableUsers = computed(() => {
  if (!usersResult.value?.users?.data) return []

  // 初回取得時にキャッシュ戦略を決定
  const total = usersResult.value.users.paginatorInfo?.total || 0
  if (total > CACHE_THRESHOLD) {
    useUserCache.value = false
  }

  return usersResult.value.users.data
    .filter(user => user && typeof user.name === 'string')
    .map(user => user.name)
})

let timer: ReturnType<typeof setTimeout>

/** @description 検索結果をフィルタリングしてMentionOptionに変換 */
const filterAndMapItems = (items: string[], pattern: string): MentionOption[] => {
  return items
    .filter(item => pattern === '' || item.toLowerCase().includes(pattern.toLowerCase()))
    .map(item => ({
      label: item,
      value: item,
    }))
}

/** @description メンション検索ハンドラー */
const handleSearch = async (pattern: string, prefix: string) => {
  if (timer) clearTimeout(timer)

  loading.value = true

  timer = setTimeout(async () => {
    let results: MentionOption[] = []

    try {
      if (prefix === '@') {
        if (useUserCache.value) {
          // キャッシュ戦略: クライアントサイドフィルタリング
          results = filterAndMapItems(availableUsers.value, pattern)
        } else {
          // 動的検索戦略: GraphQLクエリ実行
          const response = await refetchUsers({
            input: {
              name: pattern
            } satisfies FilterUserInput
          })

          if (response?.data?.users?.data) {
            results = response.data.users.data
              .filter(user => user && typeof user.name === 'string')
              .map(user => ({
                label: user.name,
                value: user.name,
              }))
          }
        }
      } else if (prefix === '#') {
        if (useTagCache.value) {
          // キャッシュ戦略: クライアントサイドフィルタリング
          results = filterAndMapItems(availableTags.value, pattern)
        } else {
          // 動的検索戦略: GraphQLクエリ実行
          const response = await refetchTags({
            input: {
              name: pattern
            } satisfies FilterTagInput
          })

          if (response?.data?.tags?.data) {
            results = response.data.tags.data
              .filter(tag => tag && typeof tag.name === 'string')
              .map(tag => ({
                label: tag.name,
                value: tag.name,
              }))
          }
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      results = []
    }

    options.value = results
    loading.value = false
  }, SEARCH_DEBOUNCE_MS)
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})

/** @description 外部公開API */
defineExpose({
  /** @description フォーカスを設定 */
  focus: () => {
    // ElMentionのfocusメソッドを呼び出す（実装されている場合）
  },
  /** @description 入力値をクリア */
  clear: () => {
    modelValue.value = ''
  }
})
</script>

<template>
  <ElMention
    v-model="modelValue"
    :options="options"
    :loading="loading"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :prefix="['@', '#']"
    type="textarea"
    style="width: 100%"
    @search="handleSearch"
  />
</template>

<style scoped>
/* ElMentionのスタイル調整が必要な場合はここに追加 */
</style>
