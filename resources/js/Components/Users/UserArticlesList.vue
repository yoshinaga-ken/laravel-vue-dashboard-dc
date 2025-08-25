<script lang="ts" setup>
import { ElCard, ElTag, ElEmpty, ElButton, ElIcon } from 'element-plus'
import { Reading, Calendar } from '@element-plus/icons-vue'
import type { Article } from '@/Types/types-graphql'

defineProps<{
  articlesCount: number
  articles: Article[]
  loading?: boolean
}>()

const emit = defineEmits<{
  'article-click': [articleId: string]
  'tag-click': [tagName: string]
  'view-all-click': []
}>()

const truncateText = (text: string, maxLength: number = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const handleArticleClick = (articleId: string) => {
  emit('article-click', articleId)
}

const handleTagClick = (tagName: string) => {
  emit('tag-click', tagName)
}

const handleViewAllClick = () => {
  emit('view-all-click')
}
</script>

<template>
  <ElCard class="user-articles-list" shadow="hover">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <ElIcon class="text-blue-600 dark:text-blue-400">
            <Reading />
          </ElIcon>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">投稿記事</h3>
          <span class="text-sm text-gray-500 dark:text-gray-400"> ({{ articlesCount }}) </span>
        </div>
        <ElButton
          v-if="articlesCount > 0"
          text
          type="primary"
          size="small"
          @click="handleViewAllClick"
        >
          すべて見る
        </ElButton>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="articlesCount === 0" class="py-8">
      <ElEmpty description="まだ記事が投稿されていません" :image-size="120" />
    </div>

    <div v-else class="space-y-4">
      <!-- 記事統計 -->
      <div
        class="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 text-center dark:from-blue-900/20 dark:to-indigo-900/20"
      >
        <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {{ articlesCount }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">投稿記事数</div>
      </div>

      <!-- 記事一覧 -->
      <div class="space-y-3">
        <div
          v-for="article in articles"
          :key="article.id"
          class="group cursor-pointer rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
          @click="handleArticleClick(article.id)"
        >
          <!-- 記事タイトル -->
          <h4
            class="text-lg font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
          >
            {{ article.title }}
          </h4>

          <!-- 記事本文（抜粋） -->
          <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {{ truncateText(article.body) }}
          </p>

          <!-- タグ一覧 -->
          <div v-if="article.tags && article.tags.length > 0" class="mt-3 flex flex-wrap gap-2">
            <ElTag
              v-for="tag in article.tags"
              :key="tag.id"
              size="small"
              type="info"
              effect="plain"
              class="cursor-pointer transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50"
              @click.stop="handleTagClick(tag.name)"
            >
              {{ tag.name }}
            </ElTag>
          </div>

          <!-- メタ情報 -->
          <div
            class="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
          >
            <div class="flex items-center space-x-1">
              <ElIcon>
                <Calendar />
              </ElIcon>
              <span>投稿日時情報は現在取得していません</span>
            </div>
            <div class="flex items-center space-x-1">
              <ElIcon>
                <Reading />
              </ElIcon>
              <span>記事ID: {{ article.id }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- もっと見るボタン -->
      <div v-if="articlesCount > articles.length" class="pt-4 text-center">
        <ElButton type="primary" plain @click="handleViewAllClick">
          さらに記事を見る ({{ articlesCount - articles.length }}件)
        </ElButton>
      </div>
    </div>
  </ElCard>
</template>

<style scoped>
.user-articles-list {
  @apply w-full;
}

.user-articles-list :deep(.el-card__header) {
  @apply border-b border-gray-200 dark:border-gray-700;
}

.user-articles-list :deep(.el-card__body) {
  @apply p-6;
}

.user-articles-list :deep(.el-tag) {
  @apply text-xs;
}

.user-articles-list :deep(.el-empty__description) {
  @apply text-gray-500 dark:text-gray-400;
}

/* 記事アイテムのホバーエフェクト */
.user-articles-list .group:hover {
  @apply border-blue-200 dark:border-blue-700;
}

/* タグのホバーエフェクト */
.user-articles-list :deep(.el-tag:hover) {
  @apply scale-105 transform;
}
</style>
