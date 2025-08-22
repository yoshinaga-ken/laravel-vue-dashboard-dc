<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $isRefresh = true;
        if ($isRefresh) {
            DB::table('team_user')->truncate();
        }
        $this->makeTeamUser();
        $this->assignUsersToTeams();
    }

    /**
     * Run the database seeds.
     */
    public function assignUsersToTeams(): void
    {
        // 既存のチームに5~10人のユーザーをランダムに所属させる
        Team::all()->each(function ($team) {
            $memberCount = rand(5, 10);
            $teamMembers = User::where('id', '!=', $team->user_id)
                ->inRandomOrder()
                ->take($memberCount)
                ->get();

            $pivotData = $teamMembers->pluck('id')->mapWithKeys(function ($memberId) {
                return [
                    $memberId => [
                        'role' => rand(1, 10) <= 2 ? 'admin' : 'editor', // 2割がadmin、残りがeditor
                    ],
                ];
            })->toArray();

            $team->users()->sync($pivotData);
        });
    }

    public function makeTeamUser(): void
    {
        // 各ユーザーに5%の確率で1~2件のチームを作成
        User::all()->each(function ($user) {
            $isTestUser = $user->name === env('TEST_USER_NAME', 'test');
            if (rand(1, 100) <= 5 || $isTestUser) { // 5%の確率
                $teamCount = rand(1, 2); // 1~2件のチームを作成
                for ($i = 0; $i < $teamCount; $i++) {
                    Team::factory()->create([
                        'user_id' => $user->id,
                        'name' => "{$user->name}'s Team #{$i}",
                        'personal_team' => false,
                    ]);
                }
            }
        });
    }
}
