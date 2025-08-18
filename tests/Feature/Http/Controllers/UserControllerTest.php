<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\User;
use App\Models\Article;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class UserControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;
    protected User $targetUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->targetUser = User::factory()->create();
    }

    /**
     * ユーザー詳細画面の表示テスト
     */
    public function test_show_returns_user_view(): void
    {
        // 認証済みユーザーでアクセス
        $this->actingAs($this->user);

        $response = $this->get(route('users.show', $this->targetUser));

        $response->assertStatus(200);
        $response->assertViewIs('app');
    }

    /**
     * 未認証でのユーザー詳細画面アクセステスト
     */
    public function test_show_redirects_when_unauthenticated(): void
    {
        $response = $this->get(route('users.show', $this->targetUser));

        $response->assertRedirect(route('login'));
    }

    /**
     * 存在しないユーザーへのアクセステスト
     */
    public function test_show_returns_page_for_nonexistent_user(): void
    {
        $this->actingAs($this->user);

        $response = $this->get(route('users.show', 99999));

        // 現在の実装では存在しないユーザーでもページを表示する
        $response->assertStatus(200);
        $response->assertViewIs('app');
    }

    /**
     * ユーザーフォローAPIテスト
     */
    public function test_follow_user_success(): void
    {
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->putJson(route('api.users.follow', $this->targetUser));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id', 'name'
        ]);

        // データベースでフォロー関係を確認
        $this->assertTrue($this->user->following()->where('following_id', $this->targetUser->id)->exists());
    }

    /**
     * 自分自身をフォローしようとした場合のテスト
     */
    public function test_cannot_follow_self(): void
    {
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->putJson(route('api.users.follow', $this->user));

        $response->assertStatus(404);
    }

    /**
     * 既にフォロー済みのユーザーをフォローしようとした場合のテスト
     */
    public function test_can_follow_already_followed_user(): void
    {
        // 事前にフォロー関係を作成
        $this->user->following()->attach($this->targetUser->id);

        Sanctum::actingAs($this->user, ['*']);

        $response = $this->putJson(route('api.users.follow', $this->targetUser));

        // 現在の実装では重複フォローを許可している
        $response->assertStatus(200);
    }

    /**
     * ユーザーアンフォローAPIテスト
     */
    public function test_unfollow_user_success(): void
    {
        // 事前にフォロー関係を作成
        $this->user->following()->attach($this->targetUser->id);

        Sanctum::actingAs($this->user, ['*']);

        $response = $this->deleteJson(route('api.users.unfollow', $this->targetUser));

        $response->assertStatus(200);

        // データベースでフォロー関係の削除を確認
        $this->assertFalse($this->user->following()->where('following_id', $this->targetUser->id)->exists());
    }

    /**
     * フォローしていないユーザーをアンフォローしようとした場合のテスト
     */
    public function test_can_unfollow_not_followed_user(): void
    {
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->deleteJson(route('api.users.unfollow', $this->targetUser));

        // 現在の実装では未フォロー状態でもアンフォローを許可している
        $response->assertStatus(200);
    }

    /**
     * 自分自身をアンフォローしようとした場合のテスト
     */
    public function test_cannot_unfollow_self(): void
    {
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->deleteJson(route('api.users.unfollow', $this->user));

        $response->assertStatus(404);
    }

    /**
     * 無効なトークンでのAPIアクセステスト
     */
    public function test_api_requires_valid_token(): void
    {
        $response = $this->putJson(route('api.users.follow', $this->targetUser));

        $response->assertStatus(401);
    }

    /**
     * APIのJSONレスポンステスト
     */
    public function test_api_follow_returns_json_when_wants_json(): void
    {
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->putJson(route('api.users.follow', $this->targetUser), [], [
            'Accept' => 'application/json'
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $this->targetUser->id,
            'name' => $this->targetUser->name
        ]);
    }

    /**
     * Web経由でのフォローテスト（リダイレクトを確認）
     */
    public function test_web_follow_redirects_back(): void
    {
        $this->actingAs($this->user);

        $response = $this->put(route('api.users.follow', $this->targetUser), [], [
            'Accept' => 'text/html'
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
    }
}
