# ユーザープロフィール編集機能システム仕様書

## 概要

本システムは、ユーザープロフィール情報を編集する機能を提供します。ユーザーは自分のプロフィール情報（名前、メールアドレス）を編集でき、さらに自分の記事一覧を表示し、記事のタイトルとタグを編集できます。GraphQLを使用したモダンなAPI設計により、効率的なデータ更新を実現しています。

**最終更新**: 2026年1月（ユーザープロフィール編集機能の実装完了）
**対象バージョン**: Laravel 12 + Vue 3 + Inertia.js + GraphQL + Element Plus

## システム構成

### 基本アーキテクチャ

- **バックエンド**: Laravel 12 + PHP 8.2+
- **フロントエンド**: Vue 3 + Inertia.js + Element Plus
- **スタイリング**: Tailwind CSS
- **データベース**: MariaDB
- **通信方式**: GraphQL（Lighthouse）
- **認証**: Laravel Sanctum

### データベース設計

#### users テーブル

```sql
- id (Primary Key)
- name (ユーザー名)
- email (メールアドレス)
- email_verified_at (メール認証日時)
- password (パスワード)
- profile_photo_path (プロフィール写真パス)
- profile_photo_url (プロフィール写真URL)
- current_team_id (現在のチームID)
- created_at, updated_at
```

#### articles テーブル

```sql
- id (Primary Key)
- user_id (Foreign Key)
- title (タイトル)
- body (本文)
- created_at, updated_at
```

#### article_tag テーブル（中間テーブル）

```sql
- id (Primary Key)
- article_id (Foreign Key)
- tag_id (Foreign Key)
- created_at, updated_at
```

#### tags テーブル

```sql
- id (Primary Key)
- name (タグ名)
- created_at, updated_at
```

## ユーザープロフィール編集機能

### 画面概要

**URL**: `/users/{userId}/edit`
**ルート名**: `users.edit`
**認証**: 必須（Sanctum認証）
**認可**: 自分のプロフィールのみ編集可能

### 機能詳細

#### プロフィール情報編集

##### 編集可能項目

- **名前** (name): 必須、最大255文字
- **メールアドレス** (email): 必須、メール形式、最大255文字、ユニーク制約

##### 編集不可項目

- **プロフィール写真**: プロフィール設定ページ（`/user/profile`）から変更
- **パスワード**: 別途パスワード変更機能で対応
- **その他のユーザー情報**: 現在は編集不可

#### 記事一覧編集

##### 表示項目

- **No**: 記事の連番（更新日付降順でソート）
- **Title**: 記事タイトル（インライン編集可能）
- **Tags**: 記事タグ（タグ編集コンポーネントで編集可能）
- **Date**: 更新日時（YYYY/MM/DD HH:II形式）

##### 編集機能

- **タイトル編集**: インライン編集（フォーカスアウト時またはEnterキーで保存）
- **タグ編集**: ArticleTagsFormコンポーネントを使用したタグ追加・削除

### UI設計

#### レイアウト構成

```text
┌─ AppLayout ────────────────────────────────┐
│ ┌─ ヘッダーセクション ──────────────────────┐ │
│ │ ユーザープロフィール編集、ナビゲーション    │ │
│ └──────────────────────────────────────────┘ │
│ ┌─ メインコンテンツ ────────────────────────┐ │
│ │ ┌─プロフィール情報編集セクション─┐        │ │
│ │ │ プロフィール写真表示            │        │ │
│ │ │ 名前入力フィールド              │        │ │
│ │ │ メールアドレス入力フィールド     │        │ │
│ │ │ 保存・リセットボタン             │        │ │
│ │ └───────────────────────────────┘        │ │
│ │ ┌─記事一覧編集セクション─────────┐        │ │
│ │ │ 記事一覧テーブル                │        │ │
│ │ │ - No, Title, Tags, Date        │        │ │
│ │ └───────────────────────────────┘        │ │
│ └──────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

#### レスポンシブ対応

- **PC版**: 全幅レイアウト、セクション縦並び
- **SP版**: 全幅レイアウト、セクション縦並び
- **ブレイクポイント**: 768px（Tailwind CSS `md:`）

#### UIコンポーネント

- **Element Plus**: `ElForm`, `ElFormItem`, `ElInput`, `ElButton`, `ElAvatar`, `ElTable`, `ElTableColumn`, `ElMessage`
- **カスタムコンポーネント**: `UpdateUserProfileForm`, `UserArticlesListForm`, `ArticleTagsForm`
- **フォームバリデーション**: Element Plusのリアルタイムバリデーション

## バックエンド実装

### GraphQLスキーマ

#### updateUser Mutation

**ファイル**: `graphql/schema.graphql`

```graphql
type Mutation {
  updateUser(
    id: ID! @whereKey @rules(apply: ["required", "exists:users,id"])
    input: UpdateUserInput! @spread
  ): User!
    @field(resolver: "App\\GraphQL\\Mutations\\Users\\UserMutation@update")
    @canFind(ability: "update", find: "id")
}

input UpdateUserInput {
  name: String
  email: String
}
```

#### updateArticle Mutation

**ファイル**: `graphql/schema.graphql`

```graphql
type Mutation {
  updateArticle(
    id: ID! @whereKey @rules(apply: ["required", "exists:articles,id"])
    input: UpdateArticleInput! @spread
  ): Article! @update @canFind(ability: "update", find: "id")
}

input UpdateArticleInput {
  title: String
  body: String
}
```

#### syncTagsByNameArticle Mutation

**ファイル**: `graphql/schema.graphql`

```graphql
type Mutation {
  syncTagsByNameArticle(id: ID!, tagNames: [String!]! @rename(attribute: "tags")): Article
    @canFind(ability: "update", find: "id")
    @field(resolver: "App\\GraphQL\\Mutations\\Articles\\ArticleMutation@syncTagsByName")
}
```

### GraphQL Mutation実装

#### UserMutation

**ファイル**: `app/GraphQL/Mutations/Users/UserMutation.php`

##### updateメソッド

```php
public function update(mixed $rootValue, array $args, GraphQLContext $context): User
```

**処理フロー**:

1. ユーザー存在確認（`User::findOrFail($args['id'])`）
2. 認証チェック（`Auth::user()`）
3. 認可チェック（自分のプロフィールのみ編集可能）
4. バリデーション実行
5. メールアドレス変更時の特別処理（`MustVerifyEmail`インターフェース対応）
6. ユーザー情報更新
7. 更新されたユーザー情報を返却

**バリデーションルール**:

- `name`: nullable, string, max:255
- `email`: nullable, email, max:255, unique:users,email（自分を除外）

**認可チェック**:

- 認証済みユーザーのみ実行可能
- 自分のプロフィールのみ編集可能（`$user->id !== $currentUser->id` の場合エラー）

**メールアドレス変更時の処理**:

- メールアドレスが変更された場合、`email_verified_at`をnullに設定
- メール認証通知を送信（`sendEmailVerificationNotification()`）

### ルーティング

**ファイル**: `routes/web.php`

```php
Route::resource('/users', UserController::class);
```

**ルート定義**:

- **編集画面**: `GET /users/{user}/edit` → `UserController@edit`
- **更新処理**: GraphQL Mutation経由（`updateUser`）

**ミドルウェア**:

- `auth:sanctum`: Sanctum認証必須
- `verified`: メール認証済み（設定による）

## フロントエンド実装

### メインコンポーネント

#### Pages/Users/Edit.vue

- **役割**: ユーザープロフィール編集画面のメインコンポーネント
- **技術**: Vue 3 Composition API + TypeScript
- **状態管理**: GraphQL Apollo Client
- **機能**: プロフィール情報編集フォーム、記事一覧編集フォームの統合

**Props**:

```typescript
{
  userId: number
}
```

**主要機能**:

- ユーザープロフィール情報の取得（`useUserProfile`）
- エラーハンドリング
- 子コンポーネントの統合

#### Components/Users/UpdateUserProfileForm.vue

- **役割**: ユーザープロフィール情報編集フォーム
- **デザイン**: Element Plus + Tailwind CSS
- **機能**: 名前・メールアドレスの編集、バリデーション、更新処理

**Props**:

```typescript
{
  userId: string | number
}
```

**Emits**:

```typescript
{
  updated: [user: User]
}
```

**主要機能**:

- フォームデータ管理（`ref<UpdateUserInput>`）
- バリデーションルール定義
- GraphQL Mutation実行（`useUpdateUser`）
- エラーハンドリング
- 成功時のメッセージ表示

**バリデーションルール**:

- `name`: 必須、最大255文字
- `email`: 必須、メール形式、最大255文字

#### Components/Users/UserArticlesListForm.vue

- **役割**: ユーザーの記事一覧を表示・編集するフォーム
- **デザイン**: Element Plus + Tailwind CSS
- **機能**: 記事一覧表示、タイトル編集、タグ編集

**Props**:

```typescript
{
  userId: string | number
}
```

**主要機能**:

- 記事一覧取得（GraphQL Query: `GetUserArticles`）
- タイトルインライン編集
- タグ編集（`ArticleTagsForm`コンポーネント使用）
- 更新日時表示（YYYY/MM/DD HH:II形式）
- 更新日付降順ソート

**GraphQL Query**:

```graphql
query GetUserArticles($userId: ID!) {
  user(id: $userId) {
    articles(first: 100, page: 1) {
      data {
        id
        title
        body
        updated_at
        tags {
          id
          name
        }
      }
    }
  }
}
```

**GraphQL Mutation**:

- `updateArticle`: タイトル更新
- `syncTagsByNameArticle`: タグ同期

#### Components/ArticleTagsForm.vue

- **役割**: 記事のタグを編集するフォームコンポーネント
- **デザイン**: Element Plus + Tailwind CSS
- **機能**: タグ追加・削除、タグ名による同期

**Props**:

```typescript
{
  article_id: number
  initialTags?: Tag[]
  skipQuery?: boolean
}
```

**Emits**:

```typescript
{
  tagsUpdated: [tags: Tag[]]
}
```

**主要機能**:

- タグ一覧表示（`ElTextTagsInput`コンポーネント使用）
- タグ追加・削除
- GraphQL Mutation実行（`syncTagsByNameArticle`）
- エラーハンドリング

### Composables

#### useUserProfile.ts

**ファイル**: `resources/js/Composables/useUserProfile.ts`

**主要機能**:

- GraphQL Query実行（`GET_USER_PROFILE`）
- ユーザーデータ管理
- 計算プロパティ（`isOwnProfile`, `followersCount`, `followingCount`等）
- データ再取得（`refetch`）

#### useUpdateUser.ts

**ファイル**: `resources/js/Composables/useUpdateUser.ts`

**主要機能**:

- GraphQL Mutation実行（`UPDATE_USER`）
- 更新状態管理（`isUpdating`, `error`）
- エラーハンドリング

**型定義**:

```typescript
export interface UpdateUserInput {
  name?: string
  email?: string
}
```

### 型安全性

**ファイル**: `resources/js/Types/types-graphql.d.ts`

**主要型定義**:

- `User`: ユーザー情報型
- `Article`: 記事情報型
- `Tag`: タグ情報型
- `UpdateUserInput`: ユーザー更新入力型
- `UpdateArticleInput`: 記事更新入力型

## セキュリティ仕様

### データ保護

- **入力値検証**: GraphQLスキーマレベルとバリデーションルールによる厳密な検証
- **SQLインジェクション対策**: Eloquent ORM使用
- **XSS対策**: Vue.js の自動エスケープ
- **CSRF保護**: GraphQLエンドポイントはCSRF保護不要（Sanctum認証による）

### アクセス制御

#### 認証

- **Sanctum認証**: すべてのGraphQL Mutationで`@guard(with: ["sanctum"])`適用
- **メール認証**: 設定により`verified`ミドルウェア適用可能

#### 認可

- **プロフィール編集**: 自分のプロフィールのみ編集可能（`UserMutation@update`で実装）
- **記事編集**: 自分の記事のみ編集可能（`@canFind(ability: "update", find: "id")`で実装）
- **ポリシー**: Laravel Policyによる詳細な認可制御

### バリデーション

#### クライアントサイド

- Element Plusフォームバリデーション
- リアルタイムバリデーション（`trigger: 'blur'`）

#### サーバーサイド

- GraphQLスキーマレベルバリデーション（`@rules`）
- Laravel Validatorによる追加バリデーション
- データベース制約（ユニーク制約等）

## パフォーマンス仕様

### データベース最適化

- **Eager Loading**: 記事一覧取得時のN+1問題回避
- **インデックス活用**: 検索性能向上
- **クエリ最適化**: 必要なフィールドのみ取得

### フロントエンド最適化

- **GraphQL最適化**: 必要フィールドのみ選択取得
- **キャッシュ戦略**: `cache-and-network`ポリシー
- **コンポーネント分割**: 保守性・パフォーマンス向上
- **レスポンシブデザイン**: デバイス別最適化

### データ更新最適化

- **部分更新**: 変更されたフィールドのみ更新
- **バッチ処理**: 複数記事の一括更新対応（将来実装予定）
- **リアルタイム更新**: 更新後の自動再取得（`refetch`）

## エラーハンドリング

### バックエンド

1. **認証エラー**
   - 認証されていないユーザー: `認証されていないユーザーです`
   - 認可エラー: `自分のプロフィールのみ編集できます`

2. **バリデーションエラー**
   - 詳細なエラーメッセージ
   - フィールド別エラー表示

3. **データベースエラー**
   - ログ出力
   - ユーザーフレンドリーなエラーメッセージ

### フロントエンド

- **バリデーションエラー**: Element Plusフォームによるリアルタイム表示
- **ネットワークエラー**: ElMessageによるエラーメッセージ表示
- **GraphQLエラー**: エラー状態の適切な表示
- **ローディング状態**: データ取得中・更新中のローディング表示

## テスト仕様

### バックエンドテスト

**ファイル**: `tests/Feature/GraphQL/UserMutationTest.php`

**テスト項目**:

- `updateUser mutation updates user name`: 名前更新テスト
- `updateUser mutation updates user email`: メールアドレス更新テスト
- `updateUser mutation updates both name and email`: 名前とメールアドレスの同時更新テスト
- `updateUser mutation requires ownership`: 認可チェックテスト（他人のプロフィールは更新不可）

**テストフレームワーク**: Pest PHP

### フロントエンドテスト

**実装状況**: Playwright による E2E テスト実装済み

**E2E テストケース**（`e2e/tests/users/user-edit.spec.ts`）

- ユーザー情報更新（名前・メールアドレス）の検証
  - GraphQL `updateUser` ミューテーションが成功し、リロード後も値が保持されることを確認
- 記事編集（タイトル・タグ）の検証
  - 記事タイトルのインライン編集（Enter/フォーカスアウトによる保存）
  - タグ追加・削除（`syncTagsByNameArticle` ミューテーション）と反映確認
- 前提: 認可のあるユーザー（テスト環境では userId=4）で実行

**今後の拡張予定**:

- コンポーネント単体テスト（Vitest）
- GraphQL クエリ・Mutation の統合テスト

## 運用・保守

### ログ・モニタリング

- GraphQLエラーの適切なログ出力
- ネットワークエラーの監視
- ユーザー更新操作の監視
- 記事更新操作の監視

### パフォーマンス監視

- GraphQL Mutationのレスポンス時間
- コンポーネントのレンダリング時間
- モバイル端末での表示性能

## 今後の拡張計画

### 機能拡張

1. **プロフィール写真アップロード機能**
   - プロフィール写真の直接アップロード
   - 画像リサイズ・最適化

2. **記事本文編集機能**
   - リッチテキストエディタ統合
   - マークダウンエディタ統合

3. **一括編集機能**
   - 複数記事の一括タグ編集
   - 複数記事の一括タイトル編集

4. **履歴管理機能**
   - 編集履歴の表示
   - 変更点の比較
   - ロールバック機能

5. **高度なバリデーション**
   - カスタムバリデーションルール
   - リアルタイムバリデーション強化

### 技術的改善

- **リアルタイム保存**: 自動保存機能
- **オフライン対応**: PWA機能
- **バックアップ機能**: データの自動バックアップ
- **リアルタイム更新**: WebSocket統合
- **パフォーマンス最適化**: キャッシュ機能強化
- **アクセシビリティ対応**: ARIA属性の追加、キーボード操作対応

## 関連ドキュメント

- [ユーザープロフィール画面機能仕様書](/doc/system/user-profile.md)
- [機能設計書](/.kiro-x/design/2-user-profile-ユーザープロフィール画面の新規作成-design.md)
- [実装タスク一覧](/.kiro-x/tasks/)
- [GraphQL API仕様](https://deepwiki.com/yoshinaga-ken/laravel-vue-dashboard-dc)
- [Jetstream認証仕様](/doc/system/team-spec-jetstream.md)
- [プレイヤープロフィール機能システム仕様書](/doc/system/player-profile.md)（参考）
