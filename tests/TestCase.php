<?php

namespace Tests;

use App\Models\User;
use App\Models\Team;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
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
        $followed->followedBy($follower);
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

    /**
     * テスト用ユーザーをフォロワー付きで作成するヘルパー
     */
    protected function createUserWithFollowers(int $followerCount = 5): array
    {
        $user = User::factory()->create();
        $followers = User::factory($followerCount)->create();

        foreach ($followers as $follower) {
            $user->followedBy($follower);
        }

        return [$user, $followers];
    }

    /**
     * テスト用ユーザーをフォロー中付きで作成するヘルパー
     */
    protected function createUserWithFollowing(int $followingCount = 3): array
    {
        $user = User::factory()->create();
        $following = User::factory($followingCount)->create();

        foreach ($following as $followedUser) {
            $followedUser->followedBy($user);
        }

        return [$user, $following];
    }
}
