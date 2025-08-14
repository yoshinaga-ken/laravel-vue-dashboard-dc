# TASK-104: 基本チーム一覧画面実装

## 概要

Vue3 + Inertia.js + Element Plus を使用して、チーム一覧を表示する基本的な画面を実装する。
チーム切り替え機能、基本的なチーム情報表示、レスポンシブ対応を含む最小機能版を作成する。

## 依存関係

- **依存タスク**:
  - TASK-101 (バックエンドAPI実装) - `TeamsController@index` API
  - TASK-102 (TypeScript型定義) - `Team` 型定義
  - TASK-103 (ナビゲーション統合) - AppLayout メニュー修正
- **後続タスク**: TASK-201 (詳細コンポーネント実装)

## 実装内容

### 1. チーム一覧ページコンポーネント

**ファイル**: `resources/js/Pages/Teams/Index.vue`

```vue
<template>
  <AppLayout title="Teams">
    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Teams</h2>
    </template>

    <div class="py-12">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="overflow-hidden bg-white shadow-xl sm:rounded-lg dark:bg-gray-800">
          <!-- ヘッダーセクション -->
          <div class="border-b border-gray-200 p-6 sm:px-8 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">All Teams</h3>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Teams you belong to and teams you've created.
                </p>
              </div>
              <ElButton
                v-if="$page.props.jetstream.canCreateTeams"
                type="primary"
                @click="handleCreateTeam"
              >
                <ElIcon><Plus /></ElIcon>
                Create Team
              </ElButton>
            </div>
          </div>

          <!-- 一覧セクション -->
          <div class="p-6 sm:px-8">
            <!-- ローディング状態 -->
            <div v-if="isLoading" class="flex justify-center py-8">
              <ElIcon class="animate-spin text-2xl text-gray-500">
                <Loading />
              </ElIcon>
            </div>

            <!-- エラー状態 -->
            <div v-else-if="error" class="py-8 text-center">
              <p class="text-red-600 dark:text-red-400">Failed to load teams. Please try again.</p>
              <ElButton type="text" @click="loadTeams" class="mt-2"> Retry </ElButton>
            </div>

            <!-- チーム一覧 -->
            <div v-else-if="teams.length > 0" class="space-y-4">
              <div
                v-for="team in teams"
                :key="team.id"
                class="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <!-- チームアバター -->
                    <ElAvatar
                      :size="48"
                      :src="team.profile_photo_url"
                      :alt="team.name"
                      class="bg-gray-300 dark:bg-gray-600"
                    >
                      <span class="text-lg font-medium">
                        {{ team.name.charAt(0).toUpperCase() }}
                      </span>
                    </ElAvatar>

                    <!-- チーム情報 -->
                    <div>
                      <h4
                        class="flex items-center text-lg font-medium text-gray-900 dark:text-white"
                      >
                        {{ team.name }}
                        <ElTag
                          v-if="team.id === $page.props.auth.user.current_team_id"
                          type="success"
                          size="small"
                          class="ml-2"
                        >
                          Current
                        </ElTag>
                        <ElTag v-if="team.personal_team" type="info" size="small" class="ml-2">
                          Personal
                        </ElTag>
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ team.members_count }}
                        {{ team.members_count === 1 ? 'member' : 'members' }}
                        <span v-if="team.pending_invitations_count > 0">
                          • {{ team.pending_invitations_count }} pending
                        </span>
                      </p>
                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        Created {{ formatDate(team.created_at) }}
                      </p>
                    </div>
                  </div>

                  <!-- アクションボタン -->
                  <div class="flex items-center space-x-2">
                    <!-- チーム切り替え -->
                    <ElButton
                      v-if="team.id !== $page.props.auth.user.current_team_id"
                      type="default"
                      size="small"
                      @click="handleSwitchTeam(team)"
                    >
                      Switch
                    </ElButton>

                    <!-- チーム設定 -->
                    <ElButton type="primary" size="small" @click="handleTeamSettings(team)">
                      Settings
                    </ElButton>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状態 -->
            <div v-else class="py-12 text-center">
              <ElIcon class="mb-4 text-6xl text-gray-400">
                <UserFilled />
              </ElIcon>
              <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">No teams found</h3>
              <p class="mb-4 text-gray-600 dark:text-gray-400">
                You don't belong to any teams yet.
              </p>
              <ElButton
                v-if="$page.props.jetstream.canCreateTeams"
                type="primary"
                @click="handleCreateTeam"
              >
                Create Your First Team
              </ElButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import { ElButton, ElIcon, ElAvatar, ElTag } from 'element-plus'
import { Plus, Loading, UserFilled } from '@element-plus/icons-vue'
import type { Team } from '@/Types/types-team'

// Props
const props = defineProps<{
  teams: Team[]
}>()

// Reactive state
const isLoading = ref(false)
const error = ref<string | null>(null)
const teams = ref<Team[]>(props.teams)

// 日付フォーマット
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

// チーム一覧の再読み込み
const loadTeams = async () => {
  isLoading.value = true
  error.value = null

  try {
    router.reload({ only: ['teams'] })
  } catch (err) {
    error.value = 'Failed to load teams'
  } finally {
    isLoading.value = false
  }
}

// チーム切り替え
const handleSwitchTeam = (team: Team) => {
  router.put(
    `/teams/${team.id}/switch`,
    {},
    {
      onSuccess: () => {
        // 切り替え後にページをリロード
        router.reload()
      },
    }
  )
}

// チーム設定画面へ遷移
const handleTeamSettings = (team: Team) => {
  router.visit(`/teams/${team.id}`)
}

// チーム作成画面へ遷移
const handleCreateTeam = () => {
  router.visit('/teams/create')
}

// 初期化
onMounted(() => {
  // 必要に応じて初期化処理
})
</script>

<style scoped>
/* 追加のスタイリングが必要な場合 */
</style>
```

### 2. ルーティング設定確認

**ファイル**: `routes/web.php` (TASK-101で既に作成済み)

```php
// チーム一覧画面のルート (確認のみ)
Route::get('/teams', [TeamsController::class, 'index'])->name('teams.index');
```

## 成果物

### 新規作成ファイル

1. `resources/js/Pages/Teams/Index.vue` - チーム一覧ページコンポーネント

## 完了条件

### 機能確認

1. **基本表示**
   - `/teams` URLでチーム一覧ページが表示される
   - AppLayoutでヘッダーが「Teams」と表示される
   - チーム一覧がカード形式で表示される

2. **チーム情報表示**
   - チーム名、メンバー数、作成日が表示される
   - 現在のチームに「Current」タグが表示される
   - Personal teamに「Personal」タグが表示される
   - チームアバターまたは頭文字が表示される

3. **インタラクティブ機能**
   - 「Switch」ボタンでチーム切り替えができる
   - 「Settings」ボタンでチーム設定画面に遷移
   - 「Create Team」ボタンでチーム作成画面に遷移

4. **状態管理**
   - ローディング状態が適切に表示される
   - エラー状態が適切に表示される
   - 空状態（チームなし）が適切に表示される

### 視覚的確認

1. **レスポンシブデザイン**
   - デスクトップ: カード形式で見やすく表示
   - タブレット: 適切な余白とレイアウト
   - モバイル: ボタン配置が操作しやすい

2. **ダークモード対応**
   - テキスト色が適切に表示される
   - 背景色が適切に表示される
   - ボーダー色が適切に表示される

3. **Element Plus統合**
   - ボタン、アバター、タグが適切にスタイリング
   - ホバー状態が適切に表示される
   - アイコンが適切に表示される

## 技術的考慮事項

### 1. Vue3 Composition API

- `defineProps<>()` による型安全なProps定義
- `ref()` による reactive state 管理
- `onMounted()` によるライフサイクル管理

### 2. Inertia.js統合

- `router.visit()` による画面遷移
- `router.put()` によるチーム切り替え
- `router.reload()` による部分的なデータ更新

### 3. Element Plus活用

- `ElButton`, `ElIcon`, `ElAvatar`, `ElTag` の適切な使用
- Element Plus のテーマシステム活用
- アクセシビリティ対応の確保

### 4. TypeScript型安全性

- `Team` 型による型安全なデータ処理
- Props の型定義による型チェック
- イベントハンドラーの型安全性

## 注意事項

### 1. パフォーマンス

- 大量のチームデータに対する配慮
- 画像読み込みの最適化
- 不要な再レンダリングの防止

### 2. ユーザビリティ

- 直感的なUI配置
- 明確なアクション表示
- 適切なフィードバック提供

### 3. セキュリティ

- チーム切り替え時の権限確認
- 適切なCSRF保護
- XSS対策の確保

## 実装時の注意点

### 1. Props の型定義

- TASK-102で作成する `Team` 型を正しくimport
- 必要に応じてPaginationも考慮

### 2. Inertia.js のデータ渡し

- `TeamsController@index` からのデータ形式と一致
- 必要なリレーションデータの確保

### 3. Element Plus のスタイリング

- 既存のJetstream スタイルとの調和
- Tailwind CSS との組み合わせ

## コードレビューポイント

1. **型安全性**: TypeScript型定義の適切な使用
2. **コンポーネント設計**: 単一責任原則の遵守
3. **パフォーマンス**: 不要な再レンダリングの防止
4. **アクセシビリティ**: 適切な属性設定とキーボード操作対応
