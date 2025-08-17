# TASK-203: UserArticlesListコンポーネントの実装

## タスク概要

ユーザーの投稿記事一覧（記事数・最新記事・タグ表示）を表示するコンポーネントを実装する。

## 依存関係

- 依存タスク: TASK-101
- このタスクに依存するタスク: TASK-301

## 実装内容

### ファイル: `resources/js/Components/UserArticlesList.vue`

```vue
<script lang="ts" setup>
import { computed } from 'vue'
import { ElCard, ElTag, ElEmpty, ElButton, ElIcon } from 'element-plus'
import { Reading, Calendar } from '@element-plus/icons-vue'
import type { Article, ArticlePaginator } from '@/Types/types-graphql'

const props = defineProps<{
  articlesCount: number
  articles: Article[]
  loading?: boolean
}>()

const emit = defineEmits<{
  'article-click': [articleId: string]
  'tag-click': [tagName: string]
  'view-all-click': []
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP')
}

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
```

## UI/UX仕様

### デザイン要件

- **記事統計**: 投稿記事数を目立つように表示
- **記事カード**: 各記事を読みやすいカード形式で表示
- **タグ表示**: 各記事のタグを視覚的に表示
- **ホバーエフェクト**: 記事・タグのインタラクション

### Element Plusコンポーネント使用

- **ElCard**: メインコンテナ
- **ElTag**: 記事タグ表示
- **ElEmpty**: 記事がない場合の表示
- **ElButton**: アクションボタン
- **ElIcon**: アイコン表示

### レスポンシブ対応

- **カードレイアウト**: モバイル・タブレット・PC対応
- **フレックスレイアウト**: タグ表示の柔軟な配置

## 機能要件

### 表示項目

- 投稿記事数（統計）
- 記事一覧（最新順）
  - 記事タイトル
  - 記事本文（抜粋）
  - タグ一覧
  - メタ情報（投稿日、記事ID等）

### インタラクション

- 記事クリック → 記事詳細画面へ遷移
- タグクリック → タグ関連記事検索
- 「すべて見る」ボタン → 記事一覧画面へ遷移
- 「さらに記事を見る」ボタン → ページネーション

### 状態管理

- ローディング状態の表示
- 記事なし状態の適切な表示
- ホバー状態の管理

## 技術仕様

### Props型定義

```typescript
interface Props {
  articlesCount: number
  articles: Article[]
  loading?: boolean
}
```

### Emits型定義

```typescript
interface Emits {
  'article-click': [articleId: string]
  'tag-click': [tagName: string]
  'view-all-click': []
}
```

### ユーティリティ関数

- `formatDate`: 日付フォーマット（日本語）
- `truncateText`: テキストの切り詰め表示

## パフォーマンス考慮

- **テキスト切り詰め**: 長い本文の効率的な表示
- **イベント処理**: クリックイベントの最適化
- **レンダリング**: 大量記事の効率的な表示

## アクセシビリティ

- **キーボード操作**: 記事・タグのキーボードナビゲーション
- **スクリーンリーダー**: 適切なセマンティック構造
- **フォーカス管理**: 適切なタブ順序

## 将来的な拡張

- **無限スクロール**: 記事一覧の段階的読み込み
- **フィルター機能**: タグ・日付によるフィルタリング
- **ソート機能**: 投稿日・タイトル順でのソート
- **検索機能**: 記事内テキスト検索

## テスト要件

- Props受け渡しのテスト
- 記事クリックイベントのテスト
- タグクリックイベントのテスト
- 記事なし状態のテスト
- テキスト切り詰めのテスト
- レスポンシブ表示のテスト

## 完了条件

- [ ] UserArticlesList.vueコンポーネントが実装されている
- [ ] 記事統計が正しく表示される
- [ ] 記事一覧が適切に表示される
- [ ] タグ表示が正常に動作する
- [ ] クリックイベントが正しく発火する
- [ ] 記事なし状態が適切に表示される
- [ ] レスポンシブ対応が完了している
- [ ] ダークモード対応が完了している
- [ ] TypeScriptエラーがない
- [ ] ESLintエラーがない
- [ ] ユーザビリティテストが完了している
