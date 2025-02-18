<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use function Pest\Laravel\actingAs;

uses(TestCase::class);
uses(RefreshDatabase::class);

/**
 * フォロー系メソッドの統合テスト
 * - User::isFollowedBy
 * - User::followedBy
 * - User::unfollowedBy
 */
test('integration tests for follow methods', function () {
    $user = User::factory()->create();
    $follower1 = User::factory()->create();
    $follower2 = User::factory()->create();

    // フォロー OFF　チェック
    $this->assertFalse($user->isFollowedBy($follower1->id));

    // フォロー ON
    $user->followedBy($follower1);
    $user->followedBy($follower2);

    // フォロー ON　チェック
    $this->assertTrue($user->isFollowedBy($follower1->id));

    // フォロー数チェック
    $this->assertEquals(2, $user->followers()->count());

    // フォロー Off
    $user->unfollowedBy($follower1);

    // フォロー OFF　チェック
    $this->assertFalse($user->isFollowedBy($follower1->id));

    // フォロー数チェック
    $this->assertEquals(1, $user->followers()->count());
});

test('@isFlowedBy - parameter test - user_id:null', function () {
    $user = User::factory()->create();
    $loginUser = User::factory()->create();

    actingAs($loginUser);

    // $user は $loginUser にフォローされていない
    $this->assertFalse($user->isFollowedBy());

    // $loginUser でフォロー
    $user->followedBy($loginUser);

    // $user は $loginUser にフォローされている
    $this->assertTrue($user->isFollowedBy());
});
