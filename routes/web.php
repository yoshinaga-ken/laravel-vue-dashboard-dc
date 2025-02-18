<?php

use App\Http\Controllers\ArticleController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard-dc-pub', function (Request $request) {
    $data = $request->query('data');
    return Inertia::render('DashboardDcPub', ['data' => $data]);
})->name('dashboard-dc-pub');

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::resource('/articles', ArticleController::class);
    Route::prefix('articles')->group(function () {
        Route::put('/{article}/like', [ArticleController::class, 'like'])->name('articles.like');
        Route::delete('/{article}/like', [ArticleController::class, 'dislike'])->name('articles.dislike');
    });

    Route::get('/dashboard-dc', function () {
        return Inertia::render('DashboardDc');
    })->name('dashboard-dc');
});
