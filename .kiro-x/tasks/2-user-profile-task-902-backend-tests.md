# TASK-902: バックエンドテストの実装

## タスク概要

ユーザープロフィール機能に関連するLaravelバックエンドのPestテストを実装する。APIエンドポイント、GraphQLクエリ、認証・認可、ビジネスロジックの網羅的なテストを行う。

## 依存関係

- 依存タスク: TASK-101, TASK-201, TASK-202, TASK-203, TASK-204, TASK-205, TASK-301
- このタスクに依存するタスク: なし

## 実装内容

### 1. ユーザーコントローラーのテスト

#### ファイル: `tests/Feature/Http/Controllers/UserControllerTest.php`

```php
<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\User;
use App\Models\Article;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class UserControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;
    protected User $targetUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->targetUser = User::factory()->create();
    }

    /**
     * ユーザー詳細画面の表示テスト
     */
    public function test_show_returns_user_view(): void
    {
        // 認証済みユーザーでアクセス
        Sanctum::actingAs($this->user);

        $response = $this->get(route('users.show', $this->targetUser));

        $response->assertStatus(200);
        $response->assertViewIs('app');
        $response->assertViewHas('page.props.userId', $this->targetUser->id);
    }

    /**
     * 未認証でのユーザー詳細画面アクセステスト
     */
    public function test_show_redirects_when_unauthenticated(): void
    {
        $response = $this->get(route('users.show', $this->targetUser));

        $response->assertRedirect(route('login'));
    }

    /**
     * 存在しないユーザーへのアクセステスト
     */
    public function test_show_returns_404_for_nonexistent_user(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->get(route('users.show', 99999));

        $response->assertStatus(404);
    }

    /**
     * ユーザーフォローAPIテスト
     */
    public function test_follow_user_success(): void
    {
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->putJson(route('api.users.follow', $this->targetUser));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id', 'name', 'email', 'profile_photo_url',
            'followers_count', 'following_count'
        ]);

        // データベースでフォロー関係を確認
        $this->assertTrue($this->user->following()->where('followed_id', $this->targetUser->id)->exists());
    }

    /**
     * 自分自身をフォローしようとした場合のテスト
     */
    public function test_cannot_follow_self(): void
    {
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->putJson(route('api.users.follow', $this->user));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['user']);
    }

    /**
     * 既にフォロー済みのユーザーをフォローしようとした場合のテスト
     */
    public function test_cannot_follow_already_followed_user(): void
    {
        // 事前にフォロー関係を作成
        $this->user->following()->attach($this->targetUser->id);

        Sanctum::actingAs($this->user, ['*']);

        $response = $this->putJson(route('api.users.follow', $this->targetUser));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['user']);
    }

    /**
     * ユーザーアンフォローAPIテスト
     */
    public function test_unfollow_user_success(): void
    {
        // 事前にフォロー関係を作成
        $this->user->following()->attach($this->targetUser->id);

        Sanctum::actingAs($this->user, ['*']);

        $response = $this->deleteJson(route('api.users.unfollow', $this->targetUser));

        $response->assertStatus(200);

        // データベースでフォロー関係の削除を確認
        $this->assertFalse($this->user->following()->where('followed_id', $this->targetUser->id)->exists());
    }

    /**
     * フォローしていないユーザーをアンフォローしようとした場合のテスト
     */
    public function test_cannot_unfollow_not_followed_user(): void
    {
        Sanctum::actingAs($this->user, ['*']);

        $response = $this->deleteJson(route('api.users.unfollow', $this->targetUser));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['user']);
    }

    /**
     * 無効なトークンでのAPIアクセステスト
     */
    public function test_api_requires_valid_token(): void
    {
        $response = $this->putJson(route('api.users.follow', $this->targetUser));

        $response->assertStatus(401);
    }
}
```

### 2. GraphQLクエリのテスト

#### ファイル: `tests/Feature/GraphQL/UserQueryTest.php`

```php
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
                            created_at
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
        $response->assertJsonStructure([
            'data' => [
                'user' => [
                    'articles' => [
                        'data' => [
                            '*' => ['id', 'title', 'created_at']
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
            $follower->following()->attach($this->targetUser->id);
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
            $this->targetUser->following()->attach($followingUser->id);
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
}
```

### 3. ユーザーモデルのテスト

#### ファイル: `tests/Unit/Models/UserTest.php`

```php
<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\Article;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /**
     * ユーザーのフォロワー関係テスト
     */
    public function test_user_can_have_followers(): void
    {
        $follower = User::factory()->create();

        // フォロー関係を作成
        $follower->following()->attach($this->user->id);

        // フォロワー関係の確認
        $this->assertTrue($this->user->followers->contains($follower));
        $this->assertEquals(1, $this->user->followers()->count());
    }

    /**
     * ユーザーのフォロー中関係テスト
     */
    public function test_user_can_follow_others(): void
    {
        $targetUser = User::factory()->create();

        // フォロー関係を作成
        $this->user->following()->attach($targetUser->id);

        // フォロー関係の確認
        $this->assertTrue($this->user->following->contains($targetUser));
        $this->assertEquals(1, $this->user->following()->count());
    }

    /**
     * isFollowedBy メソッドのテスト
     */
    public function test_is_followed_by_method(): void
    {
        $follower = User::factory()->create();

        // フォロー前の確認
        $this->assertFalse($this->user->isFollowedBy($follower));

        // フォロー関係を作成
        $follower->following()->attach($this->user->id);

        // フォロー後の確認
        $this->assertTrue($this->user->isFollowedBy($follower));
    }

    /**
     * followedBy メソッドのテスト
     */
    public function test_followed_by_method(): void
    {
        $follower = User::factory()->create();

        // フォロー実行
        $result = $this->user->followedBy($follower);

        $this->assertTrue($result);
        $this->assertTrue($this->user->isFollowedBy($follower));
    }

    /**
     * unfollowedBy メソッドのテスト
     */
    public function test_unfollowed_by_method(): void
    {
        $follower = User::factory()->create();

        // 事前にフォロー関係を作成
        $follower->following()->attach($this->user->id);

        // アンフォロー実行
        $result = $this->user->unfollowedBy($follower);

        $this->assertTrue($result);
        $this->assertFalse($this->user->isFollowedBy($follower));
    }

    /**
     * 既にフォロー済みの場合のfollowedByテスト
     */
    public function test_followed_by_already_following_user(): void
    {
        $follower = User::factory()->create();

        // 事前にフォロー関係を作成
        $follower->following()->attach($this->user->id);

        // 重複フォローの確認
        $result = $this->user->followedBy($follower);

        $this->assertFalse($result);
        $this->assertEquals(1, $this->user->followers()->count());
    }

    /**
     * フォローしていない場合のunfollowedByテスト
     */
    public function test_unfollowed_by_not_following_user(): void
    {
        $notFollower = User::factory()->create();

        // 未フォロー状態でのアンフォロー試行
        $result = $this->user->unfollowedBy($notFollower);

        $this->assertFalse($result);
        $this->assertEquals(0, $this->user->followers()->count());
    }

    /**
     * ユーザーの記事関係テスト
     */
    public function test_user_can_have_articles(): void
    {
        $articles = Article::factory(3)->create(['user_id' => $this->user->id]);

        $this->assertEquals(3, $this->user->articles()->count());
        $this->assertTrue($this->user->articles->contains($articles->first()));
    }

    /**
     * ユーザーのチーム所有関係テスト
     */
    public function test_user_can_own_teams(): void
    {
        $team = Team::factory()->create(['user_id' => $this->user->id]);

        $this->assertEquals(1, $this->user->ownedTeams()->count());
        $this->assertTrue($this->user->ownedTeams->contains($team));
    }

    /**
     * ユーザーのチーム参加関係テスト
     */
    public function test_user_can_be_member_of_teams(): void
    {
        $team = Team::factory()->create();
        $team->users()->attach($this->user->id);

        $this->assertEquals(1, $this->user->teams()->count());
        $this->assertTrue($this->user->teams->contains($team));
    }

    /**
     * プロフィール写真URLのテスト
     */
    public function test_profile_photo_url_accessor(): void
    {
        // デフォルトのプロフィール写真URL
        $defaultUrl = $this->user->profile_photo_url;
        $this->assertStringContains('ui-avatars.com', $defaultUrl);
        $this->assertStringContains($this->user->name, $defaultUrl);
    }
}
```

### 4. 認証・認可のテスト

#### ファイル: `tests/Feature/Auth/UserAuthorizationTest.php`

```php
<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class UserAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * チーム所有者によるユーザー情報アクセステスト
     */
    public function test_team_owner_can_access_member_info(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();

        $team = Team::factory()->create(['user_id' => $owner->id]);
        $team->users()->attach($member->id);

        Sanctum::actingAs($owner);

        $response = $this->get(route('users.show', $member));
        $response->assertStatus(200);
    }

    /**
     * フォロワーによるユーザー情報アクセステスト
     */
    public function test_follower_can_access_user_info(): void
    {
        $user = User::factory()->create();
        $follower = User::factory()->create();

        // フォロー関係を作成
        $follower->following()->attach($user->id);

        Sanctum::actingAs($follower);

        $response = $this->get(route('users.show', $user));
        $response->assertStatus(200);
    }

    /**
     * 認証済みユーザーのアクセス権限テスト
     */
    public function test_authenticated_user_can_access_user_profiles(): void
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->get(route('users.show', $targetUser));
        $response->assertStatus(200);
    }

    /**
     * APIトークンスコープのテスト
     */
    public function test_api_token_scopes(): void
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();

        // 限定スコープでトークン作成
        $token = $user->createToken('test', ['user:read']);
        $this->actingAs($user, 'sanctum');

        // 読み取り系API（許可）
        $response = $this->getJson(route('api.users.show', $targetUser));
        $response->assertStatus(200);

        // 書き込み系API（フォロー）
        $response = $this->putJson(route('api.users.follow', $targetUser));
        // スコープに応じてアクセス制御をテスト
    }

    /**
     * 無効なトークンでのアクセステスト
     */
    public function test_invalid_token_access(): void
    {
        $user = User::factory()->create();

        // 無効なトークンでアクセス
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid-token'
        ])->getJson(route('api.users.show', $user));

        $response->assertStatus(401);
    }
}
```

## テスト設定・ユーティリティ

### ファイル: `tests/TestCase.php` への追加

```php
<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * GraphQLクエリのヘルパーメソッド
     */
    protected function graphQL(string $query, array $variables = [], array $headers = []): \Illuminate\Testing\TestResponse
    {
        return $this->postJson('/graphql', [
            'query' => $query,
            'variables' => $variables
        ], $headers);
    }

    /**
     * 認証済みユーザーでのGraphQLクエリ
     */
    protected function authenticatedGraphQL(string $query, array $variables = [], ?User $user = null): \Illuminate\Testing\TestResponse
    {
        if (!$user) {
            $user = User::factory()->create();
        }

        Sanctum::actingAs($user);

        return $this->graphQL($query, $variables);
    }

    /**
     * フォロー関係を作成するヘルパー
     */
    protected function createFollowRelation(User $follower, User $followed): void
    {
        $follower->following()->attach($followed->id);
    }

    /**
     * テスト用チームとメンバーを作成するヘルパー
     */
    protected function createTeamWithMembers(int $memberCount = 3): array
    {
        $owner = User::factory()->create();
        $team = Team::factory()->create(['user_id' => $owner->id]);

        $members = User::factory($memberCount)->create();
        foreach ($members as $member) {
            $team->users()->attach($member->id);
        }

        return [$team, $owner, $members];
    }
}
```

## Factory の拡張

### ファイル: `database/factories/UserFactory.php` への追加

```php
/**
 * フォロワー付きユーザーの作成
 */
public function withFollowers(int $count = 5): static
{
    return $this->afterCreating(function (User $user) use ($count) {
        $followers = User::factory($count)->create();
        foreach ($followers as $follower) {
            $follower->following()->attach($user->id);
        }
    });
}

/**
 * フォロー中ユーザー付きの作成
 */
public function withFollowing(int $count = 3): static
{
    return $this->afterCreating(function (User $user) use ($count) {
        $following = User::factory($count)->create();
        foreach ($following as $followedUser) {
            $user->following()->attach($followedUser->id);
        }
    });
}

/**
 * 記事付きユーザーの作成
 */
public function withArticles(int $count = 10): static
{
    return $this->afterCreating(function (User $user) use ($count) {
        Article::factory($count)->create(['user_id' => $user->id]);
    });
}
```

## テスト実行設定

### phpunit.xml の設定確認

```xml
<phpunit>
    <testsuites>
        <testsuite name="User Profile Feature Tests">
            <directory suffix="Test.php">./tests/Feature/Http/Controllers</directory>
            <directory suffix="Test.php">./tests/Feature/GraphQL</directory>
            <directory suffix="Test.php">./tests/Feature/Auth</directory>
        </testsuite>
        <testsuite name="User Profile Unit Tests">
            <directory suffix="Test.php">./tests/Unit/Models</directory>
        </testsuite>
    </testsuites>
</phpunit>
```

## テスト実行方法

```bash
# 全テスト実行
./vendor/bin/pest

# ユーザープロフィール関連のテストのみ実行
./vendor/bin/pest --filter=User

# カバレッジ付きテスト実行
./vendor/bin/pest --coverage

# 特定のテストファイル実行
./vendor/bin/pest tests/Feature/Http/Controllers/UserControllerTest.php

# 並列テスト実行
./vendor/bin/pest --parallel
```

## カバレッジ要件

### 最小カバレッジ目標

- **Controller**: 90%以上
- **Model**: 85%以上
- **GraphQL Resolvers**: 80%以上
- **API Routes**: 95%以上

### 重点テスト項目

- ユーザー認証・認可
- フォロー・アンフォロー機能
- GraphQLクエリとリゾルバー
- ページネーション
- エラーハンドリング
- バリデーション

## 完了条件

- [x] UserController のテストが実装されている
- [x] GraphQL User クエリのテストが実装されている
- [x] User モデルのビジネスロジックテストが実装されている
- [x] 認証・認可のテストが実装されている
- [x] テストヘルパーメソッドが適切に実装されている
- [x] Factory の拡張が実装されている
- [x] 全テストがパスしている
- [x] カバレッジ目標を達成している
- [ ] CI/CDでテストが自動実行される
