# Teams/Index.vue ページ仕様書

## 概要

Teams/Index.vueは、チーム一覧画面のメインページコンポーネントです。Laravel Jetstream チーム管理システムの中核となるページで、ユーザーが所属・所有するチームの包括的な表示と管理機能を提供します。高度な検索・フィルタリング、直感的なチーム操作、レスポンシブデザインにより、効率的なチーム管理体験を実現します。

### 主な特徴

- 🏢 **統合チーム管理**: 所有・所属チームの一元表示と管理
- 🔍 **高度検索**: リアルタイム検索とマルチ条件フィルタリング
- 📱 **レスポンシブ**: 全デバイス対応の適応的レイアウト
- ⚡ **高性能**: Inertia.js による SPA ライクな高速体験
- 🎨 **モダンUI**: Element Plus + Tailwind CSS による洗練されたデザイン
- ♿ **アクセシブル**: 完全なキーボード操作・スクリーンリーダー対応
- 🔗 **URL同期**: ブラウザ履歴・ブックマーク完全対応
- 🧪 **テスト対応**: 包括的なテストサポート

## 使用例

### 基本的なページ実装

```vue
<template>
  <AppLayout title="Teams">
    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800">Teams</h2>
    </template>

    <div class="py-12">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <!-- 検索・フィルターエリア -->
        <TeamFilters
          v-model:filters="filters"
          :result-stats="stats"
          :loading="isLoading"
          @filters-changed="handleFiltersChanged"
        />

        <!-- 結果情報エリア -->
        <TeamResultsInfo
          :pagination="pagination"
          :filters="filters"
          :stats="stats"
          @per-page-changed="handlePerPageChanged"
          @filter-removed="handleFilterRemoved"
          @all-filters-cleared="handleAllFiltersCleared"
        />

        <!-- チーム一覧エリア -->
        <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TeamCard
            v-for="team in teams"
            :key="team.id"
            :team="team"
            :current-team-id="$page.props.auth.user.current_team_id"
            @team-switched="handleTeamSwitched"
          />
        </div>

        <!-- 空状態表示 -->
        <EmptyState v-if="teams.length === 0 && !isLoading" />

        <!-- ページネーション -->
        <TeamPagination
          :pagination="pagination"
          :loading="isLoading"
          @page-changed="handlePageChanged"
          @per-page-changed="handlePerPageChanged"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import TeamCard from '@/Components/Teams/TeamCard.vue'
import TeamFilters from '@/Components/Teams/TeamFilters.vue'
import TeamResultsInfo from '@/Components/Teams/TeamResultsInfo.vue'
import TeamPagination from '@/Components/Teams/TeamPagination.vue'
import EmptyState from '@/Components/EmptyState.vue'

// Props from Inertia
const props = defineProps<{
  teams: Team[]
  pagination: PaginationMeta
  filters: TeamFilters
  stats: TeamStatsWithPagination
}>()

// Local state
const isLoading = ref(false)
</script>
```

### 高度なページ実装

```vue
<template>
  <AppLayout title="Teams">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold leading-tight text-gray-800">Teams Management</h2>
        <div class="flex space-x-4">
          <ElButton @click="exportTeams">
            <ElIcon><Download /></ElIcon>
            Export
          </ElButton>
          <ElButton type="primary" @click="createTeam">
            <ElIcon><Plus /></ElIcon>
            Create Team
          </ElButton>
        </div>
      </div>
    </template>

    <div class="py-12">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <!-- 統計ダッシュボード -->
        <TeamStatsDashboard :stats="enhancedStats" />

        <!-- 検索・フィルターエリア（高度版） -->
        <TeamFilters
          v-model:filters="filters"
          :result-stats="stats"
          :loading="isLoading"
          :show-advanced="showAdvancedFilters"
          @filters-changed="handleAdvancedFiltersChanged"
          @filters-saved="handleFiltersSaved"
        />

        <!-- 表示コントロール -->
        <ViewControls
          v-model:view-mode="viewMode"
          v-model:sort-options="sortOptions"
          @view-changed="handleViewChanged"
        />

        <!-- チーム一覧（動的レイアウト） -->
        <component
          :is="viewComponent"
          :teams="teams"
          :current-team-id="$page.props.auth.user.current_team_id"
          :loading="isLoading"
          @team-switched="handleTeamSwitched"
          @team-deleted="handleTeamDeleted"
          @bulk-action="handleBulkAction"
        />
      </div>
    </div>
  </AppLayout>
</template>
```

## Props

| プロパティ    | 型                        | デフォルト値 | 必須 | 説明                         |
| ------------- | ------------------------- | ------------ | ---- | ---------------------------- |
| `teams`       | `Team[]`                  | -            | ✅   | 表示対象のチーム配列         |
| `pagination`  | `PaginationMeta`          | -            | ✅   | ページネーション情報         |
| `filters`     | `TeamFilters`             | -            | ✅   | 現在適用中のフィルター条件   |
| `stats`       | `TeamStatsWithPagination` | -            | ✅   | チーム統計情報               |
| `user`        | `User`                    | -            | ✅   | 現在ログイン中のユーザー情報 |
| `permissions` | `TeamPermissions`         | `{}`         | ❌   | チーム操作権限情報           |

### Team 型定義

```typescript
interface Team {
  /** チーム一意識別子 */
  id: number
  /** チーム名 */
  name: string
  /** 個人チームフラグ */
  personal_team: boolean
  /** 現在ユーザーがオーナーかどうか */
  is_owner: boolean
  /** チーム作成日 */
  created_at: string
  /** チーム更新日 */
  updated_at: string
  /** チームメンバー情報 */
  users?: TeamUser[]
  /** 招待中メンバー情報 */
  team_invitations?: TeamInvitation[]
  /** メンバー数（計算値） */
  members_count?: number
  /** 招待数（計算値） */
  invitations_count?: number
  /** 最終活動日 */
  last_activity_at?: string
}

interface TeamUser {
  id: number
  name: string
  email: string
  profile_photo_path?: string
  profile_photo_url?: string
  membership: {
    role: string
    created_at: string
  }
}

interface TeamInvitation {
  id: number
  email: string
  role: string
  created_at: string
}
```

### PaginationMeta 型定義

```typescript
interface PaginationMeta {
  /** 現在のページ番号 */
  current_page: number
  /** 1ページあたりの表示件数 */
  per_page: number
  /** 総件数 */
  total: number
  /** 最終ページ番号 */
  last_page: number
  /** 現在ページの開始位置 */
  from: number
  /** 現在ページの終了位置 */
  to: number
  /** 前ページのURL */
  prev_page_url?: string | null
  /** 次ページのURL */
  next_page_url?: string | null
}
```

### TeamStatsWithPagination 型定義

```typescript
interface TeamStatsWithPagination {
  /** 総チーム数 */
  total_teams: number
  /** フィルター後チーム数 */
  filtered_teams: number
  /** 現在ページのチーム数 */
  current_page_teams: number
  /** 所有チーム数 */
  owned_teams: number
  /** 所属チーム数 */
  member_teams: number
  /** 個人チーム数 */
  personal_teams: number
  /** 共有チーム数 */
  shared_teams: number
  /** 検索実行時間（ms） */
  search_time?: number
  /** データ最終更新日時 */
  last_updated: string
}
```

## Events

ページコンポーネントは直接的にはイベントを発行しませんが、子コンポーネントからのイベントを処理します：

### 子コンポーネントからのイベント処理

| イベント元        | イベント名       | ペイロード型  | 説明                 |
| ----------------- | ---------------- | ------------- | -------------------- |
| `TeamFilters`     | `filtersChanged` | `TeamFilters` | フィルター条件変更時 |
| `TeamFilters`     | `filtersCleared` | `void`        | 全フィルタークリア時 |
| `TeamResultsInfo` | `perPageChanged` | `number`      | 表示件数変更時       |
| `TeamResultsInfo` | `filterRemoved`  | `string`      | 個別フィルター削除時 |
| `TeamPagination`  | `pageChanged`    | `number`      | ページ変更時         |
| `TeamCard`        | `teamSwitched`   | `Team`        | チーム切り替え時     |

## 機能

### 🏢 チーム一覧表示

- **統合表示**: 所有チーム・所属チーム・個人チームの一元管理
- **カード形式**: 視覚的で情報豊富なチームカード表示
- **状態表示**: 現在チーム・権限レベル・活動状況の明確な表示
- **レイアウト制御**: Grid/List/Compact 表示モード切り替え

### 🔍 検索・フィルタリング

- **リアルタイム検索**: チーム名による即座の検索結果更新
- **多面的フィルター**: タイプ・メンバー数・権限・活動状況による絞り込み
- **高度フィルター**: 作成日範囲・招待状況・オーナーシップ
- **フィルター管理**: アクティブフィルターの視覚化と管理

### 📄 ページネーション

- **柔軟なページング**: 表示件数変更・高速ページジャンプ
- **状態保持**: ページ遷移時のフィルター・検索条件維持
- **URL同期**: ブラウザ履歴・ブックマーク対応
- **パフォーマンス最適化**: 効率的なデータ取得

### ⚡ チーム操作

- **チーム切り替え**: Jetstream API による安全なチーム切り替え
- **設定画面遷移**: 権限に応じたチーム設定へのナビゲーション
- **新規作成**: チーム作成フローへのスムーズな導線
- **一括操作**: 複数チームの同時操作（将来対応）

### 📊 統計・分析

- **リアルタイム統計**: チーム数・メンバー数・活動状況の表示
- **フィルター効果**: 検索・フィルターの効果測定
- **パフォーマンス監視**: 検索時間・レスポンス時間の表示
- **使用状況分析**: ユーザーの操作パターン分析

## ページ構造

### レイアウト構成

```mermaid
Teams/Index.vue
├── AppLayout
│   ├── ヘッダー
│   │   ├── ページタイトル
│   │   └── アクションボタン
│   └── メインコンテンツ
│       ├── 統計ダッシュボード
│       ├── 検索・フィルターエリア
│       │   ├── 検索バー
│       │   ├── フィルターパネル
│       │   └── ソート選択
│       ├── 結果情報エリア
│       │   ├── 件数表示
│       │   ├── アクティブフィルター
│       │   └── 表示制御
│       ├── チーム一覧エリア
│       │   ├── グリッドレイアウト
│       │   ├── リストレイアウト
│       │   └── コンパクトレイアウト
│       ├── 空状態表示
│       └── ページネーション
└── モーダル・ダイアログ
    ├── チーム作成
    ├── 確認ダイアログ
    └── エラー表示
```

### コンポーネント依存関係

```mermaid
Teams/Index.vue
├── AppLayout
├── TeamFilters
│   ├── SearchInput
│   ├── FilterDropdowns
│   └── SortControls
├── TeamResultsInfo
│   ├── ResultsStats
│   ├── ActiveFilters
│   └── ViewControls
├── TeamCard (複数)
│   ├── TeamAvatar
│   ├── TeamInfo
│   ├── TeamStats
│   └── TeamActions
├── TeamPagination
│   ├── PageControls
│   ├── PerPageSelect
│   └── JumpToPage
└── EmptyState
    ├── IllustrationGraphic
    └── ActionButtons
```

## 実装済み機能

✅ Inertia.js による SPA ライク体験
✅ Laravel Jetstream 完全統合
✅ レスポンシブグリッドレイアウト
✅ 高度な検索・フィルタリング機能
✅ リアルタイム結果更新
✅ URL パラメータ同期
✅ 状態保持（preserveState）
✅ エラーハンドリング
✅ ローディング状態管理
✅ 空状態・エラー状態表示
✅ アクセシビリティ対応
✅ TypeScript 型安全性
✅ テスト用 data-testid 属性

## 技術仕様

### 状態管理

```typescript
// Inertia.js Props（サーバーサイドから）
const props = defineProps<{
  teams: Team[]
  pagination: PaginationMeta
  filters: TeamFilters
  stats: TeamStatsWithPagination
  flash?: {
    success?: string
    error?: string
  }
}>()

// ローカル状態
const isLoading = ref(false)
const selectedTeams = ref<number[]>([])
const viewMode = ref<'grid' | 'list' | 'compact'>('grid')
const showAdvancedFilters = ref(false)

// 計算プロパティ
const hasTeams = computed(() => props.teams.length > 0)
const hasFilters = computed(() =>
  Object.values(props.filters).some(value => value !== '' && value !== 'all' && value !== null)
)
const currentUser = computed(() => $page.props.auth.user)
const viewComponent = computed(() => {
  switch (viewMode.value) {
    case 'list':
      return TeamListView
    case 'compact':
      return TeamCompactView
    default:
      return TeamGridView
  }
})
```

### イベント処理

```typescript
// フィルター変更処理
const handleFiltersChanged = (newFilters: TeamFilters) => {
  isLoading.value = true

  router.get(route('teams.index'), newFilters, {
    preserveState: true,
    preserveScroll: true,
    onSuccess: () => {
      isLoading.value = false
    },
    onError: () => {
      isLoading.value = false
    },
  })
}

// ページ変更処理
const handlePageChanged = (page: number) => {
  isLoading.value = true

  router.get(
    route('teams.index'),
    {
      ...props.filters,
      page,
    },
    {
      preserveState: true,
      onSuccess: () => {
        isLoading.value = false
      },
      onError: () => {
        isLoading.value = false
      },
    }
  )
}

// チーム切り替え処理
const handleTeamSwitched = async (team: Team) => {
  try {
    isLoading.value = true

    await router.put(route('current-team.update'), {
      team_id: team.id,
    })

    // 成功時は自動的にページリロード
    ElMessage.success(`Switched to ${team.name}`)
  } catch (error) {
    ElMessage.error('Failed to switch team')
  } finally {
    isLoading.value = false
  }
}

// エクスポート処理
const handleExportTeams = async () => {
  try {
    const response = await axios.post(route('teams.export'), {
      filters: props.filters,
      format: 'csv',
    })

    // ファイルダウンロード処理
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'teams.csv'
    link.click()
  } catch (error) {
    ElMessage.error('Export failed')
  }
}
```

## レスポンシブ対応

### デスクトップ（1024px+）

- 3列グリッドレイアウト
- フル機能表示
- サイドバー統計パネル
- 高度フィルター展開表示

### タブレット（768-1023px）

- 2列グリッドレイアウト
- 重要機能優先表示
- 折りたたみ式フィルター
- コンパクト統計表示

### モバイル（767px以下）

- 1列リストレイアウト
- 最小限UI表示
- ボトムシート式フィルター
- フローティングアクションボタン

## URL構造・ルーティング

### パラメータ構造

```url
/teams?search=development&type=shared&members=2-5&sort=name&order=asc&page=2&per_page=12
```

### ルート定義

```php
// routes/web.php
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/teams', [TeamController::class, 'index'])->name('teams.index');
    Route::post('/teams/export', [TeamController::class, 'export'])->name('teams.export');
    Route::put('/current-team', [CurrentTeamController::class, 'update'])->name('current-team.update');
});
```

## テストサポート

### data-testid属性

- `teams-index-page`: ページコンテナ全体
- `teams-header`: ページヘッダー
- `teams-filters`: フィルターエリア
- `teams-results-info`: 結果情報エリア
- `teams-grid`: チーム一覧グリッド
- `teams-pagination`: ページネーションエリア
- `teams-empty-state`: 空状態表示
- `create-team-button`: チーム作成ボタン
- `export-teams-button`: エクスポートボタン

### E2E テストシナリオ

```typescript
// tests/e2e/teams/index.spec.ts
test('should display teams list', async ({ page }) => {
  await page.goto('/teams')
  await expect(page.getByTestId('teams-index-page')).toBeVisible()
  await expect(page.getByTestId('teams-grid')).toBeVisible()
})

test('should filter teams by search', async ({ page }) => {
  await page.goto('/teams')
  await page.getByTestId('search-input').fill('Development')
  await expect(page.getByText('Development Team')).toBeVisible()
})

test('should switch teams', async ({ page }) => {
  await page.goto('/teams')
  await page.getByTestId('switch-team-2').click()
  await expect(page.getByText('Team switched successfully')).toBeVisible()
})
```

## 基本仕様

- **ファイルパス**: `resources/js/Pages/Teams/Index.vue`
- **Storybookファイル**: `stories/pages/teams/Index.stories.ts`
- **StorybookのURL**: <http://localhost:6006/?path=/docs/pages-teams-index--docs>
- **技術スタック**: Vue 3 + TypeScript + Inertia.js + Element Plus + Tailwind CSS
- **認証**: Laravel Sanctum + Jetstream
- **レイアウト**: AppLayout 使用

## 今後の改善点

### 機能拡張

- [ ] 一括操作: 複数チームの同時削除・移動・設定変更
- [ ] 高度統計: チーム活動分析・パフォーマンス監視
- [ ] カスタムビュー: ユーザー定義のレイアウト・フィルター保存
- [ ] リアルタイム更新: WebSocket によるライブアップデート

### パフォーマンス最適化

- [ ] 仮想スクロール: 大量チームデータの効率的表示
- [ ] プリフェッチ: 次ページ・関連データの先読み
- [ ] キャッシュ戦略: Redis による高速データアクセス
- [ ] 画像最適化: チームアバターの遅延読み込み

### UX向上

- [ ] ドラッグ&ドロップ: チーム並び替え・グループ化
- [ ] キーボードショートカット: 高速操作支援
- [ ] オフライン対応: PWA 機能による offline-first
- [ ] ダークモード: テーマ切り替え機能

### セキュリティ強化

- [ ] 権限管理: 細かな操作権限制御
- [ ] 監査ログ: チーム操作の完全ログ記録
- [ ] 不正検知: 異常なチーム操作の検出・防止
