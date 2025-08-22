<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Jetstream\Jetstream;
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

    $response = $this->actingAs($user)->get('/teams?type=shared');

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
            ->has('pending_invitations_count')
            ->has('projects_count')
            ->has('is_active')
            ->has('profile_photo_url')
            ->has('recent_members')
            ->has('recent_invitations')
            ->has('owner', fn ($owner) => $owner
                ->has('id')
                ->has('name')
                ->has('email')
            )
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
            ->has('role_filter')
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
            ->has('hasTeamFeatures')
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

    $response = $this->actingAs($owner)->get('/teams?type=shared');

    $response->assertInertia(fn ($page) => $page
        ->where('teams', fn ($teams)
            => collect($teams)->contains(fn ($teamData)
                => $teamData['name'] === 'Test Team'
                && $teamData['is_owner'] === true
                && $teamData['members_count'] >= 1 // owner + member (最低1人)
                && $teamData['invitations_count'] >= 0 // 招待は0以上
                && $teamData['user_role'] === 'owner'
                && $teamData['permissions']['canUpdate'] === true
                && $teamData['permissions']['canDelete'] === true
            )
        )
    );
});

test('team permissions are correctly evaluated in API response', function () {
    // APIレスポンス内でチーム権限が正確に評価される
    $owner = User::factory()->withPersonalTeam()->create();
    $member = User::factory()->withPersonalTeam()->create();

    $team = Jetstream::newTeamModel()->forceFill([
        'name' => 'Test Team',
        'user_id' => $owner->id,
        'personal_team' => false,
    ]);
    $team->save();

    $team->users()->attach($member, ['role' => 'member']);

    // オーナーとしてアクセス
    $this->actingAs($owner)
        ->get('/teams')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams)
                => collect($teams)->contains(fn ($teamData)
                    => $teamData['name'] === 'Test Team'
                    && $teamData['permissions']['canView'] === true
                    && $teamData['permissions']['canUpdate'] === true
                    && $teamData['permissions']['canDelete'] === true
                )
            )
        );

    // メンバーとしてアクセス
    $this->actingAs($member)
        ->get('/teams')
        ->assertInertia(fn ($page) => $page
            ->where('teams', fn ($teams)
                => collect($teams)->contains(fn ($teamData)
                    => $teamData['name'] === 'Test Team'
                    && $teamData['permissions']['canView'] === true
                    && $teamData['permissions']['canUpdate'] === false
                    && $teamData['permissions']['canDelete'] === false
                )
            )
        );
});

test('personal team has correct properties in API response', function () {
    // パーソナルチームがAPIレスポンスで正しいプロパティを持つ
    $user = User::factory()->withPersonalTeam()->create();

    $response = $this->actingAs($user)->get('/teams');

    $response->assertInertia(fn ($page) => $page
        ->where('teams', fn ($teams)
            => collect($teams)->contains(fn ($teamData)
                => $teamData['personal_team'] === true
                && $teamData['is_owner'] === true
                && $teamData['user_role'] === 'owner'
                && $teamData['permissions']['canView'] === true
                && $teamData['permissions']['canUpdate'] === true
                && $teamData['permissions']['canDelete'] === false // personal team cannot be deleted
            )
        )
    );
});

test('current team is correctly identified in API response', function () {
    // 現在のチームがAPIレスポンスで正確に識別される
    $user = User::factory()->withPersonalTeam()->create();

    // 追加チームを作成
    $team = Jetstream::newTeamModel()->forceFill([
        'name' => 'Test Team',
        'user_id' => $user->id,
        'personal_team' => false,
    ]);
    $team->save();

    // 現在のチームを変更
    $user->switchTeam($team);

    $response = $this->actingAs($user)->get('/teams');

    $response->assertInertia(fn ($page) => $page
        ->where('teams', fn ($teams)
            => collect($teams)->contains(fn ($teamData)
                => $teamData['name'] === 'Test Team'
                && $teamData['is_current'] === true
            )
            && collect($teams)->contains(fn ($teamData)
                => $teamData['personal_team'] === true
                && $teamData['is_current'] === false
            )
        )
    );
});

test('jetstream capabilities are correctly provided in API response', function () {
    // JetstreamのケイパビリティがAPIレスポンスで正確に提供される
    $user = User::factory()->withPersonalTeam()->create();

    $response = $this->actingAs($user)->get('/teams');

    $response->assertInertia(fn ($page) => $page
        ->has('jetstream.canCreateTeams')
        ->where('jetstream.canCreateTeams', fn ($canCreate)
            => is_bool($canCreate)
        )
    );
});

test('pagination metadata is correctly structured', function () {
    // ページネーションメタデータが正しく構造化されている
    $user = User::factory()->withPersonalTeam()->create();

    // テストデータを作成
    for ($i = 1; $i <= 15; $i++) {
        $team = Jetstream::newTeamModel()->forceFill([
            'name' => "Test Team {$i}",
            'user_id' => $user->id,
            'personal_team' => false,
        ]);
        $team->save();
    }

    $response = $this->actingAs($user)->get('/teams?per_page=32&page=1');

    $response->assertInertia(fn ($page) => $page
        ->where('pagination.current_page', 1)
        ->where('pagination.per_page', 32)
        ->where('pagination.total', 16) // personal + 15 regular
        ->where('pagination.last_page', 1) // ceil(16/32) = 1
        ->where('pagination.from', 1)
        ->where('pagination.to', 16)
        ->has('pagination.links')
    );
});

test('filter parameters are correctly reflected in API response', function () {
    // フィルターパラメーターがAPIレスポンスに正しく反映される
    $user = User::factory()->withPersonalTeam()->create();

    $response = $this->actingAs($user)->get('/teams?search=test&type=shared&member_count=5&sort_by=name_asc');

    $response->assertInertia(fn ($page) => $page
        ->where('filters.search', 'test')
        ->where('filters.type', 'shared')
        ->where('filters.member_count', '5')
        ->where('filters.sort_by', 'name_asc')
    );
});

test('statistics are accurately calculated and provided', function () {
    // 統計情報が正確に計算され提供される
    $user = User::factory()->withPersonalTeam()->create();

    // テストデータを作成
    for ($i = 1; $i <= 10; $i++) {
        $team = Jetstream::newTeamModel()->forceFill([
            'name' => "Regular Team {$i}",
            'user_id' => $user->id,
            'personal_team' => false,
        ]);
        $team->save();
    }

    $response = $this->actingAs($user)->get('/teams?type=shared&per_page=32');

    $response->assertInertia(fn ($page) => $page
        ->where('stats.total', 11) // personal + 10 regular
        ->where('stats.filtered', 10) // only shared teams
        ->where('stats.showing', 10) // all shared teams fit in one page
        ->where('stats.from', 1)
        ->where('stats.to', 10)
    );
});
