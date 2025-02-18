<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ダミーの記事をN件作る
        Article::factory(20)->create();

        Sleep(1);

        // TEST_USER_NAMEの記事をN件作る
        $user = User::where('name', env('TEST_USER_NAME'))->first();
        Article::factory(20)->createQuietly([
            'user_id' => $user->id,
        ]);
    }
}
