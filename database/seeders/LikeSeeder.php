<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;

class LikeSeeder extends Seeder
{
    use WithFaker;

    public function run(): void
    {
        $users = User::all();
        $articles = Article::all()->random(Article::all()->count() - 3);
        $likes = [];

        foreach ($articles as $article) {
            foreach ($users->random(rand(1, 4)) as $user) {
                $likes[] = [
                    'article_id' => $article->id,
                    'user_id' => $user->id,
                ];
            }
        }

        DB::table('likes')->insert($likes);
    }
}
