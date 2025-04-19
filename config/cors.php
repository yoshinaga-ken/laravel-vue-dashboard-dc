<?php

return [
    'paths' => ['graphql', 'api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:6006', 'http://localhost:6007'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
