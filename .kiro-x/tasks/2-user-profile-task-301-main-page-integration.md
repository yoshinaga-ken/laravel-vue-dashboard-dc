# TASK-301: メインページコンポーネントの統合

## タスク概要

既存のUsers/Show.vueページを更新し、実装した各UIコンポーネントを統合して完全なユーザープロフィール画面を構築する。

## 依存関係

- 依存タスク: TASK-101, TASK-201, TASK-202, TASK-203, TASK-204, TASK-205
- このタスクに依存するタスク: なし

## 実装内容

### ファイル: `resources/js/Pages/Users/Show.vue`

```vue
<script lang="ts" setup>
import { computed } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import UserBasicInfo from '@/Components/UserBasicInfo.vue'
import UserFollowInfo from '@/Components/UserFollowInfo.vue'
import UserArticlesList from '@/Components/UserArticlesList.vue'
import UserTeamsInfo from '@/Components/UserTeamsInfo.vue'
import UserActionButtons from '@/Components/UserActionButtons.vue'
import { useUserProfile } from '@/Composables/useUserProfile'
import { ElRow, ElCol, ElAlert } from 'element-plus'
import type { User } from '@/Types/types-graphql'

const props = defineProps<{
  userId: number
}>()

const {
  user,
  loading,
  error,
  isOwnProfile,
  followersCount,
  followingCount,
  articlesCount,
  latestArticles,
  followersList,
  followingList,
  ownedTeamsList,
  joinedTeamsList,
  refetch,
} = useUserProfile(props.userId)

// ページタイトルの動的生成
const pageTitle = computed(() => {
  if (loading.value) return 'ユーザープロフィール'
  if (user.value) return `${user.value.name} - プロフィール`
  return 'ユーザーが見つかりません'
})

// エラーメッセージの生成
const errorMessage = computed(() => {
  if (!error.value) return ''

  if (error.value.networkError) {
    return 'ネットワークエラーが発生しました。しばらく待ってから再度お試しください。'
  }

  if (error.value.graphQLErrors?.length > 0) {
    const firstError = error.value.graphQLErrors[0]
    if (firstError.extensions?.category === 'authorization') {
      return 'このユーザーの情報を表示する権限がありません。'
    }
    return firstError.message || '予期しないエラーが発生しました。'
  }

  return '予期しないエラーが発生しました。'
})

// イベントハンドラー
const handleArticleClick = (articleId: string) => {
  // TODO: 記事詳細ページへの遷移実装
  console.log('Navigate to article:', articleId)
}

const handleTagClick = (tagName: string) => {
  // TODO: タグ検索ページへの遷移実装
  console.log('Search by tag:', tagName)
}

const handleViewAllArticles = () => {
  // TODO: ユーザー記事一覧ページへの遷移実装
  console.log('View all articles for user:', props.userId)
}

const handleTeamClick = (teamId: string) => {
  // TODO: チーム詳細ページへの遷移実装
  console.log('Navigate to team:', teamId)
}

const handleFollowSuccess = (targetUser: User) => {
  console.log('Follow success:', targetUser.name)
  // フォロー成功時のデータ再取得
  refetch()
}

const handleUnfollowSuccess = (targetUser: User) => {
  console.log('Unfollow success:', targetUser.name)
  // アンフォロー成功時のデータ再取得
  refetch()
}

const handleEditProfile = () => {
  // TODO: プロフィール編集ページへの遷移実装
  console.log('Navigate to profile edit')
}

const handleRetry = () => {
  refetch()
}
</script>

<template>
  <AppLayout :title="pageTitle">
    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
        {{ pageTitle }}
      </h2>
    </template>

    <div class="py-12">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <!-- エラー表示 -->
        <div v-if="error && !loading" class="mb-6">
          <ElAlert :title="errorMessage" type="error" show-icon :closable="false">
            <template #default>
              <p class="mt-2 text-sm">問題が解決しない場合は、管理者にお問い合わせください。</p>
              <div class="mt-4">
                <button
                  @click="handleRetry"
                  class="rounded bg-red-100 px-3 py-1 text-sm text-red-800 transition-colors hover:bg-red-200"
                >
                  再試行
                </button>
              </div>
            </template>
          </ElAlert>
        </div>

        <!-- メインコンテンツ -->
        <div v-if="!error || loading" class="space-y-6">
          <!-- 上部セクション: 基本情報 + アクションボタン -->
          <ElRow :gutter="24">
            <ElCol :xs="24" :lg="16">
              <UserBasicInfo :user="user" :loading="loading" />
            </ElCol>
            <ElCol :xs="24" :lg="8">
              <div class="flex h-full flex-col justify-center">
                <UserActionButtons
                  v-if="user"
                  :target-user="user"
                  :is-own-profile="isOwnProfile"
                  :current-user-following-list="followingList"
                  :loading="loading"
                  @follow-success="handleFollowSuccess"
                  @unfollow-success="handleUnfollowSuccess"
                  @edit-profile="handleEditProfile"
                />
              </div>
            </ElCol>
          </ElRow>

          <!-- 中部セクション: フォロー情報 -->
          <ElRow :gutter="24">
            <ElCol :xs="24">
              <UserFollowInfo
                :followers-count="followersCount"
                :following-count="followingCount"
                :followers-list="followersList"
                :following-list="followingList"
                :loading="loading"
              />
            </ElCol>
          </ElRow>

          <!-- 下部セクション: 記事 + チーム -->
          <ElRow :gutter="24">
            <ElCol :xs="24" :lg="14">
              <UserArticlesList
                :articles-count="articlesCount"
                :articles="latestArticles"
                :loading="loading"
                @article-click="handleArticleClick"
                @tag-click="handleTagClick"
                @view-all-click="handleViewAllArticles"
              />
            </ElCol>
            <ElCol :xs="24" :lg="10">
              <UserTeamsInfo
                :owned-teams="ownedTeamsList"
                :joined-teams="joinedTeamsList"
                :current-team-id="user?.current_team_id"
                :loading="loading"
                @team-click="handleTeamClick"
              />
            </ElCol>
          </ElRow>
        </div>

        <!-- ローディング表示（データがない場合） -->
        <div v-if="loading && !user" class="flex justify-center py-12">
          <div class="text-center">
            <div
              class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"
            ></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">ユーザー情報を読み込んでいます...</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
/* レスポンシブ調整 */
@media (max-width: 1023px) {
  .py-12 {
    @apply py-6;
  }
}

/* カードの高さ統一 */
.h-full {
  @apply min-h-full;
}

/* エラー表示のスタイル調整 */
:deep(.el-alert) {
  @apply rounded-lg;
}

:deep(.el-alert__content) {
  @apply w-full;
}

/* グリッドレイアウトの調整 */
.el-col {
  @apply mb-6 lg:mb-0;
}

.el-col:last-child {
  @apply mb-0;
}

/* モバイル表示の最適化 */
@media (max-width: 640px) {
  .mx-auto {
    @apply px-4;
  }

  .space-y-6 > * + * {
    @apply mt-4;
  }
}
</style>
```

## UI/UXデザイン仕様

### レイアウト構成

```
+------------------------------------------+
|            ヘッダー(AppLayout)            |
+------------------------------------------+
| 基本情報カード (2/3) | アクションボタン (1/3) |
+------------------------------------------+
|           フォロー情報カード (全幅)        |
+------------------------------------------+
| 記事一覧カード (3/5) | チーム情報カード (2/5) |
+------------------------------------------+
```

### レスポンシブ対応

- **PC (lg以上)**: 上記の2カラム・3カラムレイアウト
- **タブレット (md-lg)**: 2カラムレイアウト
- **モバイル (xs-sm)**: 1カラム（縦並び）レイアウト

### Element Plus Grid System

- **ElRow/ElCol**: レスポンシブグリッドレイアウト
- **Gutter**: カード間の適切な余白設定
- **ブレイクポイント**: xs, lg での表示切り替え

## 機能仕様

### データ取得・表示

- **GraphQL統合**: useUserProfileComposableによる統一的なデータ取得
- **ローディング状態**: 各コンポーネントへの統一的なローディング状態配信
- **エラーハンドリング**: GraphQL・ネットワークエラーの適切な処理

### イベント処理

- **記事関連**: 記事クリック・タグクリック・全記事表示
- **チーム関連**: チームクリック
- **フォロー関連**: フォロー成功・失敗時の処理
- **ナビゲーション**: 各詳細ページへの遷移（TODO実装）

### 状態管理

- **リアクティブデータ**: Composableを通じた統一的な状態管理
- **計算されたプロパティ**: ページタイトル・エラーメッセージの動的生成
- **データ更新**: フォロー操作後の自動データ再取得

## パフォーマンス最適化

### データ取得最適化

- **単一GraphQLクエリ**: 必要なデータを一度に取得
- **キャッシュ活用**: Vue Apollo のキャッシュ機能
- **条件付きレンダリング**: 不要なコンポーネントの非表示

### レンダリング最適化

- **コンポーネント分割**: 機能別の独立したコンポーネント
- **Props最適化**: 必要最小限のデータ受け渡し
- **計算プロパティ**: 重い計算の結果キャッシュ

## エラーハンドリング仕様

### エラーケース対応

- **ネットワークエラー**: 通信障害時の適切なメッセージ
- **認証エラー**: 権限不足時の案内
- **GraphQLエラー**: APIエラーの詳細表示
- **404エラー**: ユーザー存在しない場合

### ユーザーアクション

- **再試行ボタン**: エラー発生時のリトライ機能
- **エラー報告**: 問題報告の案内表示

## アクセシビリティ対応

### セマンティック構造

- **適切なheading**: h1, h2, h3の階層構造
- **ランドマーク**: main, section, article の適切な使用
- **フォーカス管理**: キーボードナビゲーション対応

### スクリーンリーダー対応

- **aria-label**: 動的コンテンツのラベル
- **live region**: 動的更新の通知
- **代替テキスト**: 画像・アイコンの代替テキスト

## SEO対応

### メタデータ

- **動的タイトル**: ユーザー名を含むページタイトル
- **メタディスクリプション**: ユーザープロフィールの説明
- **構造化データ**: Person スキーマの実装検討

## セキュリティ考慮

### データアクセス制御

- **認証確認**: Sanctumによる認証状態確認
- **権限チェック**: GraphQL Guardによる認可制御
- **XSS対策**: Vue.jsの自動エスケープ機能活用

## 今後の拡張予定

### 機能拡張

- **記事詳細リンク**: 記事個別ページへの遷移
- **チーム詳細リンク**: チーム詳細ページへの遷移
- **プロフィール編集**: 編集ページへの遷移
- **検索機能**: タグ・ユーザー検索ページ

### パフォーマンス拡張

- **無限スクロール**: 記事・フォローリストの段階読み込み
- **画像最適化**: プロフィール写真の最適化
- **プリフェッチ**: 関連ページの事前読み込み

## テスト要件

### 統合テスト

- コンポーネント間の連携テスト
- データフローのテスト
- イベント伝播のテスト

### ユーザビリティテスト

- レスポンシブ表示のテスト
- エラー状態の表示テスト
- ローディング状態のテスト

### パフォーマンステスト

- 初期表示速度のテスト
- データ更新速度のテスト
- メモリ使用量のテスト

## 完了条件

- [ ] Users/Show.vueの統合実装が完了している
- [ ] 全コンポーネントが正しく表示される
- [ ] GraphQLデータ取得が正常に動作する
- [ ] レスポンシブレイアウトが適切に表示される
- [ ] エラーハンドリングが適切に動作する
- [ ] ローディング状態が適切に表示される
- [ ] 各種イベント処理が正常に動作する
- [ ] フォロー/アンフォロー機能が動作する
- [ ] ダークモード対応が完了している
- [ ] TypeScriptエラーがない
- [ ] ESLintエラーがない
- [ ] 全体的なユーザビリティテストが完了している
