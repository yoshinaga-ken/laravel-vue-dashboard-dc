# TeamResultsInfo.vue コンポーネント仕様書

## 概要

TeamResultsInfo.vueは、チーム一覧の検索結果情報とアクティブフィルターの管理を行う包括的なコンポーネントです。検索結果の統計情報表示、適用中フィルターの視覚的管理、表示設定のコントロールを一元化し、ユーザーが現在の検索状況を直感的に把握できる情報ダッシュボードとして機能します。

### 主な特徴

- 📊 **結果統計表示**: 総件数、フィルター結果、表示範囲の包括的表示
- 🏷️ **フィルター管理**: アクティブフィルターの視覚化と個別削除
- ⚙️ **表示制御**: 柔軟な表示件数選択とレイアウト調整
- 🔍 **検索状況**: 現在の検索・フィルター状況の明確な表示
- 📱 **レスポンシブ**: 全デバイスで最適化されたUI
- ⚡ **高速レスポンス**: リアルタイムな結果更新表示
- ♿ **アクセシブル**: 完全なキーボード操作・スクリーンリーダー対応

## 使用例

### 基本的な使用方法

```vue
<template>
  <TeamResultsInfo
    :pagination="paginationData"
    :filters="currentFilters"
    :stats="searchStats"
    @per-page-changed="handlePerPageChange"
    @filter-removed="handleFilterRemove"
    @all-filters-cleared="handleAllFiltersCleared"
  />
</template>

<script lang="ts" setup>
import TeamResultsInfo from '@/Components/Teams/TeamResultsInfo.vue'

const paginationData = ref<PaginationMeta>({
  current_page: 1,
  per_page: 12,
  total: 125,
  last_page: 11,
  from: 1,
  to: 12,
})

const currentFilters = ref<TeamFilters>({
  search: 'Development',
  type: 'shared',
  memberCount: '2-5',
  sortBy: 'name',
  sortOrder: 'asc',
})

const searchStats = ref<TeamStatsWithPagination>({
  totalTeams: 125,
  filteredTeams: 18,
  currentPageTeams: 12,
  searchTime: 45,
  lastUpdated: new Date(),
})

const handlePerPageChange = (perPage: number) => {
  console.log('Per page changed:', perPage)
  // ページネーション更新ロジック
}

const handleFilterRemove = (filterKey: string) => {
  console.log('Filter removed:', filterKey)
  // 特定フィルター削除ロジック
}

const handleAllFiltersCleared = () => {
  console.log('All filters cleared')
  // 全フィルタークリアロジック
}
</script>
```

### 高度な使用方法

```vue
<template>
  <TeamResultsInfo
    :pagination="advancedPagination"
    :filters="complexFilters"
    :stats="detailedStats"
    :show-export="true"
    :show-refresh="true"
    @per-page-changed="handleAdvancedPerPageChange"
    @filter-removed="handleAdvancedFilterRemove"
    @all-filters-cleared="handleAdvancedClearAll"
    @export-results="handleExportResults"
    @refresh-data="handleRefreshData"
  />
</template>

<script lang="ts" setup>
const complexFilters = ref<TeamFilters>({
  search: 'Development Team',
  type: 'shared',
  memberCount: '6-10',
  sortBy: 'last_activity',
  sortOrder: 'desc',
  createdAfter: '2024-01-01',
  hasInvitations: true,
  ownedByMe: false,
})

const detailedStats = ref<TeamStatsWithPagination>({
  totalTeams: 500,
  filteredTeams: 25,
  currentPageTeams: 12,
  searchTime: 89,
  lastUpdated: new Date(),
  cacheHitRate: 0.85,
  indexUsage: ['name_idx', 'type_idx', 'members_count_idx'],
})
</script>
```

## Props

| プロパティ    | 型                        | デフォルト値 | 必須 | 説明                             |
| ------------- | ------------------------- | ------------ | ---- | -------------------------------- |
| `pagination`  | `PaginationMeta`          | -            | ✅   | ページネーション情報オブジェクト |
| `filters`     | `TeamFilters`             | -            | ✅   | 現在適用中のフィルター           |
| `stats`       | `TeamStatsWithPagination` | -            | ✅   | 検索結果統計情報                 |
| `loading`     | `boolean`                 | `false`      | ❌   | データ読み込み中フラグ           |
| `showExport`  | `boolean`                 | `false`      | ❌   | エクスポート機能表示フラグ       |
| `showRefresh` | `boolean`                 | `false`      | ❌   | リフレッシュボタン表示フラグ     |
| `compactMode` | `boolean`                 | `false`      | ❌   | コンパクト表示モード             |

### TeamStatsWithPagination 型定義

```typescript
interface TeamStatsWithPagination {
  /** 総チーム数 */
  totalTeams: number
  /** フィルター適用後チーム数 */
  filteredTeams: number
  /** 現在ページ表示チーム数 */
  currentPageTeams: number
  /** 検索実行時間（ミリ秒） */
  searchTime: number
  /** 最終更新日時 */
  lastUpdated: Date
  /** キャッシュヒット率（パフォーマンス監視用） */
  cacheHitRate?: number
  /** 使用されたインデックス（デバッグ用） */
  indexUsage?: string[]
  /** フィルター適用前の初期件数 */
  originalTotal?: number
}
```

### TeamFilters 型定義（拡張版）

```typescript
interface TeamFilters {
  /** 検索キーワード */
  search: string
  /** チームタイプフィルター */
  type: 'all' | 'personal' | 'shared' | 'current'
  /** メンバー数フィルター */
  memberCount: 'all' | '1' | '2-5' | '6-10' | '11+'
  /** ソート基準 */
  sortBy: 'name' | 'created_at' | 'members' | 'last_activity'
  /** ソート順序 */
  sortOrder: 'asc' | 'desc'
  /** 作成日以降フィルター */
  createdAfter?: string
  /** 招待有無フィルター */
  hasInvitations?: boolean
  /** 自分がオーナーのチームのみ */
  ownedByMe?: boolean
  /** 最終活動日フィルター */
  lastActivityAfter?: string
  /** タグフィルター */
  tags?: string[]
}
```

## Events

| イベント名          | ペイロード型                               | 説明                                                |
| ------------------- | ------------------------------------------ | --------------------------------------------------- |
| `perPageChanged`    | `number`                                   | 表示件数変更時の発火                                |
| `filterRemoved`     | `string`                                   | 個別フィルター削除時の発火                          |
| `allFiltersCleared` | `void`                                     | 全フィルタークリア時の発火                          |
| `exportResults`     | `{ format: string, filters: TeamFilters }` | 結果エクスポート時の発火                            |
| `refreshData`       | `void`                                     | データリフレッシュ時の発火                          |
| `viewModeChanged`   | `string`                                   | 表示モード変更時の発火（'grid', 'list', 'compact'） |

## 機能

### 📊 結果統計表示

- **総件数表示**: 全チーム数の表示
- **フィルター結果**: 絞り込み後の件数表示
- **表示範囲**: 現在ページの表示範囲 "1-12 of 125"
- **検索時間**: パフォーマンス情報の表示

### 🏷️ アクティブフィルター管理

- **フィルタータグ**: 適用中フィルターの視覚的表示
- **個別削除**: 各フィルターの個別削除機能
- **一括クリア**: 全フィルターの一括削除
- **フィルター数表示**: 適用中フィルター数のカウント

### ⚙️ 表示制御機能

- **表示件数選択**: 6, 12, 24, 48件から選択
- **表示モード**: Grid / List / Compact 切り替え
- **ソート方向**: 昇順・降順の切り替え
- **エクスポート**: CSV/JSON形式での結果出力

## UI表示要素

### 結果統計エリア

- **件数表示**: "Showing 1-12 of 125 teams"
- **フィルター結果**: "18 results found"
- **検索時間**: "Search completed in 45ms"
- **最終更新**: "Last updated: 2 minutes ago"

### フィルタータグエリア

- **アクティブタグ**: 現在適用中のフィルター表示
- **削除ボタン**: 各タグの × ボタン
- **クリアボタン**: "Clear all" 一括削除ボタン
- **フィルター数**: "(3 filters applied)" 表示

### コントロールエリア

- **表示件数**: ドロップダウンセレクト
- **表示モード**: Grid/List/Compact トグルボタン
- **エクスポート**: CSV/JSON エクスポートボタン
- **リフレッシュ**: データ更新ボタン

## 実装済み機能

✅ 包括的な結果統計表示
✅ インタラクティブなフィルター管理
✅ 柔軟な表示制御オプション
✅ リアルタイムな状況更新
✅ レスポンシブデザイン
✅ エクスポート機能
✅ パフォーマンス監視
✅ ユーザビリティ最適化
✅ アクセシビリティ対応
✅ TypeScript型安全性
✅ テスト用data-testid属性

## 技術仕様

### コンポーネント構造

```mermaid
TeamResultsInfo
├── 結果統計エリア
│   ├── 総件数表示
│   ├── フィルター結果表示
│   ├── 現在表示範囲
│   └── 検索時間表示
├── フィルタータグエリア
│   ├── アクティブフィルタータグ
│   ├── 個別削除ボタン
│   ├── 一括クリアボタン
│   └── フィルター数表示
├── コントロールエリア
│   ├── 表示件数選択
│   ├── 表示モード切り替え
│   ├── エクスポートボタン
│   └── リフレッシュボタン
└── ローディングオーバーレイ
    ├── スケルトンローディング
    └── プログレスインジケーター
```

### 状態管理

```typescript
// リアクティブな状態
const currentPerPage = ref(12)
const viewMode = ref<'grid' | 'list' | 'compact'>('grid')
const isExporting = ref(false)

// 計算プロパティ
const activeFiltersCount = computed(() => {
  return Object.entries(props.filters).filter(([key, value]) => {
    if (key === 'search') return value.trim() !== ''
    if (key === 'sortBy') return value !== 'name'
    if (key === 'sortOrder') return value !== 'asc'
    return value !== 'all' && value !== '' && value !== undefined && value !== null
  }).length
})

const displayRange = computed(() => {
  const { from, to, total } = props.pagination
  return `${from}-${to} of ${total}`
})

const filteringEffectiveness = computed(() => {
  const { totalTeams, filteredTeams } = props.stats
  return totalTeams > 0 ? (filteredTeams / totalTeams) * 100 : 0
})
```

### イベント処理

```typescript
// 表示件数変更
const handlePerPageChange = (newPerPage: number) => {
  currentPerPage.value = newPerPage
  emit('perPageChanged', newPerPage)
}

// フィルター削除
const handleFilterRemove = (filterKey: string) => {
  emit('filterRemoved', filterKey)
}

// 全フィルタークリア
const handleAllFiltersCleared = () => {
  emit('allFiltersCleared')
}

// エクスポート処理
const handleExport = async (format: 'csv' | 'json') => {
  isExporting.value = true
  try {
    emit('exportResults', { format, filters: props.filters })
  } finally {
    isExporting.value = false
  }
}

// 表示モード変更
const handleViewModeChange = (mode: 'grid' | 'list' | 'compact') => {
  viewMode.value = mode
  emit('viewModeChanged', mode)
}
```

## レスポンシブ対応

### デスクトップ（1024px+）

- フル機能結果情報表示
- 全統計情報・コントロール表示
- 横並びレイアウト

### タブレット（768-1023px）

- 重要情報優先表示
- 折りたたみ式詳細情報
- 2列レイアウト

### モバイル（767px以下）

- コンパクト結果表示
- ボトムシート式フィルター管理
- 縦積みレイアウト

## テストサポート

### data-testid属性

- `team-results-info-container`: 結果情報コンテナ全体
- `results-count`: 結果件数表示
- `filter-tag-{key}`: 各フィルタータグ
- `clear-all-filters`: 全フィルタークリアボタン
- `per-page-select`: 表示件数選択
- `view-mode-{mode}`: 表示モード切り替えボタン
- `export-button-{format}`: エクスポートボタン
- `refresh-button`: リフレッシュボタン

## 基本仕様

- **ファイルパス**: `resources/js/Components/Teams/TeamResultsInfo.vue`
- **Storybookファイル**: `stories/components/teams/TeamResultsInfo.stories.ts`
- **StorybookのURL**: <http://localhost:6006/?path=/docs/teams-teamresultsinfo--docs>
- **技術スタック**: Vue 3 + TypeScript + Element Plus + Tailwind CSS

## 今後の改善点

### 機能拡張

- [ ] 高度統計: フィルタリング効果・検索パフォーマンス分析
- [ ] 保存済み検索: よく使う検索条件の保存・復元
- [ ] 検索履歴: 過去の検索条件履歴管理
- [ ] カスタムビュー: ユーザー定義の表示レイアウト

### パフォーマンス最適化

- [ ] 遅延統計更新: 大量データでの段階的統計計算
- [ ] キャッシュ統計: 統計情報の効率的キャッシュ
- [ ] バックグラウンド更新: 非同期での統計情報更新

### UX向上

- [ ] 統計チャート: 視覚的な結果分析表示
- [ ] フィルター提案: AI による最適フィルター提案
- [ ] ショートカット: キーボードによる高速操作
