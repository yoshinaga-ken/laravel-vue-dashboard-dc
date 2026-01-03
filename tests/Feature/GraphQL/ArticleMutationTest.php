<?php

use App\Models\Article;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
});

// createArticle mutation の基本テスト
test('createArticle mutation creates new article', function () {
    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation CreateArticle($input: CreateArticleInput!) {
            createArticle(input: $input) {
                id
                title
                body
                user {
                    id
                    name
                }
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'input' => [
                'title' => 'Test Article',
                'body' => 'This is a test article body content.',
            ],
        ],
    ]);

    $response->assertStatus(200);

    // エラーレスポンスの場合はデバッグ出力してエラーを確認
    if ($response->json('errors')) {
        $errors = $response->json('errors');
        $this->fail('GraphQL Error: ' . json_encode($errors, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    $response->assertJsonStructure([
        'data' => [
            'createArticle' => [
                'id', 'title', 'body', 'user',
            ],
        ],
    ]);

    $articleData = $response->json('data.createArticle');
    expect($articleData['title'])->toBe('Test Article');
    expect($articleData['body'])->toBe('This is a test article body content.');
    expect($articleData['user']['id'])->toBe((string)$this->user->id);

    // データベースに保存されていることを確認
    $article = Article::find($articleData['id']);
    expect($article)->not->toBeNull();
    expect($article->title)->toBe('Test Article');
    expect($article->user_id)->toBe($this->user->id);
});

// createArticle mutation でタグ付きで作成
test('createArticle mutation creates article with tags', function () {
    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation CreateArticle($input: CreateArticleInput!) {
            createArticle(input: $input) {
                id
                title
                body
                tags {
                    id
                    name
                }
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'input' => [
                'title' => 'Article with Tags',
                'body' => 'Article body with tags',
                'tags' => ['PHP', 'Laravel', 'GraphQL'],
            ],
        ],
    ]);

    $response->assertStatus(200);
    $articleData = $response->json('data.createArticle');
    expect($articleData['tags'])->toHaveCount(3);

    // タグがデータベースに作成されていることを確認
    $article = Article::find($articleData['id']);
    expect($article->tags)->toHaveCount(3);
});

// createArticle mutation のバリデーションテスト
test('createArticle mutation validates required fields', function () {
    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation CreateArticle($input: CreateArticleInput!) {
            createArticle(input: $input) {
                id
                title
            }
        }
    ';

    // title が空の場合
    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'input' => [
                'title' => '',
                'body' => 'Body content',
            ],
        ],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'errors' => [
            '*' => ['message'],
        ],
    ]);
});

// createArticle mutation の認証テスト
test('createArticle mutation requires authentication', function () {
    $mutation = '
        mutation CreateArticle($input: CreateArticleInput!) {
            createArticle(input: $input) {
                id
                title
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'input' => [
                'title' => 'Test Article',
                'body' => 'Body content',
            ],
        ],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'errors' => [
            '*' => ['message'],
        ],
    ]);
});

// updateArticle mutation の基本テスト
test('updateArticle mutation updates article', function () {
    $article = Article::factory()->create(['user_id' => $this->user->id]);

    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation UpdateArticle($id: ID!, $input: UpdateArticleInput!) {
            updateArticle(id: $id, input: $input) {
                id
                title
                body
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$article->id,
            'input' => [
                'title' => 'Updated Title',
                'body' => 'Updated body content',
            ],
        ],
    ]);

    $response->assertStatus(200);

    // エラーレスポンスの場合はデバッグ出力してエラーを確認
    if ($response->json('errors')) {
        $errors = $response->json('errors');
        $this->fail('GraphQL Error: ' . json_encode($errors, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    $response->assertJsonStructure([
        'data' => [
            'updateArticle' => [
                'id', 'title', 'body',
            ],
        ],
    ]);

    $articleData = $response->json('data.updateArticle');
    expect($articleData['title'])->toBe('Updated Title');
    expect($articleData['body'])->toBe('Updated body content');

    // データベースが更新されていることを確認
    $article->refresh();
    expect($article->title)->toBe('Updated Title');
    expect($article->body)->toBe('Updated body content');
});

// updateArticle mutation の認可テスト（他人の記事は更新できない）
test('updateArticle mutation requires ownership', function () {
    $article = Article::factory()->create(['user_id' => $this->otherUser->id]);

    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation UpdateArticle($id: ID!, $input: UpdateArticleInput!) {
            updateArticle(id: $id, input: $input) {
                id
                title
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$article->id,
            'input' => [
                'title' => 'Updated Title',
                'body' => 'Updated body',
            ],
        ],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'errors' => [
            '*' => ['message'],
        ],
    ]);
});

// deleteArticle mutation の基本テスト
test('deleteArticle mutation deletes article', function () {
    $article = Article::factory()->create(['user_id' => $this->user->id]);
    $articleId = $article->id;

    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation DeleteArticle($id: ID!) {
            deleteArticle(id: $id) {
                id
                title
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => ['id' => (string)$articleId],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => [
            'deleteArticle' => [
                'id', 'title',
            ],
        ],
    ]);

    // データベースから削除されていることを確認
    expect(Article::find($articleId))->toBeNull();
});

// deleteArticle mutation の認可テスト
test('deleteArticle mutation requires ownership', function () {
    $article = Article::factory()->create(['user_id' => $this->otherUser->id]);

    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation DeleteArticle($id: ID!) {
            deleteArticle(id: $id) {
                id
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => ['id' => (string)$article->id],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'errors' => [
            '*' => ['message'],
        ],
    ]);

    // 記事が削除されていないことを確認
    expect(Article::find($article->id))->not->toBeNull();
});

// associateUserArticle mutation の基本テスト
test('associateUserArticle mutation associates user to article', function () {
    $article = Article::factory()->create(['user_id' => $this->user->id]);

    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation AssociateUserArticle($id: ID!, $userId: ID!) {
            associateUserArticle(id: $id, user_id: $userId) {
                id
                user {
                    id
                    name
                }
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$article->id,
            'userId' => (string)$this->otherUser->id,
        ],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => [
            'associateUserArticle' => [
                'id',
                'user' => ['id', 'name'],
            ],
        ],
    ]);

    $articleData = $response->json('data.associateUserArticle');
    expect($articleData['user']['id'])->toBe((string)$this->otherUser->id);

    // データベースが更新されていることを確認
    $article->refresh();
    expect($article->user_id)->toBe($this->otherUser->id);
});

// attachTagsArticle mutation の基本テスト
test('attachTagsArticle mutation attaches tags to article', function () {
    $article = Article::factory()->create(['user_id' => $this->user->id]);
    $tags = Tag::factory(3)->create();

    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation AttachTagsArticle($id: ID!, $tagIds: [ID!]!) {
            attachTagsArticle(id: $id, tagIds: $tagIds) {
                id
                tags {
                    id
                    name
                }
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$article->id,
            'tagIds' => $tags->pluck('id')->map(fn($id) => (string)$id)->toArray(),
        ],
    ]);

    $response->assertStatus(200);
    $articleData = $response->json('data.attachTagsArticle');
    expect($articleData['tags'])->toHaveCount(3);

    // データベースにタグが関連付けられていることを確認
    $article->refresh();
    expect($article->tags)->toHaveCount(3);
});

// detachTagsArticle mutation の基本テスト
test('detachTagsArticle mutation detaches tags from article', function () {
    $article = Article::factory()->create(['user_id' => $this->user->id]);
    $tags = Tag::factory(3)->create();
    $article->tags()->attach($tags->pluck('id'));

    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation DetachTagsArticle($id: ID!, $tagIds: [ID!]!) {
            detachTagsArticle(id: $id, tagIds: $tagIds) {
                id
                tags {
                    id
                    name
                }
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$article->id,
            'tagIds' => [(string)$tags->first()->id],
        ],
    ]);

    $response->assertStatus(200);
    $articleData = $response->json('data.detachTagsArticle');
    expect($articleData['tags'])->toHaveCount(2);

    // データベースからタグが削除されていることを確認
    $article->refresh();
    expect($article->tags)->toHaveCount(2);
});

// syncTagsArticle mutation の基本テスト
test('syncTagsArticle mutation syncs tags for article', function () {
    $article = Article::factory()->create(['user_id' => $this->user->id]);
    $tags = Tag::factory(5)->create();
    $article->tags()->attach($tags->take(3)->pluck('id'));

    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation SyncTagsArticle($id: ID!, $tagIds: [ID!]!) {
            syncTagsArticle(id: $id, tagIds: $tagIds) {
                id
                tags {
                    id
                    name
                }
            }
        }
    ';

    $newTagIds = $tags->skip(2)->take(2)->pluck('id')->map(fn($id) => (string)$id)->toArray();

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$article->id,
            'tagIds' => $newTagIds,
        ],
    ]);

    $response->assertStatus(200);
    $articleData = $response->json('data.syncTagsArticle');
    expect($articleData['tags'])->toHaveCount(2);

    // データベースのタグが同期されていることを確認
    $article->refresh();
    expect($article->tags)->toHaveCount(2);
    expect($article->tags->pluck('id')->toArray())->toBe($tags->skip(2)->take(2)->pluck('id')->toArray());
});

// syncTagsByNameArticle mutation の基本テスト
test('syncTagsByNameArticle mutation syncs tags by name', function () {
    $article = Article::factory()->create(['user_id' => $this->user->id]);

    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation SyncTagsByNameArticle($id: ID!, $tagNames: [String!]!) {
            syncTagsByNameArticle(id: $id, tagNames: $tagNames) {
                id
                tags {
                    id
                    name
                }
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$article->id,
            'tagNames' => ['PHP', 'Laravel', 'GraphQL'],
        ],
    ]);

    $response->assertStatus(200);
    $articleData = $response->json('data.syncTagsByNameArticle');
    expect($articleData['tags'])->toHaveCount(3);

    // タグが名前で作成・関連付けられていることを確認
    $article->refresh();
    expect($article->tags)->toHaveCount(3);
    expect($article->tags->pluck('name')->toArray())->toContain('PHP', 'Laravel', 'GraphQL');
});

// syncTagsByNameArticle mutation で既存タグと新規タグの混合
test('syncTagsByNameArticle mutation handles existing and new tags', function () {
    $article = Article::factory()->create(['user_id' => $this->user->id]);
    $existingTag = Tag::factory()->create(['name' => 'PHP']);
    $article->tags()->attach($existingTag->id);

    Sanctum::actingAs($this->user, ['create', 'update', 'delete']);

    $mutation = '
        mutation SyncTagsByNameArticle($id: ID!, $tagNames: [String!]!) {
            syncTagsByNameArticle(id: $id, tagNames: $tagNames) {
                id
                tags {
                    id
                    name
                }
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$article->id,
            'tagNames' => ['PHP', 'Laravel'],
        ],
    ]);

    $response->assertStatus(200);
    $articleData = $response->json('data.syncTagsByNameArticle');
    expect($articleData['tags'])->toHaveCount(2);

    // 既存タグが再利用され、新規タグが作成されていることを確認
    $article->refresh();
    expect($article->tags)->toHaveCount(2);
    $tagNames = $article->tags->pluck('name')->toArray();
    expect($tagNames)->toContain('PHP', 'Laravel');
});

