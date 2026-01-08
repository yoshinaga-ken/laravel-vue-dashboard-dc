<?php

use App\Actions\Fortify\CreateUserFromOAuth;
use App\Models\OAuthAccount;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Contracts\User as SocialiteUser;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Socialite ユーザーのモックを作成
    $this->socialiteUser = Mockery::mock(SocialiteUser::class)->makePartial();
    $this->action = new CreateUserFromOAuth();
});

describe('CreateUserFromOAuth Action', function () {
    test('creates new user from oauth provider', function () {
        $this->socialiteUser->shouldReceive('getName')->andReturn('Test User');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn('test@example.com');
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = 'refresh_token_123';
        $this->socialiteUser->expiresIn = 3600;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $user = $this->action->execute($this->socialiteUser, 'google');

        expect($user)->toBeInstanceOf(User::class)
            ->and($user->name)->toBe('Test User')
            ->and($user->email)->toBe('test@example.com')
            ->and($user->password)->not->toBeNull()
            ->and($user->email_verified_at)->not->toBeNull();

        // ユーザーがデータベースに保存されていることを確認
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);
    });

    test('creates personal team for new user', function () {
        $this->socialiteUser->shouldReceive('getName')->andReturn('Test User');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn('test@example.com');
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = null;
        $this->socialiteUser->expiresIn = null;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $user = $this->action->execute($this->socialiteUser, 'google');

        expect($user->ownedTeams)->toHaveCount(1)
            ->and($user->ownedTeams->first()->personal_team)->toBeTrue()
            ->and($user->ownedTeams->first()->name)->toBe("Test's Team");
    });

    test('creates oauth account record', function () {
        $this->socialiteUser->shouldReceive('getName')->andReturn('Test User');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn('test@example.com');
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = 'refresh_token_123';
        $this->socialiteUser->expiresIn = 3600;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $user = $this->action->execute($this->socialiteUser, 'google');

        $this->assertDatabaseHas('oauth_accounts', [
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => 'google_123456',
        ]);

        $oauthAccount = OAuthAccount::where('user_id', $user->id)->first();
        expect($oauthAccount->access_token)->toBe('access_token_123')
            ->and($oauthAccount->refresh_token)->toBe('refresh_token_123')
            ->and($oauthAccount->expires_at)->not->toBeNull();
    });

    test('downloads and saves profile photo when provided', function () {
        Http::fake([
            'https://example.com/avatar.jpg' => Http::response(file_get_contents(__DIR__.'/../../fixtures/avatar.jpg'), 200),
        ]);

        $this->socialiteUser->shouldReceive('getName')->andReturn('Test User');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn('test@example.com');
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = null;
        $this->socialiteUser->expiresIn = null;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn('https://example.com/avatar.jpg');

        $user = $this->action->execute($this->socialiteUser, 'google');

        expect($user->profile_photo_path)->not->toBeNull();
    });

    test('handles profile photo download failure gracefully', function () {
        Http::fake([
            'https://example.com/avatar.jpg' => Http::response('', 404),
        ]);

        $this->socialiteUser->shouldReceive('getName')->andReturn('Test User');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn('test@example.com');
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = null;
        $this->socialiteUser->expiresIn = null;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn('https://example.com/avatar.jpg');

        // プロフィール写真のダウンロードに失敗してもユーザー作成は成功する
        $user = $this->action->execute($this->socialiteUser, 'google');

        expect($user)->toBeInstanceOf(User::class)
            ->and($user->profile_photo_path)->toBeNull();
    });

    test('executes in transaction', function () {
        $this->socialiteUser->shouldReceive('getName')->andReturn('Test User');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn('test@example.com');
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = null;
        $this->socialiteUser->expiresIn = null;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $userCount = User::count();
        $oauthCount = OAuthAccount::count();

        $user = $this->action->execute($this->socialiteUser, 'google');

        // ユーザーと OAuth アカウントが両方作成されていることを確認
        expect(User::count())->toBe($userCount + 1)
            ->and(OAuthAccount::count())->toBe($oauthCount + 1);
    });

    test('uses nickname when name is not provided', function () {
        $this->socialiteUser->shouldReceive('getName')->andReturn(null);
        $this->socialiteUser->shouldReceive('getNickname')->andReturn('TestNickname');
        $this->socialiteUser->shouldReceive('getEmail')->andReturn('test@example.com');
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = null;
        $this->socialiteUser->expiresIn = null;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $user = $this->action->execute($this->socialiteUser, 'google');

        expect($user->name)->toBe('TestNickname');
    });

    test('uses default name when both name and nickname are not provided', function () {
        $this->socialiteUser->shouldReceive('getName')->andReturn(null);
        $this->socialiteUser->shouldReceive('getNickname')->andReturn(null);
        $this->socialiteUser->shouldReceive('getEmail')->andReturn('test@example.com');
        $this->socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $this->socialiteUser->token = 'access_token_123';
        $this->socialiteUser->refreshToken = null;
        $this->socialiteUser->expiresIn = null;
        $this->socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $user = $this->action->execute($this->socialiteUser, 'google');

        expect($user->name)->toBe('User');
    });
});
