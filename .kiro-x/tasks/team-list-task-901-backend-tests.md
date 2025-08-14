# TASK-901: バックエンドテスト実装（チーム一覧機能）

## タスク概要

チーム一覧機能のバックエンドテストをPest PHPを使用して実装します。既存の実装を対象に、機能テスト（Feature Tests）と統合テスト（Integration Tests）を作成し、コード品質とテスト coverage を向上させます。

## 依存関係

- **依存タスク**:
  - TASK-101 (バックエンドAPI実装) - `TeamController@index` API
  - TASK-203 (ページネーション機能) - フィルター・ページネーション機能
- **関連実装**:
  - `app/Http/Controllers/TeamController.php` - テスト対象のコントローラー
  - `routes/web.php` - ルーティング設定

## 実装内容

### 1. Feature Test: TeamControllerTest.php

**ファイル**: `tests/Feature/TeamTest.php`

#### 1.1 基本的なアクセステスト

```php
<?php

use App\Models\User;
use Laravel\Jetstream\Jetstream;

test('unauthenticated users cannot access teams index', function () {
    // 未認証ユーザーがチーム一覧にアクセスした場合、ログインページにリダイレクトされる
    $this->get('/teams')
        ->assertRedirect('/login');
});

test('authenticated user can view teams index', function () {
    // 認証されたユーザーが、チームのインデックスのページを表示できます
    $user = User::factory()->withPersonalTeam()->create();

    $this->actingAs($user)
        ->get('/teams')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Teams/Index')
            ->has('teams')
            ->has('pagination')
            ->has('filters')
            ->has('stats')
            ->has('jetstream')
        );
});
```

#### 1.2 権限・認可テスト

```php
test('user can only see teams they belong to or own', function () {
    // ユーザーは所属または所有しているチームのみ表示される
    $user1 = User::factory()->withPersonalTeam()->create();
    $user2 = User::factory()->withPersonalTeam()->create();

    // user1 が追加チームを作成
    $team = Jetstream::newTeamModel()->forceFill([
        'name' => 'Test Team',
        'user_id' => $user1->id,
        'personal_team' => false,
    ]);
    $team->save();

    $this->actingAs($user1)
        ->get('/teams')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                collect($teams)->contains('name', 'Test Team') &&
                collect($teams)->contains('name', $user1->name . "'s Team")
            )
        );

    $this->actingAs($user2)
        ->get('/teams')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                !collect($teams)->contains('name', 'Test Team')
            )
        );
});
```

#### 1.3 フィルター・検索機能テスト

```php
test('teams can be filtered by search term', function () {
    // チーム名による検索フィルターが機能する
    $user = User::factory()->withPersonalTeam()->create();

    // 検索対象のチームを作成
    $searchableTeam = Jetstream::newTeamModel()->forceFill([
        'name' => 'Searchable Team',
        'user_id' => $user->id,
        'personal_team' => false,
    ]);
    $searchableTeam->save();

    $otherTeam = Jetstream::newTeamModel()->forceFill([
        'name' => 'Other Team',
        'user_id' => $user->id,
        'personal_team' => false,
    ]);
    $otherTeam->save();

    $this->actingAs($user)
        ->get('/teams?search=Searchable')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                collect($teams)->contains('name', 'Searchable Team') &&
                !collect($teams)->contains('name', 'Other Team')
            )
            ->where('filters.search', 'Searchable')
        );
});

test('teams can be filtered by type', function () {
    // チームタイプによるフィルターが機能する
    $user = User::factory()->withPersonalTeam()->create();

    // 通常のチームを作成
    $regularTeam = Jetstream::newTeamModel()->forceFill([
        'name' => 'Regular Team',
        'user_id' => $user->id,
        'personal_team' => false,
    ]);
    $regularTeam->save();

    // personal_team のみ表示
    $this->actingAs($user)
        ->get('/teams?type=personal')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                collect($teams)->every(fn ($team) => $team['personal_team'] === true)
            )
            ->where('filters.type', 'personal')
        );

    // regular team のみ表示
    $this->actingAs($user)
        ->get('/teams?type=regular')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                collect($teams)->every(fn ($team) => $team['personal_team'] === false)
            )
            ->where('filters.type', 'regular')
        );
});
```

#### 1.4 ページネーション機能テスト

```php
test('teams list supports pagination', function () {
    // ページネーション機能が正常に動作する
    $user = User::factory()->withPersonalTeam()->create();

    // 多数のチームを作成（テスト用）
    for ($i = 1; $i <= 25; $i++) {
        $team = Jetstream::newTeamModel()->forceFill([
            'name' => "Test Team {$i}",
            'user_id' => $user->id,
            'personal_team' => false,
        ]);
        $team->save();
    }

    $this->actingAs($user)
        ->get('/teams?page=1&per_page=10')
        ->assertInertia(fn ($page) => $page
            ->where('pagination.current_page', 1)
            ->where('pagination.per_page', 10)
            ->where('pagination.total', 26) // personal team + 25 regular teams
            ->has('teams', 10)
        );

    $this->actingAs($user)
        ->get('/teams?page=2&per_page=10')
        ->assertInertia(fn ($page) => $page
            ->where('pagination.current_page', 2)
            ->has('teams', 10)
        );
});

test('pagination parameters validation', function () {
    // ページネーションパラメーターのバリデーション
    $user = User::factory()->withPersonalTeam()->create();

    // 無効なページ番号
    $this->actingAs($user)
        ->get('/teams?page=0')
        ->assertInertia(fn ($page) => $page
            ->where('pagination.current_page', 1)
        );

    $this->actingAs($user)
        ->get('/teams?page=-1')
        ->assertInertia(fn ($page) => $page
            ->where('pagination.current_page', 1)
        );

    // 無効なper_pageパラメーター
    $this->actingAs($user)
        ->get('/teams?per_page=0')
        ->assertInertia(fn ($page) => $page
            ->where('pagination.per_page', 10) // デフォルト値
        );

    $this->actingAs($user)
        ->get('/teams?per_page=101') // 最大値を超える
        ->assertInertia(fn ($page) => $page
            ->where('pagination.per_page', 100) // 最大値でキャップ
        );
});
```

#### 1.5 ソート機能テスト

```php
test('teams can be sorted by different criteria', function () {
    // ソート機能が正常に動作する
    $user = User::factory()->withPersonalTeam()->create();

    // 作成日が異なるチームを作成
    $oldTeam = Jetstream::newTeamModel()->forceFill([
        'name' => 'Old Team',
        'user_id' => $user->id,
        'personal_team' => false,
        'created_at' => now()->subDays(5),
    ]);
    $oldTeam->save();

    $newTeam = Jetstream::newTeamModel()->forceFill([
        'name' => 'New Team',
        'user_id' => $user->id,
        'personal_team' => false,
        'created_at' => now()->subDays(1),
    ]);
    $newTeam->save();

    // 作成日降順（デフォルト）
    $this->actingAs($user)
        ->get('/teams?sort_by=created_desc')
        ->assertInertia(fn ($page) => $page
            ->where('teams.0.name', 'New Team')
            ->where('filters.sort_by', 'created_desc')
        );

    // 作成日昇順
    $this->actingAs($user)
        ->get('/teams?sort_by=created_asc')
        ->assertInertia(fn ($page) => $page
            ->where('teams.0.name', 'Old Team')
            ->where('filters.sort_by', 'created_asc')
        );

    // 名前昇順
    $this->actingAs($user)
        ->get('/teams?sort_by=name_asc')
        ->assertInertia(fn ($page) => $page
            ->where('teams.0.name', 'New Team') // アルファベット順
            ->where('filters.sort_by', 'name_asc')
        );
});
```

#### 1.6 統計情報テスト

```php
test('teams index provides correct statistics', function () {
    // 統計情報が正確に計算される
    $user = User::factory()->withPersonalTeam()->create();

    // 追加チームを作成
    for ($i = 1; $i <= 5; $i++) {
        $team = Jetstream::newTeamModel()->forceFill([
            'name' => "Team {$i}",
            'user_id' => $user->id,
            'personal_team' => false,
        ]);
        $team->save();
    }

    $this->actingAs($user)
        ->get('/teams')
        ->assertInertia(fn ($page) => $page
            ->where('stats.total', 6) // personal + 5 regular
            ->where('stats.filtered', 6)
            ->where('stats.showing', 6)
        );

    // フィルター適用時の統計
    $this->actingAs($user)
        ->get('/teams?type=regular')
        ->assertInertia(fn ($page) => $page
            ->where('stats.total', 6)
            ->where('stats.filtered', 5) // regular teams only
            ->where('stats.showing', 5)
        );
});
```

### 2. Integration Test: Models/TeamTest.php

**ファイル**: `tests/Integration/Models/TeamTest.php`

#### 2.1 User-Team リレーション統合テスト

```php
<?php

use App\Models\User;
use Laravel\Jetstream\Jetstream;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

test('user can access all teams they belong to', function () {
    // ユーザーが所属する全チームにアクセスできる
    $user = User::factory()->withPersonalTeam()->create();

    // 所有チームを作成
    $ownedTeam = Jetstream::newTeamModel()->forceFill([
        'name' => 'Owned Team',
        'user_id' => $user->id,
        'personal_team' => false,
    ]);
    $ownedTeam->save();

    // 他ユーザーのチームに参加
    $otherUser = User::factory()->withPersonalTeam()->create();
    $otherTeam = Jetstream::newTeamModel()->forceFill([
        'name' => 'Other Team',
        'user_id' => $otherUser->id,
        'personal_team' => false,
    ]);
    $otherTeam->save();
    $otherTeam->users()->attach($user);

    $allTeams = $user->allTeams();

    expect($allTeams->count())->toBe(3); // personal + owned + member
    expect($allTeams->pluck('name')->toArray())->toContain('Owned Team');
    expect($allTeams->pluck('name')->toArray())->toContain('Other Team');
});

test('team member counts are calculated correctly', function () {
    // チームメンバー数が正確に計算される
    $owner = User::factory()->withPersonalTeam()->create();
    $member1 = User::factory()->withPersonalTeam()->create();
    $member2 = User::factory()->withPersonalTeam()->create();

    $team = Jetstream::newTeamModel()->forceFill([
        'name' => 'Test Team',
        'user_id' => $owner->id,
        'personal_team' => false,
    ]);
    $team->save();

    // メンバーを追加
    $team->users()->attach($member1);
    $team->users()->attach($member2);

    $team->load('users', 'owner');

    // オーナー + メンバー2名 = 3名
    expect($team->users->count())->toBe(3);
});

test('team permissions are evaluated correctly', function () {
    // チーム権限が正確に評価される
    $owner = User::factory()->withPersonalTeam()->create();
    $member = User::factory()->withPersonalTeam()->create();
    $outsider = User::factory()->withPersonalTeam()->create();

    $team = Jetstream::newTeamModel()->forceFill([
        'name' => 'Test Team',
        'user_id' => $owner->id,
        'personal_team' => false,
    ]);
    $team->save();

    $team->users()->attach($member);

    // オーナー権限チェック
    expect($owner->ownsTeam($team))->toBeTrue();
    expect($owner->belongsToTeam($team))->toBeTrue();

    // メンバー権限チェック
    expect($member->ownsTeam($team))->toBeFalse();
    expect($member->belongsToTeam($team))->toBeTrue();

    // 外部ユーザー権限チェック
    expect($outsider->ownsTeam($team))->toBeFalse();
    expect($outsider->belongsToTeam($team))->toBeFalse();
});
```

#### 2.2 Team Invitation 統合テスト

```php
test('team invitation counts are calculated correctly', function () {
    // チーム招待数が正確に計算される
    $owner = User::factory()->withPersonalTeam()->create();

    $team = Jetstream::newTeamModel()->forceFill([
        'name' => 'Test Team',
        'user_id' => $owner->id,
        'personal_team' => false,
    ]);
    $team->save();

    // 招待を作成
    $team->teamInvitations()->create([
        'email' => 'test1@example.com',
        'role' => 'member',
    ]);

    $team->teamInvitations()->create([
        'email' => 'test2@example.com',
        'role' => 'member',
    ]);

    $team->load('teamInvitations');

    expect($team->teamInvitations->count())->toBe(2);
});
```

### 3. Integration Test: Api/TeamTest.php

**ファイル**: `tests/Integration/Api/TeamTest.php`

#### 3.1 データ構造テスト

```php
<?php

use App\Models\User;
use Laravel\Jetstream\Jetstream;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

test('teams index returns correct data structure', function () {
    // チーム一覧APIが正しいデータ構造を返す
    $user = User::factory()->withPersonalTeam()->create();

    $team = Jetstream::newTeamModel()->forceFill([
        'name' => 'Test Team',
        'user_id' => $user->id,
        'personal_team' => false,
    ]);
    $team->save();

    $response = $this->actingAs($user)->get('/teams');

    $response->assertInertia(fn ($page) => $page
        ->component('Teams/Index')
        ->has('teams.0', fn ($team) => $team
            ->has('id')
            ->has('name')
            ->has('personal_team')
            ->has('created_at')
            ->has('updated_at')
            ->has('is_owner')
            ->has('is_current')
            ->has('user_role')
            ->has('members_count')
            ->has('invitations_count')
            ->has('permissions', fn ($permissions) => $permissions
                ->has('canView')
                ->has('canUpdate')
                ->has('canDelete')
            )
        )
        ->has('pagination', fn ($pagination) => $pagination
            ->has('current_page')
            ->has('last_page')
            ->has('per_page')
            ->has('total')
            ->has('from')
            ->has('to')
            ->has('links')
        )
        ->has('filters', fn ($filters) => $filters
            ->has('search')
            ->has('type')
            ->has('member_count')
            ->has('sort_by')
        )
        ->has('stats', fn ($stats) => $stats
            ->has('total')
            ->has('filtered')
            ->has('showing')
            ->has('from')
            ->has('to')
        )
        ->has('jetstream', fn ($jetstream) => $jetstream
            ->has('canCreateTeams')
        )
    );
});

test('team data includes correct relationship information', function () {
    // チームデータが正確なリレーション情報を含む
    $owner = User::factory()->withPersonalTeam()->create();
    $member = User::factory()->withPersonalTeam()->create();

    $team = Jetstream::newTeamModel()->forceFill([
        'name' => 'Test Team',
        'user_id' => $owner->id,
        'personal_team' => false,
    ]);
    $team->save();

    $team->users()->attach($member, ['role' => 'member']);

    $team->teamInvitations()->create([
        'email' => 'pending@example.com',
        'role' => 'member',
    ]);

    $response = $this->actingAs($owner)->get('/teams');

    $response->assertInertia(fn ($page) => $page
        ->where('teams', fn ($teams) =>
            collect($teams)->contains(fn ($teamData) =>
                $teamData['name'] === 'Test Team' &&
                $teamData['is_owner'] === true &&
                $teamData['members_count'] === 2 && // owner + member
                $teamData['invitations_count'] === 1 &&
                $teamData['user_role'] === 'owner' &&
                $teamData['permissions']['canUpdate'] === true &&
                $teamData['permissions']['canDelete'] === true
            )
        )
    );
});
```

### 4. Performance Test

```php
test('teams index handles large datasets efficiently', function () {
    // 大量データセットの効率的な処理
    $user = User::factory()->withPersonalTeam()->create();

    // 大量のチームを作成
    for ($i = 1; $i <= 100; $i++) {
        $team = Jetstream::newTeamModel()->forceFill([
            'name' => "Team {$i}",
            'user_id' => $user->id,
            'personal_team' => false,
        ]);
        $team->save();
    }

    $startTime = microtime(true);

    $response = $this->actingAs($user)->get('/teams?per_page=20');

    $endTime = microtime(true);
    $executionTime = $endTime - $startTime;

    $response->assertStatus(200);

    // 2秒以内で応答することを確認
    expect($executionTime)->toBeLessThan(2.0);

    // N+1問題が発生していないことを確認（クエリ数を監視）
    $this->assertDatabaseQueryCount('<', 10);
});
```

## 実装時の注意点

### 1. テスト設計指針

- **明確なテスト目的**: 各テストケースの目的を明確にし、単一責任の原則に従う
- **データ独立性**: テスト間でのデータ競合を避けるため、各テストで独立したデータを作成
- **Boundary Testing**: エッジケース（空データ、最大値、無効値）のテストを含める

### 2. Laravel/Jetstream特有の考慮事項

- **User Factory**: `User::factory()->withPersonalTeam()->create()` を使用して、適切な初期状態を作成
- **Inertia.js**: `assertInertia()` を使用してフロントエンドに渡されるデータの検証
- **Team Policies**: Jetstreamの権限システムに基づいたテストケース

### 3. パフォーマンステスト

- **N+1 Problem**: Eager Loading が正しく機能していることの確認
- **Query Count**: 不要なクエリが発生していないことの監視
- **Response Time**: 妥当な応答時間内での処理完了の確認

### 4. エラーハンドリングテスト

- **Authorization Failures**: 権限不足時の適切なエラーレスポンス
- **Validation Errors**: 無効なパラメーターに対する適切な処理
- **Database Errors**: データベース例外時の適切な処理

## 成果物

### 新規作成ファイル

1. `tests/Feature/TeamTest.php` - チーム一覧機能の Feature Test
2. `tests/Integration/Models/TeamTest.php` - Team Model の統合テスト
3. `tests/Integration/Api/TeamTest.php` - API データ構造テスト

### テストカバレッジ対象

1. **TeamController@index**: チーム一覧取得API
2. **User-Team Relations**: ユーザーとチームの関係性
3. **Filtering & Pagination**: フィルター・ページネーション機能
4. **Authorization**: 権限・認可システム
5. **Data Structure**: API レスポンスデータ構造

## テスト実行方法

```bash
# 全テスト実行
vendor/bin/pest

# 特定ファイルのテスト実行
vendor/bin/pest tests/Feature/TeamTest.php

# 統合テストのみ実行
vendor/bin/pest tests/Integration/

# カバレッジレポート生成
vendor/bin/pest --coverage
```

## 品質指標

- **Test Coverage**: 90%以上
- **Response Time**: 2秒以内
- **Query Count**: 10クエリ以内
- **Memory Usage**: 32MB以内
