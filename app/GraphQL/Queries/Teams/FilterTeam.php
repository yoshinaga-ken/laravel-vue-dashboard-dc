<?php

namespace App\GraphQL\Queries\Teams;

use App\GraphQL\Queries\BaseFilter;
use Illuminate\Database\Eloquent\Builder;

class FilterTeam extends BaseFilter
{
    public function __invoke(Builder $builder, array $input)
    {
        if (isset($input['name'])) {
            $builder->where('name', 'like', '%' . $input['name'] . '%');
        }

        if (isset($input['created_at'])) {
            $builder->whereDate('created_at', $input['created_at']);
        }

        return $builder;
    }
}
