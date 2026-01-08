<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;

uses(RefreshDatabase::class);

describe('OAuth Integration', function () {
    test('complete oauth login flow for new user', function () {
        // Socialite ユーザーをモック
        $socialiteUser = Mockery::mock(SocialiteUser::class)->makePartial();
        $socialiteUser->shouldReceive('getName')->andReturn('New User');
        $socialiteUser->shouldReceive('getEmail')->andReturn('newuser@example.com');
        $socialiteUser->shouldReceive('getId')->andReturn('google_123456');
        $socialiteUser->token = 'access_token_123';
        $socialiteUser->refreshToken = 'refresh_token_123';
        $socialiteUser->expiresIn = 3600;
        $socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $provider = Mockery::mock();
        $provider->shouldReceive('redirect')->andReturn(redirect('https://accounts.google.com/oauth'));
        $provider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')
            ->with('google')
            ->andReturn($provider);

        Http::fake();

        // ステップ1: OAuth リダイレクト
        $redirectResponse = $this->get('/oauth/redirect/google');
        $redirectResponse->assertRedirect();

        // ステップ2: OAuth コールバック
        $callbackResponse = $this->get('/oauth/callback/google');
        $callbackResponse->assertRedirect(route('dashboard'));

        // ユーザーが作成され、ログインしていることを確認
        $this->assertAuthenticated();
        $user = User::where('email', 'newuser@example.com')->first();
        expect($user)->not->toBeNull()
            ->and($user->name)->toBe('New User');

        // OAuth アカウントが作成されていることを確認
        $this->assertDatabaseHas('oauth_accounts', [
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => 'google_123456',
        ]);

        // 個人チームが作成されていることを確認
        expect($user->ownedTeams)->toHaveCount(1)
            ->and($user->ownedTeams->first()->personal_team)->toBeTrue();
    });

    test('links oauth account to existing user', function () {
        $existingUser = User::factory()->withPersonalTeam()->create([
            'email' => 'existing@example.com',
            'name' => 'Existing User',
        ]);

        $socialiteUser = Mockery::mock(SocialiteUser::class)->makePartial();
        $socialiteUser->shouldReceive('getName')->andReturn('OAuth Name');
        $socialiteUser->shouldReceive('getEmail')->andReturn('existing@example.com');
        $socialiteUser->shouldReceive('getId')->andReturn('google_789012');
        $socialiteUser->token = 'access_token_456';
        $socialiteUser->refreshToken = null;
        $socialiteUser->expiresIn = null;
        $socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $provider = Mockery::mock();
        $provider->shouldReceive('redirect')->andReturn(redirect('https://accounts.google.com/oauth'));
        $provider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')
            ->with('google')
            ->andReturn($provider);

        Http::fake();

        // OAuth コールバック
        $response = $this->get('/oauth/callback/google');

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($existingUser);

        // OAuth アカウントが連携されていることを確認
        $this->assertDatabaseHas('oauth_accounts', [
            'user_id' => $existingUser->id,
            'provider' => 'google',
            'provider_id' => 'google_789012',
        ]);

        // 既存ユーザー名が保持されていることを確認
        $existingUser->refresh();
        expect($existingUser->name)->toBe('Existing User');

        // 新しいチームは作成されていないことを確認
        expect($existingUser->ownedTeams)->toHaveCount(1);
    });

    test('oauth login with 2fa enabled', function () {
        $user = User::factory()->withPersonalTeam()->create([
            'email' => 'twofa@example.com',
            'two_factor_secret' => encrypt('secret'),
        ]);

        $socialiteUser = Mockery::mock(SocialiteUser::class)->makePartial();
        $socialiteUser->shouldReceive('getName')->andReturn('Test User');
        $socialiteUser->shouldReceive('getEmail')->andReturn('twofa@example.com');
        $socialiteUser->shouldReceive('getId')->andReturn('google_2fa123');
        $socialiteUser->token = 'access_token_2fa';
        $socialiteUser->refreshToken = null;
        $socialiteUser->expiresIn = null;
        $socialiteUser->shouldReceive('getAvatar')->andReturn(null);

        $provider = Mockery::mock();
        $provider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')
            ->with('google')
            ->andReturn($provider);

        Http::fake();

        $response = $this->get('/oauth/callback/google');

        // 2FA チャレンジにリダイレクトされることを確認
        $response->assertRedirect(route('two-factor.login'));
        
        // セッションに login.id が保存されていることを確認
        expect(session('login.id'))->toBe($user->id)
            ->and(session('login.remember'))->toBe(false);
    });

    test('oauth login with profile photo sync', function () {
        // ダミーの画像レスポンスを作成
        Http::fake([
            'https://example.com/avatar.jpg' => Http::response(file_get_contents(__DIR__.'/../fixtures/avatar.jpg'), 200),
        ]);

        $socialiteUser = Mockery::mock(SocialiteUser::class)->makePartial();
        $socialiteUser->shouldReceive('getName')->andReturn('Photo User');
        $socialiteUser->shouldReceive('getEmail')->andReturn('photouser@example.com');
        $socialiteUser->shouldReceive('getId')->andReturn('google_photo123');
        $socialiteUser->token = 'access_token_photo';
        $socialiteUser->refreshToken = null;
        $socialiteUser->expiresIn = null;
        $socialiteUser->shouldReceive('getAvatar')->andReturn('https://example.com/avatar.jpg');

        $provider = Mockery::mock();
        $provider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')
            ->with('google')
            ->andReturn($provider);

        $response = $this->get('/oauth/callback/google');

        $response->assertRedirect(route('dashboard'));

        // ユーザーのプロフィール写真が設定されていることを確認
        $user = User::where('email', 'photouser@example.com')->first();
        expect($user->profile_photo_path)->not->toBeNull();
    });
});
