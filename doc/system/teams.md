# チーム機能システム仕様書

## 概要

本システムは、Laravel Jetstreamをベースとしたチーム管理機能を提供します。ユーザーは複数のチームに所属し、各チーム内で異なる役割を持つことができます。チーム一覧画面により、所属・所有するチームの包括的な管理と操作が可能です。

**最終更新**: 2025年8月13日
**対象バージョン**: Laravel 12 + Jetstream + Vue 3 + Inertia.js

## システム構成

### 基本アーキテクチャ

- **バックエンド**: Laravel 12 + Jetstream
- **フロントエンド**: Vue 3 + Inertia.js + Element Plus
- **スタイリング**: Tailwind CSS
- **認証・認可**: Laravel Sanctum + Jetstream Policies

### データベース設計

#### teams テーブル

```sql
- id (Primary Key)
- user_id (Foreign Key: チームオーナー)
- name (チーム名)
- personal_team (boolean: 個人チームフラグ)
- created_at, updated_at
```

#### team_user テーブル（中間テーブル）

```sql
- id (Primary Key)
- team_id (Foreign Key)
- user_id (Foreign Key)
- role (nullable: ユーザー役割)
- created_at, updated_at
- unique(['team_id', 'user_id'])
```

#### team_invitations テーブル

```sql
- id (Primary Key)
- team_id (Foreign Key with cascadeOnDelete)
- email (招待対象メールアドレス)
- role (nullable: 招待時の役割)
- created_at, updated_at
- unique(['team_id', 'email'])
```

## チーム管理機能

### チームの種類

#### 1. 個人チーム（Personal Team）

- **特徴**: `personal_team = true`
- **作成時期**: ユーザー新規登録時に自動作成
- **チーム名**: `"{$user->name}'s Team"`
- **制限**: 削除不可（システム保護対象）
- **目的**: 個人用ワークスペース

#### 2. 通常チーム（Shared Team）

- **特徴**: `personal_team = false`
- **作成時期**: ユーザーが任意で作成
- **制限**: 削除可能（オーナーのみ）
- **目的**: チーム協業ワークスペース

### ユーザーとチームの関係

#### チームオーナー

- **定義**: `teams.user_id`で特定される作成者・所有者
- **権限**: チームの全権限（設定変更、メンバー管理、削除）
- **複数所有**: 一人で複数チームのオーナー可能
- **表示**: メンバー一覧には表示されない

#### チームメンバー

- **定義**: `team_user`中間テーブルで管理
- **権限**: `role`フィールドによる段階的権限
- **招待フロー**: 招待 → 承認 → メンバー登録

#### 招待システム

1. **招待送信**: オーナーが「Add Team Member」でメール招待
2. **承認待ち**: `team_invitations`テーブルに記録
3. **承認処理**: メール内「Accept Invitation」で承認
4. **メンバー登録**: `team_user`テーブルに移行

### 権限・役割システム

#### 役割定義（`app/Providers/JetstreamServiceProvider.php`）

- **Administrator**: `create`, `read`, `update`, `delete`
- **Editor**: `read`, `create`, `update`
- **Default**: `read`

#### 認可ポリシー（`app/Policies/TeamPolicy.php`）

- `viewAny()`: チーム一覧表示権限
- `view()`: 個別チーム表示権限（所属チームのみ）
- `update()`: チーム設定変更権限（オーナーのみ）
- `delete()`: チーム削除権限（オーナーのみ + 非個人チーム）

## チーム一覧機能

### 画面概要

**URL**: `/teams`
**ルート名**: `teams.index`
**認証**: 必須（auth:sanctum middleware）

### 表示データ

#### 対象チーム

- **所有チーム**: `$user->ownedTeams` - 自分がオーナーのチーム
- **所属チーム**: `$user->teams` - メンバーとして所属するチーム
- **統合取得**: `$user->allTeams()` - 重複除去済み統合リスト

#### チーム情報項目

| 項目         | 説明              | データソース                 |
| ------------ | ----------------- | ---------------------------- |
| チーム名     | team.name         | 基本カラム                   |
| チームタイプ | 個人/通常         | personal_team フラグ         |
| 所有者関係   | オーナー/メンバー | $user->ownsTeam($team)       |
| 現在チーム   | 選択中チーム      | $user->current_team_id       |
| メンバー数   | チームメンバー数  | withCount('users')           |
| 招待数       | 承認待ち数        | withCount('teamInvitations') |
| 権限情報     | 操作可能権限      | Gate::check()                |

### フィルタリング・検索機能

#### 検索条件

- **テキスト検索**: チーム名による部分一致検索
- **チームタイプ**: All / Personal / Shared / Current
- **メンバー数**: 1人 / 2-5人 / 6-10人 / 11人以上
- **並び替え**: 名前・作成日・メンバー数（昇順・降順）

#### ページネーション

- **デフォルト件数**: 12件/ページ
- **選択可能件数**: 6, 12, 24, 48件
- **ページ切り替え**: Element Plus Pagination コンポーネント

### UI設計

#### レイアウト構成

```text
┌─ AppLayout ────────────────────────────────┐
│ ┌─ フィルター・検索セクション ──────────────┐ │
│ │ TeamFilters.vue                          │ │
│ └──────────────────────────────────────────┘ │
│ ┌─ 結果情報表示セクション ──────────────────┐ │
│ │ TeamResultsInfo.vue                      │ │
│ └──────────────────────────────────────────┘ │
│ ┌─ チーム一覧表示セクション ─────────────────┐ │
│ │ TeamCard.vue × N                         │ │
│ └──────────────────────────────────────────┘ │
│ ┌─ ページネーションセクション ──────────────┐ │
│ │ TeamPagination.vue                       │ │
│ └──────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

```
┌─ AppLayout ────────────────────────────────┐
│ ┌─ フィルター・検索セクション ──────────────┐ │
│ │ TeamFilters.vue                          │ │
│ └──────────────────────────────────────────┘ │
│ ┌─ 結果情報表示セクション ──────────────────┐ │
│ │ TeamResultsInfo.vue                      │ │
│ └──────────────────────────────────────────┘ │
│ ┌─ チーム一覧表示セクション ─────────────────┐ │
│ │ TeamCard.vue × N                         │ │
│ └──────────────────────────────────────────┘ │
│ ┌─ ページネーションセクション ──────────────┐ │
│ │ TeamPagination.vue                       │ │
│ └──────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

#### チームカード仕様

- **カードレイアウト**: グリッド形式（デスクトップ: 3列、タブレット: 2列、モバイル: 1列）
- **チーム情報**: アバター、名前、タイプ、統計情報
- **アクション**: 切り替え、設定、詳細表示
- **状態表示**: 現在チーム、個人チーム、オーナー/メンバー

## バックエンド実装

### コントローラー

**ファイル**: `app/Http/Controllers/TeamController.php`

#### indexメソッド仕様

```php
public function index(Request $request): \Inertia\Response
```

**処理フロー**:

1. 認可チェック（`Gate::authorize('viewAny', Team)`）
2. フィルター・検索パラメータ取得
3. ユーザー所属チーム特定（所有 + 所属）
4. 検索・フィルタリング実行
5. ページネーション処理
6. 権限情報付与
7. Inertia.js レスポンス返却

**最適化機能**:

- Eager Loading による N+1 問題回避
- withCount() による集計クエリ最適化
- 重複除去による不要データ削減

### ルーティング

**ファイル**: `routes/web.php`

```php
Route::get('/teams', [TeamController::class, 'index'])->name('teams.index');
```

**ミドルウェア**: `auth:sanctum`, `verified`

### 認可システム

**ファイル**: `app/Policies/TeamPolicy.php`

主要メソッド:

- `viewAny()`: チーム一覧表示権限
- `view()`: 個別チーム表示権限
- `delete()`: 個人チーム削除制限

## フロントエンド実装

### メインコンポーネント

#### Pages/Teams/Index.vue

- **役割**: チーム一覧画面のメインコンポーネント
- **技術**: Vue 3 Composition API + TypeScript
- **状態管理**: Inertia.js useForm, リアクティブデータ
- **機能**: フィルタリング、ページネーション、チーム切り替え

### UIコンポーネント

#### Components/Teams/TeamCard.vue

- **役割**: 個別チーム情報の表示カード
- **デザイン**: Element Plus + Tailwind CSS
- **機能**: チーム情報表示、アクション実行、状態表示
- **レスポンシブ**: デスクトップ/タブレット/モバイル対応

#### Components/Teams/TeamFilters.vue

- **役割**: 検索・フィルタリングUI
- **機能**: テキスト検索、チームタイプ選択、並び替え
- **最適化**: デバウンス機能による不要API呼び出し削減

#### Components/Teams/TeamPagination.vue

- **役割**: ページネーション操作UI
- **機能**: ページ切り替え、表示件数変更
- **デザイン**: デスクトップ/モバイル対応レスポンシブ

#### Components/Teams/TeamResultsInfo.vue

- **役割**: 検索結果情報表示
- **機能**: 件数表示、アクティブフィルター表示、フィルタークリア

### 型安全性

**ファイル**: `resources/js/Types/types-team.d.ts`

主要型定義:

- `Team`: チーム基本情報
- `TeamFilters`: 検索・フィルター条件
- `PaginationMeta`: ページネーション情報
- `TeamActionEvents`: コンポーネント間イベント

## ナビゲーション統合

### AppLayout修正

**ファイル**: `resources/js/Layouts/AppLayout.vue`

追加箇所:

- チームドロップダウンメニューに「👥 View All Teams」リンク追加
- モバイルナビゲーションにチーム一覧リンク追加

### アクセスフロー

```text
ヘッダー → チームドロップダウン → View All Teams → チーム一覧画面
```

## セキュリティ仕様

### 認証・認可

- **認証**: Laravel Sanctum による認証必須
- **認可**: Jetstream TeamPolicy による権限チェック
- **CSRF**: Inertia.js による自動CSRF保護

### データ保護

- **アクセス制御**: 所属/所有チームのみ表示
- **権限制御**: チーム毎のアクション可否制御
- **個人チーム保護**: 削除不可制御

## パフォーマンス仕様

### データベース最適化

- **Eager Loading**: N+1問題回避（with, withCount）
- **インデックス活用**: 検索性能向上
- **ページネーション**: 大量データ対応

### フロントエンド最適化

- **デバウンス**: 検索API呼び出し最適化
- **Partial Reloads**: Inertia.js による効率的データ更新
- **コンポーネント分割**: 保守性・パフォーマンス向上

## テスト仕様

### バックエンドテスト（Pest PHP）

- **Feature Test**: `tests/Feature/TeamControllerTest.php`
- **Policy Test**: `tests/Feature/TeamPolicyTest.php`
- **Integration Test**: `tests/Integration/TeamTest.php`

### フロントエンドテスト（Vitest）

- **Component Test**: `resources/js/Components/Teams/__tests__/`
- **Page Test**: `resources/js/Pages/Teams/__tests__/`

### E2Eテスト（Playwright）

- **User Flow Test**: `e2e/tests/teams/`
- **Interaction Test**: チーム操作フロー全体

### Storybook

- **Component Stories**: `stories/components/Teams/`
- **Interaction Tests**: ユーザー操作シミュレーション

## 運用・監視

### ログ出力

- チーム切り替え操作
- 権限エラー
- パフォーマンス問題

### 監視項目

- API応答時間
- データベースクエリ性能
- ユーザー操作エラー率

## 今後の拡張予定

### 機能拡張

- チーム詳細モーダル表示
- メンバー詳細管理
- チーム設定カスタマイズ
- 通知システム統合

### 技術改善

- リアルタイム更新（WebSocket）
- 検索機能強化
- パフォーマンス最適化

## 関連ドキュメント

- [Jetstream チーム管理機能仕様書](./team-spec-jetstream.md)
- [Laravel Jetstream Documentation](https://jetstream.laravel.com/)
- [Element Plus Documentation](https://element-plus.org/)
- [Inertia.js Documentation](https://inertiajs.com/)
