<?php

namespace App\Jobs;

use App\Events\ArticleCreated;
use App\Models\Article;
use App\Models\Tag;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

final class CreateArticle implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels, Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private array $data,
        private       $user,
        private bool  $shouldEventTrigger = false
    )
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): int
    {
        $articleId = DB::transaction(function () {
            $article = new Article();
            $article->fill($this->data);
            $article->user_id = $this->user->id;
            $article->save();

            $article->syncTagsByName($this->data['tags'] ?? []);

            if ($this->shouldEventTrigger) {
                event(new ArticleCreated($article));
            }
            return $article->id;
        });

        return $articleId;
    }
}
