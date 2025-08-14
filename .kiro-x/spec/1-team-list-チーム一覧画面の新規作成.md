# 要件

- チーム一覧画面の新規作成

# 機能詳細

- 現在のシステムのチーム関連の機能には、チームの新規作成やチームの切り替え、チーム設定の変更等の機能はありますが、チームの一覧表示画面がありません。チーム一覧を表示する画面を新規作成してください。
- チーム一覧は、ログインユーザーの権限で閲覧できるチームの一覧を表示と操作ができます。
- チーム一覧画面の表示は、ヘッダーのドロップダウンメニューに追加してください。
  - `AppLayout.vue`の`<Dropdown>`の所

# 方式

- チームの機能は、Laravel Jetstreamの実装を参考にこれに従った実装にしてください。
  - [Jetstreamのドキュメント](https://jetstream.laravel.com/introduction.html#inertia-vue)
  - [Jetstreamのコード](https://github.com/laravel/jetstream)
    - [`TeamController@jetstream`](vendor/laravel/jetstream/src/Http/Controllers/Inertia/TeamController.php)
- フロントとバックエンドの通信は、[Inertia.js](https://inertiajs.com/)を利用してください。`axios`や`fetch`は使用しないでください。
  - 例: [`useForm`](https://inertiajs.com/forms)や[Partial reloads](https://inertiajs.com/partial-reloads)等を利用
- UIコンポーネントは、[element-plus](https://github.com/element-plus/element-plus)を利用してください。
- 自身のAIエージェントのカスタム指示書にある、以下の名前のコーディングガイドラインを守ってください。
  - [@Backend](.rulesync/php-laravel-guidelines.md)
  - [@Frontend](.rulesync/vue3-component-guidelines.md)

# 想定される実装先ソースコードのPATH

- バックエンド - `app/Actions/Jetstream/`または`app/Http/Controllers/`以下
- フロントエンド - `resources/js/Pages/Teams/`以下

# 本issue実装に関する設計から実装までの作業の流れ

- [issue実装に関する設計から実装までの作業手順書](.kiro/rule/issue実装に関する設計から実装までの作業手順書.md)を参照してください。
