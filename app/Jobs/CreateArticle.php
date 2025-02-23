<?php

namespace App\Jobs;

use App\Events\ArticleCreated;
use App\Mail\ArticleSubmittedEmail;
use App\Models\Article;
use App\Models\Tag;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Laravel\Jetstream\Mail\TeamInvitation;

class CreateArticle implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels, Queueable;

    protected $data;
    protected $user;

    /**
     * Create a new job instance.
     */
    public function __construct(array $data, $user)
    {
        $this->data = $data;
        $this->user = $user;
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

            // create tags
            $tags = $this->data['tags'] ?? [];
            collect($tags)->each(function ($tagName) use ($article) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $article->tags()->attach($tag);
            });
            return $article->id;
        });

        return $articleId;
    }
}
