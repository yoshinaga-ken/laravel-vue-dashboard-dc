# Implementation Gap Analysis

## Current State Investigation

### Existing Authentication Infrastructure

**認証システム**:
- Laravel Jetstream 5.3 + Fortify（Inertia.js スタック）
- セッション認証（`auth:sanctum` ミドルウェア）
- メール/パスワード認証
- 2要素認証対応（`TwoFactorAuthenticatable`）
- パスワードリセット機能
- メール認証機能

**主要ファイル**:
- `app/Providers/FortifyServiceProvider.php`: Fortify 認証アクションの登録
- `app/Actions/Fortify/CreateNewUser.php`: ユーザー作成ロジック
- `app/Models/User.php`: Eloquent モデル（Jetstream traits 使用）
- `resources/js/Pages/Auth/Login.vue`: ログイン画面
- `resources/js/Pages/Auth/Register.vue`: 登録画面
- `routes/web.php`: 認証ルート（Jetstream が自動登録）

**データベース構造**:
- `users` テーブル: 標準的な Jetstream 構造
  - `id`, `name`, `email`, `password`, `email_verified_at`
  - `profile_photo_path` (Jetstream のプロフィール写真)
  - `current_team_id` (チーム機能)
- OAuth 関連テーブル: **存在しない**

**パターンと規約**:
- `app/Actions/` ディレクトリでビジネスロジックを分離
- Inertia.js による SPA 体験
- Element Plus コンポーネントを使用した UI
- TypeScript strict mode
- Composables パターン（`resources/js/Composables/`）

### Missing Capabilities

1. **Laravel Socialite**: パッケージがインストールされていない
2. **OAuth データモデル**: OAuth アカウント情報を保存するテーブル/モデルが存在しない
3. **OAuth ルーティング**: OAuth リダイレクト/コールバックルートが存在しない
4. **OAuth コントローラー**: OAuth 認証を処理するコントローラーが存在しない
5. **フロントエンド UI**: ログイン/登録画面に OAuth ボタンがない
6. **OAuth 設定**: `config/services.php` に OAuth プロバイダー設定がない
7. **アカウント連携ロジック**: 既存アカウントと OAuth アカウントを連携する機能がない

## Requirements Feasibility Analysis

### Technical Needs from Requirements

**Requirement 1: OAuth プロバイダー統合**
- **必要**: Laravel Socialite インストール、`config/services.php` 設定
- **ギャップ**: パッケージ未インストール、設定ファイル未設定
- **複雑度**: 低（標準的な Laravel パターン）

**Requirement 2: OAuth ログインフロー**
- **必要**: OAuth リダイレクト/コールバックルート、コントローラー、認証ロジック
- **ギャップ**: ルート・コントローラー・ロジックすべて未実装
- **複雑度**: 中（Jetstream/Fortify との統合が必要）

**Requirement 3: OAuth アカウント連携**
- **必要**: メールアドレスマッチングロジック、アカウント連携処理
- **ギャップ**: 連携ロジック未実装
- **複雑度**: 中（既存ユーザー検索と統合が必要）

**Requirement 4: プロフィール情報の同期**
- **必要**: OAuth プロバイダーからの情報取得、Jetstream プロフィール写真統合
- **ギャップ**: 情報取得・同期ロジック未実装
- **複雑度**: 低（Socialite が提供する情報を使用）

**Requirement 5: セキュリティ要件**
- **必要**: CSRF 保護（Laravel 標準）、トークン暗号化、エラーログ
- **ギャップ**: OAuth トークン保存方法の設計が必要
- **複雑度**: 中（暗号化とセキュアな保存が必要）

**Requirement 6: ユーザーインターフェース統合**
- **必要**: OAuth ボタンコンポーネント、ログイン/登録画面への統合
- **ギャップ**: UI コンポーネント未実装
- **複雑度**: 低（Element Plus コンポーネントを使用）

**Requirement 7: データベース拡張**
- **必要**: OAuth アカウント情報を保存するテーブル
- **ギャップ**: テーブル・モデル・マイグレーション未実装
- **複雑度**: 低（標準的な Eloquent パターン）

**Requirement 8: エラーハンドリング**
- **必要**: OAuth エラー処理、ユーザーフレンドリーなメッセージ
- **ギャップ**: エラーハンドリングロジック未実装
- **複雑度**: 低（Laravel 標準のエラーハンドリングを使用）

### Constraints from Existing Architecture

1. **Jetstream 統合**: OAuth 認証後も Jetstream のセッション管理とチーム機能を維持する必要がある
2. **Fortify 統合**: 既存の Fortify 認証フローと競合しないようにする必要がある
3. **Inertia.js**: OAuth コールバック後のリダイレクトは Inertia.js と互換性を保つ必要がある
4. **2要素認証**: OAuth ログイン後も 2FA が有効な場合はチャレンジが必要
5. **型安全性**: TypeScript strict mode に準拠した型定義が必要

## Implementation Approach Options

### Option A: Extend Existing Components

**アプローチ**: 既存の FortifyServiceProvider、Login.vue、Register.vue を拡張

**拡張対象ファイル**:
- `app/Providers/FortifyServiceProvider.php`: OAuth ルート登録を追加
- `resources/js/Pages/Auth/Login.vue`: OAuth ボタンを追加
- `resources/js/Pages/Auth/Register.vue`: OAuth ボタンを追加
- `app/Models/User.php`: OAuth リレーションを追加

**互換性評価**:
- ✅ 既存の認証フローを維持
- ✅ Jetstream/Fortify との統合が容易
- ❌ FortifyServiceProvider が肥大化する可能性
- ❌ Login.vue/Register.vue が複雑になる

**複雑度と保守性**:
- ファイルサイズ: 中程度の増加
- 単一責任原則: やや違反（認証方法が混在）
- 認知負荷: 中（既存コードに追加）

**トレードオフ**:
- ✅ 最小限の新規ファイル、初期開発が速い
- ✅ 既存パターンとインフラを活用
- ❌ 既存コンポーネントが肥大化するリスク
- ❌ 既存ロジックが複雑化する可能性

### Option B: Create New Components

**アプローチ**: OAuth 専用の新しいコンポーネントを作成

**新規作成ファイル**:
- `app/Http/Controllers/OAuthController.php`: OAuth 認証処理
- `app/Models/OAuthAccount.php`: OAuth アカウントモデル
- `app/Actions/Fortify/CreateUserFromOAuth.php`: OAuth からのユーザー作成
- `app/Actions/Fortify/LinkOAuthAccount.php`: 既存アカウントへの連携
- `resources/js/Components/Auth/OAuthButtons.vue`: OAuth ボタンコンポーネント
- `database/migrations/XXXX_create_oauth_accounts_table.php`: OAuth テーブル

**統合ポイント**:
- `routes/web.php`: OAuth ルートを追加
- `resources/js/Pages/Auth/Login.vue`: OAuthButtons コンポーネントをインポート
- `resources/js/Pages/Auth/Register.vue`: OAuthButtons コンポーネントをインポート
- `app/Models/User.php`: OAuth アカウントリレーションを追加

**責任境界**:
- OAuthController: OAuth リダイレクト/コールバック処理
- OAuthAccount モデル: OAuth アカウント情報の管理
- CreateUserFromOAuth: OAuth からの新規ユーザー作成
- LinkOAuthAccount: 既存アカウントへの連携
- OAuthButtons: OAuth ボタンの UI 表示

**トレードオフ**:
- ✅ 関心の分離が明確
- ✅ 単体テストが容易
- ✅ 既存コンポーネントの複雑度を抑制
- ❌ ファイル数が増加
- ❌ インターフェース設計に注意が必要

### Option C: Hybrid Approach（推奨）

**アプローチ**: 新規コンポーネント作成 + 既存コンポーネントの最小限の拡張

**新規作成**:
- `app/Http/Controllers/OAuthController.php`: OAuth 認証処理
- `app/Models/OAuthAccount.php`: OAuth アカウントモデル
- `app/Actions/Fortify/CreateUserFromOAuth.php`: OAuth からのユーザー作成
- `app/Actions/Fortify/LinkOAuthAccount.php`: 既存アカウントへの連携
- `resources/js/Components/Auth/OAuthButtons.vue`: OAuth ボタンコンポーネント
- `database/migrations/XXXX_create_oauth_accounts_table.php`: OAuth テーブル

**既存拡張**:
- `app/Models/User.php`: OAuth アカウントリレーションを追加（1メソッド）
- `resources/js/Pages/Auth/Login.vue`: OAuthButtons コンポーネントをインポート（数行）
- `resources/js/Pages/Auth/Register.vue`: OAuthButtons コンポーネントをインポート（数行）
- `routes/web.php`: OAuth ルートを追加（数行）

**段階的実装**:
1. **Phase 1**: 基本 OAuth ログイン（新規ユーザー作成のみ）
2. **Phase 2**: 既存アカウント連携機能
3. **Phase 3**: プロフィール情報同期の強化
4. **Phase 4**: エラーハンドリングと UX 改善

**リスク軽減**:
- 機能フラグで OAuth 機能を有効/無効化可能
- 段階的ロールアウト
- ロールバック戦略（マイグレーションの down メソッド）

**トレードオフ**:
- ✅ 複雑な機能に適したバランス
- ✅ 反復的な改善が可能
- ❌ 計画がより複雑
- ❌ 一貫性を保つための調整が必要

## Implementation Complexity & Risk

### Effort Estimation: **M (3-7 days)**

**根拠**:
- Laravel Socialite は標準的な Laravel パターンに従う
- Jetstream/Fortify との統合は既知のパターン
- 新規コンポーネント作成が必要だが、複雑なビジネスロジックは少ない
- フロントエンドは Element Plus コンポーネントを活用

**内訳**:
- バックエンド実装: 2-3日（コントローラー、モデル、アクション、マイグレーション）
- フロントエンド実装: 1-2日（OAuth ボタンコンポーネント、統合）
- テスト: 1-2日（ユニットテスト、統合テスト、E2E テスト）

### Risk Assessment: **Medium**

**根拠**:
- Laravel Socialite は成熟したパッケージで、ドキュメントが充実
- Jetstream/Fortify との統合パターンは既知（Web 検索で確認済み）
- 2要素認証との統合は追加の考慮が必要
- セキュリティ要件（トークン暗号化）は Laravel 標準機能で対応可能

**リスク要因**:
- **中リスク**: 2要素認証との統合（OAuth ログイン後の 2FA チャレンジ）
- **低リスク**: セッション管理（Jetstream の既存機能を活用）
- **低リスク**: エラーハンドリング（Laravel 標準パターン）

## Recommendations for Design Phase

### Preferred Approach: **Option C (Hybrid)**

**推奨理由**:
1. **関心の分離**: OAuth 機能を独立したコンポーネントとして実装し、既存コードへの影響を最小化
2. **拡張性**: 将来的に追加の OAuth プロバイダーを追加しやすい
3. **テスト容易性**: 各コンポーネントを独立してテスト可能
4. **保守性**: 既存の認証コードを複雑化せず、OAuth 機能を明確に分離

### Key Design Decisions

1. **OAuth アカウントモデル**: `oauth_accounts` テーブルを作成し、`User` モデルと多対一のリレーション
2. **コントローラー設計**: `OAuthController` でリダイレクト/コールバックを処理、ビジネスロジックは `Actions` に分離
3. **UI コンポーネント**: `OAuthButtons.vue` を新規作成し、ログイン/登録画面で再利用
4. **2要素認証統合**: OAuth ログイン後、2FA が有効な場合は Fortify の 2FA チャレンジを実行
5. **トークン管理**: アクセストークンとリフレッシュトークンは暗号化して保存（Laravel の `encrypted` cast を使用）

### Research Items for Design Phase

1. **Laravel Socialite 最新版**: Laravel 12 との互換性確認
2. **Jetstream 2FA 統合**: OAuth ログイン後の 2FA チャレンジ実装パターン
3. **Inertia.js リダイレクト**: OAuth コールバック後の Inertia.js レスポンス形式
4. **プロフィール写真統合**: OAuth プロバイダーからのプロフィール写真を Jetstream の `HasProfilePhoto` と統合する方法
5. **エラーハンドリング**: OAuth プロバイダー固有のエラーコードとメッセージのマッピング

### Integration Points

1. **FortifyServiceProvider**: OAuth ルートを登録（既存の Fortify ルートと競合しないように）
2. **User モデル**: OAuth アカウントリレーションを追加
3. **Login.vue / Register.vue**: OAuth ボタンコンポーネントを統合
4. **Jetstream セッション**: OAuth 認証後も Jetstream のセッション管理を維持
5. **チーム機能**: OAuth で新規登録したユーザーにも個人チームを自動作成（既存の `CreateNewUser` パターンを踏襲）

## Requirement-to-Asset Map

| Requirement | Existing Assets | Gaps | Status |
|------------|----------------|------|--------|
| OAuth プロバイダー統合 | `config/services.php` (存在) | Laravel Socialite 未インストール、設定未追加 | **Missing** |
| OAuth ログインフロー | Fortify 認証フロー | OAuth ルート・コントローラー・ロジック | **Missing** |
| OAuth アカウント連携 | User モデル | 連携ロジック、OAuth アカウントモデル | **Missing** |
| プロフィール情報同期 | `HasProfilePhoto` trait | OAuth からの情報取得・同期ロジック | **Missing** |
| セキュリティ要件 | Laravel CSRF 保護 | OAuth トークン暗号化設計 | **Unknown** |
| UI 統合 | Login.vue, Register.vue | OAuth ボタンコンポーネント | **Missing** |
| データベース拡張 | users テーブル | oauth_accounts テーブル | **Missing** |
| エラーハンドリング | Laravel 標準エラー処理 | OAuth 固有エラーハンドリング | **Missing** |
