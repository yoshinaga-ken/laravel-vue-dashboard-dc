<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ArticlePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // API の場合: トークンの権限をチェック
        $canCreate = true;
        if ($user->currentAccessToken()) {
            $canCreate = $user->tokenCan('create');
        }

        return $canCreate;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Article $article): bool
    {
        // API の場合: トークンの権限をチェック
        $canUpdate = true;
        if ($user->currentAccessToken()) {
            $canUpdate = $user->tokenCan('update');
        }

        return $canUpdate && $article->user_id == $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Article $article): bool
    {
        // API の場合: トークンの権限をチェック
        $canDelete = true;
        if ($user->currentAccessToken()) {
            $canDelete = $user->tokenCan('delete');
        }

        return $canDelete && $article->user_id == $user->id;
    }
}
