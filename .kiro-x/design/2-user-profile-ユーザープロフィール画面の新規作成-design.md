# ユーザープロフィール画面の新規作成 - 機能仕様書

## 1. 概要

任意のユーザーのプロフィール情報を表示する画面を新規作成する。現在はテスト実装として基本的なGraphQLでのユーザーデータ取得とJSONデータ表示のみが実装されているため、一般的なユーザープロフィール画面として適切な情報表示とUI/UXを提供する。

## 2. 画面仕様

### 2.1 基本情報

- **画面URL**: `http://127.0.0.1:8000/users/{userId}`
- **アクセス権限**: 認証済みユーザー（Sanctum認証）
- **レスポンシブ対応**: PC・タブレット・モバイル対応

### 2.2 表示データソース

- **主要データ取得**: GraphQL (`user(id: ID!)`)
- **通信方式**: Vue Apollo経由のGraphQL通信のみ（Inertia.jsのprops経由は使用しない）

## 3. 表示項目仕様

### 3.1 ユーザー基本情報セクション

- **プロフィール写真**: `profile_photo_url`（アバター表示）
- **ユーザー名**: `name`
- **メールアドレス**: `email`（表示可否は要検討）
- **登録日**: `created_at`
- **最終更新日**: `updated_at`

### 3.2 フォロー情報セクション

- **フォロワー数**: `followers.paginatorInfo.total`
- **フォロー中数**: `following.paginatorInfo.total`
- **フォロワー一覧**: `followers.data[].name`（一部表示、詳細は別途展開可能）
- **フォロー中一覧**: `following.data[].name`（一部表示、詳細は別途展開可能）

### 3.3 投稿記事セクション

- **記事数**: `articles.paginatorInfo.total`
- **最新記事一覧**: `articles.data[]`（タイトル、タグ表示）
- **記事詳細リンク**: 各記事への遷移可能

### 3.4 チーム情報セクション

- **所有チーム**: `ownedTeams[].name`
- **参加チーム**: `teams[].name`
- **現在のチーム**: `current_team_id`に基づく表示

### 3.5 ユーザーアクションセクション（ログインユーザーとの関係性）

- **フォロー/アンフォローボタン**: 既存のAPI（PUT/DELETE `/api/users/{user}/follow`, `/api/users/{user}/unfollow`）を使用
- **自分のプロフィールの場合**: 編集ページへのリンク表示

## 4. UI/UXデザイン仕様

### 4.1 レイアウト構成

```
+----------------------------------+
|        ヘッダー(AppLayout)        |
+----------------------------------+
|  ユーザー基本情報（アバター付き）   |
+----------------------------------+
|  フォロー情報 | ユーザーアクション  |
+----------------------------------+
|        投稿記事一覧セクション      |
+----------------------------------+
|        チーム情報セクション        |
+----------------------------------+
```

### 4.2 UIコンポーネント方針

- **基本UIライブラリ**: Element Plus使用
- **コンポーネント分割**: 機能単位でコンポーネント分割
  - `UserBasicInfo.vue`: ユーザー基本情報表示
  - `UserFollowInfo.vue`: フォロー情報表示
  - `UserArticlesList.vue`: ユーザー記事一覧表示
  - `UserTeamsInfo.vue`: チーム情報表示
  - `UserActionButtons.vue`: フォロー/アンフォローボタン

### 4.3 スタイリング

- **デザインシステム**: Tailwind CSS使用
- **ダークモード対応**: 既存の実装に合わせて対応
- **Element Plusコンポーネント使用例**:
  - `ElAvatar`: プロフィール写真表示
  - `ElCard`: 各セクションのカード表示
  - `ElButton`: アクションボタン
  - `ElTag`: 記事タグ表示
  - `ElDivider`: セクション区切り

## 5. 既存実装との関係性

### 5.1 参考実装

- **ログインユーザープロフィール画面**: `/resources/js/Pages/Profile/Show.vue`
  - レイアウト構成の参考
  - フォロー情報表示の参考
- **現在のテスト実装**: `/resources/js/Pages/Users/Show.vue`
  - GraphQLクエリ構造の参考
  - データ取得パターンの参考

### 5.2 再利用可能コンポーネント

- **ArticleTagsForm**: 既存コンポーネントだが、表示のみの場合は新規コンポーネントが必要
- **AppLayout**: 既存レイアウトコンポーネントを継続使用

## 6. GraphQL API仕様

### 6.1 使用クエリ

```graphql
query GetUserProfile($id: ID!) {
  user(id: $id) {
    id
    name
    email
    current_team_id
    profile_photo_path
    profile_photo_url
    created_at
    updated_at
    articles(first: 10, page: 1) {
      paginatorInfo {
        count
        total
        currentPage
        lastPage
      }
      data {
        id
        title
        body
        tags {
          id
          name
        }
      }
    }
    followers(first: 12, page: 1) {
      paginatorInfo {
        count
        total
      }
      data {
        id
        name
        profile_photo_url
      }
    }
    following(first: 12, page: 1) {
      paginatorInfo {
        count
        total
      }
      data {
        id
        name
        profile_photo_url
      }
    }
    ownedTeams {
      id
      name
      personal_team
    }
    teams {
      id
      name
      personal_team
    }
  }
}
```

### 6.2 認証・認可

- **GraphQL Guard**: `@guard(with: ["sanctum"])`により認証済みユーザーのみアクセス可能
- **データ可視性**: プロフィール情報は認証済みユーザー間で相互閲覧可能

## 7. 技術仕様

### 7.1 フロントエンド技術スタック

- **Vue 3 Composition API**: TypeScript使用
- **Vue Apollo**: GraphQL通信
- **Element Plus**: UIコンポーネントライブラリ
- **Tailwind CSS**: スタイリング
- **Inertia.js**: ページルーティング（propsは使用しない）

### 7.2 バックエンド技術スタック

- **Laravel**: フレームワーク
- **Lighthouse**: GraphQL実装
- **Sanctum**: API認証
- **既存API**: フォロー/アンフォロー機能

## 8. パフォーマンス考慮事項

### 8.1 データ取得最適化

- **GraphQLフィールド選択**: 必要なフィールドのみ取得
- **ペジネーション**: 記事・フォロー情報は適切なページネーション実装
- **キャッシュ戦略**: Vue Apolloのキャッシュ機能活用

### 8.2 ユーザビリティ

- **ローディング状態**: データ取得中の適切なローディング表示
- **エラーハンドリング**: ネットワークエラー・認証エラーの適切な表示
- **レスポンシブ対応**: モバイル端末での適切な表示

## 9. 今後の拡張可能性

### 9.1 機能拡張予定

- **プロフィール編集機能**: 別途実装予定
- **高度なフォロー管理**: フォロー・フォロワーの詳細一覧画面
- **記事詳細表示**: 記事一覧からの詳細遷移
- **プライバシー設定**: プロフィール情報の公開範囲設定

### 9.2 技術的拡張

- **リアルタイム更新**: フォロー状態の即座反映
- **無限スクロール**: 記事・フォロー一覧の無限スクロール対応
- **検索機能**: ユーザー検索・記事検索機能

## 10. 既存システムへの影響

### 10.1 影響のないこと

- **既存認証システム**: Jetstream・Sanctumの変更なし
- **既存GraphQLスキーマ**: スキーマ変更は不要
- **既存ルーティング**: UserController::showは既存のまま使用

### 10.2 新規追加要素

- **新規Vueコンポーネント**: 複数の機能別コンポーネント追加
- **新規Composables**: GraphQL関連の共通ロジック（必要に応じて）
- **CSS追加**: 新規UI要素のスタイリング

## 11. 品質保証

### 11.1 テスト方針

- **単体テスト**: 各Vueコンポーネントのunit test（Vitest）
- **統合テスト**: GraphQLクエリのintegration test
- **E2Eテスト**: 主要ユーザーシナリオのPlaywright test

### 11.2 コードクオリティ

- **TypeScript**: 厳密な型定義実装
- **ESLint**: コーディング規約準拠
- **Vue3ガイドライン**: プロジェクトの既存ガイドライン準拠
