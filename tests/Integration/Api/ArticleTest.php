<?php

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Sanctum\Sanctum;

use Tests\TestCase;

uses(
    TestCase::class,
    DatabaseMigrations::class,
);

beforeEach(fn() => $this->seed());

const ArticleJsonStructure =
[
    'id',
    'title',
    'body',
    'created_at',
    'is_liked_by',
    'user' => [
        "id",
        "name",
        "email",
        "email_verified_at",
        "two_factor_confirmed_at",
        "current_team_id",
        "profile_photo_path",
        "created_at",
        "updated_at",
        "profile_photo_url",
    ],
    'tags' => [
        [
            "id",
            "name",
            "created_at",
            "updated_at",
        ]
    ],
    'likes'
];

it('api.articles.index', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    // 返すJSONの構造が正しい
    $j = $this->getJson(route('api.articles.index', ['from' => 0, 'to' => 0]));
    $j->assertJsonStructure([ArticleJsonStructure]);

    // ページングが正しい
    $from = 2;
    $to = 6;
    $j = $this->getJson(route('api.articles.index', ['from' => $from, 'to' => $to]));
    $j->assertJsonCount($to - $from + 1);

    // searchキーワードでの検索結果が正しい - 存在しない
    $j = $this->getJson(route('api.articles.index', ['search' => 'Keywords not in the title']));
    $j->assertJsonCount(0);

    // searchキーワードでの検索結果が正しい - 存在する
    /** @var Article $article */
    $article = Article::factory()->create(['title' => 'Unique title']);
    $j = $this->getJson(route('api.articles.index', ['search' => $article->title]));
    $j->assertJsonCount(1);
});

it('does not allow a guest to index', function () {
    $this->getJson(route('api.articles.index'))
        ->assertUnauthorized();
});

