<?php

use App\Events\ArticleWasSubmittedForApproval;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Models\Tag;
use App\Models\Team;
use App\Models\User;
use Database\Factories\ArticleFactory;
use Database\Factories\TagFactory;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\Sanctum;

use Tests\CreatesUsers;
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
    $user = User::factory()->create();
    $follower1 = User::factory()->create();
    Sanctum::actingAs($user);

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

