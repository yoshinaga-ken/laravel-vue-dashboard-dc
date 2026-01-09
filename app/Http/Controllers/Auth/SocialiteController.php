<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    /**
     * OAuthプロバイダーへのリダイレクト
     *
     * @param string $provider プロバイダー名 (google, github)
     * @return RedirectResponse
     */
    public function redirect(string $provider): RedirectResponse
    {
        // リダイレクトURIを明示的に設定
        $redirectUri = route('auth.callback', ['provider' => $provider], absolute: true);
        
        return Socialite::driver($provider)
            ->redirectUrl($redirectUri)
            ->redirect();
    }

    /**
     * OAuthプロバイダーからのコールバック処理
     *
     * @param string $provider プロバイダー名 (google, github)
     * @return RedirectResponse
     */
    public function callback(string $provider): RedirectResponse
    {
        try {
            // プロバイダーの検証
            if (!in_array($provider, ['google', 'github'])) {
                return redirect()->route('login')
                    ->with('error', '無効なプロバイダーです。');
            }

            // リダイレクトURIを明示的に設定（redirect()と同じURIを使用）
            $redirectUri = route('auth.callback', ['provider' => $provider], absolute: true);

            $socialUser = Socialite::driver($provider)
                ->redirectUrl($redirectUri)
                ->user();

            if (!$socialUser->getEmail()) {
                return redirect()->route('login')
                    ->with('error', 'メールアドレスが取得できませんでした。');
            }

            // 既存ユーザーを検索（emailでマッチング）
            $user = User::where('email', $socialUser->getEmail())->first();

            if (!$user) {
                // 新規ユーザーを作成（パーソナルチーム付き）
                $user = User::factory()->withPersonalTeam()->create([
                    'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
                    'email' => $socialUser->getEmail(),
                    'email_verified_at' => now(),
                    'password' => Hash::make(str()->random(32)), // ランダムパスワード（OAuthユーザーは使用しない）
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                ]);
            } else {
                // 既存ユーザーの場合、プロバイダー情報を更新
                $user->update([
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                ]);
            }

            // ログイン
            Auth::login($user, true);

            return redirect()->intended(route('dashboard'));
        } catch (\Exception $e) {
            \Log::error('OAuth callback error: ' . $e->getMessage(), [
                'provider' => $provider,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('login')
                ->with('error', 'ソーシャルログインに失敗しました。もう一度お試しください。');
        }
    }
}
