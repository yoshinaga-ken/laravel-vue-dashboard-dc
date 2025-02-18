<?php

use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CreatesUsers;

uses(CreatesUsers::class);

test('users cannot create an article when not logged in', function () {
    $this->get('/articles')
        ->assertRedirect('/login');
});

test('article.index parameter validation check', function () {
    $user = $this->createUser();
    $this->loginAs($user);

    $this->get('/articles?from=0&to=2')
        ->assertStatus(200);

    // validation エラーになるかチェック
    $this->get('/articles?from=-1&to=2')
        ->assertStatus(302);
});

test('users can delete their own articles', function () {
    $user = $this->createUser();
    $article = Article::factory()->create(['user_id' => $user->id]);

    $this->loginAs($user);

    $this->delete("/articles/{$article->id}")
        ->assertRedirect('/articles')
        ->assertSessionHas('success', __('Article deleted', ['id' => $article->id]));
});

test('users cannot delete an article they do not own', function () {
    $article = Article::factory()->create();

    $this->login();

    $this->delete("/articles/{$article->id}")
        ->assertForbidden();
});

