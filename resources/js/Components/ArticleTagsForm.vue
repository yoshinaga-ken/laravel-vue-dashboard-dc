<script lang="ts" setup>
import { watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import type { ApolloError } from '@apollo/client/errors'
import PrimaryButton from '@/Components/PrimaryButton.vue'
import ElTextTagsInput from '@/Components/ElTextTagsInput.vue'
import { gql } from 'graphql-tag'
import { useForm } from '@inertiajs/vue3'
import InputError from '@/Components/InputError.vue'
import type { MutationSyncTagsByNameArticleArgs } from '@/Types/types-graphql'

const props = defineProps<{
  article_id: number
}>()

const form = useForm({
  tags: [] as string[],
  errors: {},
  processing: false,
})

const GET_ARTICLE_TAGS = gql`
  query GetArticleTags($id: ID!) {
    article(id: $id) {
      tags {
        name
      }
    }
  }
`

const { result, loading, error } = useQuery(GET_ARTICLE_TAGS, {
  id: props.article_id,
})

watch(result, newResult => {
  if (newResult?.article) {
    form.tags = newResult.article.tags.map(tag => tag.name)
  }
})

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

const updateTags = () => {
  form.errors = {}

  const variables: MutationSyncTagsByNameArticleArgs = {
    id: props.article_id,
    tagNames: form.tags,
  }

  syncTagsByNameArticle(variables)
    .then(() => {
      // 必要に応じて再フェッチや他の処理をここに追加
    })
    .catch((e: ApolloError) => {
      console.log(e.graphQLErrors[0])
      if (e.graphQLErrors[0].extensions.debugMessage) {
        form.errors = JSON.parse(e.graphQLErrors[0].extensions.debugMessage)
        console.log(form.errors)
      } else {
        form.errors.tags = '予期しないエラーが発生しました。'
      }
    })
}
</script>

<template>
  <div>
    <div>article_id:{{ article_id }}</div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">エラーが発生しました</div>
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
