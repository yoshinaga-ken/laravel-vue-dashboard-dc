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

- **全チーム表示**: システム内の全チーム（管理者向け機能）
- **フィルター適用**: 役割フィルターで所有・所属チームに絞り込み可能
- **統合取得**: `Jetstream::newTeamModel()::query()` - 全チーム対象

#### チーム情報項目

| 項目         | 説明                       | データソース                 |
| ------------ | -------------------------- | ---------------------------- |
| チーム名     | team.name                  | 基本カラム                   |
| チームタイプ | 個人/通常                  | personal_team フラグ         |
| ユーザー関係 | オーナー/メンバー/関与なし | user_role判定ロジック        |
| 現在チーム   | 選択中チーム               | $user->current_team_id       |
| メンバー数   | チームメンバー数           | withCount('users')           |
| 招待数       | 承認待ち数                 | withCount('teamInvitations') |
| 権限情報     | 操作可能権限               | Gate::check()                |

### フィルタリング・検索機能

#### 検索条件

- **テキスト検索**: チーム名による部分一致検索
- **チームタイプ**: All / Personal / Shared / Current
- **役割フィルター**: All / Owner（所有チーム） / Member（所属チーム）
- **メンバー数**: 1人 / 2-5人 / 6-10人 / 11人以上
- **並び替え**: 名前・作成日・メンバー数（昇順・降順）

#### ページネーション

- **デフォルト件数**: 32件/ページ
- **選択可能件数**: 32, 128, 全件
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

#### 重要な設計変更

- **2025年8月17日更新**: 全チーム表示に変更（従来の所属チームのみ表示から変更）
- **ページネーション**: 32件/128件/全件対応
- **役割判定**: `'owner'|'member'|'none'` の3段階判定
- **統計情報**: システム全体のチーム数を表示

**処理フロー**:

1. 認可チェック（`Gate::authorize('viewAny', Team)`）
2. フィルター・検索パラメータ取得
3. 全チーム対象ベースクエリ構築
4. 検索・フィルタリング実行（役割フィルターを含む）
5. ページネーション処理（32件/128件/全件対応）
6. ユーザー関係性判定・権限情報付与
7. Inertia.js レスポンス返却

**最適化機能**:

- Eager Loading による N+1 問題回避（usersリレーション含む）
- withCount() による集計クエリ最適化
- 全件表示時の効率的データハンドリング

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

- **アクセス制御**: 全チーム表示（管理者機能）+ 役割フィルターによる絞り込み
- **権限制御**: チーム毎のアクション可否制御（関与なしチームは制限）
- **個人チーム保護**: 削除不可制御

## パフォーマンス仕様

### データベース最適化

- **Eager Loading**: N+1問題回避（with, withCount, ユーザーリレーション含む）
- **インデックス活用**: 検索性能向上
- **ページネーション**: 大量データ対応（全件表示時の効率化）
- **クエリ最適化**: 全チーム取得時のパフォーマンス考慮

### フロントエンド最適化

- **デバウンス**: 検索API呼び出し最適化
- **Partial Reloads**: Inertia.js による効率的データ更新
- **コンポーネント分割**: 保守性・パフォーマンス向上

## テスト仕様

### バックエンドテスト（Pest PHP）

- **Feature Test**: `tests/Feature/TeamTest.php`
  - 全チーム表示機能のテスト
  - 役割フィルター（all/owner/member）のテスト
  - ページネーション（32件/128件/全件）のテスト
  - 検索・フィルタリング機能のテスト
  - ユーザー関係性判定（owner/member/none）のテスト
- **Integration Test**: `tests/Integration/Models/TeamTest.php`
  - Teamモデルのリレーション・スコープテスト
- **API Test**: `tests/Integration/Api/TeamTest.php`
  - API経由でのチーム操作テスト

### フロントエンドテスト（Vitest）

- **Component Test**: `resources/js/Components/Teams/__tests__/`
  - `TeamCard.test.ts`: チーム表示カード ✅
  - `TeamFilters.test.ts`: 検索・フィルタリングUI ✅
  - `TeamPagination.test.ts`: ページネーション
  - `TeamResultsInfo.test.ts`: 結果情報表示
- **Page Test**: `resources/js/Pages/Teams/__tests__/`
  - `Index.test.ts`: メインページコンポーネント

### E2Eテスト（Playwright）

- **User Flow Test**: `e2e/tests/teams/`
  - `team.spec.ts`: チーム管理機能の統合E2Eテスト ✅

- **主要テスト機能**:

- ✅ チーム一覧の基本表示・ナビゲーション
- ✅ チーム切り替えフロー（現在チーム → 他チーム）
- ✅ チーム詳細画面・作成画面への遷移
- ✅ フィルタリング機能（個人/共有、役割フィルター、複合条件）
- ✅ アクティブフィルター表示・クリア機能
- ✅ 権限に応じたUI制御（個人チーム、オーナー/メンバー）
- ✅ レスポンシブデザイン対応
- ✅ エラーハンドリング（404等）
- ✅ チームカード詳細内容の表示確認

### Storybook

- **Component Stories**: `stories/components/Teams/`
  - `TeamCard.stories.js`: チームカード表示パターン
  - `TeamFilters.stories.js`: フィルター操作パターン
  - `TeamPagination.stories.js`: ページネーション操作パターン
  - `TeamResultsInfo.stories.js`: 結果情報表示パターン
- **Interaction Tests**: ユーザー操作シミュレーション

### テスト移行計画

#### Phase 1: 既存テストの修正

- `tests/Feature/TeamTest.php` の全チーム表示対応
- 役割フィルター関連テストの追加
- ページネーション仕様変更の反映

#### Phase 2: 新規テストの追加

- ユーザー関係性判定（none）のテスト
- 統計情報（システム全体）のテスト
- パフォーマンステスト（大量データ）

#### Phase 3: E2E・Storybook更新

- 新しいUIフローのE2Eテスト
- 更新されたコンポーネントのStorybook

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
- **管理者権限管理**: 全チーム表示権限の細分化

### 技術改善

- リアルタイム更新（WebSocket）
- 検索機能強化
- パフォーマンス最適化
- **権限システム強化**: 役割ベースアクセス制御の拡張

## 関連ドキュメント

- [Jetstream チーム管理機能仕様書](./team-spec-jetstream.md)
- [Laravel Jetstream Documentation](https://jetstream.laravel.com/)
- [Element Plus Documentation](https://element-plus.org/)
- [Inertia.js Documentation](https://inertiajs.com/)
