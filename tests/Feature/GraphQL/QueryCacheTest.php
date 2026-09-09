<?php

use Illuminate\Support\Facades\File;
use Nuwave\Lighthouse\Cache\QueryCache;
use Nuwave\Lighthouse\GraphQL;

beforeEach(function () {
    $opcachePath = storage_path('framework/cache/testing-lighthouse-query');
    File::ensureDirectoryExists($opcachePath);

    config([
        'cache.default' => 'file',
        'cache.stores.file.path' => $opcachePath,
        'lighthouse.query_cache.enable' => true,
        'lighthouse.query_cache.mode' => 'hybrid',
        'lighthouse.query_cache.opcache_path' => $opcachePath,
    ]);

    $this->app->forgetInstance('cache');
    $this->app->forgetInstance('cache.store');
    $this->app->forgetInstance(QueryCache::class);
    $this->app->forgetInstance(GraphQL::class);
});

afterEach(function () {
    File::deleteDirectory(storage_path('framework/cache/testing-lighthouse-query'));
});

test('graphql query cache returns the same result on a subsequent request', function () {
    $query = '{ __typename }';

    $this->graphQL($query)
        ->assertOk()
        ->assertJsonPath('data.__typename', 'Query');

    $this->graphQL($query)
        ->assertOk()
        ->assertJsonPath('data.__typename', 'Query');
});
