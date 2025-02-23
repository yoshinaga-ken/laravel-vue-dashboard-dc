<?php

use App\Jobs\CreateArticle;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(
    TestCase::class,
    RefreshDatabase::class
);


test('we can create article', function () {
    $data = [
        'title' => 'Sample Article',
        'body' => 'This is a sample article.',
        'tags' => ['php', 'laravel']
    ];
    $user = User::factory()->create();

    $job = new CreateArticle($data, $user);
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
});
