<?php

namespace App\Actions\Fortify;

use App\Models\OAuthAccount;
use App\Models\User;
use Illuminate\Http\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class LinkOAuthAccount
{
    /**
     * Link OAuth account to existing user.
     *
     * @param User $user
     * @param SocialiteUser $socialiteUser
     * @param string $provider
     * @return void
     */
    public function execute(User $user, SocialiteUser $socialiteUser, string $provider): void
    {
        DB::transaction(function () use ($user, $socialiteUser, $provider) {
            // OAuth アカウント情報を保存（重複チェック付き）
            $this->createOrUpdateOAuthAccount($user, $socialiteUser, $provider);

            // プロフィール情報（名前、写真）が空の場合は OAuth から取得した情報で更新
            $this->updateProfileIfEmpty($user, $socialiteUser);
        });
    }

    /**
     * Create or update OAuth account record.
     */
    protected function createOrUpdateOAuthAccount(User $user, SocialiteUser $socialiteUser, string $provider): void
    {
        OAuthAccount::updateOrCreate(
            [
                'user_id' => $user->id,
                'provider' => $provider,
                'provider_id' => $socialiteUser->getId(),
            ],
            [
                'access_token' => $socialiteUser->token,
                'refresh_token' => $socialiteUser->refreshToken,
                'expires_at' => $socialiteUser->expiresIn ? now()->addSeconds($socialiteUser->expiresIn) : null,
            ]
        );
    }

    /**
     * Update profile information if empty.
     */
    protected function updateProfileIfEmpty(User $user, SocialiteUser $socialiteUser): void
    {
        $updates = [];

        // 名前が空の場合は OAuth から取得した情報で更新
        if (empty($user->name)) {
            $updates['name'] = $socialiteUser->getName() ?? $socialiteUser->getNickname() ?? 'User';
        }

        // プロフィール写真 URL が提供され、既存のプロフィール写真がない場合、画像をダウンロードして保存
        if ($socialiteUser->getAvatar() && !$user->profile_photo_path) {
            $this->updateProfilePhoto($user, $socialiteUser->getAvatar());
        }

        // 更新がある場合のみ保存
        if (!empty($updates)) {
            $user->forceFill($updates)->save();
        }
    }

    /**
     * Download and save profile photo from OAuth provider.
     */
    protected function updateProfilePhoto(User $user, string $photoUrl): void
    {
        try {
            // 画像をダウンロード
            $response = Http::timeout(10)->get($photoUrl);

            if ($response->successful()) {
                // 一時ファイルとして保存
                $tempPath = sys_get_temp_dir().'/'.uniqid('oauth_photo_', true).'.jpg';
                file_put_contents($tempPath, $response->body());

                // Jetstream の updateProfilePhoto() で保存
                $user->updateProfilePhoto(new File($tempPath));

                // 一時ファイルを削除
                @unlink($tempPath);
            }
        } catch (\Exception $e) {
            // プロフィール写真のダウンロードに失敗しても処理は続行
            \Log::warning('Failed to download profile photo from OAuth provider', [
                'user_id' => $user->id,
                'photo_url' => $photoUrl,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
