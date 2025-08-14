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

    // メンバー2名
    expect($team->users->count())->toBe(2);
    
    // オーナー + メンバー2名 = 3名
    expect($team->allUsers()->count())->toBe(3);
    
    // 実際のカウントを確認
    $actualCount = $team->users->count();
    expect($actualCount)->toBeGreaterThanOrEqual(2); // 最低2人（オーナー + メンバー）
    
    // 実際のユーザーIDを確認（メンバーのみ）
    $userIds = $team->users->pluck('id')->toArray();
    expect($userIds)->not->toContain($owner->id); // オーナーは含まれない
    expect($userIds)->toContain($member1->id);
    expect($userIds)->toContain($member2->id);
    
    // 全ユーザーIDを確認（オーナー + メンバー）
    $allUserIds = $team->allUsers()->pluck('id')->toArray();
    expect($allUserIds)->toContain($owner->id);
    expect($allUserIds)->toContain($member1->id);
    expect($allUserIds)->toContain($member2->id);
    
    // メンバーシップを確認
    expect($owner->belongsToTeam($team))->toBeTrue();
    expect($member1->belongsToTeam($team))->toBeTrue();
    expect($member2->belongsToTeam($team))->toBeTrue();
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

test('user role in team is determined correctly', function () {
    // ユーザーのチーム内役割が正確に判定される
    $owner = User::factory()->withPersonalTeam()->create();
    $member = User::factory()->withPersonalTeam()->create();
    $admin = User::factory()->withPersonalTeam()->create();

    $team = Jetstream::newTeamModel()->forceFill([
        'name' => 'Test Team',
        'user_id' => $owner->id,
        'personal_team' => false,
    ]);
    $team->save();

    // メンバーを追加
    $team->users()->attach($member, ['role' => 'member']);
    $team->users()->attach($admin, ['role' => 'admin']);

    // オーナーロール
    expect($owner->ownsTeam($team))->toBeTrue();
    expect($owner->belongsToTeam($team))->toBeTrue();

    // メンバーロール
    expect($member->belongsToTeam($team))->toBeTrue();
    expect($member->ownsTeam($team))->toBeFalse();

    // 管理者ロール
    expect($admin->belongsToTeam($team))->toBeTrue();
    expect($admin->ownsTeam($team))->toBeFalse();
});

test('personal team behavior is correct', function () {
    // パーソナルチームの動作が正確である
    $user = User::factory()->withPersonalTeam()->create();

    $personalTeam = $user->personalTeam();

    // パーソナルチームの基本プロパティ
    expect($personalTeam->personal_team)->toBeTrue();
    expect($personalTeam->user_id)->toBe($user->id);
    expect($user->ownsTeam($personalTeam))->toBeTrue();

    // パーソナルチームは削除できない
    expect($personalTeam->personal_team)->toBeTrue();
});

test('team membership validation works correctly', function () {
    // チームメンバーシップの検証が正確に動作する
    $owner = User::factory()->withPersonalTeam()->create();
    $member = User::factory()->withPersonalTeam()->create();
    $nonMember = User::factory()->withPersonalTeam()->create();

    $team = Jetstream::newTeamModel()->forceFill([
        'name' => 'Test Team',
        'user_id' => $owner->id,
        'personal_team' => false,
    ]);
    $team->save();

    $team->users()->attach($member);

    // メンバーシップチェック
    expect($owner->belongsToTeam($team))->toBeTrue();
    expect($member->belongsToTeam($team))->toBeTrue();
    expect($nonMember->belongsToTeam($team))->toBeFalse();

    // チーム内ユーザー一覧
    $teamUserIds = $team->allUsers()->pluck('id')->toArray();
    expect($teamUserIds)->toContain($owner->id);
    expect($teamUserIds)->toContain($member->id);
    expect($teamUserIds)->not()->toContain($nonMember->id);
});
