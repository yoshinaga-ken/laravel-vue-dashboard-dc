<?php

use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\CreatesUsers;

uses(CreatesUsers::class);
uses(RefreshDatabase::class);


test('users cannot create an article when not logged in', function () {
    $this->get('/articles')
        ->assertRedirect('/login');
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

