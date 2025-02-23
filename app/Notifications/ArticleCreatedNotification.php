<?php

namespace App\Notifications;

use App\Mail\ArticleCreatedEmail;
use App\Models\Article;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ArticleCreatedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private Article $article)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(User $user): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(User $user): ArticleCreatedEmail
    {
        return (new ArticleCreatedEmail($this->article))
            ->to($this->article->user->email, $this->article->user->name);
    }

    public function toDatabase(User $user)
    {
        return [
            'type' => 'article_submitted',
            'article_title' => $this->article->title,
        ];
    }
}
