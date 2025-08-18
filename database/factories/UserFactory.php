<?php

namespace Database\Factories;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Jetstream\Features;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'remember_token' => Str::random(10),
            'profile_photo_path' => null,
            'current_team_id' => null,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user should have a personal team.
     */
    public function withPersonalTeam(?callable $callback = null): static
    {
        if (! Features::hasTeamFeatures()) {
            return $this->state([]);
        }

        return $this->has(
            Team::factory()
                ->state(fn (array $attributes, User $user) => [
                    'name' => $user->name.'\'s Team',
                    'user_id' => $user->id,
                    'personal_team' => true,
                ])
                ->when(is_callable($callback), $callback),
            'ownedTeams'
        );
    }

    /**
     * フォロワー付きユーザーの作成
     */
    public function withFollowers(int $count = 5): static
    {
        return $this->afterCreating(function (User $user) use ($count) {
            $followers = User::factory($count)->create();
            foreach ($followers as $follower) {
                $user->followedBy($follower);
            }
        });
    }

    /**
     * フォロー中ユーザー付きの作成
     */
    public function withFollowing(int $count = 3): static
    {
        return $this->afterCreating(function (User $user) use ($count) {
            $following = User::factory($count)->create();
            foreach ($following as $followedUser) {
                $followedUser->followedBy($user);
            }
        });
    }

    /**
     * 記事付きユーザーの作成
     */
    public function withArticles(int $count = 10): static
    {
        return $this->afterCreating(function (User $user) use ($count) {
            \App\Models\Article::factory($count)->create(['user_id' => $user->id]);
        });
    }
}
