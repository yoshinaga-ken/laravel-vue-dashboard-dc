# TASK-101: バックエンドAPI実装（チーム一覧取得）

## 概要

Laravel Jetstream を拡張して、チーム一覧を取得するAPIエンドポイントを実装する。
現在存在しない `teams.index` ルートとコントローラーメソッドを新規作成し、
ユーザーが所有・所属するチーム一覧データを適切な権限制御のもとで提供する。

## 依存関係

- **依存タスク**: なし（最初に実装するタスク）
- **後続タスク**: TASK-104 (基本チーム一覧画面実装)

## 実装内容

### 1. TeamController 作成

**ファイル**: `app/Http/Controllers/TeamController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Laravel\Jetstream\Jetstream;

class TeamController extends Controller
{
    /**
     * チーム一覧を表示
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Jetstream::newTeamModel());

        $user = $request->user();

        // ユーザーの所有チーム + 所属チーム（重複除去）
        $teams = $user->allTeams()->load([
            'owner',
            'users',
            'teamInvitations'
        ]);

        return Inertia::render('Teams/Index', [
            'teams' => $teams->map(function ($team) use ($user) {
                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'personal_team' => $team->personal_team,
                    'created_at' => $team->created_at,
                    'updated_at' => $team->updated_at,

                    // 関係性
                    'is_owner' => $user->ownsTeam($team),
                    'is_current' => $team->id === $user->current_team_id,

                    // 権限・役割
                    'user_role' => $user->teamRole($team),

                    // カウント
                    'members_count' => $team->users->count(),
                    'invitations_count' => $team->teamInvitations->count(),

                    // 権限チェック
                    'permissions' => [
                        'canView' => Gate::check('view', $team),
                        'canUpdate' => Gate::check('update', $team),
                        'canDelete' => Gate::check('delete', $team) && !$team->personal_team,
                    ],
                ];
            }),
            'jetstream' => [
                'canCreateTeams' => Jetstream::userHasTeamFeatures($user) && Gate::check('create', Jetstream::newTeamModel()),
            ],
        ]);
    }
}
```

### 2. ルート追加

**ファイル**: `routes/web.php`

```php
use App\Http\Controllers\TeamController;

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    // 既存ルート...

    // チーム一覧追加
    Route::get('/teams', [TeamController::class, 'index'])->name('teams.index');
});
```

### 3. 権限制御の実装

#### TeamPolicy 確認・拡張（必要に応じて）

**ファイル**: `app/Policies/TeamPolicy.php`

```php
/**
 * チーム一覧表示権限
 */
public function viewAny(User $user): bool
{
    return true; // 認証済みユーザーはチーム一覧を表示可能
}

/**
 * チーム削除権限（個人チーム制御）
 */
public function delete(User $user, Team $team): bool
{
    return $user->ownsTeam($team) && !$team->personal_team;
}
```

## 技術的考慮事項

### 1. パフォーマンス最適化

- **Eager Loading**: `$user->allTeams()->load(['owner', 'users', 'teamInvitations'])`
- **N+1問題回避**: 一括でリレーションデータを取得
- **権限チェック**: `Gate::check()`による効率的な権限確認

### 2. Jetstream標準機能の活用

- `$user->allTeams()`: 所有・所属チーム統合取得（重複除去済み）
- `$user->ownsTeam($team)`: オーナー判定
- `$user->teamRole($team)`: チーム内役割取得
- `Gate::check()`: ポリシーベース権限制御

### 3. 個人チーム制御

- `$team->personal_team`: 個人チームフラグ
- 削除権限: `!$team->personal_team` で個人チーム削除を禁止

## 成果物

### 新規作成ファイル

1. `app/Http/Controllers/TeamController.php` - チーム一覧コントローラー

### 修正ファイル

1. `routes/web.php` - ルート追加

## 完了条件

### 機能確認

1. **ルート確認**

   ```bash
   php artisan route:list | grep teams.index
   ```

2. **権限テスト**
   - 認証済みユーザーのみアクセス可能
   - 未認証ユーザーはリダイレクト

3. **データ取得テスト**
   - 所有チーム・所属チーム両方を取得
   - 個人チーム削除権限が `false`
   - メンバー数・招待数が正確

### API応答確認

```json
{
  "teams": [
    {
      "id": 1,
      "name": "よしだ's Team",
      "personal_team": true,
      "is_owner": true,
      "is_current": true,
      "user_role": null,
      "members_count": 0,
      "invitations_count": 0,
      "permissions": {
        "canView": true,
        "canUpdate": true,
        "canDelete": false
      }
    }
  ],
  "jetstream": {
    "canCreateTeams": true
  }
}
```

## 注意事項

### 1. Jetstream互換性

- Laravel Jetstream の標準機能を拡張
- 既存のポリシー・権限システムを活用
- `vendor/laravel/jetstream` のコントローラーとは別実装

### 2. セキュリティ

- 必ず認証ミドルウェア通過後のアクセス
- ポリシーによる適切な権限制御
- 個人チーム削除の制限

### 3. パフォーマンス

- Eager Loadingによる効率的なデータ取得
- 必要最小限のデータのみ応答に含める

## テスト観点

1. **認証テスト**: 未認証ユーザーのアクセス拒否
2. **権限テスト**: チーム表示権限の適切な制御
3. **データテスト**: 所有・所属チームの正確な取得
4. **個人チームテスト**: 削除権限の適切な制御
