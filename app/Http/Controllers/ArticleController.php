<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Models\Article;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Articles/Index', [
            'articles' => function () {
                $articles = Article::with(['user', 'tags', 'likes'])
                    ->orderByDesc('created_at')
                    ->paginate(8)
                    ->withQueryString()
                    ->through(fn(Article $article) => [
                        'id' => $article->id,
                        'title' => $article->title,
                        'created_at' => $article->created_at,
                        'user' => $article->user,
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
        $article->fill($request->all());
        $article->user_id = $request->user()->id;
        $article->save();

        return Redirect::route('articles.index')->with('success', __('Article created', ['id' => $article->id]));
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

        return Redirect::back()->with('success', __('Article updated', ['id' => $article->id]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        $article->delete();

        return Redirect::route('articles.index')->with('success', __('Article deleted', ['id' => $article->id]));
    }
    public function like(Request $request, Article $article)
    {
        $article->likedBy($request->user());

        $user_id = $request->user()->id;
        return Redirect::back()->with('success', __('Article liked', ['id' => $article->id, 'user_id' => $user_id]));
    }

    public function dislike(Request $request, Article $article)
    {
        $article->dislikedBy($request->user());

        $user_id = $request->user()->id;
        return Redirect::back()->with('success', __('Article disliked', ['id' => $article->id, 'user_id' => $user_id]));
    }
}
