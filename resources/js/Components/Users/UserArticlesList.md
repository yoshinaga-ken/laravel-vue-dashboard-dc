# UserArticlesList.vue コンポーネント仕様書

## 概要

ユーザーの投稿記事一覧を表示するUIコンポーネントです。記事の統計情報、最新記事リスト、タグ表示、各種ナビゲーション機能を提供します。

## 機能

### 表示項目

- **記事総数**: 統計カード形式での投稿記事数表示
- **最新記事一覧**: 記事タイトル・内容プレビュー・タグのリスト表示
- **タグ表示**: 各記事に関連付けられたタグの視覚的表示
- **記事プレビュー**: 記事内容の適切な長さでのプレビュー表示

### インタラクション機能

- **記事詳細遷移**: 記事タイトルクリックで詳細ページへ遷移
- **タグ検索**: タグクリックでタグ検索ページへ遷移
- **全記事表示**: 「すべて見る」ボタンでユーザー記事一覧ページへ遷移

## Props

```typescript
interface Props {
  articlesCount: number     // 記事総数（必須）
  articles: Article[]       // 記事リスト（必須）
  loading?: boolean         // ローディング状態（オプション）
}
```

## Events

```typescript
interface Emits {
  'article-click': [articleId: string]    // 記事クリック時
  'tag-click': [tagName: string]          // タグクリック時
  'view-all-click': []                    // 全記事表示クリック時
}
```

## 技術仕様

### 使用コンポーネント

- **ElCard**: メインコンテナ
- **ElTag**: 記事タグ表示
- **ElButton**: 「すべて見る」ボタン
- **ElEmpty**: 記事がない場合の空状態表示

## Storybook

- **開発環境URL**: `http://localhost:6006/?path=/docs/users-userarticleslist--docs`
- **ストーリーバリエーション**: Default, Loading, NoArticles, ManyArticles
- **Interaction tests**: 記事・タグクリックの自動テスト実装済み

## 関連コンポーネント

- **UserBasicInfo.vue**: ユーザー基本情報表示
- **Pages/Users/Show.vue**: メインページで使用
