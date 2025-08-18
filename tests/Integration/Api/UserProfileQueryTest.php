<?php

namespace Api;

use App\Models\User;
use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserProfileQueryTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_profile_query_basic_user_data()
    {
        // 基本的なユーザーデータのクエリテスト
        $user = User::factory()->create();
        $targetUser = User::factory()->create();

        $query = '
            query GetUserProfile($id: ID!) {
                userProfile(id: $id) {
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

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'userProfile' => [
                        'id' => $targetUser->id,
                        'name' => $targetUser->name,
                        'email' => $targetUser->email,
                    ],
                ],
            ]);
    }

    public function test_user_profile_query_with_articles()
    {
        // 記事データを含むクエリテスト
        $user = User::factory()->create();
        $targetUser = User::factory()->create();
        $article = $targetUser->articles()->create([
            'title' => 'Test Article',
            'body' => 'Test body content',
        ]);

        $query = '
            query GetUserProfile($id: ID!) {
                userProfile(id: $id) {
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

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'userProfile' => [
                        'articles' => [
                            'data' => [
                                [
                                    'id' => $article->id,
                                    'title' => $article->title,
                                    'body' => $article->body,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function test_user_profile_query_with_articles_and_dates()
    {
        // 記事の日付フィールドを含むクエリテスト
        $user = User::factory()->create();
        $targetUser = User::factory()->create();
        $article = $targetUser->articles()->create([
            'title' => 'Test Article',
            'body' => 'Test body content',
        ]);

        $query = '
            query GetUserProfile($id: ID!) {
                userProfile(id: $id) {
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
        $response->assertStatus(200);

        $responseData = $response->json();

        // デバッグ用：レスポンスの内容を出力
        if (isset($responseData['errors'])) {
            $this->fail('GraphQL query failed: ' . json_encode($responseData['errors'], JSON_PRETTY_PRINT));
        }

        $this->assertArrayHasKey('data', $responseData);
        $this->assertArrayHasKey('userProfile', $responseData['data']);
        $this->assertArrayHasKey('articles', $responseData['data']['userProfile']);
        $this->assertArrayHasKey('data', $responseData['data']['userProfile']['articles']);
    }

    public function test_user_profile_query_with_followers()
    {
        // フォロワーデータを含むクエリテスト
        $user = User::factory()->create();
        $targetUser = User::factory()->create();
        $follower = User::factory()->create();

        $targetUser->followedBy($follower);

        $query = '
            query GetUserProfile($id: ID!) {
                userProfile(id: $id) {
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

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'userProfile' => [
                        'followers' => [
                            'data' => [
                                [
                                    'id' => $follower->id,
                                    'name' => $follower->name,
                                    'email' => $follower->email,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function test_user_profile_query_with_following()
    {
        // フォロー中データを含むクエリテスト
        $user = User::factory()->create();
        $targetUser = User::factory()->create();
        $followingUser = User::factory()->create();

        $followingUser->followedBy($targetUser);

        $query = '
            query GetUserProfile($id: ID!) {
                userProfile(id: $id) {
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

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'userProfile' => [
                        'following' => [
                            'data' => [
                                [
                                    'id' => $followingUser->id,
                                    'name' => $followingUser->name,
                                    'email' => $followingUser->email,
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function test_user_profile_query_with_teams()
    {
        // チームデータを含むクエリテスト
        $user = User::factory()->create();
        $targetUser = User::factory()->create();
        $team = $targetUser->ownedTeams()->create([
            'name' => 'Test Team',
            'personal_team' => false,
        ]);

        $query = '
            query GetUserProfile($id: ID!) {
                userProfile(id: $id) {
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

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'userProfile' => [
                        'ownedTeams' => [
                            [
                                'id' => $team->id,
                                'name' => $team->name,
                                'personal_team' => $team->personal_team,
                            ],
                        ],
                        'allTeams' => [
                            [
                                'id' => $team->id,
                                'name' => $team->name,
                                'personal_team' => $team->personal_team,
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function test_user_profile_query_complete()
    {
        // 完全なクエリのテスト
        $user = User::factory()->create();
        $targetUser = User::factory()->create();

        $query = '
            query GetUserProfile($id: ID!) {
                userProfile(id: $id) {
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
                                category
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
        $response->assertStatus(200);

        $responseData = $response->json();

        // エラーがないことを確認
        if (isset($responseData['errors'])) {
            $this->fail('GraphQL query failed: ' . json_encode($responseData['errors'], JSON_PRETTY_PRINT));
        }

        $this->assertArrayHasKey('data', $responseData);
        $this->assertArrayHasKey('userProfile', $responseData['data']);
    }
}
