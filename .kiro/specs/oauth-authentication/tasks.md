# Implementation Plan

- [x] 1. Laravel Socialite のインストールと基本設定
- [x] 1.1 Laravel Socialite パッケージのインストール
  - Composer で `laravel/socialite` をインストール
  - `config/services.php` に Google、GitHub などの OAuth プロバイダー設定を追加
  - 環境変数（`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` など）の設定例を `.env.example` に追加
  - _Requirements: 1.1, 1.2, 1.5_

- [x] 2. OAuth アカウントデータベース構造の実装
- [x] 2.1 OAuth アカウントテーブルのマイグレーション作成
  - `oauth_accounts` テーブルのマイグレーションファイルを作成
  - カラム: `id`, `user_id`, `provider`, `provider_id`, `access_token`, `refresh_token`, `expires_at`, `timestamps`
  - 外部キー制約: `user_id` → `users.id` (onDelete cascade)
  - ユニーク制約: `(provider, provider_id)`
  - インデックス: `user_id`, `unique_provider_account`
  - _Requirements: 7.1, 7.5_

- [x] 2.2 OAuthAccount モデルの実装
  - `app/Models/OAuthAccount.php` を作成
  - `User` モデルへの belongsTo リレーションを定義
  - `fillable`, `hidden`, `casts` プロパティを設定（`access_token`, `refresh_token` は `encrypted` cast）
  - プロバイダー名の enum 検証メソッドを追加
  - _Requirements: 7.2, 7.3, 7.4_

- [x] 2.3 User モデルへの OAuth リレーション追加
  - `app/Models/User.php` に `oauthAccounts()` hasMany リレーションを追加
  - 特定プロバイダーの OAuth アカウントを取得するヘルパーメソッドを追加（オプション）
  - _Requirements: 7.1_

- [x] 3. OAuth 認証アクションの実装
- [x] 3.1 CreateUserFromOAuth アクションの実装
  - `app/Actions/Fortify/CreateUserFromOAuth.php` を作成
  - OAuth プロバイダーからのユーザー情報（名前、メール、プロフィール写真 URL）を取得
  - 新規ユーザーを作成（パスワードは null）
  - 個人チームを自動作成（既存の `CreateNewUser` パターンを踏襲）
  - OAuth アカウント情報を保存（アクセストークン、リフレッシュトークンは暗号化）
  - プロフィール写真 URL が提供される場合、画像をダウンロードして Jetstream の `updateProfilePhoto()` で保存
  - トランザクション内で実行してデータ整合性を保証
  - _Requirements: 2.2, 3.3, 4.1, 4.2, 4.3, 4.4, 4.5, 7.1, 7.2, 7.3_

- [x] 3.2 LinkOAuthAccount アクションの実装
  - `app/Actions/Fortify/LinkOAuthAccount.php` を作成
  - 既存ユーザーに OAuth アカウント情報を連携
  - OAuth アカウント情報を保存（重複チェック付き）
  - プロフィール情報（名前、写真）が空の場合は OAuth から取得した情報で更新（既存情報は上書きしない）
  - プロフィール写真 URL が提供され、既存のプロフィール写真がない場合、画像をダウンロードして保存
  - トランザクション内で実行してデータ整合性を保証
  - _Requirements: 3.1, 3.2, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 7.1, 7.2, 7.3_

- [x] 4. OAuth コントローラーの実装
- [x] 4.1 OAuthController のリダイレクト処理実装
  - `app/Http/Controllers/OAuthController.php` を作成
  - `redirect()` メソッドを実装: プロバイダー名を受け取り、Laravel Socialite で OAuth プロバイダーへリダイレクト
  - プロバイダー名の検証（有効なプロバイダーのみ許可）
  - CSRF 保護ミドルウェア適用
  - エラーハンドリング: 無効なプロバイダーの場合、エラーメッセージを表示してログイン画面にリダイレクト
  - _Requirements: 1.1, 1.2, 2.1, 5.1, 5.2, 8.1, 8.5_

- [x] 4.2 OAuthController のコールバック処理実装
  - `callback()` メソッドを実装: OAuth プロバイダーからのコールバックを処理
  - Laravel Socialite でユーザー情報を取得
  - メールアドレスで既存ユーザーを検索
  - 既存ユーザーが見つかった場合: `LinkOAuthAccount` アクションを実行してアカウント連携
  - 既存ユーザーが見つからない場合: `CreateUserFromOAuth` アクションを実行して新規ユーザー作成
  - ユーザーをログイン（`Auth::login()`）
  - 2要素認証が有効な場合は Fortify の 2FA チャレンジを実行（`TwoFactorAuthenticationChallenged` イベントをディスパッチ）
  - 2要素認証が無効な場合または 2FA チャレンジ完了後: ダッシュボードへリダイレクト
  - エラーハンドリング: OAuth 認証失敗時、エラーメッセージを表示してログイン画面にリダイレクト（機密情報はログに記録しない）
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.4, 3.5, 5.1, 5.2, 5.6, 8.1, 8.2, 8.4, 8.5_

- [x] 4.3 OAuth ルートの登録
  - `routes/web.php` に OAuth リダイレクト/コールバックルートを追加
  - `/oauth/redirect/{provider}` → `OAuthController@redirect`
  - `/oauth/callback/{provider}` → `OAuthController@callback`
  - CSRF 保護ミドルウェア適用（コールバックルートは state パラメータでも CSRF 保護）
  - _Requirements: 1.3, 2.1, 5.1_

- [x] 5. フロントエンド OAuth ボタンコンポーネントの実装
- [x] 5.1 OAuthButtons コンポーネントの作成
  - `resources/js/Components/Auth/OAuthButtons.vue` を作成
  - Element Plus の `ElButton` コンポーネントを使用して OAuth プロバイダーボタンを表示
  - プロバイダーごとにアイコンと名前を表示（Google、GitHub など）
  - プロバイダーアイコンは CDN またはローカルアセットから取得
  - レスポンシブデザイン対応（モバイル/デスクトップで適切に表示）
  - プロバイダーボタンクリック時に `/oauth/redirect/{provider}` ルートへリダイレクト（`route()` ヘルパーを使用）
  - Props で有効なプロバイダーリストを受け取る（オプション、デフォルトはすべて）
  - TypeScript 型定義を追加（Props、Emits）
  - _Requirements: 6.1, 6.3, 6.4, 6.5_

- [x] 5.2 ログイン画面への OAuth ボタン統合
  - `resources/js/Pages/Auth/Login.vue` に `OAuthButtons` コンポーネントをインポート
  - ログインフォームの上または下に OAuth ボタンを配置
  - 有効な OAuth プロバイダーのみ表示（環境変数から取得、または Inertia.js の `$page.props` から取得）
  - ローディング状態の管理（OAuth リダイレクト中はローディングインジケーターを表示）
  - _Requirements: 2.4, 6.1_

- [x] 5.3 登録画面への OAuth ボタン統合
  - `resources/js/Pages/Auth/Register.vue` に `OAuthButtons` コンポーネントをインポート
  - 登録フォームの上または下に OAuth ボタンを配置
  - 有効な OAuth プロバイダーのみ表示
  - ローディング状態の管理
  - _Requirements: 2.4, 6.2_

- [x] 6. エラーハンドリングとセキュリティの強化
- [x] 6.1 OAuth エラーハンドリングの実装
  - OAuth プロバイダーが利用できない場合のエラーメッセージ表示
  - OAuth 認証タイムアウト時のエラーメッセージ表示と再試行促進
  - ユーザーが OAuth 認証をキャンセルした場合、エラーを表示せずにログイン画面に戻る
  - ユーザーフレンドリーなエラーメッセージを表示（技術的な詳細はログに記録のみ）
  - OAuth プロバイダー固有のエラーコードとメッセージのマッピング
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 6.2 セキュリティ機能の実装
  - OAuth コールバック時の state パラメータによる CSRF 検証
  - 不正な OAuth リクエストの検出とログ記録（機密情報は除外）
  - OAuth トークンの有効期限管理（`expires_at` カラムを使用）
  - OAuth アカウント連携時のユーザー通知（将来の拡張として検討、今回は自動連携）
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 7. バックエンドテストの実装
- [x] 7.1 OAuthController のユニットテスト
  - OAuth リダイレクト処理のテスト（有効/無効なプロバイダー）
  - OAuth コールバック処理のテスト（新規ユーザー作成、既存アカウント連携）
  - 2要素認証チェックのテスト
  - エラーハンドリングのテスト
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 3.1, 3.2, 5.1, 5.2, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 7.2 CreateUserFromOAuth アクションのユニットテスト
  - 新規ユーザー作成のテスト
  - 個人チーム作成のテスト
  - OAuth アカウント保存のテスト
  - プロフィール写真保存のテスト
  - トランザクション処理のテスト
  - _Requirements: 2.2, 3.3, 4.1, 4.2, 4.3, 4.4, 4.5, 7.1, 7.2, 7.3_

- [x] 7.3 LinkOAuthAccount アクションのユニットテスト
  - 既存アカウント連携のテスト
  - OAuth アカウント重複防止のテスト
  - プロフィール情報更新のテスト（既存情報は上書きしない）
  - トランザクション処理のテスト
  - _Requirements: 3.1, 3.2, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 7.1, 7.2, 7.3_

- [x] 7.4 OAuthAccount モデルのユニットテスト
  - リレーションのテスト
  - トークン暗号化/復号化のテスト
  - バリデーションのテスト
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 7.5 OAuth 統合テスト
  - OAuth ログインフローの統合テスト（リダイレクト → コールバック → ユーザー作成 → ログイン）
  - 既存アカウント連携の統合テスト
  - 2FA 統合のテスト
  - プロフィール写真同期のテスト
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 8. フロントエンドテストの実装
- [x] 8.1 OAuthButtons コンポーネントのユニットテスト
  - OAuth ボタン表示のテスト
  - プロバイダーボタンクリック時のリダイレクトテスト
  - レスポンシブデザインのテスト
  - _Requirements: 6.1, 6.3, 6.4, 6.5_

- [x] 9. 型定義とドキュメントの追加
- [x] 9.1 TypeScript 型定義の追加
  - `resources/js/Types/types-oauth.d.ts` を作成
  - OAuth プロバイダー型定義を追加
  - OAuth ボタンの Props/Emits 型定義を追加
  - _Requirements: 6.3_

