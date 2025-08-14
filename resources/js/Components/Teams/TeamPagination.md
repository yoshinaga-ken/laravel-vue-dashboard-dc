# TeamPagination.vue コンポーネント仕様書

## 概要

TeamPagination.vueは、チーム一覧のページネーション機能を提供する高機能コンポーネントです。Element Plus Paginationを基盤とし、チーム管理システムに最適化されたページング体験を提供します。大量のチームデータを効率的にナビゲートできる包括的な機能を持ちます。

### 主な特徴

- 📄 **高機能ページネーション**: Element Plus完全統合による安定性
- 🔢 **柔軟な表示件数**: 6, 12, 24, 48件から選択可能
- 🏃 **高速ページジャンプ**: 直接ページ指定による効率的ナビゲーション
- 📱 **レスポンシブ**: デバイスごとに最適化されたUI
- ⚡ **ローディング状態**: スムーズなUX体験
- ♿ **アクセシブル**: キーボード操作・スクリーンリーダー対応
- 🧪 **テスト対応**: 包括的なテストサポート

## 使用例

### 基本的な使用方法

```vue
<template>
  <TeamPagination
    :pagination="paginationData"
    :loading="isLoading"
    @page-changed="handlePageChange"
    @per-page-changed="handlePerPageChange"
  />
</template>

<script lang="ts" setup>
import TeamPagination from '@/Components/Teams/TeamPagination.vue'

const paginationData = ref<PaginationMeta>({
  current_page: 1,
  per_page: 12,
  total: 125,
  last_page: 11,
  from: 1,
  to: 12,
})

const isLoading = ref(false)

const handlePageChange = async (page: number) => {
  isLoading.value = true
  try {
    await fetchTeams({ page, per_page: paginationData.value.per_page })
  } finally {
    isLoading.value = false
  }
}

const handlePerPageChange = async (perPage: number) => {
  isLoading.value = true
  try {
    await fetchTeams({ page: 1, per_page: perPage })
  } finally {
    isLoading.value = false
  }
}
</script>
```

### 高度な使用方法

```vue
<template>
  <TeamPagination
    :pagination="advancedPagination"
    :loading="loadingState"
    :disabled="isFormSubmitting"
    :small="isMobileView"
    @page-changed="handleAdvancedPageChange"
    @per-page-changed="handleAdvancedPerPageChange"
    @page-size-changed="handlePageSizeChange"
  />
</template>

<script lang="ts" setup>
const advancedPagination = ref<PaginationMeta>({
  current_page: 3,
  per_page: 24,
  total: 500,
  last_page: 21,
  from: 49,
  to: 72,
  prev_page_url: '/teams?page=2',
  next_page_url: '/teams?page=4',
})

const handleAdvancedPageChange = async (page: number) => {
  // URL更新とデータ取得を同時実行
  await Promise.all([router.push({ query: { ...route.query, page } }), refreshTeamData({ page })])
}
</script>
```

## Props

| プロパティ        | 型               | デフォルト値 | 必須 | 説明                             |
| ----------------- | ---------------- | ------------ | ---- | -------------------------------- |
| `pagination`      | `PaginationMeta` | -            | ✅   | ページネーション情報オブジェクト |
| `loading`         | `boolean`        | `false`      | ❌   | ローディング状態フラグ           |
| `disabled`        | `boolean`        | `false`      | ❌   | コンポーネント無効化フラグ       |
| `small`           | `boolean`        | `false`      | ❌   | コンパクト表示モード             |
| `showSizeChanger` | `boolean`        | `true`       | ❌   | 表示件数変更UI表示フラグ         |
| `showQuickJumper` | `boolean`        | `true`       | ❌   | ページジャンプUI表示フラグ       |
| `showTotal`       | `boolean`        | `true`       | ❌   | 総件数表示フラグ                 |

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
  /** 前ページのURL（Laravel Pagination） */
  prev_page_url?: string | null
  /** 次ページのURL（Laravel Pagination） */
  next_page_url?: string | null
  /** ページURLリスト（Laravel Pagination） */
  links?: PaginationLink[]
}

interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}
```

## Events

| イベント名            | ペイロード型                        | 説明                         |
| --------------------- | ----------------------------------- | ---------------------------- |
| `pageChanged`         | `number`                            | ページ変更時の発火           |
| `perPageChanged`      | `number`                            | 表示件数変更時の発火         |
| `pageSizeChanged`     | `{ page: number, perPage: number }` | ページ・件数同時変更時の発火 |
| `jumpToPage`          | `number`                            | ページジャンプ時の発火       |
| `loadingStateChanged` | `boolean`                           | ローディング状態変更時の発火 |

## 機能

### 📄 ページネーション機能

- **ページ移動**: 前後ページ・指定ページへの移動
- **ページジャンプ**: 直接ページ番号指定
- **境界制御**: 最初・最後ページでの適切な制御
- **URL同期**: ブラウザURL・履歴との連携

### 🔢 表示件数制御

- **選択可能件数**: 6, 12, 24, 48件
- **件数変更時挙動**: 自動的に1ページ目へリセット
- **メモリ機能**: ユーザーの選択を記憶・復元
- **適応的調整**: 総件数に応じた最適件数提案

### ⚡ パフォーマンス最適化

- **遅延ローディング**: 大量データの段階的読み込み
- **キャッシュ機能**: 訪問済みページの一時保存
- **プリフェッチ**: 次ページの先読み機能
- **デバウンス**: 高速ページ切り替えの最適化

## UI表示要素

### ページネーションコントロール

- **ページ番号**: クリック可能なページ番号ボタン
- **前後移動ボタン**: Previous/Next ナビゲーション
- **最初・最後ページボタン**: First/Last ページジャンプ
- **省略表示**: 大量ページ時の "..." 表示

### 表示件数選択

- **ドロップダウン**: 6, 12, 24, 48件から選択
- **現在選択表示**: "12 / page" 形式での表示
- **総件数表示**: "Showing 1-12 of 125 teams"

### 統計情報表示

- **ページ情報**: "Page 3 of 11"
- **範囲表示**: "Showing 25-36 of 125 teams"
- **クイックジャンプ**: "Jump to page" 入力欄

## 実装済み機能

✅ Element Plus Pagination 完全統合
✅ レスポンシブページネーション
✅ 柔軟な表示件数制御
✅ 高速ページジャンプ機能
✅ ローディング状態の視覚化
✅ URL同期・ブラウザ履歴対応
✅ キーボード操作サポート
✅ 適応的レイアウト調整
✅ パフォーマンス最適化
✅ TypeScript型安全性
✅ テスト用data-testid属性

## 技術仕様

### コンポーネント構造

```mermaid
TeamPagination
├── ページネーション本体
│   ├── 前ページボタン
│   ├── ページ番号リスト
│   ├── 次ページボタン
│   └── 最初・最後ページボタン
├── 表示件数選択
│   ├── ドロップダウンメニュー
│   └── 現在選択表示
├── 統計情報表示
│   ├── 総件数表示
│   ├── 現在範囲表示
│   └── ページ情報表示
├── クイックジャンプ
│   ├── ページ入力欄
│   └── ジャンプボタン
└── ローディングオーバーレイ
    ├── スピナー表示
    └── 半透明マスク
```

### 状態管理

```typescript
// リアクティブな状態
const currentPage = ref(1)
const perPage = ref(12)
const isJumping = ref(false)

// 計算プロパティ
const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.per_page))

const pageRange = computed(() => {
  const current = props.pagination.current_page
  const total = totalPages.value
  const delta = 2

  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  // 省略表示ロジック
  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else {
    rangeWithDots.push(total)
  }

  return rangeWithDots
})
```

### イベント処理

```typescript
// ページ変更
const handlePageChange = (page: number) => {
  if (page === currentPage.value || props.loading) return

  currentPage.value = page
  emit('pageChanged', page)
}

// 表示件数変更
const handlePerPageChange = (newPerPage: number) => {
  perPage.value = newPerPage
  currentPage.value = 1 // 1ページ目にリセット
  emit('perPageChanged', newPerPage)
  emit('pageSizeChanged', { page: 1, perPage: newPerPage })
}

// ページジャンプ
const handlePageJump = (targetPage: number) => {
  const page = Math.max(1, Math.min(totalPages.value, targetPage))
  if (page !== currentPage.value) {
    isJumping.value = true
    emit('jumpToPage', page)
    setTimeout(() => {
      isJumping.value = false
    }, 300)
  }
}
```

## レスポンシブ対応

### デスクトップ（1024px+）

- フル機能ページネーション表示
- 全ページ番号・統計情報表示
- クイックジャンプ機能提供

### タブレット（768-1023px）

- 簡略化ページネーション
- 重要ページ番号のみ表示
- 統計情報はコンパクト表示

### モバイル（767px以下）

- 最小限ページネーション
- 前後移動ボタンのみ
- ページ情報は数値のみ表示

## テストサポート

### data-testid属性

- `team-pagination-container`: ページネーションコンテナ全体
- `pagination-prev`: 前ページボタン
- `pagination-next`: 次ページボタン
- `pagination-page-{number}`: 各ページボタン
- `per-page-select`: 表示件数選択
- `page-jump-input`: ページジャンプ入力欄
- `pagination-info`: ページ情報表示エリア

## 基本仕様

- **ファイルパス**: `resources/js/Components/Teams/TeamPagination.vue`
- **Storybookファイル**: `stories/components/teams/TeamPagination.stories.ts`
- **StorybookのURL**: <http://localhost:6006/?path=/docs/teams-teampagination--docs>
- **技術スタック**: Vue 3 + TypeScript + Element Plus + Tailwind CSS

## 今後の改善点

### 機能拡張

- [ ] 無限スクロール: 自動ページ読み込み機能
- [ ] ページサイズ自動調整: 画面サイズに応じた最適件数
- [ ] ブックマーク機能: 特定ページの保存・復元
- [ ] 検索連動: フィルター結果とのシームレス連携

### パフォーマンス最適化

- [ ] 仮想ページネーション: 大量ページの効率的表示
- [ ] プリロード機能: 次ページデータの先読み
- [ ] キャッシュ戦略: 訪問済みページの高速復元

### UX向上

- [ ] アニメーション: ページ切り替え時のスムーズな遷移
- [ ] プログレスバー: 読み込み進捗の視覚化
- [ ] ショートカット: キーボードによる高速ナビゲーション
