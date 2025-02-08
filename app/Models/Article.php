<?php

namespace App\Models;

use App\Traits\HasTranslatedAttributes;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Auth;

class Article extends Model
{
    use HasFactory;
    use HasTranslatedAttributes;

    const PAGE_SIZE = 8;

    protected $fillable = [
        'title',
        'body'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    public function getCreatedAtAttribute(string $value): string
    {
        return Carbon::parse($value)->format('Y/m/d H:i');
    }

    public function likes(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'likes')->withTimestamps();
    }

    /**
     * ユーザーによっていいねされているか？
     *
     * @param int|null $user_id ユーザーID
     * @return bool
     */
    public function isLikedBy(int $user_id = null): bool
    {
        $user_id = $user_id ?? Auth::id();
        return $user_id && (bool)$this->load('likes')->likes->where('id', $user_id)->count();
    }

    /**
     * いいねを設定する
     *
     * @param User $user いいねを設定するユーザー
     * @return void
     */
    public function likedBy(User $user): void
    {
        $user_id = $user->id;
        $this->likes()->detach($user_id);
        $this->likes()->attach($user_id);
    }

    /**
     * いいねを取り消す
     *
     * @param User $user いいねを取り消すユーザー
     * @return void
     */
    public function dislikedBy(User $user): void
    {
        $user_id = $user->id;
        $this->likes()->detach($user_id);
    }

    public function scopeSearch(Builder $query, string $word): Builder
    {
        return $query->when($word !== '', function ($query) use ($word) {
            $query->where('title', 'like', "%{$word}%");
        });
    }
}
