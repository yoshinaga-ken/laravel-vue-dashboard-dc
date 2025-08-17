# TeamResultsInfo.vue コンポーネント仕様書

## 概要

TeamResultsInfo.vueは、チーム一覧の検索結果情報とアクティブフィルターの管理を行うコンポーネントです。検索結果の統計情報表示、適用中フィルターの視覚的管理、表示件数設定のコントロールを提供し、ユーザーが現在の検索状況を直感的に把握できる情報表示として機能します。

### 主な特徴

- 📊 **結果統計表示**: 総件数、フィルター結果、表示範囲の表示
- 🏷️ **フィルター管理**: アクティブフィルターの視覚化と個別削除
- ⚙️ **表示制御**: 32件/128件/全件の表示件数選択
- 🔍 **検索状況**: 現在の検索・フィルター状況の明確な表示
- 📱 **レスポンシブ**: 全デバイスで最適化されたUI
- ♿ **アクセシブル**: キーボード操作・スクリーンリーダー対応

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
  per_page: 32,
  total: 125,
  last_page: 4,
  from: 1,
  to: 32,
})

const currentFilters = ref<TeamFilters>({
  search: 'Development',
  type: 'shared',
  member_count: '2-5',
  sort_by: 'name_asc',
})

const searchStats = ref<TeamStatsWithPagination>({
  total: 125,
  filtered: 18,
  showing: 18,
  from: 1,
  to: 18,
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
    @per-page-changed="handleAdvancedPerPageChange"
    @filter-removed="handleAdvancedFilterRemove"
    @all-filters-cleared="handleAdvancedClearAll"
  />
</template>

<script lang="ts" setup>
const complexFilters = ref<TeamFilters>({
  search: 'Development Team',
  type: 'shared',
  member_count: '6-10',
  sort_by: 'members_desc',
})

const detailedStats = ref<TeamStatsWithPagination>({
  total: 500,
  filtered: 25,
  showing: 25,
  from: 1,
  to: 25,
})
</script>
```

## Props

| プロパティ   | 型                        | デフォルト値 | 必須 | 説明                             |
| ------------ | ------------------------- | ------------ | ---- | -------------------------------- |
| `pagination` | `PaginationMeta`          | -            | ✅   | ページネーション情報オブジェクト |
| `filters`    | `TeamFilters`             | -            | ✅   | 現在適用中のフィルター           |
| `stats`      | `TeamStatsWithPagination` | -            | ✅   | 検索結果統計情報                 |
| `loading`    | `boolean`                 | `false`      | ❌   | データ読み込み中フラグ           |

### TeamStatsWithPagination 型定義

```typescript
interface TeamStatsWithPagination {
  /** 総チーム数 */
  total: number
  /** フィルター適用後チーム数 */
  filtered: number
  /** 現在ページ表示チーム数 */
  showing: number
  /** 表示開始番号 */
  from: number
  /** 表示終了番号 */
  to: number
}
```

### TeamFilters 型定義

```typescript
interface TeamFilters {
  /** 検索キーワード */
  search?: string
  /** チームタイプフィルター */
  type?: string
  /** メンバー数フィルター */
  member_count?: string
  /** ソート基準 */
  sort_by?: string
}
```

## Events

| イベント名          | ペイロード型 | 説明                       |
| ------------------- | ------------ | -------------------------- |
| `perPageChanged`    | `number`     | 表示件数変更時の発火       |
| `filterRemoved`     | `string`     | 個別フィルター削除時の発火 |
| `allFiltersCleared` | `void`       | 全フィルタークリア時の発火 |

## 機能

### 📊 結果統計表示

- **総件数表示**: 全チーム数の表示
- **フィルター結果**: 絞り込み後の件数表示
- **表示範囲**: 現在ページの表示範囲 "1-32 of 125"

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

### デスクトップ（1024px以上）

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

## 基本仕様

- **ファイルパス**: `resources/js/Components/Teams/TeamResultsInfo.vue`
- **技術スタック**: Vue 3 + TypeScript + Element Plus + Tailwind CSS
