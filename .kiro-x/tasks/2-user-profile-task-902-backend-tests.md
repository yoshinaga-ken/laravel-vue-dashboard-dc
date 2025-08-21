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

use App\Models\User;
use App\Models\Article;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->targetUser = User::factory()->create();
});

// ユーザー詳細画面の表示テスト
test('authenticated user can view user profile', function () {
    // 認証済みユーザーでアクセス
    Sanctum::actingAs($this->user);

    $response = $this->get(route('users.show', $this->targetUser));

    $response->assertStatus(200);
    $response->assertViewIs('app');
    $response->assertViewHas('page.props.userId', $this->targetUser->id);
});

// 未認証でのユーザー詳細画面アクセステスト
test('unauthenticated user is redirected to login', function () {
    $response = $this->get(route('users.show', $this->targetUser));

    $response->assertRedirect(route('login'));
});

// 存在しないユーザーへのアクセステスト
test('returns 404 for nonexistent user', function () {
    Sanctum::actingAs($this->user);

    $response = $this->get(route('users.show', 99999));

    $response->assertStatus(404);
});

// ユーザーフォローAPIテスト
test('can follow user successfully', function () {
    Sanctum::actingAs($this->user, ['*']);

    $response = $this->putJson(route('api.users.follow', $this->targetUser));

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'id', 'name', 'email', 'profile_photo_url',
        'followers_count', 'following_count'
    ]);

    // データベースでフォロー関係を確認
    expect($this->user->following()->where('followed_id', $this->targetUser->id)->exists())->toBeTrue();
});

// 自分自身をフォローしようとした場合のテスト
test('cannot follow self', function () {
    Sanctum::actingAs($this->user, ['*']);

    $response = $this->putJson(route('api.users.follow', $this->user));

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['user']);
});

// 既にフォロー済みのユーザーをフォローしようとした場合のテスト
test('cannot follow already followed user', function () {
    // 事前にフォロー関係を作成
    $this->user->following()->attach($this->targetUser->id);

    Sanctum::actingAs($this->user, ['*']);

    $response = $this->putJson(route('api.users.follow', $this->targetUser));

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['user']);
});

// ユーザーアンフォローAPIテスト
test('can unfollow user successfully', function () {
    // 事前にフォロー関係を作成
    $this->user->following()->attach($this->targetUser->id);

    Sanctum::actingAs($this->user, ['*']);

    $response = $this->deleteJson(route('api.users.unfollow', $this->targetUser));

    $response->assertStatus(200);

    // データベースでフォロー関係の削除を確認
    expect($this->user->following()->where('followed_id', $this->targetUser->id)->exists())->toBeFalse();
});

// フォローしていないユーザーをアンフォローしようとした場合のテスト
test('cannot unfollow not followed user', function () {
    Sanctum::actingAs($this->user, ['*']);

    $response = $this->deleteJson(route('api.users.unfollow', $this->targetUser));

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['user']);
});

// 無効なトークンでのAPIアクセステスト
test('api requires valid token', function () {
    $response = $this->putJson(route('api.users.follow', $this->targetUser));

    $response->assertStatus(401);
});
```

### 2. GraphQLクエリのテスト

#### ファイル: `tests/Feature/GraphQL/UserQueryTest.php`

```php
<?php

use App\Models\User;
use App\Models\Article;
use App\Models\Team;
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
    expect($userData['id'])->toBe($this->targetUser->id);
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
    expect($articlesData['data'])->toHaveCount(10); // ページサイズ確認
    expect($articlesData['paginatorInfo']['total'])->toBe(15); // 総数確認
});

// ユーザーのフォロワー一覧クエリテスト
test('user query returns followers list', function () {
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
    expect($followersData['data'])->toHaveCount(5);
    expect($followersData['paginatorInfo']['total'])->toBe(5);
});

// ユーザーのフォロー中一覧クエリテスト
test('user query returns following list', function () {
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
        'variables' => ['id' => (string)$this->targetUser->id]
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'errors' => [
            '*' => ['message']
        ]
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
        'variables' => ['id' => '99999']
    ]);

    $response->assertStatus(200);
    expect($response->json('data.user'))->toBeNull();
});
```

### 3. ユーザーモデルのテスト

#### ファイル: `tests/Integration/Models/UserTest.php`

```php
<?php

use App\Models\User;
use App\Models\Article;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

// ユーザーのフォロワー関係テスト
test('user can have followers', function () {
    $follower = User::factory()->create();

    // フォロー関係を作成
    $follower->following()->attach($this->user->id);

    // フォロワー関係の確認
    expect($this->user->followers->contains($follower))->toBeTrue();
    expect($this->user->followers()->count())->toBe(1);
});

// ユーザーのフォロー中関係テスト
test('user can follow others', function () {
    $targetUser = User::factory()->create();

    // フォロー関係を作成
    $this->user->following()->attach($targetUser->id);

    // フォロー関係の確認
    expect($this->user->following->contains($targetUser))->toBeTrue();
    expect($this->user->following()->count())->toBe(1);
});

// isFollowedBy メソッドのテスト
test('is followed by method works correctly', function () {
    $follower = User::factory()->create();

    // フォロー前の確認
    expect($this->user->isFollowedBy($follower))->toBeFalse();

    // フォロー関係を作成
    $follower->following()->attach($this->user->id);

    // フォロー後の確認
    expect($this->user->isFollowedBy($follower))->toBeTrue();
});

// followedBy メソッドのテスト
test('followed by method works correctly', function () {
    $follower = User::factory()->create();

    // フォロー実行
    $result = $this->user->followedBy($follower);

    expect($result)->toBeTrue();
    expect($this->user->isFollowedBy($follower))->toBeTrue();
});

// unfollowedBy メソッドのテスト
test('unfollowed by method works correctly', function () {
    $follower = User::factory()->create();

    // 事前にフォロー関係を作成
    $follower->following()->attach($this->user->id);

    // アンフォロー実行
    $result = $this->user->unfollowedBy($follower);

    expect($result)->toBeTrue();
    expect($this->user->isFollowedBy($follower))->toBeFalse();
});

// 既にフォロー済みの場合のfollowedByテスト
test('followed by already following user returns false', function () {
    $follower = User::factory()->create();

    // 事前にフォロー関係を作成
    $follower->following()->attach($this->user->id);

    // 重複フォローの確認
    $result = $this->user->followedBy($follower);

    expect($result)->toBeFalse();
    expect($this->user->followers()->count())->toBe(1);
});

// フォローしていない場合のunfollowedByテスト
test('unfollowed by not following user returns false', function () {
    $notFollower = User::factory()->create();

    // 未フォロー状態でのアンフォロー試行
    $result = $this->user->unfollowedBy($notFollower);

    expect($result)->toBeFalse();
    expect($this->user->followers()->count())->toBe(0);
});

// ユーザーの記事関係テスト
test('user can have articles', function () {
    $articles = Article::factory(3)->create(['user_id' => $this->user->id]);

    expect($this->user->articles()->count())->toBe(3);
    expect($this->user->articles->contains($articles->first()))->toBeTrue();
});

// ユーザーのチーム所有関係テスト
test('user can own teams', function () {
    $team = Team::factory()->create(['user_id' => $this->user->id]);

    expect($this->user->ownedTeams()->count())->toBe(1);
    expect($this->user->ownedTeams->contains($team))->toBeTrue();
});

// ユーザーのチーム参加関係テスト
test('user can be member of teams', function () {
    $team = Team::factory()->create();
    $team->users()->attach($this->user->id);

    expect($this->user->teams()->count())->toBe(1);
    expect($this->user->teams->contains($team))->toBeTrue();
});

// プロフィール写真URLのテスト
test('profile photo url accessor works correctly', function () {
    // デフォルトのプロフィール写真URL
    $defaultUrl = $this->user->profile_photo_url;
    expect($defaultUrl)->toContain('ui-avatars.com');
    expect($defaultUrl)->toContain($this->user->name);
});
```

### 4. 認証・認可のテスト

#### ファイル: `tests/Feature/Auth/UserAuthorizationTest.php`

```php
<?php

use App\Models\User;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

// チーム所有者によるユーザー情報アクセステスト
test('team owner can access member info', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();

    $team = Team::factory()->create(['user_id' => $owner->id]);
    $team->users()->attach($member->id);

    Sanctum::actingAs($owner);

    $response = $this->get(route('users.show', $member));
    $response->assertStatus(200);
});

// フォロワーによるユーザー情報アクセステスト
test('follower can access user info', function () {
    $user = User::factory()->create();
    $follower = User::factory()->create();

    // フォロー関係を作成
    $follower->following()->attach($user->id);

    Sanctum::actingAs($follower);

    $response = $this->get(route('users.show', $user));
    $response->assertStatus(200);
});

// 認証済みユーザーのアクセス権限テスト
test('authenticated user can access user profiles', function () {
    $user = User::factory()->create();
    $targetUser = User::factory()->create();

    Sanctum::actingAs($user);

    $response = $this->get(route('users.show', $targetUser));
    $response->assertStatus(200);
});

// APIトークンスコープのテスト
test('api token scopes work correctly', function () {
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
});

// 無効なトークンでのアクセステスト
test('invalid token access is denied', function () {
    $user = User::factory()->create();

    // 無効なトークンでアクセス
    $response = $this->withHeaders([
        'Authorization' => 'Bearer invalid-token'
    ])->getJson(route('api.users.show', $user));

    $response->assertStatus(401);
});
```

## テスト設定・ユーティリティ

### ファイル: `tests/TestCase.php` への追加

```php
<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

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

### Pestヘルパー関数の追加（新規）

#### ファイル: `tests/Pest.php` への追加

```php
<?php

use App\Models\User;
use App\Models\Team;
use Laravel\Sanctum\Sanctum;

// Pestカスタムヘルパー関数

/**
 * GraphQLクエリのヘルパー関数
 */
function graphQL(string $query, array $variables = [], array $headers = []) {
    return test()->postJson('/graphql', [
        'query' => $query,
        'variables' => $variables
    ], $headers);
}

/**
 * 認証済みユーザーでのGraphQLクエリ
 */
function authenticatedGraphQL(string $query, array $variables = [], ?User $user = null) {
    if (!$user) {
        $user = User::factory()->create();
    }

    Sanctum::actingAs($user);

    return graphQL($query, $variables);
}

/**
 * フォロー関係を作成するヘルパー
 */
function createFollowRelation(User $follower, User $followed): void {
    $follower->following()->attach($followed->id);
}

/**
 * テスト用チームとメンバーを作成するヘルパー
 */
function createTeamWithMembers(int $memberCount = 3): array {
    $owner = User::factory()->create();
    $team = Team::factory()->create(['user_id' => $owner->id]);

    $members = User::factory($memberCount)->create();
    foreach ($members as $member) {
        $team->users()->attach($member->id);
    }

    return [$team, $owner, $members];
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
