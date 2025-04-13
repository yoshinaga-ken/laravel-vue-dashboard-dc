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
        $this->assignUsersToTeams();
        $this->makeTeamUser();
    }

    /**
     * Run the database seeds.
     */
    public function assignUsersToTeams(): void
    {
        // 既存のチームに5~20人のユーザーをランダムに所属させる
        Team::all()->each(function ($team) {
            $memberCount = rand(5, 10);
            $teamMembers = User::where('id', '!=', $team->user_id)
                ->inRandomOrder()
                ->take($memberCount)
                ->get();

            $pivotData = $teamMembers->pluck('id')->mapWithKeys(function ($memberId) {
                return [
                    $memberId => [
                        'role' => rand(1, 10) <= 2 ? 'admin' : 'editor' // 2割がadmin、残りがeditor
                    ]
                ];
            })->toArray();

            $team->users()->sync($pivotData);
        });
    }

    public function makeTeamUser(): void
    {
        // 各ユーザーに0~2件のチームを作成
        User::all()->each(function ($user) {
            $teamCount = rand(0, 2);
            for ($i = 0; $i < $teamCount; $i++) {
                $team = Team::factory()->create([
                    'user_id' => $user->id,
                    'name' => "{$user->name}'s Team #{$i}",
                    'personal_team' => false,
                ]);

                // 新規作成したチームに5~20人のユーザーをランダムに所属させる
                $this->assignUsersToTeams();
            }
        });
    }
}
