<?php

use App\Models\Article;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->targetUser = User::factory()->create();
});

// ユーザークエリの基本テスト
test('user query returns basic information', function () {
    Sanctum::actingAs($this->user);

    $query = '
        query GetUser($id: ID!) {
            user(id: $id) {
                id
                name
                email
                profile_photo_url
                created_at
                updated_at
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $query,
        'variables' => ['id' => (string)$this->targetUser->id],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => [
            'user' => [
                'id', 'name', 'email', 'profile_photo_url',
                'created_at', 'updated_at',
            ],
        ],
    ]);

    $userData = $response->json('data.user');
    expect($userData['id'])->toBe((string)$this->targetUser->id);
    expect($userData['name'])->toBe($this->targetUser->name);
    expect($userData['email'])->toBe($this->targetUser->email);
});

// ユーザーの記事一覧クエリテスト
test('user query returns articles with pagination', function () {
    // テスト用記事を作成
    Article::factory(15)->create(['user_id' => $this->targetUser->id]);

    Sanctum::actingAs($this->user);

    $query = '
        query GetUserWithArticles($id: ID!, $first: Int!, $page: Int!) {
            user(id: $id) {
                id
                name
                articles(first: $first, page: $page) {
                    data {
                        id
                        title
                        body
                    }
                    paginatorInfo {
                        count
                        currentPage
                        total
                        lastPage
                    }
                }
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $query,
        'variables' => [
            'id' => (string)$this->targetUser->id,
            'first' => 10,
            'page' => 1,
        ],
    ]);

    $response->assertStatus(200);

    // レスポンスの内容をデバッグ
    if (!$response->json('data')) {
        expect(false)->toBe(true, 'GraphQL Error: ' . json_encode($response->json()));
    }

    $response->assertJsonStructure([
        'data' => [
            'user' => [
                'articles' => [
                    'data' => [
                        '*' => ['id', 'title', 'body'],
                    ],
                    'paginatorInfo' => [
                        'count', 'currentPage', 'total', 'lastPage',
                    ],
                ],
            ],
        ],
    ]);

    $articlesData = $response->json('data.user.articles');
    expect($articlesData['data'])->toHaveCount(10); // ページサイズ確認
    expect($articlesData['paginatorInfo']['total'])->toBe(15); // 総数確認
});

// ユーザーのフォロワー一覧クエリテスト
test('user query returns followers list', function () {
    // フォロワーを作成
    $followers = User::factory(5)->create();
    foreach ($followers as $follower) {
        $this->targetUser->followedBy($follower);
    }

    Sanctum::actingAs($this->user);

    $query = '
        query GetUserWithFollowers($id: ID!) {
            user(id: $id) {
                id
                followers(first: 10) {
                    data {
                        id
                        name
                        profile_photo_url
                    }
                    paginatorInfo {
                        total
                    }
                }
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $query,
        'variables' => ['id' => (string)$this->targetUser->id],
    ]);

    $response->assertStatus(200);
    $followersData = $response->json('data.user.followers');
    expect($followersData['data'])->toHaveCount(5);
    expect($followersData['paginatorInfo']['total'])->toBe(5);
});

// ユーザーのフォロー中一覧クエリテスト
test('user query returns following list', function () {
    // フォロー中のユーザーを作成
    $followingUsers = User::factory(3)->create();
    foreach ($followingUsers as $followingUser) {
        $followingUser->followedBy($this->targetUser);
    }

    Sanctum::actingAs($this->user);

    $query = '
        query GetUserWithFollowing($id: ID!) {
            user(id: $id) {
                id
                following(first: 10) {
                    data {
                        id
                        name
                        profile_photo_url
                    }
                    paginatorInfo {
                        total
                    }
                }
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $query,
        'variables' => ['id' => (string)$this->targetUser->id],
    ]);

    $response->assertStatus(200);
    $followingData = $response->json('data.user.following');
    expect($followingData['data'])->toHaveCount(3);
    expect($followingData['paginatorInfo']['total'])->toBe(3);
});

// ユーザーのチーム情報クエリテスト
test('user query returns teams information', function () {
    // 所有チームと参加チームを作成
    $ownedTeam = Team::factory()->create(['user_id' => $this->targetUser->id]);
    $memberTeam = Team::factory()->create();
    $memberTeam->users()->attach($this->targetUser->id);

    Sanctum::actingAs($this->user);

    $query = '
        query GetUserWithTeams($id: ID!) {
            user(id: $id) {
                id
                ownedTeams {
                    id
                    name
                }
                teams {
                    id
                    name
                }
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $query,
        'variables' => ['id' => (string)$this->targetUser->id],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => [
            'user' => [
                'ownedTeams' => [
                    '*' => ['id', 'name'],
                ],
                'teams' => [
                    '*' => ['id', 'name'],
                ],
            ],
        ],
    ]);

    $userData = $response->json('data.user');
    expect($userData['ownedTeams'])->toHaveCount(1);
    expect($userData['teams'])->toHaveCount(1);
});

// 未認証でのクエリアクセステスト
test('user query requires authentication', function () {
    $query = '
        query GetUser($id: ID!) {
            user(id: $id) {
                id
                name
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $query,
        'variables' => ['id' => (string)$this->targetUser->id],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'errors' => [
            '*' => ['message'],
        ],
    ]);
});

// 存在しないユーザーのクエリテスト
test('user query returns null for nonexistent user', function () {
    Sanctum::actingAs($this->user);

    $query = '
        query GetUser($id: ID!) {
            user(id: $id) {
                id
                name
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $query,
        'variables' => ['id' => '99999'],
    ]);

    $response->assertStatus(200);
    expect($response->json('data.user'))->toBeNull();
});

// 複数ユーザー一覧クエリテスト
test('users query returns paginated list', function () {
    // 追加のユーザーを作成
    User::factory(10)->create();

    Sanctum::actingAs($this->user);

    $query = '
        query GetUsers($first: Int!, $page: Int!) {
            users(first: $first, page: $page) {
                data {
                    id
                    name
                    email
                }
                paginatorInfo {
                    count
                    currentPage
                    total
                    lastPage
                }
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $query,
        'variables' => [
            'first' => 5,
            'page' => 1,
        ],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => [
            'users' => [
                'data' => [
                    '*' => ['id', 'name', 'email'],
                ],
                'paginatorInfo' => [
                    'count', 'currentPage', 'total', 'lastPage',
                ],
            ],
        ],
    ]);

    $usersData = $response->json('data.users');
    expect($usersData['data'])->toHaveCount(5);
    expect($usersData['paginatorInfo']['total'])->toBe(12); // 初期2名 + 10名
});

// ログインユーザー自身の情報クエリテスト
test('login user query returns current user', function () {
    Sanctum::actingAs($this->user);

    $query = '
        query GetLoginUser {
            loginUser {
                id
                name
                email
                profile_photo_url
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $query,
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => [
            'loginUser' => [
                'id', 'name', 'email', 'profile_photo_url',
            ],
        ],
    ]);

    $loginUserData = $response->json('data.loginUser');
    expect($loginUserData['id'])->toBe((string)$this->user->id);
    expect($loginUserData['name'])->toBe($this->user->name);
    expect($loginUserData['email'])->toBe($this->user->email);
});
