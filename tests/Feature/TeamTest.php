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

    // shared team のみ表示
    $this->actingAs($user)
        ->get('/teams?type=shared')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                collect($teams)->every(fn ($team) => $team['personal_team'] === false)
            )
            ->where('filters.type', 'shared')
        );
});

test('teams can be filtered by role', function () {
    // チーム役割によるフィルターが機能する
    $owner = User::factory()->withPersonalTeam()->create();
    $member = User::factory()->create();

    // オーナーが所有するチームを作成
    $ownedTeam = Jetstream::newTeamModel()->forceFill([
        'name' => 'Owned Team',
        'user_id' => $owner->id,
        'personal_team' => false,
    ]);
    $ownedTeam->save();

    // メンバーが参加するチームを作成
    $memberTeam = Jetstream::newTeamModel()->forceFill([
        'name' => 'Member Team',
        'user_id' => $member->id,
        'personal_team' => false,
    ]);
    $memberTeam->save();

    // メンバーをチームに追加
    $memberTeam->users()->attach($owner->id);

    // オーナーフィルター - オーナーが所有するチームのみ表示
    $this->actingAs($owner)
        ->get('/teams?role_filter=owner')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                collect($teams)->every(fn ($team) => $team['is_owner'] === true)
            )
            ->where('filters.role_filter', 'owner')
        );

    // メンバーフィルター - メンバーとして参加しているチームのみ表示
    $this->actingAs($owner)
        ->get('/teams?role_filter=member')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                collect($teams)->every(fn ($team) => $team['is_owner'] === false)
            )
            ->where('filters.role_filter', 'member')
        );

    // 全役割フィルター - 全てのチームを表示
    $this->actingAs($owner)
        ->get('/teams?role_filter=all')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                collect($teams)->count() >= 3 // personal + owned + member team
            )
            ->where('filters.role_filter', 'all')
        );
});

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
        ->get('/teams?page=1&per_page=12')
        ->assertInertia(fn ($page) => $page
            ->where('pagination.current_page', 1)
            ->where('pagination.per_page', 12)
            ->where('pagination.total', 26) // personal team + 25 regular teams
            ->has('teams', 12)
        );

    $this->actingAs($user)
        ->get('/teams?page=2&per_page=12')
        ->assertInertia(fn ($page) => $page
            ->where('pagination.current_page', 2)
            ->has('teams', 12)
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
            ->where('pagination.per_page', 12) // デフォルト値
        );

    $this->actingAs($user)
        ->get('/teams?per_page=101') // 最大値を超える
        ->assertInertia(fn ($page) => $page
            ->where('pagination.per_page', 12) // デフォルト値に戻る
        );
});

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

    // 作成日降順（デフォルト）- shared teamsのみでテスト
    $this->actingAs($user)
        ->get('/teams?type=shared&sort_by=created_desc')
        ->assertInertia(fn ($page) => $page
            ->where('teams.0.name', 'New Team')
            ->where('filters.sort_by', 'created_desc')
        );

    // 作成日昇順 - shared teamsのみでテスト
    $this->actingAs($user)
        ->get('/teams?type=shared&sort_by=created_asc')
        ->assertInertia(fn ($page) => $page
            ->where('teams.0.name', 'Old Team')
            ->where('filters.sort_by', 'created_asc')
        );

    // 名前昇順 - shared teamsのみでテスト
    $this->actingAs($user)
        ->get('/teams?type=shared&sort_by=name_asc')
        ->assertInertia(fn ($page) => $page
            ->where('teams.0.name', 'New Team') // アルファベット順
            ->where('filters.sort_by', 'name_asc')
        );
});

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
        ->get('/teams?type=shared')
        ->assertInertia(fn ($page) => $page
            ->where('stats.total', 6)
            ->where('stats.filtered', 5) // shared teams only
            ->where('stats.showing', 5)
        );

    // 役割フィルター適用時の統計
    $this->actingAs($user)
        ->get('/teams?role_filter=owner')
        ->assertInertia(fn ($page) => $page
            ->where('stats.total', 6)
            ->where('stats.filtered', 6) // all teams (personal + 5 owned)
            ->where('stats.showing', 6)
        );
});

test('teams can be filtered by multiple criteria', function () {
    // 複数のフィルター条件を組み合わせたフィルタリングが機能する
    $owner = User::factory()->withPersonalTeam()->create();
    $member = User::factory()->create();

    // オーナーが所有する共有チームを作成
    $ownedSharedTeam = Jetstream::newTeamModel()->forceFill([
        'name' => 'Owned Shared Team',
        'user_id' => $owner->id,
        'personal_team' => false,
    ]);
    $ownedSharedTeam->save();

    // メンバーが所有する共有チームを作成
    $memberOwnedTeam = Jetstream::newTeamModel()->forceFill([
        'name' => 'Member Owned Team',
        'user_id' => $member->id,
        'personal_team' => false,
    ]);
    $memberOwnedTeam->save();

    // オーナーをメンバーが所有するチームに追加
    $memberOwnedTeam->users()->attach($owner->id);

    // 検索 + タイプ + 役割フィルターの組み合わせ
    $this->actingAs($owner)
        ->get('/teams?search=Owned&type=shared&role_filter=owner')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                collect($teams)->every(fn ($team) => 
                    str_contains($team['name'], 'Owned') &&
                    $team['personal_team'] === false &&
                    $team['is_owner'] === true
                )
            )
            ->where('filters.search', 'Owned')
            ->where('filters.type', 'shared')
            ->where('filters.role_filter', 'owner')
        );

    // 検索 + 役割フィルターの組み合わせ
    $this->actingAs($owner)
        ->get('/teams?search=Member&role_filter=member')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                collect($teams)->every(fn ($team) => 
                    str_contains($team['name'], 'Member') &&
                    $team['is_owner'] === false
                )
            )
            ->where('filters.search', 'Member')
            ->where('filters.role_filter', 'member')
        );
});

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
});

test('role filter handles edge cases correctly', function () {
    // 役割フィルターのエッジケースを正しく処理する
    $user = User::factory()->withPersonalTeam()->create();

    // 無効な役割フィルター値
    $this->actingAs($user)
        ->get('/teams?role_filter=invalid')
        ->assertInertia(fn ($page) => $page
            ->where('filters.role_filter', 'invalid') // 無効な値でもフィルターとして保持
        );

    // 空の役割フィルター値
    $response = $this->actingAs($user)->get('/teams?role_filter=');
    $response->assertInertia(fn ($page) => $page
        ->where('filters.role_filter', null) // 空文字列はnullに変換される
    );

    // 役割フィルターなし（デフォルト値）
    $this->actingAs($user)
        ->get('/teams')
        ->assertInertia(fn ($page) => $page
            ->where('filters.role_filter', 'all') // デフォルト値
        );
});

test('role filter works with member count filter', function () {
    // 役割フィルターとメンバー数フィルターの組み合わせが機能する
    $owner = User::factory()->withPersonalTeam()->create();
    $member1 = User::factory()->create();
    $member2 = User::factory()->create();

    // オーナーが所有する1人チーム（personal team）
    // オーナーが所有する複数人チーム
    $multiMemberTeam = Jetstream::newTeamModel()->forceFill([
        'name' => 'Multi Member Team',
        'user_id' => $owner->id,
        'personal_team' => false,
    ]);
    $multiMemberTeam->save();
    $multiMemberTeam->users()->attach([$member1->id, $member2->id]);

    // 役割フィルター + メンバー数フィルターの組み合わせ
    $this->actingAs($owner)
        ->get('/teams?role_filter=owner&member_count=1')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                collect($teams)->every(fn ($team) => 
                    $team['is_owner'] === true &&
                    $team['members_count'] === 1
                )
            )
            ->where('filters.role_filter', 'owner')
            ->where('filters.member_count', '1')
        );

    // 役割フィルター + メンバー数フィルター（複数人）
    $this->actingAs($owner)
        ->get('/teams?role_filter=owner&member_count=2-5')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams) =>
                collect($teams)->every(fn ($team) => 
                    $team['is_owner'] === true &&
                    $team['members_count'] >= 2 &&
                    $team['members_count'] <= 5
                )
            )
            ->where('filters.role_filter', 'owner')
            ->where('filters.member_count', '2-5')
        );
});
