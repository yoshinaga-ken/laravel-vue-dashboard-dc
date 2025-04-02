<?php

namespace App\GraphQL\Queries\Articles;

use Illuminate\Database\Eloquent\Builder;

class FilterArticle
{
    public function __invoke(Builder $builder, array $input): Builder
    {
        if (isset($input['title'])) {
            $builder->where('title', 'like', "%{$input['title']}%");
        }
        if (isset($input['body'])) {
            $builder->where('body', 'like', "%{$input['body']}%");
        }
        if (isset($input['user_id'])) {
            $builder->where('user_id', $input['user_id']);
        }
        if (isset($input['user_name'])) {
            $builder->whereHas('user', function ($query) use ($input) {
                $query->where('name', 'like', "%{$input['user_name']}%");
            });
        }
        if (isset($input['created_at'])) {
            $builder->whereDate('created_at', $input['created_at']);
        }
        return $builder;
    }
}
