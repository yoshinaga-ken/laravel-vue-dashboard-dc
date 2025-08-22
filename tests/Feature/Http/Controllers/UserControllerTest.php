<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->targetUser = User::factory()->create();
});

// ユーザー詳細画面の表示テスト
test('authenticated user can view user profile', function () {
    // 認証済みユーザーでアクセス
    $this->actingAs($this->user);

    $response = $this->get(route('users.show', $this->targetUser));

    $response->assertStatus(200);
    $response->assertViewIs('app');
});

// 未認証でのユーザー詳細画面アクセステスト
test('unauthenticated user is redirected to login', function () {
    $response = $this->get(route('users.show', $this->targetUser));

    $response->assertRedirect(route('login'));
});

// 存在しないユーザーへのアクセステスト
test('returns page for nonexistent user', function () {
    $this->actingAs($this->user);

    $response = $this->get(route('users.show', 99999));

    // 現在の実装では存在しないユーザーでもページを表示する
    $response->assertStatus(200);
    $response->assertViewIs('app');
});

// ユーザーフォローAPIテスト
test('can follow user successfully', function () {
    Sanctum::actingAs($this->user, ['*']);

    $response = $this->putJson(route('api.users.follow', $this->targetUser));

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'id', 'name',
    ]);

    // データベースでフォロー関係を確認
    expect($this->user->following()->where('following_id', $this->targetUser->id)->exists())->toBeTrue();
});

// 自分自身をフォローしようとした場合のテスト
test('cannot follow self', function () {
    Sanctum::actingAs($this->user, ['*']);

    $response = $this->putJson(route('api.users.follow', $this->user));

    $response->assertStatus(404);
});

// 既にフォロー済みのユーザーをフォローしようとした場合のテスト
test('can follow already followed user', function () {
    // 事前にフォロー関係を作成
    $this->user->following()->attach($this->targetUser->id);

    Sanctum::actingAs($this->user, ['*']);

    $response = $this->putJson(route('api.users.follow', $this->targetUser));

    // 現在の実装では重複フォローを許可している
    $response->assertStatus(200);
});

// ユーザーアンフォローAPIテスト
test('can unfollow user successfully', function () {
    // 事前にフォロー関係を作成
    $this->user->following()->attach($this->targetUser->id);

    Sanctum::actingAs($this->user, ['*']);

    $response = $this->deleteJson(route('api.users.unfollow', $this->targetUser));

    $response->assertStatus(200);

    // データベースでフォロー関係の削除を確認
    expect($this->user->following()->where('following_id', $this->targetUser->id)->exists())->toBeFalse();
});

// フォローしていないユーザーをアンフォローしようとした場合のテスト
test('can unfollow not followed user', function () {
    Sanctum::actingAs($this->user, ['*']);

    $response = $this->deleteJson(route('api.users.unfollow', $this->targetUser));

    // 現在の実装では未フォロー状態でもアンフォローを許可している
    $response->assertStatus(200);
});

// 自分自身をアンフォローしようとした場合のテスト
test('cannot unfollow self', function () {
    Sanctum::actingAs($this->user, ['*']);

    $response = $this->deleteJson(route('api.users.unfollow', $this->user));

    $response->assertStatus(404);
});

// 無効なトークンでのAPIアクセステスト
test('api requires valid token', function () {
    $response = $this->putJson(route('api.users.follow', $this->targetUser));

    $response->assertStatus(401);
});

// APIのJSONレスポンステスト
test('api follow returns json when wants json', function () {
    Sanctum::actingAs($this->user, ['*']);

    $response = $this->putJson(route('api.users.follow', $this->targetUser), [], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(200);
    $response->assertJson([
        'id' => $this->targetUser->id,
        'name' => $this->targetUser->name,
    ]);
});

// Web経由でのフォローテスト（リダイレクトを確認）
test('web follow redirects back', function () {
    $this->actingAs($this->user);

    $response = $this->put(route('api.users.follow', $this->targetUser), [], [
        'Accept' => 'text/html',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');
});
