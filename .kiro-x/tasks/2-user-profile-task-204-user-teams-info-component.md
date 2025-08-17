# TASK-204: UserTeamsInfoコンポーネントの実装

## タスク概要

ユーザーのチーム情報（所有チーム・参加チーム・現在のチーム）を表示するコンポーネントを実装する。

## 依存関係

- 依存タスク: TASK-101
- このタスクに依存するタスク: TASK-301

## 実装内容

### ファイル: `resources/js/Components/UserTeamsInfo.vue`

```vue
<script lang="ts" setup>
import { computed } from 'vue'
import { ElCard, ElTag, ElEmpty, ElIcon, ElDivider } from 'element-plus'
import { User, Crown, Users } from '@element-plus/icons-vue'
import type { Team, User as UserType } from '@/Types/types-graphql'

const props = defineProps<{
  ownedTeams: Team[]
  joinedTeams: Team[]
  currentTeamId?: string | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'team-click': [teamId: string]
}>()

const currentTeam = computed(() => {
  if (!props.currentTeamId) return null

  // 所有チームから検索
  const ownedTeam = props.ownedTeams.find(team => team.id === props.currentTeamId)
  if (ownedTeam) return ownedTeam

  // 参加チームから検索
  const joinedTeam = props.joinedTeams.find(team => team.id === props.currentTeamId)
  return joinedTeam || null
})

const hasTeams = computed(() => {
  return props.ownedTeams.length > 0 || props.joinedTeams.length > 0
})

const handleTeamClick = (teamId: string) => {
  emit('team-click', teamId)
}

const getTeamTypeLabel = (team: Team) => {
  return team.personal_team ? 'パーソナルチーム' : 'チーム'
}

const getTeamTypeTag = (team: Team) => {
  return team.personal_team ? 'info' : 'primary'
}
</script>

<template>
  <ElCard class="user-teams-info" shadow="hover">
    <template #header>
      <div class="flex items-center space-x-2">
        <ElIcon class="text-green-600 dark:text-green-400">
          <Users />
        </ElIcon>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">チーム情報</h3>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="!hasTeams" class="py-8">
      <ElEmpty description="チームに参加していません" :image-size="120" />
    </div>

    <div v-else class="space-y-6">
      <!-- 現在のチーム -->
      <div v-if="currentTeam" class="space-y-3">
        <div class="flex items-center space-x-2">
          <ElIcon class="text-amber-600 dark:text-amber-400">
            <Crown />
          </ElIcon>
          <h4 class="text-md font-medium text-gray-900 dark:text-white">現在のチーム</h4>
        </div>

        <div
          class="cursor-pointer rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 transition-shadow hover:shadow-md dark:border-amber-700 dark:from-amber-900/20 dark:to-yellow-900/20"
          @click="handleTeamClick(currentTeam.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h5 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ currentTeam.name }}
              </h5>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ getTeamTypeLabel(currentTeam) }}
              </p>
            </div>
            <ElTag :type="getTeamTypeTag(currentTeam)" effect="light" size="small">
              現在のチーム
            </ElTag>
          </div>
        </div>
      </div>

      <ElDivider v-if="currentTeam" class="my-6" />

      <!-- 所有チーム -->
      <div v-if="ownedTeams.length > 0" class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">所有チーム</h4>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ ownedTeams.length }}チーム
          </span>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div
            v-for="team in ownedTeams"
            :key="team.id"
            class="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:hover:border-blue-600"
            @click="handleTeamClick(team.id)"
          >
            <div class="flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <h5
                  class="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                >
                  {{ team.name }}
                </h5>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ getTeamTypeLabel(team) }}
                </p>
              </div>
              <ElIcon class="ml-2 text-amber-500 dark:text-amber-400">
                <Crown />
              </ElIcon>
            </div>
            <ElTag :type="getTeamTypeTag(team)" effect="plain" size="small" class="mt-2">
              オーナー
            </ElTag>
          </div>
        </div>
      </div>

      <!-- 参加チーム -->
      <div v-if="joinedTeams.length > 0" class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">参加チーム</h4>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ joinedTeams.length }}チーム
          </span>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div
            v-for="team in joinedTeams"
            :key="team.id"
            class="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-green-300 hover:shadow-md dark:border-gray-700 dark:hover:border-green-600"
            @click="handleTeamClick(team.id)"
          >
            <div class="flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <h5
                  class="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400"
                >
                  {{ team.name }}
                </h5>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ getTeamTypeLabel(team) }}
                </p>
              </div>
              <ElIcon class="ml-2 text-green-500 dark:text-green-400">
                <User />
              </ElIcon>
            </div>
            <ElTag type="success" effect="plain" size="small" class="mt-2"> メンバー </ElTag>
          </div>
        </div>
      </div>

      <!-- チーム統計 -->
      <div class="border-t border-gray-200 pt-4 dark:border-gray-700">
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-900/20">
            <div class="text-xl font-bold text-amber-600 dark:text-amber-400">
              {{ ownedTeams.length }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">所有チーム</div>
          </div>
          <div class="rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
            <div class="text-xl font-bold text-green-600 dark:text-green-400">
              {{ joinedTeams.length }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">参加チーム</div>
          </div>
        </div>
      </div>
    </div>
  </ElCard>
</template>

<style scoped>
.user-teams-info {
  @apply w-full;
}

.user-teams-info :deep(.el-card__header) {
  @apply border-b border-gray-200 dark:border-gray-700;
}

.user-teams-info :deep(.el-card__body) {
  @apply p-6;
}

.user-teams-info :deep(.el-divider) {
  @apply border-gray-200 dark:border-gray-700;
}

.user-teams-info :deep(.el-empty__description) {
  @apply text-gray-500 dark:text-gray-400;
}

/* チームカードのホバーエフェクト */
.user-teams-info .group:hover {
  @apply scale-105 transform;
}

/* タグのスタイル調整 */
.user-teams-info :deep(.el-tag) {
  @apply text-xs;
}
</style>
```

## UI/UX仕様

### デザイン要件

- **現在のチーム強調**: アクティブチームの視覚的強調
- **チーム分類表示**: 所有・参加チームの明確な区別
- **統計表示**: チーム数の視覚的な表示
- **カード型レイアウト**: 各チームを個別カードで表示

### Element Plusコンポーネント使用

- **ElCard**: メインコンテナ
- **ElTag**: チームタイプ・ロール表示
- **ElEmpty**: チームなし状態表示
- **ElIcon**: アイコン表示
- **ElDivider**: セクション区切り

### レスポンシブ対応

- **Grid Layout**: モバイル1カラム、PC2カラム
- **カードサイズ**: 画面サイズに応じた調整

## 機能要件

### 表示項目

- 現在のチーム（ハイライト表示）
- 所有チーム一覧
  - チーム名
  - チームタイプ（パーソナル/一般）
  - オーナー表示
- 参加チーム一覧
  - チーム名
  - チームタイプ
  - メンバー表示
- チーム統計（所有数・参加数）

### インタラクション

- チームクリック → チーム詳細画面へ遷移
- 現在のチームの特別表示
- ホバーエフェクト

### 状態管理

- ローディング状態の表示
- チームなし状態の適切な表示
- 現在のチーム判定ロジック

## 技術仕様

### Props型定義

```typescript
interface Props {
  ownedTeams: Team[]
  joinedTeams: Team[]
  currentTeamId?: string | null
  loading?: boolean
}
```

### Emits型定義

```typescript
interface Emits {
  'team-click': [teamId: string]
}
```

### 計算されたプロパティ

- `currentTeam`: 現在のチームオブジェクト
- `hasTeams`: チーム所属の有無判定

### ユーティリティ関数

- `getTeamTypeLabel`: チームタイプの日本語ラベル
- `getTeamTypeTag`: チームタイプに応じたタグスタイル

## Jetstreamチーム機能との統合

### チームタイプ

- **パーソナルチーム**: `personal_team: true`
- **一般チーム**: `personal_team: false`

### ロール区別

- **オーナー**: `ownedTeams`に含まれるチーム
- **メンバー**: `teams`に含まれるチーム（オーナー以外）

### 現在のチーム

- `current_team_id`に基づく現在アクティブなチーム
- 所有・参加チーム両方から検索

## パフォーマンス考慮

- **計算プロパティ**: チーム検索の効率化
- **条件レンダリング**: 不要な要素の非表示
- **イベント処理**: クリックイベントの最適化

## アクセシビリティ

- **セマンティック構造**: 適切なheading階層
- **キーボード操作**: チームカードのフォーカス対応
- **スクリーンリーダー**: 適切なラベル設定

## 将来的な拡張

- **チーム詳細情報**: メンバー数・アクティビティ表示
- **チーム管理機能**: 脱退・削除ボタン
- **チーム検索**: チーム名による検索機能
- **ソート機能**: チーム名・作成日順ソート

## テスト要件

- Props受け渡しのテスト
- チームクリックイベントのテスト
- 現在のチーム判定ロジックのテスト
- チームタイプ表示のテスト
- チームなし状態のテスト
- レスポンシブ表示のテスト

## 完了条件

- [ ] UserTeamsInfo.vueコンポーネントが実装されている
- [ ] 現在のチームが適切に強調表示される
- [ ] 所有・参加チームが正しく分類表示される
- [ ] チーム統計が正しく表示される
- [ ] チームクリックイベントが正しく発火する
- [ ] チームなし状態が適切に表示される
- [ ] レスポンシブ対応が完了している
- [ ] ダークモード対応が完了している
- [ ] TypeScriptエラーがない
- [ ] ESLintエラーがない
- [ ] ユーザビリティテストが完了している
