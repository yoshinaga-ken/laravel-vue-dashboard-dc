<?php

use App\Models\OAuthAccount;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;

uses(RefreshDatabase::class);

describe('OAuthController', function () {
    describe('redirect method', function () {
        test('redirects to google oauth provider', function () {
            $provider = Mockery::mock();
            $provider->shouldReceive('redirect')->andReturn(redirect('https://accounts.google.com/oauth'));

            Socialite::shouldReceive('driver')
                ->with('google')
                ->andReturn($provider);

            $response = $this->get('/oauth/redirect/google');

            $response->assertRedirect();
        });

        test('redirects to github oauth provider', function () {
            $provider = Mockery::mock();
            $provider->shouldReceive('redirect')->andReturn(redirect('https://github.com/login/oauth'));

            Socialite::shouldReceive('driver')
                ->with('github')
                ->andReturn($provider);

            $response = $this->get('/oauth/redirect/github');

            $response->assertRedirect();
        });

        test('rejects invalid provider', function () {
            $response = $this->get('/oauth/redirect/facebook');

            $response->assertRedirect(route('login'));
            $response->assertSessionHasErrors(['oauth']);
        });

        test('handles socialite error gracefully', function () {
            Socialite::shouldReceive('driver')
                ->with('google')
                ->andThrow(new \Exception('Socialite error'));

            $response = $this->get('/oauth/redirect/google');

            $response->assertRedirect(route('login'));
            $response->assertSessionHasErrors(['oauth']);
        });
    });

    describe('callback method', function () {
        test('creates new user and logs in', function () {
            $socialiteUser = Mockery::mock(SocialiteUser::class)->makePartial();
            $socialiteUser->shouldReceive('getName')->andReturn('Test User');
            $socialiteUser->shouldReceive('getEmail')->andReturn('newuser@example.com');
            $socialiteUser->shouldReceive('getId')->andReturn('google_123456');
            $socialiteUser->token = 'access_token_123';
            $socialiteUser->refreshToken = 'refresh_token_123';
            $socialiteUser->expiresIn = 3600;
            $socialiteUser->shouldReceive('getAvatar')->andReturn(null);

            $provider = Mockery::mock();
            $provider->shouldReceive('user')->andReturn($socialiteUser);

            Socialite::shouldReceive('driver')
                ->with('google')
                ->andReturn($provider);

            Http::fake();

            $response = $this->get('/oauth/callback/google');

            $response->assertRedirect(route('dashboard'));
            $this->assertAuthenticated();

            // ユーザーが作成されていることを確認
            $this->assertDatabaseHas('users', [
                'email' => 'newuser@example.com',
                'name' => 'Test User',
            ]);

            // OAuth アカウントが作成されていることを確認
            $user = User::where('email', 'newuser@example.com')->first();
            $this->assertDatabaseHas('oauth_accounts', [
                'user_id' => $user->id,
                'provider' => 'google',
                'provider_id' => 'google_123456',
            ]);
        });

        test('links oauth account to existing user', function () {
            $existingUser = User::factory()->withPersonalTeam()->create([
                'email' => 'existing@example.com',
            ]);

            $socialiteUser = Mockery::mock(SocialiteUser::class)->makePartial();
            $socialiteUser->shouldReceive('getName')->andReturn('Test User');
            $socialiteUser->shouldReceive('getEmail')->andReturn('existing@example.com');
            $socialiteUser->shouldReceive('getId')->andReturn('google_123456');
            $socialiteUser->token = 'access_token_123';
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

            $response->assertRedirect(route('dashboard'));
            $this->assertAuthenticatedAs($existingUser);

            // OAuth アカウントが連携されていることを確認
            $this->assertDatabaseHas('oauth_accounts', [
                'user_id' => $existingUser->id,
                'provider' => 'google',
                'provider_id' => 'google_123456',
            ]);
        });

        test('redirects to 2fa challenge when enabled', function () {
            $user = User::factory()->withPersonalTeam()->create([
                'email' => 'twofa@example.com',
                'two_factor_secret' => encrypt('secret'),
            ]);

            $socialiteUser = Mockery::mock(SocialiteUser::class)->makePartial();
            $socialiteUser->shouldReceive('getName')->andReturn('Test User');
            $socialiteUser->shouldReceive('getEmail')->andReturn('twofa@example.com');
            $socialiteUser->shouldReceive('getId')->andReturn('google_123456');
            $socialiteUser->token = 'access_token_123';
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

            $response->assertRedirect(route('two-factor.login'));
            expect(session('login.id'))->toBe($user->id);
        });

        test('rejects invalid provider in callback', function () {
            $response = $this->get('/oauth/callback/facebook');

            $response->assertRedirect(route('login'));
            $response->assertSessionHasErrors(['oauth']);
        });

        test('handles oauth callback error gracefully', function () {
            Socialite::shouldReceive('driver')
                ->with('google')
                ->andThrow(new \Exception('OAuth error'));

            $response = $this->get('/oauth/callback/google');

            $response->assertRedirect(route('login'));
            $response->assertSessionHasErrors(['oauth']);
        });
    });
});
