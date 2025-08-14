# チーム一覧画面機能仕様書

## 概要

現在のLaravel Jetstreamシステムには、チーム作成、チーム切り替え、チーム設定等の機能は実装されているが、**チーム一覧表示画面が存在しない**（`teams.index`ルートが未実装）。ユーザーが所属または所有しているチーム一覧を表示し、各チームへの操作を提供する画面を新規作成する。

## Jetstreamチームシステムの理解

### チームの種類と特性

1. **個人チーム** (`personal_team = true`)
   - 新規ユーザー登録時に自動作成される（`"{$user->name}'s Team"`）
   - **削除不可**（システム保護対象）
   - 各ユーザーに必ず1つ存在

2. **通常チーム** (`personal_team = false`)
   - ユーザーが追加で作成するチーム
   - 削除可能（オーナーのみ）
   - 複数作成可能

### ユーザーとチームの関係性

1. **チームオーナー** (`teams.user_id`)
   - チームの作成者・所有者
   - 一人で複数チームのオーナー可能
   - `$user->ownedTeams`で取得
   - **メンバー一覧には表示されない**

2. **チームメンバー** (`team_user`中間テーブル)
   - チームに招待され承認されたユーザー
   - `role`フィールドで権限管理（admin/editor）
   - `$team->users`で取得

3. **招待中ユーザー** (`team_invitations`テーブル)
   - 招待メール送信済み、承認待ちの状態
   - `Accept Invitation`で`team_user`に移行

### 権限システム

#### 役割定義（`app/Providers/JetstreamServiceProvider.php`）

- **Administrator**: `create`, `read`, `update`, `delete`
- **Editor**: `read`, `create`, `update`
- **Default**: `read`

#### 認可ポリシー（`app/Policies/TeamPolicy.php`）

- `viewAny()`: 常に true
- `view()`: `$user->belongsToTeam($team)`
- `update()`: `$user->ownsTeam($team)`
- `delete()`: `$user->ownsTeam($team)`
- `addTeamMember()`: `$user->ownsTeam($team)`

## 現在のシステム状況

### 既存のチーム関連機能

- **チーム作成**: `/teams/create` でチーム新規作成
- **チーム詳細・設定**: `/teams/{team}` でチーム設定変更、メンバー管理
- **チーム切り替え**: AppLayoutのドロップダウンでチーム切り替え
- **チーム招待・メンバー管理**: 各チーム詳細画面内で実行可能

### 既存のルーティング

```php
PUT current-team ................ current-team.update
GET|HEAD team-invitations/{invitation} ... team-invitations.accept
DELETE team-invitations/{invitation} ..... team-invitations.destroy
POST teams ................................... teams.store
GET|HEAD teams/create ........................ teams.create
GET|HEAD teams/{team} ........................ teams.show
PUT teams/{team} ............................. teams.update
DELETE teams/{team} .......................... teams.destroy
POST teams/{team}/members ........... team-members.store
PUT teams/{team}/members/{user} ..... team-members.update
DELETE teams/{team}/members/{user} .. team-members.destroy
```

**注意**: `teams.index`（チーム一覧）ルートは存在しない

### 既存のファイル構造

```
resources/js/Pages/Teams/
├── Create.vue              # チーム作成画面
├── Show.vue                # チーム詳細・設定画面
└── Partials/
    ├── CreateTeamForm.vue
    ├── DeleteTeamForm.vue
    ├── TeamMemberManager.vue
    └── UpdateTeamNameForm.vue
```

### データベース構造

````
teams {
  id, user_id(オーナー), name, personal_team, timestamps
}

team_user {
  id, team_id, user_id, role, timestamps
  unique(['team_id', 'user_id'])
}

team_invitations {
  id, team_id, email, role, timestamps
  unique(['team_id', 'email'])
}
```## 新規機能要件

### 1. チーム一覧画面の作成

#### 1.1 画面仕様

- **URL**: `/teams` (GET)
- **ルート名**: `teams.index`
- **ページコンポーネント**: `resources/js/Pages/Teams/Index.vue`

#### 1.2 表示対象データ

1. **所有チーム** (`$user->ownedTeams`)
   - 自分がオーナー（`teams.user_id = $user->id`）のチーム一覧
   - 個人チーム + 作成した通常チーム

2. **所属チーム** (`$user->teams`)
   - メンバーとして所属（`team_user`テーブル）するチーム一覧
   - 他人が作成したチームで招待を承認済み

#### 1.3 各チームの表示情報

| 項目 | 説明 | 取得方法 |
|------|------|----------|
| **チーム名** | team.name | 基本カラム |
| **チームタイプ** | 個人 / 通常 | `personal_team`フラグ |
| **所有者関係** | オーナー / メンバー | `$user->ownsTeam($team)` |
| **自分の権限** | admin / editor / - | `$user->membership->role` |
| **メンバー数** | チームメンバー数 | `$team->users()->count()` |
| **招待数** | 承認待ち招待数 | `$team->teamInvitations()->count()` |
| **現在チーム** | 現在選択中 | `$user->current_team_id` |
| **作成日** | created_at | 基本カラム |
| **最終更新日** | updated_at | 基本カラム |

#### 1.4 UI要件

- **Element Plus の `ElTable` コンポーネント**を使用
- **チームタイプ表示**:
  - 個人チーム: 🏠 アイコン + "Personal" バッジ
  - 通常チーム: 👥 アイコン + "Team" バッジ
- **所有者関係表示**:
  - オーナー: 👑 アイコン + "Owner" バッジ
  - メンバー: 👤 アイコン + "Member" バッジ
- **現在チーム表示**: ✅ アイコン + 背景色変更
- **レスポンシブデザイン対応**
- **ダークモード対応**
- **ソート機能**（チーム名、作成日、更新日、メンバー数）
- **フィルタリング機能**:
  - 所有チーム / 所属チーム
  - 個人チーム / 通常チーム
  - 現在チーム

#### 1.5 アクション機能

各チーム行に以下のアクションボタンを配置：

1. **チーム詳細・設定** (全チーム共通)
   - アイコン: ⚙️
   - リンク先: `route('teams.show', team.id)`
   - 条件: `Gate::allows('view', $team)`

2. **チーム切り替え** (非現在チーム)
   - アイコン: 🔄
   - 機能: `current-team.update`
   - 条件: `$team->id !== $user->current_team_id`

3. **チーム削除** (所有者のみ)
   - アイコン: 🗑️
   - 機能: 確認ダイアログ + `teams.destroy`
   - 条件: `$user->ownsTeam($team) && !$team->personal_team`
   - 注意: **個人チームは削除不可**

#### 1.6 特別な制御事項

1. **個人チーム制御**
   - 削除ボタン非表示（`personal_team = true`）
   - 特別なスタイリング（背景色・アイコン）

2. **権限制御**
   - チーム詳細: `view`ポリシー
   - チーム削除: `delete`ポリシー + 非個人チーム

3. **メンバー数計算**
   - **オーナーは含まない** (`$team->users()->count()`)
   - 招待中は別途表示 (`$team->teamInvitations()->count()`)

### 2. ナビゲーション統合

#### 2.1 AppLayoutの修正

- チームドロップダウンメニューに「チーム一覧」リンクを追加
- 既存のメニュー構造：
````

Team Management
├── Team Settings (既存)
├── Create New Team (既存)
└── Teams List (新規追加)

````

#### 2.2 ナビゲーションフロー

- ヘッダの「チーム」ドロップダウン → 「チーム一覧」をクリック
- チーム一覧画面で各チームの詳細を確認
- 必要に応じてチーム切り替えや設定変更へ遷移

### 3. バックエンド実装

#### 3.1 コントローラー実装

**新規作成**: `app/Http/Controllers/TeamController.php`

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
````

#### 3.2 ルート追加

**追加先**: `routes/web.php`

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

#### 3.3 データ取得の最適化

1. **Eager Loading による N+1 問題回避**

   ```php
   $teams = $user->allTeams()->load([
       'owner',           // チームオーナー情報
       'users',           // チームメンバー
       'teamInvitations'  // 招待中ユーザー
   ]);
   ```

2. **`allTeams()` メソッドの活用**
   - Jetstream の `HasTeams` トレイトが提供
   - 所有チーム + 所属チームを統合取得（重複除去済み）

3. **権限チェックの最適化**
   - Gate::check() によるポリシーベース認可
   - 一括権限チェックでデータベースアクセス最小化

#### 3.4 認可ポリシー拡張

**既存**: `app/Policies/TeamPolicy.php` を活用

- `viewAny()`: チーム一覧表示権限（認証ユーザーのみ）
- `view()`: 個別チーム表示権限（所属チームのみ）
- `delete()`: チーム削除権限（オーナーのみ + 非個人チーム）

```php
/**
 * チーム削除権限（個人チーム制御）
 */
public function delete(User $user, Team $team): bool
{
    return $user->ownsTeam($team) && !$team->personal_team;
}
```

#### 3.5 API応答形式

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
      },
      "created_at": "2025-01-01T00:00:00.000000Z",
      "updated_at": "2025-01-01T00:00:00.000000Z"
    }
  ],
  "jetstream": {
    "canCreateTeams": true
  }
}
```

### 4. フロントエンド実装

#### 4.1 新規コンポーネント

1. **`resources/js/Pages/Teams/Index.vue`** - メイン画面

   ```vue
   <script lang="ts" setup>
   import { computed } from 'vue'
   import { router, useForm } from '@inertiajs/vue3'
   import AppLayout from '@/Layouts/AppLayout.vue'
   import TeamTable from './Partials/TeamTable.vue'
   import { ElButton, ElCard } from 'element-plus'
   import { Plus } from '@element-plus/icons-vue'

   const props = defineProps<{
     teams: Team[]
     jetstream: {
       canCreateTeams: boolean
     }
   }>()

   const switchToTeam = (team: Team) => {
     router.put(
       route('current-team.update'),
       {
         team_id: team.id,
       },
       {
         preserveState: false,
       }
     )
   }

   const deleteTeam = (team: Team) => {
     if (confirm(`チーム「${team.name}」を削除しますか？`)) {
       router.delete(route('teams.destroy', team.id))
     }
   }
   </script>
   ```

2. **`resources/js/Pages/Teams/Partials/TeamTable.vue`** - テーブル表示

   ```vue
   <script lang="ts" setup>
   import { ElTable, ElTableColumn, ElTag, ElButton, ElIcon } from 'element-plus'
   import { Setting, Delete, Refresh, Crown, User } from '@element-plus/icons-vue'

   const props = defineProps<{
     teams: Team[]
   }>()

   const emit = defineEmits<{
     switchTeam: [team: Team]
     viewTeam: [team: Team]
     deleteTeam: [team: Team]
   }>()
   </script>
   ```

3. **`resources/js/Pages/Teams/Partials/TeamActions.vue`** - アクション群

   ```vue
   <script lang="ts" setup>
   import { ElButton, ElIcon, ElTooltip } from 'element-plus'
   import { Setting, Delete, Refresh } from '@element-plus/icons-vue'

   const props = defineProps<{
     team: Team
   }>()

   const emit = defineEmits<{
     switchTeam: [team: Team]
     viewTeam: [team: Team]
     deleteTeam: [team: Team]
   }>()
   </script>
   ```

#### 4.2 TypeScript型定義

**作成**: `resources/js/Types/types-team.d.ts`

```typescript
export interface Team {
  id: number
  name: string
  personal_team: boolean
  is_owner: boolean
  is_current: boolean
  user_role: string | null
  members_count: number
  invitations_count: number
  created_at: string
  updated_at: string
  permissions: {
    canView: boolean
    canUpdate: boolean
    canDelete: boolean
  }
}

export interface TeamIndexProps {
  teams: Team[]
  jetstream: {
    canCreateTeams: boolean
  }
}
```

#### 4.3 UI実装詳細

1. **テーブル設計**

   ```vue
   <ElTable :data="teams" style="width: 100%">
     <ElTableColumn prop="name" label="チーム名" sortable>
       <template #default="{ row }">
         <div class="flex items-center gap-2">
           <ElIcon :class="teamTypeIconClass(row)">
             <component :is="teamTypeIcon(row)" />
           </ElIcon>
           <span>{{ row.name }}</span>
           <ElTag v-if="row.is_current" type="success" size="small">
             Current
           </ElTag>
         </div>
       </template>
     </ElTableColumn>
   
     <ElTableColumn label="所有者関係">
       <template #default="{ row }">
         <ElTag :type="row.is_owner ? 'primary' : 'info'">
           <ElIcon>
             <Crown v-if="row.is_owner" />
             <User v-else />
           </ElIcon>
           {{ row.is_owner ? 'Owner' : 'Member' }}
         </ElTag>
       </template>
     </ElTableColumn>
   
     <!-- その他のカラム... -->
   </ElTable>
   ```

2. **レスポンシブ対応**
   - Desktop: 全カラム表示
   - Tablet: 重要カラムのみ
   - Mobile: カード形式に変更

3. **ダークモード対応**
   - Element Plus のダークテーマ活用
   - Tailwind CSS のダークモード設定

#### 4.4 状態管理

- **チーム切り替え**: Inertia.js の `router.put`
- **データ更新**: Partial Reloads 対応
- **フィルタリング**: 画面内 computed プロパティ
- **ソート**: Element Plus の Table ソート機能

#### 4.5 エラーハンドリング

```typescript
const deleteTeam = (team: Team) => {
  if (!team.permissions.canDelete) {
    ElMessage.error('このチームを削除する権限がありません')
    return
  }

  ElMessageBox.confirm(`チーム「${team.name}」を削除しますか？`, '確認', {
    confirmButtonText: '削除',
    cancelButtonText: 'キャンセル',
    type: 'warning',
  }).then(() => {
    router.delete(route('teams.destroy', team.id), {
      onSuccess: () => {
        ElMessage.success('チームを削除しました')
      },
      onError: () => {
        ElMessage.error('チームの削除に失敗しました')
      },
    })
  })
}
```

## 技術仕様

### フロントエンド技術スタック

- **Framework**: Vue 3 + Inertia.js
- **Type Safety**: TypeScript
- **UI Library**: Element Plus
- **Styling**: Tailwind CSS
- **Form Handling**: Inertia.js useForm

### バックエンド技術スタック

- **Framework**: Laravel 12
- **Authentication**: Laravel Jetstream + Sanctum
- **Authorization**: Laravel Policies
- **Database**: MariaDB (Eloquent ORM)

## セキュリティ要件

### アクセス制御

1. **認証**: Sanctum middleware による認証必須
2. **認可**: Team Policy による権限チェック
3. **CSRF**: Inertia.js による自動CSRF保護
4. **XSS**: Vue.js テンプレートによる自動エスケープ

### データ保護

1. **所有者情報**: 自分が所有/所属するチームのみ表示
2. **権限制御**: チーム毎のアクション可否を適切に制御
3. **入力検証**: Laravel Validation による厳密な入力検証

## パフォーマンス要件

### データベース最適化

- Eager Loading による N+1 問題回避
- インデックス活用による高速検索
- ページネーション対応（50件/ページ）

### フロントエンド最適化

- Element Plus Tree Shaking
- Vue.js コンポーネント遅延読み込み
- Tailwind CSS 最適化

## テスト要件

### バックエンドテスト（Pest PHP）

- Feature Test: チーム一覧API
- Unit Test: TeamPolicy
- Authentication Test: 認証制御

### フロントエンドテスト（Vitest）

- Component Test: Index.vue
- Integration Test: Inertia.js通信
- Accessibility Test: a11y対応

### E2Eテスト（Playwright）

- ユーザーフロー全体のテスト
- 各ブラウザでの動作確認

## 互換性要件

### ブラウザサポート

- Chrome 90+
- Firefox 85+
- Safari 14+
- Edge 90+

### レスポンシブ対応

- Desktop: 1024px+
- Tablet: 768px-1023px
- Mobile: 320px-767px

## マイグレーション影響

### データベース変更

- 既存テーブル構造への影響なし
- インデックス追加の可能性

### 既存機能への影響

- 既存のチーム関連機能への影響なし
- AppLayout への軽微な変更のみ

## Jetstream特有の実装考慮事項

### 1. 個人チーム（Personal Team）の特別扱い

1. **削除制御**

   ```php
   // 個人チームは削除不可
   public function delete(User $user, Team $team): bool
   {
       return $user->ownsTeam($team) && !$team->personal_team;
   }
   ```

2. **UI表示**
   - 個人チームには🏠アイコンと「Personal」バッジ
   - 削除ボタンを非表示
   - 特別な背景色でハイライト

### 2. チームメンバー数の正確な計算

**注意**: オーナーはメンバー一覧に含まれない

```php
// 正しいメンバー数計算
$membersCount = $team->users()->count(); // オーナーは含まれない
$totalUsers = $membersCount + 1; // オーナーを含む総人数
```

### 3. 招待システムとの連携

1. **招待中ユーザーの表示**

   ```typescript
   // 招待数の表示
   invitations_count: team.teamInvitations.length
   ```

2. **チーム状態の完全性**
   - 確定メンバー: `team_user`テーブル
   - 招待中: `team_invitations`テーブル
   - 合計招待状況を明確に表示

### 4. allTeams()メソッドの活用

```php
// Jetstreamが提供するメソッド
$allTeams = $user->allTeams(); // 所有 + 所属チーム（重複除去済み）
$ownedTeams = $user->ownedTeams; // 所有チームのみ
$memberTeams = $user->teams; // 所属チームのみ
```

### 5. チーム切り替えの実装

```javascript
// Jetstream標準の切り替え方法
const switchToTeam = team => {
  router.put(
    route('current-team.update'),
    {
      team_id: team.id,
    },
    {
      preserveState: false, // 重要: 画面全体をリロード
    }
  )
}
```

### 6. 権限チェックの最適化

```php
// 一括権限チェック
'permissions' => [
    'canView' => Gate::check('view', $team),
    'canUpdate' => Gate::check('update', $team),
    'canDelete' => Gate::check('delete', $team) && !$team->personal_team,
    'canAddMembers' => Gate::check('addTeamMember', $team),
],
```

## 実装優先度

### Phase 1（高優先度）

1. **バックエンドAPI実装**
   - TeamController@index
   - ルート追加
   - 基本的な権限チェック

2. **基本的なチーム一覧表示**
   - Index.vue作成
   - 基本テーブル表示
   - 個人チーム制御

3. **ナビゲーション統合**
   - AppLayout修正
   - メニュー追加

### Phase 2（中優先度）

1. **フィルタリング・ソート機能**
   - チームタイプフィルタ
   - 所有者関係フィルタ
   - テーブルソート

2. **チーム切り替え機能**
   - 切り替えボタン実装
   - 現在チーム表示

3. **レスポンシブ対応**
   - モバイルレイアウト
   - タブレットレイアウト

### Phase 3（低優先度）

1. **高度なフィルタリング**
   - 検索機能
   - 複合条件フィルタ

2. **パフォーマンス最適化**
   - ページネーション
   - 遅延読み込み

3. **アクセシビリティ向上**
   - キーボード操作
   - スクリーンリーダー対応

## マイグレーション影響

### データベース変更

- 既存テーブル構造への影響なし
- インデックス追加の可能性（パフォーマンス向上）

### 既存機能への影響

- 既存のチーム関連機能への影響なし
- AppLayout への軽微な変更のみ
- Jetstream標準機能との完全互換性維持

## 関連ドキュメント

- [Laravel Jetstream Documentation](https://jetstream.laravel.com/)
- [Jetstream Teams Documentation](https://jetstream.laravel.com/features/teams.html)
- [Inertia.js Documentation](https://inertiajs.com/)
- [Element Plus Documentation](https://element-plus.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html)
- [プロジェクト内 Jetstream仕様書](../doc/system/team-spec-jetstream.md)
