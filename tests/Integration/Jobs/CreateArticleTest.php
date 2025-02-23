<?php

use App\Events\ArticleCreated;
use App\Jobs\CreateArticle;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

uses(
    TestCase::class,
    RefreshDatabase::class
);


it('we can create article', function () {
    Event::fake();

    $data = [
        'title' => 'Sample Article',
        'body' => 'This is a sample article.',
        'tags' => ['php', 'laravel']
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

    $this->assertDatabaseHas('tags', ['name' => 'php']);
    $this->assertDatabaseHas('tags', ['name' => 'laravel']);
    $this->assertDatabaseHas('article_tag', ['article_id' => $articleId]);

    Event::assertDispatched(ArticleCreated::class);
});
