<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(
    TestCase::class,
    RefreshDatabase::class
);

const FollowJsonStructure =
[
    'id',
    'name',
];

it('api.users.follow|unfollow', function () {
    $this->actingAs($user = User::factory()->withPersonalTeam()->create());
    $follower1 = User::factory()->create();

    // フォロー OFF　チェック
    $this->assertFalse($follower1->isFollowedBy());

    // 🚀フォロー ON
    $this->putJson(route('api.users.follow', $follower1->id))
        ->assertJsonStructure(FollowJsonStructure);

    // フォロー ON　チェック
    $this->assertTrue($follower1->isFollowedBy());

    // 🚀フォロー OFF
    $this->deleteJson(route('api.users.unfollow', $follower1->id))
        ->assertJsonStructure(FollowJsonStructure);

    // フォロー OFF　チェック
    $this->assertFalse($follower1->isFollowedBy());

    // 自分はフォロー・アンフォローできないチェック

    // 🚀フォロー ON
    $this->putJson(route('api.users.follow', $user->id))
        ->assertStatus(404);

    // 🚀フォロー OFF
    $this->deleteJson(route('api.users.unfollow', $user->id))
        ->assertStatus(404);
});

