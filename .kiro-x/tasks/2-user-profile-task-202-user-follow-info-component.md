# TASK-202: UserFollowInfoコンポーネントの実装

## タスク概要

ユーザーのフォロー情報（フォロワー数・フォロー中数・一覧表示）を表示するコンポーネントを実装する。

## 依存関係

- 依存タスク: TASK-101
- このタスクに依存するタスク: TASK-301

## 実装内容

### ファイル: `resources/js/Components/UserFollowInfo.vue`

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { ElCard, ElButton, ElAvatar, ElCollapse, ElCollapseItem, ElIcon } from 'element-plus'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import type { User, UserPaginator } from '@/Types/types-graphql'

const props = defineProps<{
  followersCount: number
  followingCount: number
  followersList: User[]
  followingList: User[]
  loading?: boolean
}>()

const followersExpanded = ref(false)
const followingExpanded = ref(false)

const toggleFollowers = () => {
  followersExpanded.value = !followersExpanded.value
}

const toggleFollowing = () => {
  followingExpanded.value = !followingExpanded.value
}

const getDisplayName = (user: User) => {
  return user.name || 'Unknown User'
}
</script>

<template>
  <ElCard class="user-follow-info" shadow="hover">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">フォロー情報</h3>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="space-y-6">
      <!-- フォロー統計 -->
      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ followersCount }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">フォロワー</div>
        </div>

        <div class="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ followingCount }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">フォロー中</div>
        </div>
      </div>

      <!-- フォロワー詳細 -->
      <div class="space-y-3">
        <ElButton
          @click="toggleFollowers"
          text
          class="w-full justify-between p-0"
          :disabled="followersCount === 0"
        >
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            フォロワー一覧 ({{ followersCount }})
          </span>
          <ElIcon v-if="followersCount > 0">
            <ArrowDown v-if="!followersExpanded" />
            <ArrowUp v-else />
          </ElIcon>
        </ElButton>

        <ElCollapse v-model="followersExpanded" class="followers-collapse">
          <ElCollapseItem name="followers">
            <div v-if="followersList.length > 0" class="max-h-60 space-y-2 overflow-y-auto">
              <div
                v-for="follower in followersList"
                :key="follower.id"
                class="flex items-center space-x-3 rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ElAvatar
                  :size="32"
                  :src="follower.profile_photo_url"
                  :alt="getDisplayName(follower)"
                >
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-300">
                    {{ getDisplayName(follower).charAt(0).toUpperCase() }}
                  </span>
                </ElAvatar>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {{ getDisplayName(follower) }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="py-4 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">フォロワーはいません</p>
            </div>
          </ElCollapseItem>
        </ElCollapse>
      </div>

      <!-- フォロー中詳細 -->
      <div class="space-y-3">
        <ElButton
          @click="toggleFollowing"
          text
          class="w-full justify-between p-0"
          :disabled="followingCount === 0"
        >
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            フォロー中一覧 ({{ followingCount }})
          </span>
          <ElIcon v-if="followingCount > 0">
            <ArrowDown v-if="!followingExpanded" />
            <ArrowUp v-else />
          </ElIcon>
        </ElButton>

        <ElCollapse v-model="followingExpanded" class="following-collapse">
          <ElCollapseItem name="following">
            <div v-if="followingList.length > 0" class="max-h-60 space-y-2 overflow-y-auto">
              <div
                v-for="following in followingList"
                :key="following.id"
                class="flex items-center space-x-3 rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ElAvatar
                  :size="32"
                  :src="following.profile_photo_url"
                  :alt="getDisplayName(following)"
                >
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-300">
                    {{ getDisplayName(following).charAt(0).toUpperCase() }}
                  </span>
                </ElAvatar>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {{ getDisplayName(following) }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="py-4 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">フォロー中のユーザーはいません</p>
            </div>
          </ElCollapseItem>
        </ElCollapse>
      </div>
    </div>
  </ElCard>
</template>

<style scoped>
.user-follow-info {
  @apply w-full;
}

.user-follow-info :deep(.el-card__header) {
  @apply border-b border-gray-200 dark:border-gray-700;
}

.user-follow-info :deep(.el-card__body) {
  @apply p-6;
}

.followers-collapse :deep(.el-collapse-item__header),
.following-collapse :deep(.el-collapse-item__header) {
  @apply hidden;
}

.followers-collapse :deep(.el-collapse-item__content),
.following-collapse :deep(.el-collapse-item__content) {
  @apply border-0 p-0;
}

.followers-collapse :deep(.el-collapse-item__wrap),
.following-collapse :deep(.el-collapse-item__wrap) {
  @apply border-0;
}
</style>
```

## UI/UX仕様

### デザイン要件

- **統計表示**: フォロワー数・フォロー中数を目立つように表示
- **展開/折りたたみ**: ユーザー一覧の表示/非表示切り替え
- **スクロール対応**: 一覧が長い場合のスクロール機能
- **ホバーエフェクト**: ユーザー項目のインタラクション

### Element Plusコンポーネント使用

- **ElCard**: メインコンテナ
- **ElButton**: 展開/折りたたみボタン
- **ElAvatar**: ユーザーアバター表示
- **ElCollapse/ElCollapseItem**: 一覧の展開/折りたたみ
- **ElIcon**: 矢印アイコン

### レスポンシブ対応

- **Grid Layout**: 2カラムの統計表示
- **モバイル対応**: 小さな画面での適切な表示

## 機能要件

### 表示項目

- フォロワー数（数値）
- フォロー中数（数値）
- フォロワー一覧（アバター付き）
- フォロー中一覧（アバター付き）

### インタラクション

- 一覧の展開/折りたたみ
- ユーザー項目のホバーエフェクト
- 長いリストのスクロール対応

### 状態管理

- 展開状態の管理（ref）
- ローディング状態の表示
- データなし状態の適切な表示

## 技術仕様

### Props型定義

```typescript
interface Props {
  followersCount: number
  followingCount: number
  followersList: User[]
  followingList: User[]
  loading?: boolean
}
```

### リアクティブ状態

- `followersExpanded`: フォロワー一覧の展開状態
- `followingExpanded`: フォロー中一覧の展開状態

### メソッド

- `toggleFollowers`: フォロワー一覧の展開切り替え
- `toggleFollowing`: フォロー中一覧の展開切り替え
- `getDisplayName`: ユーザー名の安全な取得

## パフォーマンス考慮

- **仮想スクロール**: 将来的な大量ユーザー対応
- **遅延読み込み**: アバター画像の効率的な読み込み
- **メモ化**: 計算処理の最適化

## アクセシビリティ

- **キーボード操作**: 展開/折りたたみのキーボード対応
- **スクリーンリーダー**: 適切なaria属性の設定
- **フォーカス管理**: 適切なフォーカス制御

## テスト要件

- Props受け渡しのテスト
- 展開/折りたたみ動作のテスト
- ユーザー一覧表示のテスト
- ローディング状態のテスト
- 空データ状態のテスト

## 完了条件

- [ ] UserFollowInfo.vueコンポーネントが実装されている
- [ ] フォロー統計が正しく表示される
- [ ] 一覧の展開/折りたたみが動作する
- [ ] アバター表示が正常に動作する
- [ ] レスポンシブ対応が完了している
- [ ] ダークモード対応が完了している
- [ ] TypeScriptエラーがない
- [ ] ESLintエラーがない
- [ ] ユーザビリティテストが完了している
