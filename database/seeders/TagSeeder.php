<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $isRefresh = 1;

        if ($isRefresh) {
            DB::table('tags')->delete();
            $this->makeTags();
        }

        if ($isRefresh) {
            DB::table('article_tag')->truncate();
        }
        $this->makeArticleTag();
    }

    public function makeTags(): void
    {
        DB::table('tags')->insert([
            ['name' => 'Installation',],
            ['name' => 'Configuration',],
            ['name' => 'Authentication',],
            ['name' => 'Security',],
            ['name' => 'Requests',],
            ['name' => 'Input',],
            ['name' => 'Session',],
            ['name' => 'Cache',],
            ['name' => 'Database',],
            ['name' => 'Eloquent',],
            ['name' => 'IOC',],
            ['name' => 'Views',],
            ['name' => 'Blade',],
            ['name' => 'Forms',],
            ['name' => 'Validation',],
            ['name' => 'Mail',],
            ['name' => 'Queues',],
            ['name' => 'Laravel.io',],
            ['name' => 'Packages',],
            ['name' => 'Meetups',],
            ['name' => 'Architecture',],
            ['name' => 'Jobs',],
            ['name' => 'Testing',],
            ['name' => 'Laravel',],
            ['name' => 'Lumen',],
            ['name' => 'Spark',],
            ['name' => 'Forge',],
            ['name' => 'Envoyer',],
            ['name' => 'Homestead',],
            ['name' => 'Valet',],
            ['name' => 'Socialite',],
            ['name' => 'Mix',],
            ['name' => 'Dusk',],
            ['name' => 'Jetstream',],
            ['name' => 'Fortify',],
            ['name' => 'Sail',],
            ['name' => 'Envoy',],
            ['name' => 'Vapor',],
            ['name' => 'Cashier',],
            ['name' => 'Breeze',],
            ['name' => 'Echo',],
            ['name' => 'Horizon',],
            ['name' => 'Sanctum',],
            ['name' => 'Scout',],
            ['name' => 'Tinker',],
            ['name' => 'Routing',],
            ['name' => 'Middleware',],
            ['name' => 'Logging',],
            ['name' => 'Artisan',],
            ['name' => 'Notifications',],
            ['name' => 'Scheduling',],
            ['name' => 'Authorization',],
            ['name' => 'Encryption',],
            ['name' => 'Passport',],
            ['name' => 'Nova',],
            ['name' => 'JavaScript',],
            ['name' => 'Vue.js',],
            ['name' => 'Alpine.js',],
            ['name' => 'API',],
            ['name' => 'Octane',],
        ]);
    }

    public function makeArticleTag(): void
    {
        $tagIds = array_flip(Tag::all()->pluck('id')->toArray());
        $articles = Article::all();
        $articleTag = [];

        foreach ($articles as $article) {
            foreach (array_rand($tagIds, rand(2, 3)) as $tagId) {
                $articleTag[] = [
                    'article_id' => $article->id,
                    'tag_id' => $tagId,
                ];
            }
        }

        DB::table('article_tag')->insert($articleTag);
    }
}
