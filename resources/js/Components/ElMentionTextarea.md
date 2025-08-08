# ElMentionTextarea コンポーネント

Element PlusのElMentionコンポーネントをラッピングした、@ユーザーメンションと#タグ補完機能付きテキストエリアコンポーネントです。

## 機能

- **@ユーザーメンション**: `@`を入力するとGraphQLでユーザー検索が実行され、候補が表示されます
- **#タグ補完**: `#`を入力するとGraphQLでタグ検索が実行され、候補が表示されます
- **デバウンス検索**: 300ms の遅延でクライアントサイドフィルタリングを最適化
- **リアルタイム検索**: 入力に応じて候補がリアルタイムで更新されます
- **GraphQL統合**: 初回ロード時にすべてのユーザーとタグを取得し、クライアントサイドでフィルタリング

## 使用方法

```vue
<template>
  <ElMentionTextarea
    v-model="content"
    :rows="6"
    :disabled="false"
    placeholder="記事の内容を入力してください。@でユーザーメンション、#でタグが利用できます。"
    class="mt-1 block w-full"
  />
</template>

<script setup>
import ElMentionTextarea from '@/Components/ElMentionTextarea.vue'
import { ref } from 'vue'

const content = ref('')
</script>
```

## Props

| プロパティ    | 型      | デフォルト                                      | 説明                     |
| ------------- | ------- | ----------------------------------------------- | ------------------------ |
| `placeholder` | String  | `'input @ to mention people, # to mention tag'` | プレースホルダーテキスト |
| `disabled`    | Boolean | `false`                                         | 無効状態                 |
| `rows`        | Number  | `4`                                             | テキストエリアの行数     |

## Events

- `@search`: メンション検索時に発火 (Element Plus内部で処理)

## v-model

- `modelValue` (String): テキストエリアの内容をバインディング

## GraphQL API統合

このコンポーネントは以下のGraphQLクエリを使用してデータを取得します：

### ユーザー取得クエリ

```graphql
query FilterUsers($input: FilterUserInput) {
  users(input: $input, first: 512) {
    data {
      name
      email
    }
    paginatorInfo {
      count
      total
    }
  }
}
```

### タグ取得クエリ

```graphql
query FilterTags($input: FilterTagInput) {
  tags(input: $input, first: 512) {
    data {
      name
    }
  }
}
```

### データフロー

#### キャッシュ戦略（データ件数 ≤ 512）

1. **初回ロード時**: 空の条件でユーザーとタグを全件取得
2. **件数判定**: `paginatorInfo.total` ≤ 512 の場合、キャッシュモードに設定
3. **メンション入力時**: 取得済みデータをクライアントサイドでフィルタリング
4. **候補表示**: Element Plusが自動的にプレフィックス（@、#）を追加して表示

#### 動的検索戦略（データ件数 > 512）

1. **初回ロード時**: 空の条件でデータを取得し件数をチェック
2. **件数判定**: `paginatorInfo.total` > 512 の場合、動的検索モードに設定
3. **メンション入力時**: 入力パターンでGraphQLクエリを再実行
4. **候補表示**: 検索結果をリアルタイムで表示

## 実装済み機能

✅ Element Plus ElMentionコンポーネントのラッピング
✅ GraphQL API統合（ユーザー・タグ取得）
✅ @ユーザーメンション機能
✅ #タグ補完機能
✅ プレフィックス自動認識（`['@', '#']`）
✅ デバウンス検索（300ms）
✅ ハイブリッド検索戦略（キャッシュ vs 動的検索）
✅ 自動最適化（データ量に応じた戦略切り替え）
✅ CreateArticleFormでの使用
✅ UpdateArticleFormでの使用
✅ v-modelサポート
✅ TypeScript型安全性
✅ レスポンシブ対応

## アーキテクチャ

### コンポーネント構造

```mermaid
ElMentionTextarea
├── GraphQLクエリ (useQuery)
│   ├── FilterUsers
│   └── FilterTags
├── リアクティブデータ
│   ├── availableUsers (computed)
│   └── availableTags (computed)
├── 検索ハンドラー
│   ├── handleSearch(pattern, prefix)
│   └── filterAndMapItems(items, pattern)
└── Element Plus ElMention
    ├── prefix: ['@', '#']
    ├── type: 'textarea'
    └── @search イベント
```

### パフォーマンス最適化

- **ハイブリッド検索戦略**: データ量に応じて自動的に最適な検索方法を選択
  - **512件以下**: キャッシュ戦略（初回取得 + クライアントサイドフィルタリング）
  - **512件超過**: 動的検索戦略（リアルタイムGraphQLクエリ）
- **デバウンス**: 高速タイピング時の処理負荷を軽減（300ms）
- **Computed プロパティ**: データ変換の効率化
- **自動戦略切り替え**: 初回ロード時にデータ量を判定して最適な戦略を選択

## 今後の改善点

### UI/UX機能

- [ ] ユーザーアバターの表示サポート
- [ ] カスタムスタイリングオプション
- [ ] キーボードナビゲーションの改善
- [ ] アクセシビリティの改善

### Markdown機能

- [ ] Markdown記法の入力補助
- [ ] シンタックスハイライト機能
- [ ] リアルタイムMarkdownプレビュー
- [ ] Markdown形式の入出力サポート

### メンション機能強化

- [ ] メンション候補のプレビュー機能
- [ ] メンション部分のインタラクティブ表示（`cursor: pointer`）
- [ ] Ctrl+クリックでユーザー・タグページへジャンプ機能
- [ ] メンション部分のホバー時詳細情報表示

### パフォーマンス・スケーラビリティ

- [ ] 大量データ対応（仮想スクロール）
- [ ] カスタムプレフィックスのサポート
