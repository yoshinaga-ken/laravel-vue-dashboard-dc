# ユーザープロフィール画面機能仕様書

## 1. 概要

任意のユーザーのプロフィール情報を表示する画面です。認証済みユーザーが他のユーザーまたは自分自身のプロフィール情報を閲覧し、フォロー/アンフォロー等のソーシャル機能を利用できます。

## 2. 基本情報

- **URL**: `/users/{userId}`
- **アクセス権限**: 認証済みユーザー（Sanctum認証）
- **技術スタック**: Vue 3 + TypeScript, GraphQL, Element Plus, Tailwind CSS
- **レスポンシブ対応**: PC・タブレット・モバイル対応

## 3. 機能概要

### 3.1 表示情報

#### ユーザー基本情報

- プロフィール写真（アバター表示）
- ユーザー名
- メールアドレス
- 登録日・最終更新日

#### フォロー情報

- フォロワー数・フォロー中数
- フォロワー一覧（一部表示・展開可能）
- フォロー中一覧（一部表示・展開可能）

#### 投稿記事情報

- 記事総数
- 最新記事一覧（タイトル・タグ表示）
- 記事詳細リンク・タグ検索リンク

#### チーム情報

- 所有チーム・参加チーム一覧
- 現在のチーム情報

### 3.2 ユーザーアクション

#### フォロー機能

- フォロー/アンフォローボタン（他ユーザーの場合）
- リアルタイムでのフォロー状態更新

#### プロフィール編集

- 自分のプロフィールの場合のみ編集ページリンク表示

#### ナビゲーション

- 記事詳細ページへの遷移
- タグ検索ページへの遷移
- チーム詳細ページへの遷移
- ユーザー記事一覧ページへの遷移

## 4. 技術仕様

### 4.1 データ取得

#### GraphQLクエリ

- **クエリ名**: `GetUserProfile`
- **エンドポイント**: GraphQL API (`user(id: ID!)`)
- **通信方式**: Vue Apollo経由
- **認証**: Sanctum Guard適用

#### 取得データ構造

```typescript
{
  user: {
    id, name, email, current_team_id,
    profile_photo_path, profile_photo_url,
    created_at, updated_at,
    articles: { paginatorInfo, data[] },
    followers: { paginatorInfo, data[] },
    following: { paginatorInfo, data[] },
    ownedTeams[], teams[]
  }
}
```

### 4.2 コンポーネント構成

#### メインページコンポーネント

- **ファイル**: `/resources/js/Pages/Users/Show.vue`
- **レイアウト**: AppLayoutを使用
- **機能**: 各UIコンポーネントの統合・イベントハンドリング

#### UIコンポーネント群

- **UserBasicInfo.vue**: ユーザー基本情報表示
- **UserFollowInfo.vue**: フォロー情報表示・展開機能
- **UserArticlesList.vue**: ユーザー記事一覧表示
- **UserTeamsInfo.vue**: チーム情報表示
- **UserActionButtons.vue**: フォロー/アンフォローボタン

#### Composables

- **useUserProfile.ts**: GraphQLクエリ・データ管理
- **useUserFollow.ts**: フォロー/アンフォロー機能

### 4.3 APIエンドポイント

#### GraphQL

- **Query**: `user(id: ID!)`
- **認証**: `@guard(with: ["sanctum"])`

#### REST API（フォロー機能）

- **フォロー**: `PUT /api/users/{user}/follow`
- **アンフォロー**: `DELETE /api/users/{user}/unfollow`

## 5. UI/UXデザイン

### 5.1 レイアウト構成

```text
+----------------------------------+
|        ヘッダー(AppLayout)        |
+----------------------------------+
| ユーザー基本情報 | アクションボタン |
+----------------------------------+
|         フォロー情報セクション      |
+----------------------------------+
|  投稿記事一覧   |   チーム情報      |
+----------------------------------+
```

### 5.2 デザインシステム

#### UIライブラリ

- **Element Plus**: ElCard, ElAvatar, ElButton, ElTag, ElDivider等
- **Tailwind CSS**: レスポンシブデザイン・ダークモード対応

#### レスポンシブブレークポイント

- **モバイル**: `xs` (< 640px)
- **タブレット**: `lg` (≥ 1024px)
- **デスクトップ**: `lg` (≥ 1024px)

### 5.3 ユーザビリティ

#### ローディング・エラー表示

- データ取得中のローディングアニメーション
- ネットワークエラー・認証エラーの適切な表示
- 再試行ボタン提供

#### インタラクション

- フォロー状態の即座反映
- 展開可能なフォロー一覧
- 記事・チーム・タグへのナビゲーション

## 6. セキュリティ・パフォーマンス

### 6.1 セキュリティ

- **認証**: Sanctum認証必須
- **認可**: GraphQL Guard適用
- **データ可視性**: 認証済みユーザー間で相互閲覧可能

### 6.2 パフォーマンス

- **GraphQL最適化**: 必要フィールドのみ選択取得
- **キャッシュ戦略**: `cache-and-network`ポリシー
- **ペジネーション**: 記事・フォロー情報の適切な分割

## 7. Storybookサポート

### 7.1 実装状況

- 各UIコンポーネントのStorybookストーリー実装済み
- Interaction tests実装によるE2E的テスト自動化
- 複数のストーリーバリエーション（Default, Loading, Error等）

### 7.2 Storybookアクセス

- **開発環境**: `http://localhost:6006`
- **コンポーネントパス**: `stories/components/users/`

## 8. テスト仕様

### 8.1 実装済みテスト

- **Storybookテスト**: 各コンポーネントのInteraction tests
- **TypeScript**: 厳密な型定義・エラーハンドリング

### 8.2 今後のテスト拡張

- **単体テスト**: Vitestによるコンポーネントテスト
- **統合テスト**: GraphQLクエリのintegration test
- **E2Eテスト**: Playwrightによる主要シナリオテスト

## 9. 運用・保守

### 9.1 ログ・モニタリング

- GraphQLエラーの適切なログ出力
- ネットワークエラーの監視
- フォロー機能のAPI呼び出し監視

### 9.2 パフォーマンス監視

- GraphQLクエリのレスポンス時間
- コンポーネントのレンダリング時間
- モバイル端末での表示性能

## 10. 今後の拡張計画

### 10.1 機能拡張

- プロフィール編集機能の本格実装
- 高度なフォロー管理（詳細一覧・検索）
- プライバシー設定（公開範囲制御）
- リアルタイム通知機能

### 10.2 技術的改善

- 無限スクロール対応
- より詳細なエラーハンドリング
- パフォーマンス最適化
- アクセシビリティ対応強化

## 11. 関連ドキュメント

- [機能設計書](/.kiro-x/design/2-user-profile-ユーザープロフィール画面の新規作成-design.md)
- [実装タスク一覧](/.kiro-x/tasks/)
- [GraphQL API仕様](https://deepwiki.com/yoshinaga-ken/laravel-vue-dashboard-dc)
- [Jetstream認証仕様](/doc/system/team-spec-jetstream.md)
