<?php

namespace App\GraphQL\Queries;

use Illuminate\Database\Eloquent\Builder;

class BaseFilter
{
    /**
     * Split the name into firstname and lastname.
     */
    protected function nameSplitter(?string $name): array
    {
        $nameParts = explode(' ', $name, 2);

        return [
            'firstname' => current($nameParts),
            'lastname'  => $nameParts[1] ?? '',
        ];
    }

    /**
     * Apply filter on the query.
     */
    protected function applyFilter(Builder $query, array $filters): Builder
    {
        foreach ($filters as $column => $value) {
            if (! empty($value)) {
                $query->where($column, $value);
            }
        }

        return $query;
    }

    /**
     * Apply filter on the query.
     */
    protected function applyLikeFilter(Builder $query, array $filters): Builder
    {
        foreach ($filters as $column => $value) {
            if (! empty($value)) {
                $query->where($column, 'like', '%'.$value.'%');
            }
        }

        return $query;
    }
}
