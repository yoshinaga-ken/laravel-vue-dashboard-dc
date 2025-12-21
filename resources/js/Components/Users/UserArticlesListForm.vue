<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { ElTable, ElTableColumn, ElInput, ElMessage } from 'element-plus'
  import { useMutation, useQuery } from '@vue/apollo-composable'
  import gql from 'graphql-tag'
  import ArticleTagsForm from '@/Components/ArticleTagsForm.vue'
  import type { Article } from '@/Types/types-graphql'

  const props = defineProps<{
    userId: string | number
  }>()

  // 記事一覧を取得
  const GET_USER_ARTICLES = gql`
    query GetUserArticles($userId: ID!) {
      user(id: $userId) {
        articles(first: 100, page: 1) {
          data {
            id
            title
            body
            updated_at
            tags {
              id
              name
            }
          }
        }
      }
    }
  `

  const { result, loading, refetch } = useQuery(GET_USER_ARTICLES, {
    userId: String(props.userId),
  })

  // 日付フォーマット関数（YYYY/MM/DD HH:II形式）
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}/${month}/${day} ${hours}:${minutes}`
  }

  // 記事一覧データ（更新日付降順でソート）
  const articles = computed(() => {
    const data = result.value?.user?.articles?.data || []
    // 更新日付降順でソート
    return [...data].sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0
      return dateB - dateA // 降順
    })
  })

  // タグ更新時のハンドラー（refetchで自動更新されるため、ログのみ）
  const handleTagsUpdated = (_articleId: string | number, _updatedTags: Article['tags']) => {
    // タグ更新後、記事一覧を再取得して最新データを反映
    refetch()
  }

  // タイトル編集用のローカル状態
  const editingTitles = ref<Record<string, string>>({})

  // 記事のタイトルを初期化
  const initializeEditingTitle = (article: Article) => {
    if (!editingTitles.value[article.id]) {
      editingTitles.value[article.id] = article.title
    }
  }

  // タイトル更新用のmutation
  const UPDATE_ARTICLE = gql`
    mutation UpdateArticle($id: ID!, $title: String!, $body: String!) {
      updateArticle(id: $id, input: { title: $title, body: $body }) {
        id
        title
        body
      }
    }
  `

  const { mutate: updateArticle } = useMutation(UPDATE_ARTICLE)

  // タイトルを保存
  const saveTitle = async (article: Article) => {
    try {
      const newTitle = editingTitles.value[article.id]?.trim()

      if (!newTitle) {
        ElMessage.error('タイトルを入力してください')
        return
      }

      if (newTitle === article.title) {
        // 変更がない場合は何もしない
        return
      }

      await updateArticle({
        id: String(article.id),
        title: newTitle,
        body: article.body, // 既存のbodyを保持
      })

      ElMessage.success('タイトルを更新しました')
      // タイトル更新後、記事一覧を再取得（タグデータも含まれる）
      await refetch()
      // ArticleTagsFormは再マウントしない（keyを更新しない）ことで、タグが空になる問題を回避
    } catch (error) {
      console.error('Update article title failed:', error)
      ElMessage.error('タイトルの更新に失敗しました')
    }
  }
</script>

<template>
  <div class="user-articles-list-form">
    <h3 class="mb-4 text-lg font-semibold">記事一覧</h3>

    <div v-if="loading" class="flex items-center justify-center p-8">
      <span>読み込み中...</span>
    </div>

    <div v-else-if="articles.length === 0" class="p-8 text-center text-gray-500">
      記事がありません
    </div>

    <ElTable v-else :data="articles" stripe style="width: 100%">
      <ElTableColumn type="index" label="No" width="60" :index="index => index + 1" />

      <ElTableColumn label="Title" min-width="200">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <ElInput
              v-model="editingTitles[row.id]"
              :placeholder="row.title"
              size="small"
              @focus="initializeEditingTitle(row)"
              @blur="saveTitle(row)"
              @keyup.enter="saveTitle(row)"
            />
          </div>
        </template>
      </ElTableColumn>

      <ElTableColumn label="Tags" min-width="300">
        <template #default="{ row }">
          <ArticleTagsForm
            :key="`article-tags-${row.id}`"
            :article_id="row.id"
            :initial-tags="row.tags"
            :skip-query="true"
            @tags-updated="handleTagsUpdated(row.id, $event)"
          />
        </template>
      </ElTableColumn>

      <ElTableColumn label="Date" width="160" sortable prop="updated_at">
        <template #default="{ row }">
          {{ formatDate(row.updated_at) }}
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<style scoped>
  .user-articles-list-form {
    width: 100%;
  }
</style>

