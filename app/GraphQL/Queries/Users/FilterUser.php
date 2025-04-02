<?php

namespace App\GraphQL\Queries\Users;

use App\GraphQL\Queries\BaseFilter;
use Illuminate\Database\Eloquent\Builder;

class FilterUser extends BaseFilter
{
    public function __invoke(Builder $builder, array $input)
    {
        if (isset($input['name'])) {
            $builder->where('name', 'like', '%' . $input['name'] . '%');
        }

        if (isset($input['email'])) {
            $builder->where('email', 'like', '%' . $input['email'] . '%');
        }

        if (isset($input['created_at'])) {
            $builder->whereDate('created_at', $input['created_at']);
        }

        return $builder;
    }
}
