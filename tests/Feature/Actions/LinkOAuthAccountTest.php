<?php

use App\Actions\Fortify\LinkOAuthAccount;
use App\Models\OAuthAccount;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Contracts\User as SocialiteUser;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Socialite ユーザーのモックを作成
    $this->socialiteUser = Mockery::mock(SocialiteUser::class)->makePartial();
    $this->action = new LinkOAuthAccount();
});

describe('LinkOAuthAccount Action', function () {
    test('links oauth account to existing user', function () {
        $user = User::factory()->withPersonalTeam()->create();

        $this->socialiteUser->shouldReceive('getName')->andReturn('OAuth Name');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn($user->email);
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = 'refresh_token_123';
        $this->socialiteUser->expiresIn = 3600;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $this->action->execute($user, $this->socialiteUser, 'google');

        $this->assertDatabaseHas('oauth_accounts', [
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => 'google_123456',
        ]);
    });

    test('updates existing oauth account if already linked', function () {
        $user = User::factory()->withPersonalTeam()->create();
        
        // 既存の OAuth アカウントを作成
        $existingOAuth = OAuthAccount::create([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => 'google_123456',
            'access_token' => 'old_access_token',
            'refresh_token' => 'old_refresh_token',
        ]);

        $this->socialiteUser->shouldReceive('getName')->andReturn('OAuth Name');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn($user->email);
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'new_access_token';
        $this->socialiteUser->refreshToken = 'new_refresh_token';
        $this->socialiteUser->expiresIn = 7200;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $this->action->execute($user, $this->socialiteUser, 'google');

        // OAuth アカウントが更新されていることを確認
        $updatedOAuth = OAuthAccount::find($existingOAuth->id);
        expect($updatedOAuth->access_token)->toBe('new_access_token')
            ->and($updatedOAuth->refresh_token)->toBe('new_refresh_token');

        // OAuth アカウントが重複していないことを確認
        $count = OAuthAccount::where('user_id', $user->id)
            ->where('provider', 'google')
            ->count();
        expect($count)->toBe(1);
    });

    test('does not overwrite existing user name', function () {
        $user = User::factory()->withPersonalTeam()->create([
            'name' => 'Existing Name',
        ]);

        $this->socialiteUser->shouldReceive('getName')->andReturn('OAuth Name');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn($user->email);
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = null;
        $this->socialiteUser->expiresIn = null;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $this->action->execute($user, $this->socialiteUser, 'google');

        // 既存の名前が保持されていることを確認
        $user->refresh();
        expect($user->name)->toBe('Existing Name');
    });

    test('updates empty user name from oauth', function () {
        $user = User::factory()->withPersonalTeam()->create([
            'name' => '',
        ]);

        $this->socialiteUser->shouldReceive('getName')->andReturn('OAuth Name');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn($user->email);
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = null;
        $this->socialiteUser->expiresIn = null;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $this->action->execute($user, $this->socialiteUser, 'google');

        // 名前が OAuth から更新されていることを確認
        $user->refresh();
        expect($user->name)->toBe('OAuth Name');
    });

    test('does not overwrite existing profile photo', function () {
        Http::fake([
            'https://example.com/avatar.jpg' => Http::response(file_get_contents(__DIR__.'/../../fixtures/avatar.jpg'), 200),
        ]);

        $user = User::factory()->withPersonalTeam()->create([
            'profile_photo_path' => 'existing/photo.jpg',
        ]);

        $this->socialiteUser->shouldReceive('getName')->andReturn('OAuth Name');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn($user->email);
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = null;
        $this->socialiteUser->expiresIn = null;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn('https://example.com/avatar.jpg');

        $this->action->execute($user, $this->socialiteUser, 'google');

        // 既存のプロフィール写真が保持されていることを確認
        $user->refresh();
        expect($user->profile_photo_path)->toBe('existing/photo.jpg');
    });

    test('updates profile photo when user has no photo', function () {
        Http::fake([
            'https://example.com/avatar.jpg' => Http::response(file_get_contents(__DIR__.'/../../fixtures/avatar.jpg'), 200),
        ]);

        $user = User::factory()->withPersonalTeam()->create([
            'profile_photo_path' => null,
        ]);

        $this->socialiteUser->shouldReceive('getName')->andReturn('OAuth Name');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn($user->email);
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = null;
        $this->socialiteUser->expiresIn = null;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn('https://example.com/avatar.jpg');

        $this->action->execute($user, $this->socialiteUser, 'google');

        // プロフィール写真が更新されていることを確認
        $user->refresh();
        expect($user->profile_photo_path)->not->toBeNull();
    });

    test('executes in transaction', function () {
        $user = User::factory()->withPersonalTeam()->create();

        $this->socialiteUser->shouldReceive('getName')->andReturn('OAuth Name');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn($user->email);
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = null;
        $this->socialiteUser->expiresIn = null;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $oauthCount = OAuthAccount::count();

        $this->action->execute($user, $this->socialiteUser, 'google');

        // OAuth アカウントが作成されていることを確認
        expect(OAuthAccount::count())->toBe($oauthCount + 1);
    });
});
