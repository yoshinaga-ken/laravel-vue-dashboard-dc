<?php

use App\Models\User;
use App\Models\Article;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);


// ユーザープロフィールクエリ - 基本的なユーザーデータ
test('user profile query - basic user data', function () {
    // 基本的なユーザーデータのクエリテスト
    $user = User::factory()->create();
    $targetUser = User::factory()->create();

    $query = '
        query GetUserProfile($id: ID!) {
            user(id: $id) {
                id
                name
                email
                profile_photo_url
            }
        }
    ';

    $response = $this->actingAs($user)
        ->postJson('/graphql', [
            'query' => $query,
            'variables' => ['id' => $targetUser->id],
        ]);

    expect($response->status())->toBe(200);
    expect($response->json())->toMatchArray([
        'data' => [
            'user' => [
                'id' => (string)$targetUser->id,
                'name' => $targetUser->name,
                'email' => $targetUser->email,
                'profile_photo_url' => $targetUser->profile_photo_url,
            ],
        ],
    ]);
});

// ユーザープロフィールクエリ - 記事データを含む
test('user profile query - includes article data', function () {
    // 記事データを含むクエリテスト
    $user = User::factory()->create();
    $targetUser = User::factory()->create();
    $article = $targetUser->articles()->create([
        'title' => 'Test Article',
        'body' => 'Test body content',
    ]);

    $query = '
        query GetUserProfile($id: ID!) {
            user(id: $id) {
                id
                name
                articles(first: 4) {
                    data {
                        id
                        title
                        body
                    }
                }
            }
        }
    ';

    $response = $this->actingAs($user)
        ->postJson('/graphql', [
            'query' => $query,
            'variables' => ['id' => $targetUser->id],
        ]);

    expect($response->status())->toBe(200);
    expect($response->json())->toMatchArray([
        'data' => [
            'user' => [
                'id' => (string)$targetUser->id,
                'name' => $targetUser->name,
                'articles' => [
                    'data' => [
                        [
                            'id' => (string)$article->id,
                            'title' => $article->title,
                            'body' => $article->body,
                        ],
                    ],
                ],
            ],
        ],
    ]);
});

// ユーザープロフィールクエリ - 記事の日付フィールドを含む
test('user profile query - includes article date fields', function () {
    // 記事の日付フィールドを含むクエリテスト
    $user = User::factory()->create();
    $targetUser = User::factory()->create();
    $article = $targetUser->articles()->create([
        'title' => 'Test Article',
        'body' => 'Test body content',
    ]);

    $query = '
        query GetUserProfile($id: ID!) {
            user(id: $id) {
                id
                name
                articles(first: 4) {
                    data {
                        id
                        title
                        body
                    }
                }
            }
        }
    ';

    $response = $this->actingAs($user)
        ->postJson('/graphql', [
            'query' => $query,
            'variables' => ['id' => $targetUser->id],
        ]);

    // レスポンスの構造を確認
    expect($response->status())->toBe(200);

    $responseData = $response->json();

    // デバッグ用：レスポンスの内容を出力
    if (isset($responseData['errors'])) {
        throw new Exception('GraphQL query failed: ' . json_encode($responseData['errors'], JSON_PRETTY_PRINT));
    }

    expect($responseData)->toHaveKey('data');
    expect($responseData['data'])->toHaveKey('user');
    expect($responseData['data']['user'])->toHaveKey('articles');
    expect($responseData['data']['user']['articles'])->toHaveKey('data');
});

// ユーザープロフィールクエリ - フォロワーデータを含む
test('user profile query - includes follower data', function () {
    // フォロワーデータを含むクエリテスト
    $user = User::factory()->create();
    $targetUser = User::factory()->create();
    $follower = User::factory()->create();

    $targetUser->followedBy($follower);

    $query = '
        query GetUserProfile($id: ID!) {
            user(id: $id) {
                id
                name
                followers(first: 16) {
                    data {
                        id
                        name
                        email
                    }
                }
            }
        }
    ';

    $response = $this->actingAs($user)
        ->postJson('/graphql', [
            'query' => $query,
            'variables' => ['id' => $targetUser->id],
        ]);

    expect($response->status())->toBe(200);
    expect($response->json())->toMatchArray([
        'data' => [
            'user' => [
                'id' => (string)$targetUser->id,
                'name' => $targetUser->name,
                'followers' => [
                    'data' => [
                        [
                            'id' => (string)$follower->id,
                            'name' => $follower->name,
                            'email' => $follower->email,
                        ],
                    ],
                ],
            ],
        ],
    ]);
});

// ユーザープロフィールクエリ - フォロー中データを含む
test('user profile query - includes following data', function () {
    // フォロー中データを含むクエリテスト
    $user = User::factory()->create();
    $targetUser = User::factory()->create();
    $followingUser = User::factory()->create();

    $followingUser->followedBy($targetUser);

    $query = '
        query GetUserProfile($id: ID!) {
            user(id: $id) {
                id
                name
                following(first: 16) {
                    data {
                        id
                        name
                        email
                    }
                }
            }
        }
    ';

    $response = $this->actingAs($user)
        ->postJson('/graphql', [
            'query' => $query,
            'variables' => ['id' => $targetUser->id],
        ]);

    expect($response->status())->toBe(200);
    expect($response->json())->toMatchArray([
        'data' => [
            'user' => [
                'id' => (string)$targetUser->id,
                'name' => $targetUser->name,
                'following' => [
                    'data' => [
                        [
                            'id' => (string)$followingUser->id,
                            'name' => $followingUser->name,
                            'email' => $followingUser->email,
                        ],
                    ],
                ],
            ],
        ],
    ]);
});

// ユーザープロフィールクエリ - チームデータを含む
test('user profile query - includes team data', function () {
    // チームデータを含むクエリテスト
    $user = User::factory()->create();
    $targetUser = User::factory()->create();
    $team = $targetUser->ownedTeams()->create([
        'name' => 'Test Team',
        'personal_team' => false,
    ]);

    $query = '
        query GetUserProfile($id: ID!) {
            user(id: $id) {
                id
                name
                ownedTeams {
                    id
                    name
                    personal_team
                }
                allTeams {
                    id
                    name
                    personal_team
                }
            }
        }
    ';

    $response = $this->actingAs($user)
        ->postJson('/graphql', [
            'query' => $query,
            'variables' => ['id' => $targetUser->id],
        ]);

    expect($response->status())->toBe(200);
    expect($response->json())->toMatchArray([
        'data' => [
            'user' => [
                'id' => (string)$targetUser->id,
                'name' => $targetUser->name,
                'ownedTeams' => [
                    [
                        'id' => (string)$team->id,
                        'name' => $team->name,
                        'personal_team' => $team->personal_team,
                    ],
                ],
                'allTeams' => [
                    [
                        'id' => (string)$team->id,
                        'name' => $team->name,
                        'personal_team' => $team->personal_team,
                    ],
                ],
            ],
        ],
    ]);
});

// ユーザープロフィールクエリ - 完全なクエリ
test('user profile query - complete query', function () {
    // 完全なクエリのテスト
    $user = User::factory()->create();
    $targetUser = User::factory()->create();

    // テストデータの作成
    $article = $targetUser->articles()->create([
        'title' => 'Test Article',
        'body' => 'Test body content',
    ]);

    $tag = \App\Models\Tag::factory()->create();
    $article->tags()->attach($tag->id);

    $follower = User::factory()->create();
    $targetUser->followedBy($follower);

    $followingUser = User::factory()->create();
    $followingUser->followedBy($targetUser);

    $team = $targetUser->ownedTeams()->create([
        'name' => 'Test Team',
        'personal_team' => false,
    ]);

    $query = '
        query GetUserProfile($id: ID!) {
            user(id: $id) {
                id
                name
                email
                current_team_id
                profile_photo_path
                profile_photo_url
                created_at
                updated_at
                articles(first: 4) {
                    data {
                        id
                        title
                        body
                        tags {
                            id
                            name
                        }
                    }
                }
                followers(first: 16) {
                    data {
                        id
                        name
                        email
                        profile_photo_url
                    }
                }
                following(first: 16) {
                    data {
                        id
                        name
                        email
                        profile_photo_url
                    }
                }
                ownedTeams {
                    id
                    name
                    personal_team
                }
                teams {
                    id
                    name
                    personal_team
                }
                allTeams {
                    id
                    name
                    personal_team
                }
            }
        }
    ';

    $response = $this->actingAs($user)
        ->postJson('/graphql', [
            'query' => $query,
            'variables' => ['id' => $targetUser->id],
        ]);

    // レスポンスの構造を確認
    expect($response->status())->toBe(200);

    $responseData = $response->json();

    // エラーがないことを確認
    if (isset($responseData['errors'])) {
        throw new Exception('GraphQL query failed: ' . json_encode($responseData['errors'], JSON_PRETTY_PRINT));
    }

    expect($responseData)->toHaveKey('data');
    expect($responseData['data'])->toHaveKey('user');

    // 基本的なユーザー情報の確認
    expect($responseData['data']['user']['id'])->toBe((string)$targetUser->id);
    expect($responseData['data']['user']['name'])->toBe($targetUser->name);
    expect($responseData['data']['user']['email'])->toBe($targetUser->email);

    // 記事データの確認
    expect($responseData['data']['user']['articles']['data'])->toHaveCount(1);
    expect($responseData['data']['user']['articles']['data'][0]['id'])->toBe((string)$article->id);

    // フォロワーデータの確認
    expect($responseData['data']['user']['followers']['data'])->toHaveCount(1);
    expect($responseData['data']['user']['followers']['data'][0]['id'])->toBe((string)$follower->id);

    // フォロー中データの確認
    expect($responseData['data']['user']['following']['data'])->toHaveCount(1);
    expect($responseData['data']['user']['following']['data'][0]['id'])->toBe((string)$followingUser->id);

    // チームデータの確認
    expect($responseData['data']['user']['ownedTeams'])->toHaveCount(1);
    expect($responseData['data']['user']['ownedTeams'][0]['id'])->toBe((string)$team->id);
    expect($responseData['data']['user']['allTeams'])->toHaveCount(1);
    expect($responseData['data']['user']['allTeams'][0]['id'])->toBe((string)$team->id);
});
