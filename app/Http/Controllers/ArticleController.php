<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resource\ArticleResource;
use App\Models\Article;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $articles = Article::with(['user', 'tags'])
            ->orderByDesc('created_at')
            ->paginate(8)
            ->withQueryString()
            ->through(fn($article) => [
                'id' => $article->id,
                'title' => $article->title,
                'created_at' => $article->created_at,
                'user' => $article->user,
                'tags' => $article->tags
            ]);

        return Inertia::render('Articles/Index', [
            'articles' => $articles
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
                'article' => $article->load('user', 'tags'),
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
                'article' => $article->load('user', 'tags'),
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
        $article->fill($request->all())->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        $article->delete();
    }
}
