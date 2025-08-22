<?php

namespace App\Jobs;

use App\Events\ArticleCreated;
use App\Models\Article;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

final class UpdateArticle implements ShouldQueue
{
    use Dispatchable;use InteractsWithQueue;use SerializesModels;use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private Article $article,
        private array   $data,
        private bool    $shouldEventTrigger = false
    )
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): int
    {
        DB::transaction(function () {
            $this->article->fill($this->data)->save();

            $this->article->syncTagsByName($this->data['tags'] ?? []);

            if ($this->shouldEventTrigger) {
                event(new ArticleCreated($this->article));
            }
        });
        return $this->article->id;
    }
}
