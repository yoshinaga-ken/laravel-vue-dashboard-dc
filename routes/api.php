<?php

use App\Http\Controllers\ArticleController;
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
        ]);
});
