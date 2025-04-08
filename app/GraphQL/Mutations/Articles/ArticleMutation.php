<?php

namespace App\GraphQL\Mutations\Articles;

use App\Http\Controllers\Controller;
use App\Jobs\CreateArticle;
use App\Models\Article;
use App\Models\User;
use App\Traits\ArticleRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class ArticleMutation extends Controller
{
    use ArticleRequest;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(
//        protected ArticleRepository $articleRepository,
    )
    {
    }

    public function store(mixed $rootValue, array $args, GraphQLContext $context)
    {
        try {
            // バリデーションの実行
            $validator = Validator::make($args, $this->rules());
            if ($validator->fails()) {
                throw new \Exception($validator->errors());
            }

            $user = Auth::user();
            if (!$user) {
                throw new \Exception(['認証されていないユーザーです']);
            }

            $article = new Article();
            Gate::forUser($user)->authorize('create', $article);

            $job = new CreateArticle($args, $user);
            $articleId = Bus::dispatchNow($job);

            $article = Article::find($articleId);

            if (!$article) {
                throw new \Exception(['記事の作成に失敗しました']);
            }

            return $article;
//            return [
//                'success' => true,
//                'message' => __('Article created', ['id' => $article->id]),
//                'article' => $article
//            ];
        } catch (\Exception $e) {
//            return [
//                'success'  => false,
//                'errors' => $e->getMessage()
//            ];
            throw $e;
        }
    }

    // Userを更新する
    public function associateUser($root, array $args, GraphQLContext $context)
    {
        $article = Article::findOrFail($args['id']);
        $user = User::find($args['user_id']);
        $article->user()->associate($user);
        $article->save();
        return $article;
    }

    public function attachTags($root, array $args, GraphQLContext $context)
    {
        $article = Article::findOrFail($args['id']);
        $article->tags()->attach($args['tagIds']);
        return $article;
    }

    public function detachTags($root, array $args, GraphQLContext $context)
    {
        $article = Article::findOrFail($args['id']);
        $article->tags()->detach($args['tagIds']);
        return $article;
    }

    public function syncTags($root, array $args, GraphQLContext $context)
    {
        $article = Article::findOrFail($args['id']);
        $article->tags()->sync($args['tagIds']);
        return $article;
    }

    public function syncTagsByName($root, array $args, GraphQLContext $context)
    {
        // バリデーションの実行
        $rules = $this->rules();
        $validator = Validator::make($args, [
            'tags' => $rules['tags'],
            'tags.*' => $rules['tags.*'],
        ]);
        if ($validator->fails()) {
            throw new \Exception($validator->errors());
        }

        $article = Article::findOrFail($args['id']);
        $article->syncTagsByName($args['tags']);
        return $article;
    }
}
