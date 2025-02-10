<?php

namespace App\Http\Controllers;

use App\Http\Requests\IndexArticleRequest;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\UserResource;
use App\Models\Article;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(IndexArticleRequest $request)
    {
        $isWantsJson = $request->wantsJson();

        $search = $request->input('search', '');

        $sort = $request->input('sort', 'created_at');
        $order = $request->input('order', 'desc');

        $from = $request->input('from', 0);
        $to = $request->input('to', Article::PAGE_SIZE);

        return $isWantsJson
            ? response()->json(ArticleResource::collection(
                Article::with(['user', 'likes', 'tags'])
                    ->search($search)
                    ->orderBy($sort, $order)
                    ->skip($from)
                    ->take($to - $from + 1)
                    ->get()
            ))
            : Inertia::render('Articles/Index', [
                'articles' => function () use ($request, $sort, $order, $search) {
                    $articles = Article::with(['user', 'tags', 'likes'])
                        ->search($search)
                        ->orderBy($sort, $order)
                        ->paginate(Article::PAGE_SIZE)
                        ->withQueryString()
                        ->through(fn(Article $article) => [
                            'id' => $article->id,
                            'title' => $article->title,
                            'created_at' => $article->created_at,
                            'user' => UserResource::make($article->user)->toArray($request),
                            'tags' => $article->tags,
                            'likes' => $article->likes,
                            'is_liked_by' => $article->isLikedBy(),
                        ]);
                    return $articles;
                },
            ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Articles/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticleRequest $request, Article $article)
    {
        $isWantsJson = $request->wantsJson();

        $user = $request->user();
        Gate::forUser($user)->authorize('create', $article);

        DB::transaction(function () use ($article, $request) {
            $article->fill($request->all());
            $article->user_id = $request->user()->id;
            $article->save();

            // create tags
            collect($request->tags)->each(function ($tagName) use ($article) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $article->tags()->attach($tag);
            });
        });

        return $isWantsJson
            ? ArticleResource::make($article) // ['article_id' => $article->id]
            : Redirect::route('articles.index')->with('success', __('Article created', ['id' => $article->id]));
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        return Inertia::render('Articles/Show', [
                'article' => function () use ($article) {
                    $article->load('user', 'tags', 'likes')->is_liked_by = $article->isLikedBy();
                    return $article;
                },
                'permissions' => [
                    'canDeleteArticle' => false,
                    'canUpdateArticle' => false,
                ],
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        return Inertia::render('Articles/Edit', [
                'article' => function () use ($article) {
                    $article->load('user', 'tags', 'likes')->is_liked_by = $article->isLikedBy();
                    return $article;
                },
                'permissions' => [
                    'canDeleteArticle' => true,
                    'canUpdateArticle' => true,
                ],
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticleRequest $request, Article $article)
    {
        $isWantsJson = $request->wantsJson();

        $user = $request->user();
        Gate::forUser($user)->authorize('update', $article);

        DB::transaction(function () use ($article, $request) {
            // update article
            $article->fill($request->all())->save();

            // update tags
            $article->tags()->detach();
            collect($request->tags)->each(function ($tagName) use ($article) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $article->tags()->attach($tag);
            });
        });

        return $isWantsJson
            ? ArticleResource::make($article) // ['article_id' => $article->id]
            : Redirect::back()->with('success', __('Article updated', ['id' => $article->id]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Article $article)
    {
        $isWantsJson = $request->wantsJson();

        $user = $request->user();
        Gate::forUser($user)->authorize('delete', $article);

        $article->delete();

        return $isWantsJson
            ? ['article_id' => $article->id]
            : Redirect::route('articles.index')->with('success', __('Article deleted', ['id' => $article->id]));
    }

    public function like(Request $request, Article $article)
    {
        $isWantsJson = $request->wantsJson();

        $article->likedBy($request->user());

        $user_id = $request->user()->id;
        return $isWantsJson
            ? response()->json(new ArticleResource(Article::with(['user', 'likes', 'tags'])->find($article->id)))
            : Redirect::back()->with('success', __('Article liked', ['id' => $article->id, 'user_id' => $user_id]));
    }

    public function dislike(Request $request, Article $article)
    {
        $isWantsJson = $request->wantsJson();

        $article->dislikedBy($request->user());

        $user_id = $request->user()->id;
        return $isWantsJson
            ? response()->json(new ArticleResource(Article::with(['user', 'likes', 'tags'])->find($article->id)))
            : Redirect::back()->with('success', __('Article disliked', ['id' => $article->id, 'user_id' => $user_id]));
    }
}
