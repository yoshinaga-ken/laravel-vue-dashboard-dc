<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 各ユーザーに0~3件のチームを作成
        User::all()->each(function ($user) {
            $teamCount = rand(0, 3);
            for ($i = 0; $i < $teamCount; $i++) {
                $team = Team::factory()->create([
                    'user_id' => $user->id,
                    'name' => "Team {$user->name} #{$i}"
                ]);

                // 各チームに2~5人のユーザーをランダムに所属させる
                $memberCount = rand(2, 5);
                $teamMembers = User::where('id', '!=', $user->id)
                    ->inRandomOrder()
                    ->take($memberCount)
                    ->get();

                $team->users()->attach($teamMembers->pluck('id'));
            }
        });
    }
}
