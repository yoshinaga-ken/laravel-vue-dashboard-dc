<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FollowerSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $followers = $users->random(max(0, $users->count() - 3)); // 一部のユーザーをフォロワーに

        $follows = [];

        foreach ($followers as $follower) {
            $followTargets = $users
                ->reject(fn($user) => $user->id === $follower->id) // 自分を除外
                ->random(rand(1, min(4, $users->count() - 1))); // 最小1人, 最大4人フォロー

            foreach ($followTargets as $user) {
                $follows[] = [
                    'follower_id' => $follower->id,
                    'following_id' => $user->id,
                ];
            }
        }

        if (!empty($follows)) {
            DB::table('followers')->insert($follows);
        }
    }
}
