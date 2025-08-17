# TASK-201: UserBasicInfoコンポーネントの実装

## タスク概要

ユーザーの基本情報（アバター、名前、メール、登録日等）を表示するコンポーネントを実装する。

## 依存関係

- 依存タスク: TASK-101
- このタスクに依存するタスク: TASK-301

## 実装内容

### ファイル: `resources/js/Components/UserBasicInfo.vue`

```vue
<script lang="ts" setup>
import { computed } from 'vue'
import { ElAvatar, ElCard, ElDivider } from 'element-plus'
import type { User } from '@/Types/types-graphql'

const props = defineProps<{
  user: User
  loading?: boolean
}>()

const formattedCreatedAt = computed(() => {
  if (!props.user?.created_at) return ''
  return new Date(props.user.created_at).toLocaleDateString('ja-JP')
})

const formattedUpdatedAt = computed(() => {
  if (!props.user?.updated_at) return ''
  return new Date(props.user.updated_at).toLocaleDateString('ja-JP')
})
</script>

<template>
  <ElCard class="user-basic-info" shadow="hover">
    <template #header>
      <div class="flex items-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">基本情報</h3>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="user" class="space-y-6">
      <!-- プロフィール写真とメイン情報 -->
      <div class="flex items-center space-x-4">
        <ElAvatar
          :size="80"
          :src="user.profile_photo_url"
          :alt="user.name"
          class="ring-2 ring-gray-200 dark:ring-gray-700"
        >
          <span class="text-2xl font-bold text-gray-600 dark:text-gray-300">
            {{ user.name.charAt(0).toUpperCase() }}
          </span>
        </ElAvatar>

        <div class="min-w-0 flex-1">
          <h2 class="truncate text-2xl font-bold text-gray-900 dark:text-white">
            {{ user.name }}
          </h2>
          <p class="truncate text-sm text-gray-600 dark:text-gray-400">
            {{ user.email }}
          </p>
        </div>
      </div>

      <ElDivider class="my-4" />

      <!-- 詳細情報 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="space-y-3">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">ユーザーID</dt>
            <dd class="text-sm text-gray-900 dark:text-white">
              {{ user.id }}
            </dd>
          </div>

          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">登録日</dt>
            <dd class="text-sm text-gray-900 dark:text-white">
              {{ formattedCreatedAt }}
            </dd>
          </div>
        </div>

        <div class="space-y-3">
          <div v-if="user.current_team_id">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">現在のチームID</dt>
            <dd class="text-sm text-gray-900 dark:text-white">
              {{ user.current_team_id }}
            </dd>
          </div>

          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">最終更新日</dt>
            <dd class="text-sm text-gray-900 dark:text-white">
              {{ formattedUpdatedAt }}
            </dd>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">ユーザー情報を読み込めませんでした</p>
    </div>
  </ElCard>
</template>

<style scoped>
.user-basic-info {
  @apply w-full;
}

.user-basic-info :deep(.el-card__header) {
  @apply border-b border-gray-200 dark:border-gray-700;
}

.user-basic-info :deep(.el-card__body) {
  @apply p-6;
}

.user-basic-info :deep(.el-divider) {
  @apply border-gray-200 dark:border-gray-700;
}
</style>
```

## UI/UX仕様

### デザイン要件

- **レスポンシブ対応**: モバイル・タブレット・PC対応
- **ダークモード対応**: Tailwind CSSのダークモードクラス使用
- **アクセシビリティ**: 適切なaria-label、alt属性の設定

### Element Plusコンポーネント使用

- **ElCard**: メインコンテナとして使用
- **ElAvatar**: プロフィール写真表示
- **ElDivider**: セクション区切り

### スタイリング

- **Tailwind CSS**: ユーティリティクラス使用
- **Grid Layout**: レスポンシブなグリッドレイアウト
- **Hover Effects**: ホバー時のカードエフェクト

## 機能要件

### 表示項目

- プロフィール写真（アバター）
- ユーザー名
- メールアドレス
- ユーザーID
- 登録日（日本語形式）
- 最終更新日（日本語形式）
- 現在のチームID（存在する場合）

### 状態管理

- **ローディング状態**: スピナー表示
- **エラー状態**: エラーメッセージ表示
- **データなし状態**: 適切な代替表示

## 技術仕様

### Props型定義

```typescript
interface Props {
  user: User
  loading?: boolean
}
```

### 計算されたプロパティ

- `formattedCreatedAt`: 登録日の日本語形式フォーマット
- `formattedUpdatedAt`: 更新日の日本語形式フォーマット

### TypeScript対応

- 厳密な型定義の実装
- Element Plusコンポーネントの型安全性確保

## パフォーマンス考慮

- **遅延読み込み**: 画像の適切な読み込み処理
- **メモ化**: computed プロパティによる計算結果キャッシュ
- **軽量レンダリング**: 不要な再レンダリングの回避

## テスト要件

- Propsの正常な受け渡しテスト
- ローディング状態の表示テスト
- 日付フォーマットのテスト
- レスポンシブ表示のテスト

## 完了条件

- [ ] UserBasicInfo.vueコンポーネントが実装されている
- [ ] 全ての表示項目が正しく表示される
- [ ] ローディング状態が適切に表示される
- [ ] レスポンシブ対応が完了している
- [ ] ダークモード対応が完了している
- [ ] TypeScriptエラーがない
- [ ] ESLintエラーがない
- [ ] 視覚的なテストが完了している
