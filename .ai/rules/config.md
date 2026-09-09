---
paths:
  - config/lighthouse.php
  - config/cache.php
---

# Config

## Lighthouse query cache uses hybrid mode
Laravel 13 `cache.serializable_classes` is `false`, so Lighthouse `query_cache.mode=store` cannot unserialize `GraphQL\Language\AST\DocumentNode` and `/graphql` returns `__PHP_Incomplete_Class`. Keep `mode` on `hybrid` (AST arrays as PHP files + string cache payloads). Tests disable the query cache via `LIGHTHOUSE_QUERY_CACHE_ENABLE` except `QueryCacheTest`, which uses a temp file store. After switching modes, run `php artisan lighthouse:clear-query-cache`.
