<?php

use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Models\Tag;
use App\Models\User;
use Database\Factories\ArticleFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

use Tests\TestCase;

uses(
    TestCase::class,
    RefreshDatabase::class,
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
        'id',
        'name',
        'email',
        'created_at',
        'updated_at',
        'is_followed_by',
        'followers' => [],
        'following' => [],
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

    // 🚀記事一覧取得
    $j = $this->getJson(route('api.articles.index', ['from' => 0, 'to' => 0]));

    // APIのレスポンスのJSONのフォーマットチェック
    $j->assertJsonStructure([ArticleJsonStructure]);

    // ページングが正しい
    $from = 2;
    $to = 6;
    // 🚀記事一覧取得
    $j = $this->getJson(route('api.articles.index', ['from' => $from, 'to' => $to]));
    $j->assertJsonCount($to - $from + 1);

    // searchキーワードでの検索結果が正しい - 存在しない
    // 🚀記事一覧取得
    $j = $this->getJson(route('api.articles.index', ['search' => 'Keywords not in the title']));
    $j->assertJsonCount(0);

    // searchキーワードでの検索結果が正しい - 存在する
    /** @var Article $article */
    $article = Article::factory()->create(['title' => 'Unique title']);
    // 🚀記事一覧取得
    $j = $this->getJson(route('api.articles.index', ['search' => $article->title]));
    $j->assertJsonCount(1);

    // Validation が実装されているか？
    // 🚀記事一覧取得
    $j = $this->getJson(route('api.articles.index', ['from' => -1, 'to' => 2]));
    $j->assertJsonStructure(['message','errors' => []]);
});

it('api.articles.index - param:user_id', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    Article::factory()->count(8)->create(['user_id' => $user->id]);
    $userArticleCount = Article::where('user_id', $user->id)->count();
    // 🚀記事一覧取得
    $j = $this->getJson(route('api.articles.index', ['user_id' => $user->id]));
    $j->assertJsonCount($userArticleCount);

    $from = 1; $to = 3;
    // 🚀記事一覧取得
    $j = $this->getJson(route('api.articles.index', ['user_id' => $user->id,'from' => $from, 'to' => $to]));
    $j->assertJsonCount($to - $from + 1);
});


it('api.articles.store|update', function (string $method) {
    $user = User::factory()->create();
    Sanctum::actingAs($user, ['create', 'update']);

    if ($method === 'update') {
        $article = Article::factory()->create(['user_id' => $user->id]);
    }

    // 適当なTagを2件取得
    $tags = Tag::inRandomOrder()->limit(2)->get();
    $tagCount = Tag::query()->count();

    $uniqTime = time();
    $data = [
        'title' => "test.api.articles.{$method}.{$uniqTime}",
        'body' => fake()->text(),
        'tags' => [$tags[0]->name, $tags[1]->name, "newCreate{$uniqTime}"],
    ];

    // 🚀記事更新|新規作成
    if ($method === 'update') {
        $j = $this->putJson(route('api.articles.update', $article->id), $data);
    } else {
        $j = $this->postJson(route('api.articles.store'), $data);
    }

    // APIのレスポンスのJSONのフォーマットチェック
    $j->assertJsonStructure(['data' => ArticleJsonStructure]);

    $article_id = $j->json()['data']['id'];

    // ArticleがDBに保存されているかチェック
    $this->assertDatabaseHas('articles', [
        'id' => $article_id,
        'user_id' => $user->id,
        'title' => $data['title'],
        'body' => $data['body'],
    ]);

    // ArticlesのTagがDBに保存されているかチェック
    $createdArticle = ArticleResource::make(Article::with('tags')->find($article_id));
    $this->assertEquals($createdArticle->tags->pluck('name')->toArray(), $data['tags']);

    // 新規名前のTag(name:"newCreate{$uniqTime}")が1件新規追加されているかチェック
    expect(Tag::query()->count())->toBe($tagCount + 1);

    // Validation が実装されているか？
    $data['title'] = '';
    // 🚀記事更新|新規作成
    if ($method === 'update') {
        $j = $this->putJson(route('api.articles.update', $article->id), $data);
    } else {
        $j = $this->postJson(route('api.articles.store'), $data);
    }
    $j->assertJsonStructure(['message','errors' => []]);
})->with('dataset.article.store|update');

dataset('dataset.article.store|update', [
    'store' => ['store'],
    'update' => ['update'],
]);

it('api.articles.delete', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user, ['delete']);

    // $userのArticleを作成
    $article = Article::factory()->create(['user_id' => $user->id]);

    // 🚀記事削除
    $j = $this->deleteJson(route('api.articles.destroy', $article->id));

    // APIのレスポンスのJSONのフォーマットチェック
    $j->assertJson([
        'article_id' => $article->id,
    ]);

    // $article->id の article が削除されているかチェック
    $this->assertDatabaseMissing('articles', [
        'id' => $article->id,
    ]);
});

it('api.like|dislike', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $article = Article::factory()->create();
    $article->tags()->create(['name' => 'uniqTag']);

    // いいね OFF　チェック
    $this->assertFalse($article->isLikedBy($user->id));

    // 🚀いいね ON
    $j = $this->putJson(route('api.articles.like', $article->id));

    // APIのレスポンスのJSONのフォーマットチェック
    $j->assertJsonStructure(ArticleJsonStructure);
    // いいね ON チェック
    $this->assertTrue($article->isLikedBy($user->id));

    // 🚀いいね OFF
    $j = $this->deleteJson(route('api.articles.dislike', $article->id));

    // APIのレスポンスのJSONのフォーマットチェック
    $j->assertJsonStructure(ArticleJsonStructure);
    // いいね OFF　チェック
    $this->assertFalse($article->isLikedBy($user->id));
});

it('does not allow a guest to index', function () {
    $this->getJson(route('api.articles.index'))
        ->assertUnauthorized();
});

it('does not allow a guest to create', function () {
    $this->postJson(route('api.articles.store'))
        ->assertUnauthorized();
});

it('does not allow a guest to update', function () {
    $article = Article::factory()->create();
    $this->putJson(route('api.articles.update', $article->id))
        ->assertUnauthorized();
});

it('does not allow a guest to delete', function () {
    $article = Article::factory()->create();
    $this->deleteJson(route('api.articles.destroy', $article->id))
        ->assertUnauthorized();
});

it('does not allow a user to delete another user\'s article', function () {
    $user = User::factory()->create();

    $article = ArticleFactory::new()->create();

    Sanctum::actingAs($user, ['delete']);

    $this->deleteJson(route('api.articles.destroy', $article->id))
        ->assertForbidden();
});
