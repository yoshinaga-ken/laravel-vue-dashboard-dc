<?php

namespace App\Actions\Fortify;

use App\Models\OAuthAccount;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class CreateUserFromOAuth
{
    /**
     * Create a new user from OAuth provider information.
     *
     * @param SocialiteUser $socialiteUser
     * @param string $provider
     * @return User
     */
    public function execute(SocialiteUser $socialiteUser, string $provider): User
    {
        return DB::transaction(function () use ($socialiteUser, $provider) {
            // 新規ユーザーを作成（パスワードは null）
            $user = User::create([
                'name' => $socialiteUser->getName() ?? $socialiteUser->getNickname() ?? 'User',
                'email' => $socialiteUser->getEmail(),
                'password' => null,
            ]);

            // 個人チームを自動作成
            $this->createTeam($user);

            // OAuth アカウント情報を保存
            $this->createOAuthAccount($user, $socialiteUser, $provider);

            // プロフィール写真 URL が提供される場合、画像をダウンロードして保存
            if ($socialiteUser->getAvatar()) {
                $this->updateProfilePhoto($user, $socialiteUser->getAvatar());
            }

            return $user;
        });
    }

    /**
     * Create a personal team for the user.
     */
    protected function createTeam(User $user): void
    {
        $user->ownedTeams()->save(Team::forceCreate([
            'user_id' => $user->id,
            'name' => explode(' ', $user->name, 2)[0]."'s Team",
            'personal_team' => true,
        ]));
    }

    /**
     * Create OAuth account record.
     */
    protected function createOAuthAccount(User $user, SocialiteUser $socialiteUser, string $provider): void
    {
        OAuthAccount::create([
            'user_id' => $user->id,
            'provider' => $provider,
            'provider_id' => $socialiteUser->getId(),
            'access_token' => $socialiteUser->token,
            'refresh_token' => $socialiteUser->refreshToken,
            'expires_at' => $socialiteUser->expiresIn ? now()->addSeconds($socialiteUser->expiresIn) : null,
        ]);
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
            // プロフィール写真のダウンロードに失敗してもユーザー作成は続行
            \Log::warning('Failed to download profile photo from OAuth provider', [
                'user_id' => $user->id,
                'photo_url' => $photoUrl,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
