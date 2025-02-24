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

test('users can update articles', function () {
    $this->actingAs($user = User::factory()->withPersonalTeam()->create());
    $article = Article::factory()->create(['user_id' => $user->id]);

    $this->put("/articles/{$article->id}", [
        'title' => 'Updated title',
        'body' => 'Updated body',
        'tags' => ['tag1', 'tag2']
    ]);

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

