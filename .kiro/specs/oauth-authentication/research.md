# Research Log

## Summary

本機能は既存の Laravel Jetstream + Fortify 認証システムに OAuth ソーシャルログイン機能を追加する。Laravel Socialite を使用して Google、GitHub などの OAuth プロバイダーと統合し、既存の認証フローと互換性を保ちながら実装する。

## Research Log

### Laravel Socialite 互換性

**調査内容**: Laravel Socialite 5.0 と Laravel 12 の互換性確認

**調査結果**:
- Laravel Socialite 5.0 は Laravel 12 と完全に互換性がある
- Laravel 公式ドキュメントで Laravel 12.x 向けの Socialite セクションが提供されている
- Laravel Shift の互換性チャートでは、Socialite 5.17.1 から 5.23.1 が Laravel 12.x と互換

**出典**: 
- Laravel 公式ドキュメント: https://laravel.com/docs/12.x/socialite
- Laravel Shift 互換性チャート: https://laravelshift.com/can-i-upgrade-laravel/laravel/socialite

**設計への影響**: Laravel Socialite 5.0 を安全に使用可能

### Jetstream 2FA 統合パターン

**調査内容**: OAuth ログイン後の 2要素認証チャレンジ実装パターン

**調査結果**:
- OAuth ログイン後、2FA が有効なユーザーの場合は `TwoFactorAuthenticationChallenged` イベントをディスパッチ
- セッションに `login.id` と `login.remember` を保存
- `two-factor.login` ルートにリダイレクト
- Fortify の 2FA 設定で `confirmPassword: false` を設定することで、OAuth ユーザーがパスワードなしで 2FA を有効化可能

**出典**: Stack Overflow の Laravel Jetstream Socialite 2FA 統合に関する議論

**設計への影響**: OAuth コールバック処理で 2FA チェックを実装する必要がある

### Inertia.js リダイレクト

**調査内容**: OAuth コールバック後の Inertia.js レスポンス形式

**調査結果**:
- Inertia.js は標準的な HTTP リダイレクト（`redirect()`）をサポート
- OAuth コールバックは通常の HTTP リクエストとして処理され、Inertia.js の特別な処理は不要
- リダイレクト先は通常のルート（`route('dashboard')`）で問題なし

**設計への影響**: 標準的な Laravel リダイレクトを使用可能

### プロフィール写真統合

**調査内容**: OAuth プロバイダーからのプロフィール写真を Jetstream の `HasProfilePhoto` と統合する方法

**調査結果**:
- Jetstream の `HasProfilePhoto` trait は `updateProfilePhoto()` メソッドを提供
- このメソッドは `Illuminate\Http\UploadedFile` または `Illuminate\Http\File` を受け取る
- OAuth プロバイダーから取得した画像 URL をダウンロードし、一時ファイルとして保存してから `updateProfilePhoto()` に渡す必要がある
- `config/jetstream.php` の `profile_photo_disk` 設定で保存先を指定

**設計への影響**: OAuth コールバック処理でプロフィール写真をダウンロード・保存するロジックが必要

## Architecture Pattern Evaluation

### 選択パターン: Hybrid Approach (Option C)

**理由**:
1. **関心の分離**: OAuth 機能を独立したコンポーネントとして実装し、既存コードへの影響を最小化
2. **拡張性**: 将来的に追加の OAuth プロバイダーを追加しやすい
3. **テスト容易性**: 各コンポーネントを独立してテスト可能
4. **保守性**: 既存の認証コードを複雑化せず、OAuth 機能を明確に分離

### 設計決定

1. **OAuth アカウントモデル**: `oauth_accounts` テーブルを作成し、`User` モデルと多対一のリレーション
2. **コントローラー設計**: `OAuthController` でリダイレクト/コールバックを処理、ビジネスロジックは `Actions` に分離
3. **UI コンポーネント**: `OAuthButtons.vue` を新規作成し、ログイン/登録画面で再利用
4. **2要素認証統合**: OAuth ログイン後、2FA が有効な場合は Fortify の 2FA チャレンジを実行
5. **トークン管理**: アクセストークンとリフレッシュトークンは暗号化して保存（Laravel の `encrypted` cast を使用）

## Risks and Mitigation

### リスク要因

1. **2要素認証との統合**: OAuth ログイン後の 2FA チャレンジ実装が複雑
   - **軽減策**: Fortify の標準的な 2FA イベントを使用

2. **セッション管理**: OAuth コールバック後の Jetstream セッション管理
   - **軽減策**: Jetstream の既存のセッション管理機能を活用

3. **プロフィール写真のダウンロード**: 外部 URL からの画像ダウンロードと保存
   - **軽減策**: Laravel の HTTP クライアントとファイルストレージを使用

## External Dependencies

### Laravel Socialite 5.0

**目的**: OAuth プロバイダーとの通信

**バージョン**: 5.0+ (Laravel 12 互換)

**統合方法**: Composer でインストール、`config/services.php` で設定

**制約**: プロバイダーごとにクライアント ID とシークレットが必要
