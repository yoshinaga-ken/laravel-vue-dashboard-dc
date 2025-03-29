# Laravel + Vue3 + Dimensional chart Dashboard template
- [Live demo](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc?data=covid19-data-2021-02-28)

A template project for an admin panel with a dashboard using dimensional charts, implemented with laravel and vue.

![img.png](doc/img/dashboard-test-article-like.png)

## Features
- Dashboard with [Dimensional chart(dc.js)](http://dc-js.github.io/dc.js/)
  - [Articles Dashboard](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc?data=test-article-like)
  - Dashboard with many more dimensional charts
- [Laravel Jetstream Features](https://jetstream.laravel.com/introduction.html)
  - Authentication
  - Registration
  - User Management
  - Password Update
  - Password Confirmation
  - Two Factor Authentication
  - Browser Sessions
  - Teams Management
- Articles Management 
  - CRUD Operations
  - article like/dislike
  - RestFul API
  - article dashboard data create
- User Management 
  - follow/unfollow
- GraphQL

## Technology Stack
- backend
  - [Laravel 11](https://laravel.com/) 
    - [Eloquent ORM](https://laravel.com/docs/12.x)
  - [inertiajs](https://inertiajs.com/)
  - RestFul API
  - [GraphQL](https://graphql.org/) by [lighthouse](https://lighthouse-php.com/)
  - Authentication by [sanctum](https://laravel.com/docs/12.x/sanctum)
  - test
    - pest
- frontend
  - [vue 3](https://vuejs.org/)
  - [tailwindcss](https://tailwindcss.com/)
    - dark mode
  - ui components
    - [vuetify](https://vuetifyjs.com/en/)
    - [element-plus](https://element-plus.org/en-US/)
  - [GraphQL](https://graphql.org/) by [Vue Apollo](https://apollo.vuejs.org/)
  - [Google Maps Api](https://developers.google.com/maps/documentation/javascript/reference?hl=en)
  - [YouTube API](https://developers.google.com/youtube/v3/docs?hl=en)
  - test 
    - vitest
    - e2e by [playwright](https://playwright.dev/)

## Database
- [mariadb-schema.sql](database/schema/mariadb-schema.sql)
- ![er](doc/database/er-a5er.png)
- ![er-diagram](doc/database/er-diagram.svg)

## Quick Start

```bash [Terminal]
# backend - run web server 
php artisan serve

# frontend - watch build
pnpm run dev

```

## Setup

```bash
# Setup configuration:
cp .env.example .env

# Generate application key:
php artisan key:generate

# Create a database in the DB_DATABASE field in the .env file.

# Run database migrations:
php artisan migrate

# Run database seeder:
php artisan db:seed

# Install Composer dependencies
composer install

# Install NPM dependencies
pnpm install
```


## Production

Build a production-ready Vue.js frontend application

```bash
pnpm run build

# output: public/build/
```

## Running tests

```bash
# Backend test
vendor/bin/pest -p

# Frontend vitest
pnpm test

# Frontend e2e test
$ cd e2e
e2e$ npx playwright test

```
