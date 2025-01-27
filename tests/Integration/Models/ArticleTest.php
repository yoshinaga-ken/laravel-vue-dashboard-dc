<?php

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use function Pest\Laravel\actingAs;

uses(TestCase::class);
uses(RefreshDatabase::class);

/**
 * いいね系メソッドのテスト
 * - Article::isLikedBy
 * - Article::likedBy
 * - Article::dislikedBy
 */
test('いいね系メソッドのテスト', function () {
    $users = User::factory()->count(3)->create();
    /** @var Article[] $articles */
    $articles = Article::factory()->count(1)->create();

    // 2つのユーザーよりいいねをもらう
    $articles[0]->likedBy($users[0]);
    $articles[0]->likedBy($users[1]);

    // チェック　ユーザーからのいいね
    $this->assertTrue($articles[0]->isLikedBy($users[0]->id));
    $this->assertTrue($articles[0]->isLikedBy($users[1]->id));
    $this->assertFalse($articles[0]->isLikedBy($users[2]->id));

    // チェック　いいねの数:2
    expect($articles[0]->likes->count())->toEqual(2);

    // User1いいね解除
    $articles[0]->dislikedBy($users[1]);
    // チェック　User1いいね解除
    $this->assertFalse($articles[0]->isLikedBy($users[1]->id));

    // チェック　いいねの数:1
    expect($articles[0]->likes->count())->toEqual(1);

    // User1いいね
    $articles[0]->likedBy($users[1]);
    // チェック　User1いいね
    $this->assertTrue($articles[0]->isLikedBy($users[1]->id));
    // チェック　いいねの数:2
    expect($articles[0]->likes->count())->toEqual(2);

    // USER2でログインする
    actingAs($users[2]);
    // チェック ログインユーザー:USER2 いいね
    $this->assertFalse($articles[0]->isLikedBy());
    // ログインユーザー:USER2 でいいねをする
    $articles[0]->likedBy($users[2]);
    // チェック ログインユーザー:USER2 いいね
    $this->assertTrue($articles[0]->isLikedBy());
});
