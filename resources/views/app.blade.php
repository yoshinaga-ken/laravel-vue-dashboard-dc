<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $meta = app(App\Services\MetaService::class)->getMetaData(request()->query('data'));
        @endphp
        <title inertia>{{ $meta['title'] }}</title>
        <link rel="shortcut icon" href="{{ $meta['favicon'] }}">
        <meta name="keywords" content="{{ $meta['keywords'] }}">
        <meta name="description" content="{{ $meta['description'] }}">
        <meta property="og:image" content="{{ $meta['og:image'] }}">
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
