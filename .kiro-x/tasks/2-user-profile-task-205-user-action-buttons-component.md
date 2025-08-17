# TASK-205: UserActionButtonsコンポーネントの実装

## タスク概要

ユーザーに対するアクション（フォロー/アンフォロー・プロフィール編集等）のボタンコンポーネントを実装する。

## 依存関係

- 依存タスク: TASK-101
- このタスクに依存するタスク: TASK-301

## 実装内容

### ファイル: `resources/js/Components/UserActionButtons.vue`

```vue
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElButton, ElIcon, ElMessage } from 'element-plus'
import { Plus, Check, Edit, UserFilled } from '@element-plus/icons-vue'
import { useUserFollow } from '@/Composables/useUserFollow'
import type { User } from '@/Types/types-graphql'

const props = defineProps<{
  targetUser: User
  isOwnProfile: boolean
  currentUserFollowingList?: User[]
  loading?: boolean
}>()

const emit = defineEmits<{
  'follow-success': [user: User]
  'unfollow-success': [user: User]
  'edit-profile': []
}>()

const { isFollowing, isLoading, toggleFollow } = useUserFollow()

// 初期化時にフォロー状態を設定
const initializeFollowState = () => {
  if (props.currentUserFollowingList && props.targetUser) {
    isFollowing.value = props.currentUserFollowingList.some(user => user.id === props.targetUser.id)
  }
}

// Props変更時にフォロー状態を更新
watch(
  () => props.currentUserFollowingList,
  () => {
    initializeFollowState()
  },
  { immediate: true }
)

const handleFollowToggle = async () => {
  try {
    await toggleFollow(Number(props.targetUser.id))

    // 成功メッセージ表示
    const message = isFollowing.value ? 'フォローしました' : 'フォローを解除しました'
    ElMessage.success(message)

    // 親コンポーネントに結果を通知
    if (isFollowing.value) {
      emit('follow-success', props.targetUser)
    } else {
      emit('unfollow-success', props.targetUser)
    }
  } catch (error) {
    console.error('Follow toggle failed:', error)
    ElMessage.error('操作に失敗しました')
  }
}

const handleEditProfile = () => {
  emit('edit-profile')
}

const followButtonText = computed(() => {
  return isFollowing.value ? 'フォロー中' : 'フォローする'
})

const followButtonType = computed(() => {
  return isFollowing.value ? 'success' : 'primary'
})

const followButtonIcon = computed(() => {
  return isFollowing.value ? Check : Plus
})
</script>

<template>
  <div class="user-action-buttons">
    <div v-if="loading" class="flex justify-center">
      <div class="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="flex flex-col gap-3 sm:flex-row">
      <!-- 自分のプロフィールの場合 -->
      <template v-if="isOwnProfile">
        <ElButton
          type="primary"
          size="large"
          class="flex-1 sm:flex-none"
          @click="handleEditProfile"
        >
          <ElIcon class="mr-2">
            <Edit />
          </ElIcon>
          プロフィールを編集
        </ElButton>
      </template>

      <!-- 他のユーザーのプロフィールの場合 -->
      <template v-else>
        <!-- フォロー/アンフォローボタン -->
        <ElButton
          :type="followButtonType"
          :loading="isLoading"
          size="large"
          class="min-w-36 flex-1 sm:flex-none"
          @click="handleFollowToggle"
        >
          <ElIcon v-if="!isLoading" class="mr-2">
            <component :is="followButtonIcon" />
          </ElIcon>
          {{ followButtonText }}
        </ElButton>

        <!-- メッセージボタン（将来的な拡張） -->
        <ElButton type="info" plain size="large" class="flex-1 sm:flex-none" disabled>
          <ElIcon class="mr-2">
            <UserFilled />
          </ElIcon>
          メッセージ
        </ElButton>
      </template>
    </div>

    <!-- 補助情報 -->
    <div v-if="!isOwnProfile && !loading" class="mt-3 text-center">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        <template v-if="isFollowing"> このユーザーをフォローしています </template>
        <template v-else> フォローして最新情報を受け取る </template>
      </p>
    </div>
  </div>
</template>

<style scoped>
.user-action-buttons {
  @apply w-full;
}

.user-action-buttons :deep(.el-button) {
  @apply font-medium;
}

.user-action-buttons :deep(.el-button--large) {
  @apply px-6 py-3;
}

/* フォローボタンのホバーエフェクト */
.user-action-buttons :deep(.el-button--success:hover) {
  @apply border-red-500 bg-red-500;
}

.user-action-buttons :deep(.el-button--success:hover .el-icon) {
  @apply rotate-45 transform;
}

/* ボタンの幅調整 */
@media (min-width: 640px) {
  .user-action-buttons .el-button {
    @apply min-w-max;
  }
}

/* ローディング状態のスタイル */
.user-action-buttons :deep(.el-button.is-loading) {
  @apply opacity-75;
}
</style>
```

## UI/UX仕様

### デザイン要件

- **レスポンシブレイアウト**: モバイル（縦並び）・PC（横並び）
- **状態表示**: フォロー状態の明確な視覚表現
- **ローディング状態**: 操作中の適切なフィードバック
- **ホバーエフェクト**: フォローボタンのunfollowプレビュー

### Element Plusコンポーネント使用

- **ElButton**: アクションボタン
- **ElIcon**: ボタンアイコン
- **ElMessage**: 成功・エラーメッセージ

### インタラクションデザイン

- **フォローボタン**: 状態によってスタイル・テキスト変更
- **ホバーエフェクト**: フォロー中ボタンのunfollowプレビュー
- **ローディング**: 操作中のスピナー表示

## 機能要件

### 表示モード

#### 自分のプロフィールの場合（`isOwnProfile: true`）

- プロフィール編集ボタン

#### 他のユーザーのプロフィールの場合（`isOwnProfile: false`）

- フォロー/アンフォローボタン
- メッセージボタン（将来的な機能、現在は無効）

### フォロー機能

- **フォロー状態判定**: `currentUserFollowingList`から判定
- **状態切り替え**: フォロー ↔ アンフォロー
- **API連携**: 既存のUserController follow/unfollowメソッド使用
- **リアルタイム更新**: 状態変更の即座反映

### ユーザーフィードバック

- **成功メッセージ**: フォロー操作成功時
- **エラーメッセージ**: 操作失敗時
- **補助テキスト**: フォロー状態の説明

## 技術仕様

### Props型定義

```typescript
interface Props {
  targetUser: User
  isOwnProfile: boolean
  currentUserFollowingList?: User[]
  loading?: boolean
}
```

### Emits型定義

```typescript
interface Emits {
  'follow-success': [user: User]
  'unfollow-success': [user: User]
  'edit-profile': []
}
```

### 状態管理

- **フォロー状態**: useUserFollowComposableで管理
- **ローディング状態**: API操作中の状態管理
- **初期化**: Props変更時の状態同期

### 計算されたプロパティ

- `followButtonText`: フォロー状態に応じたボタンテキスト
- `followButtonType`: フォロー状態に応じたボタンタイプ
- `followButtonIcon`: フォロー状態に応じたアイコン

## API連携仕様

### 使用エンドポイント

- **フォロー**: `PUT /api/users/{user}/follow`
- **アンフォロー**: `DELETE /api/users/{user}/unfollow`

### エラーハンドリング

- **ネットワークエラー**: 適切なエラーメッセージ表示
- **認証エラー**: 認証失効時の処理
- **バリデーションエラー**: API側のバリデーションエラー処理

## パフォーマンス考慮

- **状態同期**: Props変更時の効率的な状態更新
- **デバウンス**: 連続クリック防止
- **キャッシュ**: フォロー状態のローカルキャッシュ

## アクセシビリティ

- **キーボード操作**: ボタンのキーボードアクセス
- **スクリーンリーダー**: 適切なaria-label
- **フォーカス管理**: 操作後のフォーカス制御

## セキュリティ考慮

- **自己フォロー防止**: バックエンド側で実装済み
- **認証確認**: Sanctum認証の確認
- **CSRF対策**: Laravel標準のCSRF対策

## 将来的な拡張

- **メッセージ機能**: ダイレクトメッセージ送信
- **ブロック機能**: ユーザーブロック・解除
- **通報機能**: 不適切なユーザーの通報
- **フォローリクエスト**: プライベートアカウント対応

## テスト要件

- フォロー/アンフォロー操作のテスト
- プロフィール表示モードの切り替えテスト
- API通信エラー時の動作テスト
- ローディング状態の表示テスト
- レスポンシブ表示のテスト

## 完了条件

- [ ] UserActionButtons.vueコンポーネントが実装されている
- [ ] フォロー/アンフォロー機能が正常に動作する
- [ ] 自分/他人のプロフィール表示が適切に切り替わる
- [ ] ローディング状態が適切に表示される
- [ ] 成功・エラーメッセージが適切に表示される
- [ ] レスポンシブ対応が完了している
- [ ] ダークモード対応が完了している
- [ ] TypeScriptエラーがない
- [ ] ESLintエラーがない
- [ ] ユーザビリティテストが完了している
