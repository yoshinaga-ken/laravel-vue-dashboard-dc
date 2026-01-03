<script lang="ts" setup>
import { watch, computed, ref as vueRef } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import PrimaryButton from '@/Components/PrimaryButton.vue'
import ElTextTagsInput from '@/Components/ElTextTagsInput.vue'
import { gql } from 'graphql-tag'
import { useForm } from '@inertiajs/vue3'
import InputError from '@/Components/InputError.vue'
import type { MutationSyncTagsByNameArticleArgs, Tag } from '@/Types/types-graphql'

const props = defineProps<{
  article_id: number
  initialTags?: Tag[] // 親コンポーネントから受け取る初期タグデータ
  skipQuery?: boolean // GraphQLクエリをスキップするかどうか
}>()

const form = useForm({
  tags: [] as string[],
  errors: {},
  processing: false,
})

// 初期タグデータからフォームを初期化
const initializeTagsFromProps = () => {
  if (props.initialTags && props.initialTags.length > 0) {
    form.tags = props.initialTags.map((tag: Tag) => tag.name)
  }
}

// 初期化時にpropsからタグを設定
if (props.initialTags) {
  initializeTagsFromProps()
}

const GET_ARTICLE_TAGS = gql`
  query GetArticleTags($id: ID!) {
    article(id: $id) {
      tags {
        name
      }
    }
  }
`

// skipQueryがtrueの場合はクエリを実行しない
const queryResult = props.skipQuery
  ? {
      result: vueRef(null),
      loading: vueRef(false),
      error: vueRef(null),
      refetch: async () => ({ data: vueRef(null) }),
    }
  : useQuery(GET_ARTICLE_TAGS, () => ({
      id: String(props.article_id),
    }))

const { result, loading, error, refetch } = queryResult

// GraphQLクエリの結果を監視（skipQueryがfalseの場合のみ）
if (!props.skipQuery) {
  watch(result, newResult => {
    if (newResult?.article?.tags) {
      // タグが存在し、かつpropsから初期化されていない場合のみ更新
      if (form.tags.length === 0 || !props.initialTags) {
        form.tags = newResult.article.tags.map((tag: { name: string }) => tag.name)
      }
    }
  })
}

// props.initialTagsが変更された場合にフォームを更新
watch(
  () => props.initialTags,
  newTags => {
    if (newTags && newTags.length > 0) {
      form.tags = newTags.map((tag: Tag) => tag.name)
    }
  },
  { deep: true }
)

const SYNC_TAGS_BY_NAME_WITH_ARTICLE = gql`
  mutation SyncTagsByNameWithArticle($id: ID!, $tagNames: [String!]!) {
    syncTagsByNameArticle(id: $id, tagNames: $tagNames) {
      id
      tags {
        name
      }
    }
  }
`

const { mutate: syncTagsByNameArticle } = useMutation(SYNC_TAGS_BY_NAME_WITH_ARTICLE)

const emit = defineEmits<{
  tagsUpdated: [tags: Tag[]]
}>()

const updateTags = () => {
  form.errors = {}

  const variables: MutationSyncTagsByNameArticleArgs = {
    id: String(props.article_id),
    tagNames: form.tags,
  }

  syncTagsByNameArticle(variables)
    .then(response => {
      // タグ更新後、最新データを取得
      if (response?.data?.syncTagsByNameArticle?.tags) {
        const updatedTags = response.data.syncTagsByNameArticle.tags
        form.tags = updatedTags.map((tag: { name: string }) => tag.name)
        // 親コンポーネントに更新を通知
        emit('tagsUpdated', updatedTags as Tag[])
      } else if (!props.skipQuery) {
        // skipQueryがfalseの場合のみrefetch
        refetch()
      }
    })
    .catch((e: unknown) => {
      const graphQLError = (
        e as { graphQLErrors?: Array<{ extensions?: { debugMessage?: string } }> }
      )?.graphQLErrors?.[0]
      if (graphQLError?.extensions?.debugMessage) {
        form.errors = JSON.parse(graphQLError.extensions.debugMessage as string)
        console.log(form.errors)
      } else {
        form.errors.tags = '予期しないエラーが発生しました。'
      }
    })
}

// ローディング状態を計算（skipQueryがtrueの場合は常にfalse）
const isLoading = computed(() => {
  return props.skipQuery === true ? false : loading.value
})
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error && !skipQuery">エラーが発生しました</div>
    <div v-else>
      <ElTextTagsInput v-model="form.tags" type="text" class="mt-1 block w-full" />

      <InputError :message="form.errors.tags" class="mt-2" />
      <div v-for="(tag, index) in form.tags" :key="index">
        <InputError
          :message="
            form.errors[`tags.${index}`] === undefined
              ? ''
              : '「' + tag + '」 : ' + form.errors[`tags.${index}`]
          "
          class="mt-2"
        />
      </div>

      <PrimaryButton
        :class="{ 'opacity-25': form.processing }"
        :disabled="form.processing"
        @click="updateTags"
      >
        Update Tags
      </PrimaryButton>
    </div>
  </div>
</template>
