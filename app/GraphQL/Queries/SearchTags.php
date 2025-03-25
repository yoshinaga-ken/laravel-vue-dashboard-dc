<?php

namespace App\GraphQL\Queries;

use App\Models\Tag;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class SearchTags
{
    public function resolve($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $keyword = $args['keyword'] ?? '';
        $limit = $args['limit'] ?? null;

        $query = Tag::query();

        if (!empty($keyword)) {
            $query->where('name', 'like', "%{$keyword}%");
        }

        if ($limit !== null) {
            $query->limit($limit);
        }

        return $query->get();
    }
}
