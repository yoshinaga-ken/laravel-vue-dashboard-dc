<?php

use App\Models\OAuthAccount;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('OAuthAccount Model', function () {
    test('can create oauth account', function () {
        $user = User::factory()->create();

        $oauthAccount = OAuthAccount::create([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => '123456789',
            'access_token' => 'test_access_token',
            'refresh_token' => 'test_refresh_token',
            'expires_at' => now()->addHour(),
        ]);

        expect($oauthAccount)->toBeInstanceOf(OAuthAccount::class)
            ->and($oauthAccount->user_id)->toBe($user->id)
            ->and($oauthAccount->provider)->toBe('google')
            ->and($oauthAccount->provider_id)->toBe('123456789');
    });

    test('belongs to user', function () {
        $user = User::factory()->create();
        $oauthAccount = OAuthAccount::factory()->create([
            'user_id' => $user->id,
        ]);

        expect($oauthAccount->user)->toBeInstanceOf(User::class)
            ->and($oauthAccount->user->id)->toBe($user->id);
    });

    test('encrypts access token', function () {
        $user = User::factory()->create();
        $plainToken = 'test_access_token_plain';

        $oauthAccount = OAuthAccount::create([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => '123456789',
            'access_token' => $plainToken,
        ]);

        // データベースに直接保存された値は暗号化されている
        $rawValue = \DB::table('oauth_accounts')
            ->where('id', $oauthAccount->id)
            ->value('access_token');

        expect($rawValue)->not->toBe($plainToken)
            ->and($oauthAccount->access_token)->toBe($plainToken);
    });

    test('encrypts refresh token', function () {
        $user = User::factory()->create();
        $plainToken = 'test_refresh_token_plain';

        $oauthAccount = OAuthAccount::create([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => '123456789',
            'access_token' => 'test_access_token',
            'refresh_token' => $plainToken,
        ]);

        // データベースに直接保存された値は暗号化されている
        $rawValue = \DB::table('oauth_accounts')
            ->where('id', $oauthAccount->id)
            ->value('refresh_token');

        expect($rawValue)->not->toBe($plainToken)
            ->and($oauthAccount->refresh_token)->toBe($plainToken);
    });

    test('validates google provider', function () {
        expect(OAuthAccount::isValidProvider('google'))->toBeTrue();
    });

    test('validates github provider', function () {
        expect(OAuthAccount::isValidProvider('github'))->toBeTrue();
    });

    test('rejects invalid provider', function () {
        expect(OAuthAccount::isValidProvider('facebook'))->toBeFalse()
            ->and(OAuthAccount::isValidProvider('twitter'))->toBeFalse()
            ->and(OAuthAccount::isValidProvider(''))->toBeFalse();
    });

    test('hides sensitive tokens in array', function () {
        $user = User::factory()->create();
        $oauthAccount = OAuthAccount::factory()->create([
            'user_id' => $user->id,
        ]);

        $array = $oauthAccount->toArray();

        expect($array)->not->toHaveKey('access_token')
            ->and($array)->not->toHaveKey('refresh_token');
    });

    test('casts expires_at to datetime', function () {
        $user = User::factory()->create();
        $expiresAt = now()->addHour();

        $oauthAccount = OAuthAccount::create([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => '123456789',
            'access_token' => 'test_access_token',
            'expires_at' => $expiresAt,
        ]);

        expect($oauthAccount->expires_at)->toBeInstanceOf(\Illuminate\Support\Carbon::class);
    });

    test('enforces unique provider and provider_id constraint', function () {
        $user = User::factory()->create();

        OAuthAccount::create([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => '123456789',
            'access_token' => 'test_access_token',
        ]);

        // 同じプロバイダー + プロバイダー ID の組み合わせは一意でなければならない
        OAuthAccount::create([
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => '123456789',
            'access_token' => 'test_access_token_2',
        ]);
    })->throws(\Illuminate\Database\QueryException::class);

    test('cascades delete when user is deleted', function () {
        $user = User::factory()->create();
        $oauthAccount = OAuthAccount::factory()->create([
            'user_id' => $user->id,
        ]);

        $user->delete();

        expect(OAuthAccount::find($oauthAccount->id))->toBeNull();
    });
});
