<?php

namespace App\Http\Controllers;

use App\Actions\Fortify\CreateUserFromOAuth;
use App\Actions\Fortify\LinkOAuthAccount;
use App\Models\OAuthAccount;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Laravel\Fortify\Events\TwoFactorAuthenticationChallenged;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    /**
     * Redirect to OAuth provider.
     *
     * @param string $provider
     * @return RedirectResponse
     */
    public function redirect(string $provider): RedirectResponse
    {
        // プロバイダー名の検証
        if (!OAuthAccount::isValidProvider($provider)) {
            return redirect()->route('login')
                ->withErrors(['oauth' => '無効な OAuth プロバイダーです。']);
        }

        try {
            return Socialite::driver($provider)->redirect();
        } catch (\Exception $e) {
            Log::error('OAuth redirect failed', [
                'provider' => $provider,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('login')
                ->withErrors(['oauth' => 'OAuth 認証の開始に失敗しました。']);
        }
    }

    /**
     * Handle OAuth callback.
     *
     * @param string $provider
     * @return RedirectResponse
     */
    public function callback(string $provider, CreateUserFromOAuth $createUserFromOAuth, LinkOAuthAccount $linkOAuthAccount): RedirectResponse
    {
        // プロバイダー名の検証
        if (!OAuthAccount::isValidProvider($provider)) {
            return redirect()->route('login')
                ->withErrors(['oauth' => '無効な OAuth プロバイダーです。']);
        }

        try {
            // Laravel Socialite でユーザー情報を取得
            $socialiteUser = Socialite::driver($provider)->user();

            // メールアドレスで既存ユーザーを検索
            $existingUser = User::where('email', $socialiteUser->getEmail())->first();

            if ($existingUser) {
                // 既存ユーザーが見つかった場合: アカウント連携
                $linkOAuthAccount->execute($existingUser, $socialiteUser, $provider);
                $user = $existingUser;
            } else {
                // 既存ユーザーが見つからない場合: 新規ユーザー作成
                $user = $createUserFromOAuth->execute($socialiteUser, $provider);
            }

            // ユーザーをログイン
            Auth::login($user);

            // 2要素認証が有効な場合は Fortify の 2FA チャレンジを実行
            if ($user->two_factor_secret) {
                Session::put('login.id', $user->id);
                Session::put('login.remember', false);

                TwoFactorAuthenticationChallenged::dispatch($user);

                return redirect()->route('two-factor.login');
            }

            // 2要素認証が無効な場合: ダッシュボードへリダイレクト
            return redirect()->route('dashboard');
        } catch (\Exception $e) {
            // OAuth 認証失敗時、エラーメッセージを表示してログイン画面にリダイレクト（機密情報はログに記録しない）
            Log::error('OAuth callback failed', [
                'provider' => $provider,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('login')
                ->withErrors(['oauth' => 'OAuth 認証に失敗しました。もう一度お試しください。']);
        }
    }
}
