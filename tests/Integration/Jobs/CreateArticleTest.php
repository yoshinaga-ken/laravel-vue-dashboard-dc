<?php

use App\Events\ArticleCreated;
use App\Jobs\CreateArticle;
use App\Jobs\UpdateArticle;
use App\Models\Article;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

uses(
    TestCase::class,
    RefreshDatabase::class
);

it('we can create article', function () {
    Event::fake();

    // タグを作成
    $tag = Tag::factory()->create(['name' => 'tag1']);
    $newTagName = "new tag"; // 新規作成されるタグ
    $tagCount = Tag::count();

    $data = [
        'title' => 'Sample Article',
        'body' => 'This is a sample article.',
        'tags' => [$tag->name, $newTagName]
    ];
    $user = User::factory()->create();

    $job = new CreateArticle($data, $user, true);
    $articleId = $job->handle();

    $this->assertDatabaseHas('articles', [
        'id' => $articleId,
        'title' => 'Sample Article',
        'body' => 'This is a sample article.',
        'user_id' => $user->id
    ]);

    $this->assertDatabaseHas('tags', ['name' => $tag->name]);
    $this->assertDatabaseHas('tags', ['name' => $newTagName]);
    // 存在しないタグ($newTagName)は新規作成されているのをチェック
    $this->assertDatabaseCount('tags', $tagCount + 1);

    Event::assertDispatched(ArticleCreated::class, function ($event) use ($articleId) {
        return $event->article->id === $articleId;
    });
});

it('we can update article', function () {
    Event::fake();

    $article = Article::factory()->create(['title' => 'Original Title']);
    $data = ['title' => 'Updated Title', 'tags' => ['tag1', 'tag2']];
    $article->user()->associate($user = User::factory()->create());

    $job = new UpdateArticle($article, $data, false);
    $articleId = $job->handle();

    $this->assertDatabaseHas('articles', [
        'id' => $articleId,
        'title' => 'Updated Title',
        'body' => $article->body,
        'user_id' => $user->id
    ]);

    $this->assertDatabaseHas('tags', ['name' => 'tag1']);
    $this->assertDatabaseHas('tags', ['name' => 'tag2']);
    $this->assertDatabaseHas('article_tag', ['article_id' => $articleId]);

    Event::assertNotDispatched(ArticleCreated::class);
});

it('we can not update article when transaction failed', function () {
    Event::fake();

    $article = Article::factory()->create(['title' => 'Original Title']);
    $data = ['title' => 'Updated Title', 'tags' => ['tag1', 'tag2']];

    DB::shouldReceive('transaction')->andThrow(new \Exception('Transaction failed'));

    $job = new UpdateArticle($article, $data, true);

    $this->expectException(\Exception::class);
    $job->handle();

    $this->assertDatabaseHas('articles', ['id' => $article->id, 'title' => 'Original Title']);
    Event::assertNotDispatched(ArticleCreated::class);
});

