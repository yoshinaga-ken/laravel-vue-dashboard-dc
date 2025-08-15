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

    const PAGE_SIZE = 24;

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
     * @param int|null $userId ユーザーID
     * @return bool
     */
    public function isLikedBy(int $userId = null): bool
    {
        $userId = $userId ?? Auth::id();
        return $userId && $this->load('likes')->likes->where('id', $userId)->count();
    }

    /**
     * いいねを設定する
     *
     * @param User $user いいねを設定するユーザー
     * @return void
     */
    public function likedBy(User $user): void
    {
        $userId = $user->id;
        $this->likes()->detach($userId);
        $this->likes()->attach($userId);
    }

    /**
     * いいねを取り消す
     *
     * @param User $user いいねを取り消すユーザー
     * @return void
     */
    public function dislikedBy(User $user): void
    {
        $userId = $user->id;
        $this->likes()->detach($userId);
    }

    public function scopeSearch(Builder $query, array $search = [], bool $isTagsAnd = true): Builder
    {
        $title = $search['title'] ?? null;
        $tags = $search['tags'] ?? null;
        $users = $search['users'] ?? null;
        $dateValue = $search['date_value'] ?? null;
        $dateOperator = $search['date_operator'] ?? null;
        $likesCount = $search['likes_count'] ?? null;
        $likesOperator = $search['likes_operator'] ?? null;
        $dateRangeValue = $search['date_range_value'] ?? null; // 追加：日付範囲検索パラメータ

        if ($isTagsAnd) {
            $query->when($tags, function ($query) use ($tags) {
                foreach ($tags as $tag) {
                    $query->whereHas('tags', function ($query) use ($tag) {
                        $query->where('name', $tag);
                    });
                }
            });
        } else {
            $query->when($tags, function ($query, $tags) {
                $query->whereHas('tags', function ($query) use ($tags) {
                    $query->whereIn('name', $tags);
                });
            });
        }

        $query->when($users, function ($query) use ($users) {
            $query->whereHas('user', function ($query) use ($users) {
                $query->whereIn('name', $users);
            });
        });

        // 日付範囲検索の実装
        $query->when(!empty($dateRangeValue), function ($query) use ($dateRangeValue) {
            $dates = explode(',', $dateRangeValue);
            if (count($dates) === 2) {
                $fromDate = $dates[0];
                $toDate = $dates[1];
                $query->whereBetween('updated_at', [$fromDate, $toDate]);
            }
        });

        // 単一日付検索の条件（既存）
        $query->when(!empty($dateValue) && !empty($dateOperator), function ($query) use ($dateValue, $dateOperator) {
            $query->where('updated_at', $dateOperator, $dateValue);
        });

        $query->when(!empty($likesCount) && !empty($likesOperator), function ($query) use ($likesCount, $likesOperator) {
            $query->withCount('likes')
                  ->having('likes_count', $likesOperator, $likesCount);
        });

        return $query->when($title, function ($query) use ($title) {
            $query->where('title', 'like', "%$title%");
        });
    }

    public function syncTagsByName(array $tags): void
    {
        $tagIds = array_map(function ($tagName) {
            return Tag::firstOrCreate(['name' => $tagName])->id;
        }, $tags);

        $this->tags()->sync($tagIds);
    }
}
