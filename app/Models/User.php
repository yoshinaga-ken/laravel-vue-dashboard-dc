<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Jetstream\HasTeams;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    /** @use HasFactory<UserFactory> */
    use HasFactory;
    use HasProfilePhoto;
    use HasTeams;
    use Notifiable;
    use TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the articles for the user.
     * @return HasMany
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    /**
     * Get the likes articles for the user.
     * @return BelongsToMany
     */
    public function likes(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'likes')->withTimestamps();
    }

    /**
     * ユーザーがフォローしているかどうか
     * @param int|null $userId
     * @return bool
     */
    public function isFollowedBy(int $userId = null): bool
    {
        $userId = $userId ?? Auth::id();
        // followersはリレーションでキャッシュされているので、loadが必要
        return (bool)$this->load('followers')->followers->where('id', $userId)->count();
    }

    /**
     * ユーザーをフォローする
     * @param User $user
     */
    public function followedBy(User $user): void
    {
        $userId = $user->id;
        $this->followers()->detach($userId);
        $this->followers()->attach($userId);
    }

    /**
     * ユーザーのフォローを外す
     * @param User $user
     */
    public function unfollowedBy(User $user): void
    {
        $userId = $user->id;
        $this->followers()->detach($userId);
    }

    /**
     * フォロワー（自分をフォローしているユーザー）を取得
     * @return BelongsToMany
     */
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'followers',
            'following_id',
            'follower_id'
        )->withTimestamps();
    }

    /**
     * フォロー中（自分がフォローしているユーザー）を取得
     * @return BelongsToMany
     */
    public function following(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'followers',
            'follower_id',
            'following_id'
        )->withTimestamps();
    }

    /**
     * Get the OAuth accounts for the user.
     *
     * @return HasMany<OAuthAccount>
     */
    public function oauthAccounts(): HasMany
    {
        return $this->hasMany(OAuthAccount::class);
    }

    /**
     * Get the OAuth account for a specific provider.
     *
     * @param string $provider
     * @return OAuthAccount|null
     */
    public function oauthAccount(string $provider): ?OAuthAccount
    {
        return $this->oauthAccounts()->where('provider', $provider)->first();
    }
}
