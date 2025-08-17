<?php

namespace Tests\Feature\GraphQL;

use App\Models\User;
use App\Models\Article;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class UserQueryTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected User $targetUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->targetUser = User::factory()->create();
    }

    /**
     * ユーザークエリの基本テスト
     */
    public function test_user_query_returns_basic_information(): void
    {
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
            'variables' => ['id' => (string)$this->targetUser->id]
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'user' => [
                    'id', 'name', 'email', 'profile_photo_url',
                    'created_at', 'updated_at'
                ]
            ]
        ]);

        $userData = $response->json('data.user');
        $this->assertEquals($this->targetUser->id, $userData['id']);
        $this->assertEquals($this->targetUser->name, $userData['name']);
        $this->assertEquals($this->targetUser->email, $userData['email']);
    }

    /**
     * ユーザーの記事一覧クエリテスト
     */
    public function test_user_query_returns_articles_with_pagination(): void
    {
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
                'page' => 1
            ]
        ]);

        $response->assertStatus(200);

        // レスポンスの内容をデバッグ
        if (!$response->json('data')) {
            $this->fail('GraphQL Error: ' . json_encode($response->json()));
        }

        $response->assertJsonStructure([
            'data' => [
                'user' => [
                    'articles' => [
                        'data' => [
                            '*' => ['id', 'title', 'body']
                        ],
                        'paginatorInfo' => [
                            'count', 'currentPage', 'total', 'lastPage'
                        ]
                    ]
                ]
            ]
        ]);

        $articlesData = $response->json('data.user.articles');
        $this->assertCount(10, $articlesData['data']); // ページサイズ確認
        $this->assertEquals(15, $articlesData['paginatorInfo']['total']); // 総数確認
    }

    /**
     * ユーザーのフォロワー一覧クエリテスト
     */
    public function test_user_query_returns_followers_list(): void
    {
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
            'variables' => ['id' => (string)$this->targetUser->id]
        ]);

        $response->assertStatus(200);
        $followersData = $response->json('data.user.followers');
        $this->assertCount(5, $followersData['data']);
        $this->assertEquals(5, $followersData['paginatorInfo']['total']);
    }

    /**
     * ユーザーのフォロー中一覧クエリテスト
     */
    public function test_user_query_returns_following_list(): void
    {
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
            'variables' => ['id' => (string)$this->targetUser->id]
        ]);

        $response->assertStatus(200);
        $followingData = $response->json('data.user.following');
        $this->assertCount(3, $followingData['data']);
        $this->assertEquals(3, $followingData['paginatorInfo']['total']);
    }

    /**
     * ユーザーのチーム情報クエリテスト
     */
    public function test_user_query_returns_teams_information(): void
    {
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
            'variables' => ['id' => (string)$this->targetUser->id]
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'user' => [
                    'ownedTeams' => [
                        '*' => ['id', 'name']
                    ],
                    'teams' => [
                        '*' => ['id', 'name']
                    ]
                ]
            ]
        ]);

        $userData = $response->json('data.user');
        $this->assertCount(1, $userData['ownedTeams']);
        $this->assertCount(1, $userData['teams']);
    }

    /**
     * 未認証でのクエリアクセステスト
     */
    public function test_user_query_requires_authentication(): void
    {
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
            'variables' => ['id' => (string)$this->targetUser->id]
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'errors' => [
                '*' => ['message']
            ]
        ]);
    }

    /**
     * 存在しないユーザーのクエリテスト
     */
    public function test_user_query_returns_null_for_nonexistent_user(): void
    {
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
            'variables' => ['id' => '99999']
        ]);

        $response->assertStatus(200);
        $this->assertNull($response->json('data.user'));
    }

    /**
     * 複数ユーザー一覧クエリテスト
     */
    public function test_users_query_returns_paginated_list(): void
    {
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
                'page' => 1
            ]
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'users' => [
                    'data' => [
                        '*' => ['id', 'name', 'email']
                    ],
                    'paginatorInfo' => [
                        'count', 'currentPage', 'total', 'lastPage'
                    ]
                ]
            ]
        ]);

        $usersData = $response->json('data.users');
        $this->assertCount(5, $usersData['data']);
        $this->assertEquals(12, $usersData['paginatorInfo']['total']); // 初期2名 + 10名
    }

    /**
     * ログインユーザー自身の情報クエリテスト
     */
    public function test_login_user_query_returns_current_user(): void
    {
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
            'query' => $query
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'loginUser' => [
                    'id', 'name', 'email', 'profile_photo_url'
                ]
            ]
        ]);

        $loginUserData = $response->json('data.loginUser');
        $this->assertEquals($this->user->id, $loginUserData['id']);
        $this->assertEquals($this->user->name, $loginUserData['name']);
        $this->assertEquals($this->user->email, $loginUserData['email']);
    }
}
