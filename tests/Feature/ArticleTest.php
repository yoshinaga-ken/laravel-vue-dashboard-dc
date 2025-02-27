<?php

use App\Models\Article;
use App\Models\User;

test('users cannot create an article when not logged in', function () {
    $this->get('/articles')
        ->assertRedirect('/login');
});

test('article.index parameter validation check', function () {
    $this->actingAs($user = User::factory()->withPersonalTeam()->create());

    $this->get('/articles?from=0&to=2')
        ->assertStatus(200);

    // validation エラーになるかチェック
    $this->get('/articles?from=-1&to=2')
        ->assertStatus(302);
});

test('users can create articles', function () {
    $this->actingAs($user = User::factory()->withPersonalTeam()->create());

    /** @var Illuminate\Http\RedirectResponse $response */
    $response = $this->post('/articles', [
        'title' => 'Test title',
        'body' => 'Test body',
        'tags' => ['tag1', 'tag2']
    ]);

    $article = Article::latest()->first(); // 最後に作成された記事を取得

    $response
        ->assertRedirect(route('articles.edit', $article->id))
        ->assertSessionHas('success', __('Article created', ['id' => $article->id]));

    expect($article->title)->toEqual('Test title');
    expect($article->body)->toEqual('Test body');
    expect($article->tags()->pluck('name')->toArray())->toEqual(['tag1', 'tag2']);
});

test('users can update articles', function () {
    $this->actingAs($user = User::factory()->withPersonalTeam()->create());
    $article = Article::factory()->create(['user_id' => $user->id]);

    $this->put("/articles/{$article->id}", [
        'title' => 'Updated title',
        'body' => 'Updated body',
        'tags' => ['tag1', 'tag2']
    ])
        ->assertRedirect(route('articles.edit', $article->id))
        ->assertSessionHas('success', __('Article updated', ['id' => $article->id]));

    $article->refresh();

    expect($article->title)->toEqual('Updated title');
    expect($article->body)->toEqual('Updated body');
    expect($article->tags()->pluck('name')->toArray())->toEqual(['tag1', 'tag2']);
});

test('users can delete their own articles', function () {
    $this->actingAs($user = User::factory()->withPersonalTeam()->create());
    $article = Article::factory()->create(['user_id' => $user->id]);

    $this->delete("/articles/{$article->id}")
        ->assertRedirect('/articles')
        ->assertSessionHas('success', __('Article deleted', ['id' => $article->id]));
});

test('users cannot delete an article they do not own', function () {
    $this->actingAs(User::factory()->withPersonalTeam()->create());
    $article = Article::factory()->create();

    $this->delete("/articles/{$article->id}")
        ->assertForbidden();
});

