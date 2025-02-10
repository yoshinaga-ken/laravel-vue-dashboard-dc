<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware([
    'auth:sanctum',
])->group(function () {
    Route::apiResource('/articles', ArticleController::class)
        ->names([
            'index' => 'api.articles.index',
            'store' => 'api.articles.store',
            'show' => 'api.articles.show',
            'update' => 'api.articles.update',
            'destroy' => 'api.articles.destroy',
        ]);

    Route::prefix('articles')->group(function () {
        Route::put('/{article}/like', [ArticleController::class, 'like'])->name('api.articles.like');
        Route::delete('/{article}/like', [ArticleController::class, 'dislike'])->name('api.articles.dislike');
    });

    Route::prefix('users')->group(function () {
        Route::put('/{user}/follow', [UserController::class, 'follow'])->name('api.users.follow');
        Route::delete('/{user}/unfollow', [UserController::class, 'unfollow'])->name('api.users.unfollow');
    });
});
