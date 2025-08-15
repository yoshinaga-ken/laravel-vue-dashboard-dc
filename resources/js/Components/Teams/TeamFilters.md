# TeamFilters.vue コンポーネント仕様書

## 概要

TeamFilters.vueは、チーム一覧画面で高度な検索・フィルタリング機能を提供するコンポーネントです。リアルタイム検索、複数条件フィルター、視覚的なフィルター管理により、ユーザーが効率的にチームを見つけることができます。

### 主な特徴

- 🔍 **リアルタイム検索**: デバウンス機能によるスムーズな検索体験
- 🏷️ **多面的フィルター**: チームタイプ、メンバー数、権限による絞り込み
- 📊 **並び替え機能**: 名前、作成日、メンバー数による柔軟なソート
- 🏃 **高速応答**: デバウンス処理による最適化された検索性能
- 📱 **レスポンシブ**: 全デバイスで最適化されたUI
- ♿ **アクセシブル**: キーボード操作、スクリーンリーダー完全対応
- 🧪 **テスト対応**: 包括的なテストサポート

## 使用例

### 基本的な使用方法

```vue
<template>
  <TeamFilters
    v-model:filters="teamFilters"
    :result-stats="searchStats"
    @filters-changed="handleFiltersChanged"
  />
</template>

<script lang="ts" setup>
  import TeamFilters from '@/Components/Teams/TeamFilters.vue'

  const teamFilters = ref<TeamFilters>({
    search: '',
    type: 'all',
    memberCount: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  })

  const searchStats = ref<ResultStats>({
    total: 25,
    filtered: 8,
    showing: 8,
  })

  const handleFiltersChanged = (filters: TeamFilters) => {
    console.log('Filters updated:', filters)
    // API call or local filtering logic
  }
</script>
```

### 高度な使用方法

```vue
<template>
  <TeamFilters
    v-model:filters="advancedFilters"
    :result-stats="stats"
    :loading="isLoading"
    :show-advanced="true"
    @filters-changed="performAdvancedSearch"
    @filters-cleared="resetAllFilters"
  />
</template>

<script lang="ts" setup>
  const advancedFilters = ref<TeamFilters>({
    search: 'Development',
    type: 'shared',
    memberCount: '2-5',
    sortBy: 'members',
    sortOrder: 'desc',
    createdAfter: '2024-01-01',
    hasInvitations: true,
  })
</script>
```

## Props

| プロパティ     | 型            | デフォルト値 | 必須 | 説明                       |
| -------------- | ------------- | ------------ | ---- | -------------------------- |
| `filters`      | `TeamFilters` | -            | ✅   | フィルター条件オブジェクト |
| `resultStats`  | `ResultStats` | `undefined`  | ❌   | 検索結果統計情報           |
| `loading`      | `boolean`     | `false`      | ❌   | ローディング状態           |
| `showAdvanced` | `boolean`     | `false`      | ❌   | 高度フィルター表示フラグ   |
| `disabled`     | `boolean`     | `false`      | ❌   | コンポーネント無効化フラグ |

### TeamFilters 型定義

```typescript
interface TeamFilters {
  /** 検索キーワード */
  search: string
  /** チームタイプフィルター */
  type: 'all' | 'personal' | 'shared' | 'current'
  /** チーム役割フィルター */
  roleFilter: 'all' | 'owner' | 'member'
  /** メンバー数フィルター */
  memberCount: 'all' | '1' | '2-5' | '6-10' | '11+'
  /** ソート基準 */
  sortBy: 'name' | 'created_at' | 'members' | 'last_activity'
  /** ソート順序 */
  sortOrder: 'asc' | 'desc'
  /** 作成日以降フィルター（高度）*/
  createdAfter?: string
  /** 招待有無フィルター（高度） */
  hasInvitations?: boolean
  /** 自分がオーナーのチームのみ（高度） */
  ownedByMe?: boolean
}
```

### ResultStats 型定義

```typescript
interface ResultStats {
  /** 総チーム数 */
  total: number
  /** フィルター後チーム数 */
  filtered: number
  /** 現在表示中チーム数 */
  showing: number
  /** 検索実行時間（ms） */
  searchTime?: number
}
```

## Events

| イベント名        | ペイロード型                            | 説明                            |
| ----------------- | --------------------------------------- | ------------------------------- |
| `update:filters`  | `TeamFilters`                           | フィルター条件の更新（v-model） |
| `filtersChanged`  | `TeamFilters`                           | フィルター変更時の発火          |
| `filtersCleared`  | `void`                                  | 全フィルタークリア時の発火      |
| `searchSubmitted` | `{ query: string }`                     | 検索実行時の発火                |
| `sortChanged`     | `{ sortBy: string, sortOrder: string }` | ソート変更時の発火              |

## 機能

### 🔍 検索機能

- **リアルタイム検索**: チーム名による部分一致検索
- **デバウンス処理**: 300ms遅延による最適化
- **検索履歴**: 最近の検索キーワード保存
- **検索候補**: 入力補完機能

### 🏷️ フィルター機能

- **チームタイプ**: All / Personal / Shared / Current
- **チーム役割**: All Roles / Owner / Member
- **メンバー数**: 1人 / 2-5人 / 6-10人 / 11人以上
- **権限レベル**: Owner / Member / Guest
- **活動状況**: Active / Inactive / Recent

### 📊 並び替え機能

- **名前順**: A-Z / Z-A
- **作成日順**: 新しい順 / 古い順
- **メンバー数順**: 多い順 / 少ない順
- **最終活動順**: 最近活動 / 長期間非活動

## UI表示要素

### フィルターバー

- **検索入力欄**: プレースホルダー付きテキスト入力
- **フィルタードロップダウン**: チームタイプ選択
- **メンバー数選択**: ラジオボタンまたはチップ形式
- **ソート選択**: ドロップダウンメニュー

### アクティブフィルター表示

- **フィルタータグ**: 現在適用中のフィルター表示
- **クリアボタン**: 個別・一括クリア機能
- **フィルター数表示**: 適用中フィルター数の表示

### 検索結果統計

- **総件数表示**: "25 teams found"
- **フィルター後件数**: "Showing 8 of 25 teams"
- **検索時間表示**: "Search completed in 45ms"

## 実装済み機能

✅ Element Plus UI コンポーネント統合
✅ デバウンス機能付きリアルタイム検索
✅ 複数条件フィルタリング
✅ チーム役割フィルター機能
✅ 柔軟なソート機能
✅ アクティブフィルター視覚化
✅ レスポンシブデザイン
✅ キーボードショートカット
✅ フィルター状態の永続化
✅ 検索履歴機能
✅ TypeScript型安全性
✅ テスト用data-testid属性

## 技術仕様

### コンポーネント構造

```mermaid
TeamFilters
├── 検索バー
│   ├── 検索入力欄
│   ├── 検索ボタン
│   └── クリアボタン
├── フィルターパネル
│   ├── チームタイプ選択
│   ├── チーム役割選択
│   ├── メンバー数選択
│   ├── 権限レベル選択
│   └── 活動状況選択
├── ソートパネル
│   ├── ソート基準選択
│   └── ソート順序選択
├── アクティブフィルター表示
│   ├── フィルタータグリスト
│   └── 一括クリアボタン
└── 結果統計表示
    ├── 件数表示
    └── 検索時間表示
```

### 状態管理

```typescript
// リアクティブな状態
const searchKeyword = ref('')
const activeFilters = ref<TeamFilters>({
  search: '',
  type: 'all',
  memberCount: 'all',
  sortBy: 'name',
  sortOrder: 'asc',
})

// デバウンス処理
const debouncedSearch = useDebounceFn((value: string) => {
  emit('filtersChanged', { ...activeFilters.value, search: value })
}, 300)

// 計算プロパティ
const hasActiveFilters = computed(() => {
  return Object.values(activeFilters.value).some(
    value => value !== '' && value !== 'all' && value !== 'name' && value !== 'asc'
  )
})
```

### イベント処理

```typescript
// 検索実行
const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword
  debouncedSearch(keyword)
}

// フィルター変更
const handleFilterChange = (filterType: string, value: any) => {
  activeFilters.value[filterType] = value
  emit('filtersChanged', activeFilters.value)
}

// フィルタークリア
const clearAllFilters = () => {
  activeFilters.value = {
    search: '',
    type: 'all',
    roleFilter: 'all',
    memberCount: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  }
  emit('filtersCleared')
}
```

## レスポンシブ対応

### デスクトップ（1024px+）

- 4列グリッドレイアウト
- 全フィルター要素表示
- 横並びレイアウト

### タブレット（768-1023px）

- 2列グリッドレイアウト
- 重要フィルターのみ表示
- 折りたたみ式追加フィルター

### モバイル（767px以下）

- 1列スタックレイアウト
- アコーディオン式フィルター
- フローティングアクションボタン

## テストサポート

### data-testid属性

- `team-filters-container`: フィルターコンテナ全体
- `search-input`: 検索入力欄
- `filter-type-{type}`: チームタイプフィルター
- `filter-role-{role}`: チーム役割フィルター
- `filter-members-{count}`: メンバー数フィルター
- `sort-by-{field}`: ソート基準選択
- `clear-all-filters`: 全フィルタークリアボタン
- `active-filter-{index}`: アクティブフィルタータグ

## 基本仕様

- **ファイルパス**: `resources/js/Components/Teams/TeamFilters.vue`
- **Storybookファイル**: `stories/components/teams/TeamFilters.stories.ts`
- **StorybookのURL**: <http://localhost:6006/?path=/docs/teams-teamfilters--docs>
- **技術スタック**: Vue 3 + TypeScript + Element Plus + Tailwind CSS

## 今後の改善点

### 機能拡張

- [ ] 高度フィルター: 作成日範囲、最終活動日
- [ ] フィルタープリセット: よく使うフィルター組み合わせの保存
- [ ] 検索候補: インクリメンタルサーチ機能
- [ ] フィルター履歴: 過去のフィルター条件復元

### パフォーマンス最適化

- [ ] 仮想スクロール: 大量フィルター結果の最適化
- [ ] キャッシュ機能: フィルター結果の一時保存
- [ ] 遅延読み込み: フィルターオプションの動的読み込み

### UX向上

- [ ] ドラッグ&ドロップ: フィルター順序のカスタマイズ
- [ ] キーボードショートカット: 高速フィルター操作
- [ ] 音声検索: 音声入力による検索機能
