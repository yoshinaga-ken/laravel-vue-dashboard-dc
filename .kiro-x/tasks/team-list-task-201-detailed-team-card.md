# TASK-201: 詳細チームカードコンポーネント実装

## 概要

チーム一覧で使用する再利用可能なチームカードコンポーネントを実装する。
メンバー詳細表示、招待状況表示、詳細なチーム情報表示機能を含む。
TASK-104の基本実装を詳細機能で置き換える。

## 依存関係

- **依存タスク**: TASK-104 (基本チーム一覧画面実装)
- **後続タスク**: TASK-202 (フィルタリング・検索機能)

## 実装内容

### 1. TeamCardコンポーネント

**ファイル**: `resources/js/Components/Teams/TeamCard.vue`

```vue
<template>
  <div
    class="overflow-hidden rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-lg dark:border-gray-700"
  >
    <!-- カードヘッダー -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-gray-800 dark:to-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- チームアバター -->
          <div class="relative">
            <ElAvatar
              :size="64"
              :src="team.profile_photo_url"
              :alt="team.name"
              class="shadow-lg ring-4 ring-white dark:ring-gray-600"
            >
              <span class="text-xl font-bold text-gray-600 dark:text-gray-300">
                {{ team.name.charAt(0).toUpperCase() }}
              </span>
            </ElAvatar>
            <!-- オンライン表示 (将来の機能) -->
            <div
              v-if="team.is_active"
              class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500 dark:border-gray-600"
            />
          </div>

          <!-- チーム基本情報 -->
          <div>
            <h4 class="flex items-center text-xl font-semibold text-gray-900 dark:text-white">
              {{ team.name }}
              <ElTag
                v-if="team.id === currentTeamId"
                type="success"
                size="small"
                class="ml-2"
                effect="light"
              >
                <ElIcon><Check /></ElIcon>
                Current
              </ElTag>
              <ElTag v-if="team.personal_team" type="info" size="small" class="ml-2" effect="light">
                <ElIcon><User /></ElIcon>
                Personal
              </ElTag>
            </h4>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Created {{ formatDate(team.created_at) }} by {{ team.owner.name }}
            </p>
          </div>
        </div>

        <!-- クイックアクション -->
        <ElDropdown trigger="click" @command="handleAction">
          <ElButton type="text" circle>
            <ElIcon><More /></ElIcon>
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem v-if="team.id !== currentTeamId" command="switch" icon="Switch">
                Switch to Team
              </ElDropdownItem>
              <ElDropdownItem command="settings" icon="Setting"> Team Settings </ElDropdownItem>
              <ElDropdownItem
                v-if="canLeaveTeam"
                command="leave"
                icon="Close"
                class="text-red-600"
                divided
              >
                Leave Team
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
    </div>

    <!-- カードボディ -->
    <div class="p-6">
      <!-- 統計情報 -->
      <div class="mb-6 grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ team.members_count }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ team.members_count === 1 ? 'Member' : 'Members' }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {{ team.pending_invitations_count }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Pending</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ team.projects_count || 0 }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Projects</div>
        </div>
      </div>

      <!-- メンバー一覧プレビュー -->
      <div v-if="team.recent_members?.length" class="mb-6">
        <div class="mb-3 flex items-center justify-between">
          <h5 class="text-sm font-medium text-gray-900 dark:text-white">Recent Members</h5>
          <ElButton type="text" size="small" @click="$emit('showMembers', team)">
            View All
          </ElButton>
        </div>
        <div class="flex items-center space-x-2">
          <ElAvatar
            v-for="member in team.recent_members.slice(0, 5)"
            :key="member.id"
            :size="32"
            :src="member.profile_photo_url"
            :title="member.name"
            class="ring-2 ring-white dark:ring-gray-600"
          >
            {{ member.name.charAt(0) }}
          </ElAvatar>
          <span v-if="team.members_count > 5" class="ml-2 text-sm text-gray-500 dark:text-gray-400">
            +{{ team.members_count - 5 }} more
          </span>
        </div>
      </div>

      <!-- 招待中のメンバー -->
      <div v-if="team.pending_invitations_count > 0" class="mb-6">
        <div class="mb-3 flex items-center justify-between">
          <h5 class="text-sm font-medium text-gray-900 dark:text-white">Pending Invitations</h5>
          <ElTag type="warning" size="small" effect="light">
            {{ team.pending_invitations_count }}
          </ElTag>
        </div>
        <div class="space-y-2">
          <div
            v-for="invitation in team.recent_invitations"
            :key="invitation.id"
            class="flex items-center justify-between rounded bg-yellow-50 p-2 dark:bg-yellow-900/20"
          >
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ invitation.email }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(invitation.created_at) }}
            </span>
          </div>
        </div>
      </div>

      <!-- アクションボタン -->
      <div
        class="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700"
      >
        <div class="flex space-x-2">
          <ElButton
            v-if="team.id !== currentTeamId"
            type="primary"
            size="small"
            @click="handleSwitchTeam"
            :loading="isSwitching"
          >
            <ElIcon><Switch /></ElIcon>
            Switch
          </ElButton>
          <ElButton type="default" size="small" @click="handleTeamSettings">
            <ElIcon><Setting /></ElIcon>
            Settings
          </ElButton>
        </div>

        <ElButton type="text" size="small" @click="$emit('showDetails', team)">
          View Details
          <ElIcon><ArrowRight /></ElIcon>
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import {
  ElAvatar,
  ElTag,
  ElButton,
  ElIcon,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from 'element-plus'
import { Check, User, More, Switch, Setting, ArrowRight, Close } from '@element-plus/icons-vue'
import type { Team } from '@/Types/types-team'

// Props
const props = defineProps<{
  team: Team
  currentTeamId: number
}>()

// Emits
const emit = defineEmits<{
  showMembers: [team: Team]
  showDetails: [team: Team]
  teamSwitched: [team: Team]
}>()

// Reactive state
const isSwitching = ref(false)

// Computed
const canLeaveTeam = computed(() => {
  return !props.team.personal_team && props.team.id !== props.currentTeamId
})

// Methods
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

const handleSwitchTeam = async () => {
  isSwitching.value = true
  try {
    await router.put(
      `/teams/${props.team.id}/switch`,
      {},
      {
        onSuccess: () => {
          emit('teamSwitched', props.team)
        },
      }
    )
  } finally {
    isSwitching.value = false
  }
}

const handleTeamSettings = () => {
  router.visit(`/teams/${props.team.id}`)
}

const handleAction = (command: string) => {
  switch (command) {
    case 'switch':
      handleSwitchTeam()
      break
    case 'settings':
      handleTeamSettings()
      break
    case 'leave':
      // 今後実装
      console.log('Leave team:', props.team.id)
      break
  }
}
</script>
```

### 2. Index.vue の更新

**ファイル**: `resources/js/Pages/Teams/Index.vue` (部分更新)

```vue
<template>
  <!-- ... existing header ... -->

  <!-- チーム一覧セクション -->
  <div class="p-6 sm:px-8">
    <!-- ... loading/error states ... -->

    <!-- チーム一覧 (更新) -->
    <div v-else-if="teams.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <TeamCard
        v-for="team in teams"
        :key="team.id"
        :team="team"
        :current-team-id="$page.props.auth.user.current_team_id"
        @show-members="handleShowMembers"
        @show-details="handleShowDetails"
        @team-switched="handleTeamSwitched"
      />
    </div>

    <!-- ... empty state ... -->
  </div>
</template>

<script lang="ts" setup>
// ... existing imports ...
import TeamCard from '@/Components/Teams/TeamCard.vue'

// ... existing code ...

// 新しいイベントハンドラー
const handleShowMembers = (team: Team) => {
  // 将来の実装: メンバー詳細モーダル表示
  console.log('Show members for team:', team.id)
}

const handleShowDetails = (team: Team) => {
  // 将来の実装: チーム詳細モーダル表示
  console.log('Show details for team:', team.id)
}

const handleTeamSwitched = (team: Team) => {
  // チーム切り替え後の処理
  router.reload()
}
</script>
```

## 成果物

### 新規作成ファイル

1. `resources/js/Components/Teams/TeamCard.vue` - 詳細チームカードコンポーネント

### 修正ファイル

1. `resources/js/Pages/Teams/Index.vue` - TeamCardコンポーネント統合

## 完了条件

### 機能確認

1. **詳細カード表示**
   - チーム情報が美しいカード形式で表示
   - 統計情報（メンバー数、招待数、プロジェクト数）が表示
   - メンバープレビューが表示

2. **インタラクティブ機能**
   - ドロップダウンメニューでクイックアクション
   - チーム切り替え機能
   - 設定画面への遷移

3. **レスポンシブレイアウト**
   - デスクトップ: 3カラムグリッド
   - タブレット: 2カラムグリッド
   - モバイル: 1カラム

### 視覚的確認

1. **デザイン品質**
   - グラデーション背景による美しいヘッダー
   - 適切な余白とレイアウト
   - ホバー効果による良好なUX

2. **情報の可読性**
   - 重要な情報が目立つ配置
   - 統計情報の視覚的表現
   - 状態タグによる明確な識別

## 技術的考慮事項

### 1. コンポーネント設計

- 単一責任原則に基づく設計
- Props/Emitsによる疎結合
- 再利用可能性の確保

### 2. Element Plus活用

- Grid システムによるレスポンシブ対応
- Dropdown コンポーネントの活用
- Icon システムの統一的使用

### 3. パフォーマンス

- 適切なkey設定によるレンダリング最適化
- Loading状態の管理
- 不要な再レンダリングの防止

## 注意事項

### 1. データ構造

- `recent_members` と `recent_invitations` が配列で提供されること
- `projects_count` はオプショナルフィールド
- `is_active` は将来の機能用フィールド

### 2. スタイリング

- ダークモード対応の確保
- Tailwind CSS による一貫性
- Element Plus テーマとの調和

### 3. アクセシビリティ

- 適切なaria属性
- キーボード操作対応
- スクリーンリーダー対応

## 実装時の注意点

### 1. TypeScript型定義

- `Team` 型の拡張が必要な場合はTASK-102を更新
- Props の型安全性を確保
- Emits の型定義を適切に設定

### 2. イベント処理

- 親コンポーネントとの適切な連携
- エラーハンドリングの実装
- Loading状態の管理

### 3. レスポンシブ対応

- Grid システムの適切な使用
- モバイルでの操作性確保
- 画面サイズごとの最適化

## コードレビューポイント

1. **コンポーネント分離**: 適切な責任分担と再利用性
2. **型安全性**: TypeScript型定義の活用
3. **パフォーマンス**: 効率的なレンダリング
4. **UX**: 直感的な操作性と視覚的魅力
