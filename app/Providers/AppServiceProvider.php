<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'locale' => function () {
                return app()->getLocale();
            },
            'translations' => function () {
                return cache()->rememberForever('translations.' . app()->getLocale(), function () {
                    $translations = [
                        'models' => trans('models'),
                    ];

                    // <lang>.jsonからの翻訳を追加
                    $jsonTranslations = json_decode(file_get_contents(lang_path(app()->getLocale() . '.json')), true);
                    return array_merge($translations, $jsonTranslations ?? []);
                });
            },
        ]);
    }
}
