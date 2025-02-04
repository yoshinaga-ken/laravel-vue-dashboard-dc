<?php

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use function Pest\Laravel\actingAs;

uses(TestCase::class);
uses(RefreshDatabase::class);

/**
 * いいね系メソッドの統合テスト
 * - Article::isLikedBy
 * - Article::likedBy
 * - Article::dislikedBy
 */
test('integration tests for like methods', function () {
    /** @var User[] $users */
    $users = User::factory()->count(3)->create();
    /** @var Article $article */
    $article = Article::factory()->create();

    // 2つのユーザーよりいいねをもらう
    $article->likedBy($users[0]);
    $article->likedBy($users[1]);

    // チェック　ユーザーからのいいね
    $this->assertTrue($article->isLikedBy($users[0]->id));
    $this->assertTrue($article->isLikedBy($users[1]->id));
    $this->assertFalse($article->isLikedBy($users[2]->id));

    // チェック　いいねの数:2
    expect($article->likes->count())->toEqual(2);

    // User1いいね解除
    $article->dislikedBy($users[1]);
    // チェック　User1いいね解除
    $this->assertFalse($article->isLikedBy($users[1]->id));

    // チェック　いいねの数:1
    expect($article->likes->count())->toEqual(1);

    // User1いいね
    $article->likedBy($users[1]);
    // チェック　User1いいね
    $this->assertTrue($article->isLikedBy($users[1]->id));
    // チェック　いいねの数:2
    expect($article->likes->count())->toEqual(2);

    // USER2でログインする
    actingAs($users[2]);
    // チェック ログインユーザー:USER2 いいね
    $this->assertFalse($article->isLikedBy());
    // ログインユーザー:USER2 でいいねをする
    $article->likedBy($users[2]);
    // チェック ログインユーザー:USER2 いいね
    $this->assertTrue($article->isLikedBy());
});
