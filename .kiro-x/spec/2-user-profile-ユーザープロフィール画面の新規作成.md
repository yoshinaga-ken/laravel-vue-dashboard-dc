# 要件

- ユーザープロフィール画面の新規作成

# 機能詳細

- [任意のユーザーのプロフィール画面](http://127.0.0.1:8000/users/{$userId})を作成してください
- 現在のシステムには、[ログインユーザーのプロフィール編集画面](http://127.0.0.1:8000/user/profile)はあります。これを参考に作成してください 
- 現在、ユーザーのプロフィール画面は以下がテスト実装されています。これをベースに新規に他のユーザー情報の表示項目を実装してください
  - GraphQLでUserデータ取得とprint表示
  - ユーザーの0番目の記事のタグ編集フォーム
- 表示する項目は、一般的なユーザープロフィール画面の表示項目、ユーザーテーブルや、Userに関するgraphQL系APIの機能を確認して判断してください

# 方式

- フロントとバックエンドの通信は、GraphQLを利用してください
  - [Inertia.js](https://inertiajs.com/)のprops経由の通信は使用しないでください。
  - 使用しているフレームワークは
    - Backendは、 [lighthouse](https://lighthouse-php.com/)　を利用してます
    - Frontendは、[Vue Apollo](https://apollo.vuejs.org/)　を利用してます。
- UIコンポーネントで共通となる機能はComposables ( /js/Composables/use*.ts等)で共通化してください
- できるだけ機能単位にUIコンポーネントを分割実装してください
  - UIコンポーネントの構成する基本UIコンポーネントは、[element-plus](https://github.com/element-plus/element-plus)を利用してください。
- 自身のAIエージェントのカスタム指示書(/.github/instructions/*.instructions.md)にある、以下の名前のコーディングガイドラインを守ってください。
  - GitHub Copilotの場合  
    - [@Backend](/.github/instructions/php-laravel-guidelines.instructions.md)
    - [@Frontend](/.github/instructions/vue3-component-guidelines.instructions.md)


# 想定される実装先、画面URLとソースコード例
- 画面URL: http://127.0.0.1:8000/users/{$userId}
- バックエンド 
  - GraphQL　通信
    - [schema.graphql](/graphql/schema.graphql)
      - user(id: ID! @eq): User @find(model: "App\\Models\\User")
        - app/Models/User.php
    - app/GraphQL/Mutations/Users/*.php
    - app/GraphQL/Queries/Users/FilterUser.php
  -　Inertia.js　通信
    - `app/Http/Controllers/UserController.php` 
      - showメソッド:[Inertia.js](https://inertiajs.com/)でpropsを渡している
      - 他、follow,unfollow API
- フロントエンド
  - `/resources/js/Pages/Users/Show.vue`　...User画面(読み取り専用)
    - 現在、ユーザーのプロフィール画面は以下がテスト実装されています
  - `/resources/js/Pages/Users/Edit.vue` ...User編集画面

# 参考コード:[ログインユーザーのプロフィール編集画面](http://127.0.0.1:8000/user/profile)　
- フロントエンド
  - `resources/js/Pages/Profile/`以下
    - Partials/*.vue
    - Show.vue

- バックエンド
  - `app/Http/Controllers/ArticleController.php`　
    - Article CRUD 操作
  - vendor側
    - vendor/laravel/jetstream/src/Http/Controllers/Inertia/CurrentUserController.php
    - vendor/laravel/fortify/src/Http/Controllers/PasswordController.php:1 
  - 他にも, $php artisan route:list --name=user で確認した以下等
```bash
GET|HEAD        api/checkin/users .......................................................................... api.checkin.users › CheckinController@getUsers
PUT             api/users/{user}/follow .......................................................................... api.users.follow › UserController@follow
DELETE          api/users/{user}/unfollow .................................................................... api.users.unfollow › UserController@unfollow
DELETE          user ............................................................. current-user.destroy › Laravel\Jetstream › CurrentUserController@destroy
PUT             user/password .......................................................... user-password.update › Laravel\Fortify › PasswordController@update
PUT             user/profile-information .......................... user-profile-information.update › Laravel\Fortify › ProfileInformationController@update
DELETE          user/profile-photo ........................................ current-user-photo.destroy › Laravel\Jetstream › ProfilePhotoController@destroy
GET|HEAD        users .................................................................................................. users.index › UserController@index
POST            users .................................................................................................. users.store › UserController@store
GET|HEAD        users/create ......................................................................................... users.create › UserController@create
GET|HEAD        users/{user} ............................................................................................. users.show › UserController@show
PUT|PATCH       users/{user} ......................................................................................... users.update › UserController@update
DELETE          users/{user} ....................................................................................... users.destroy › UserController@destroy
GET|HEAD        users/{user}/edit ........................................................................................ users.edit › UserController@edit
```

# 本issue実装に関する設計から実装までの作業の流れ

- [issue実装に関する設計から実装までの作業手順書](.kiro/rule/issue実装に関する設計から実装までの作業手順書.md)を参照してください。
