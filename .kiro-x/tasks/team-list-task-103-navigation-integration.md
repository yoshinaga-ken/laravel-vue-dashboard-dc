# TASK-103: ナビゲーション統合（AppLayout修正）

## 概要

AppLayoutのチームドロップダウンメニューに「チーム一覧」リンクを追加し、
ユーザーがヘッダーナビゲーションからチーム一覧画面にアクセスできるようにする。
既存のJetstream チーム管理メニューに自然に統合する。

## 依存関係

- **依存タスク**: TASK-101 (バックエンドAPI実装) - `teams.index` ルートが必要
- **後続タスク**: TASK-104 (基本チーム一覧画面実装)

## 実装内容

### 1. AppLayout修正

**ファイル**: `resources/js/Layouts/AppLayout.vue`

#### デスクトップ版チームドロップダウンの修正

```vue
<!-- Team Management セクション（208行目周辺） -->
<div class="block px-4 py-2 text-xs text-gray-400">Manage Team</div>

<!-- Team Settings -->
<DropdownLink :href="route('teams.show', $page.props.auth.user.current_team)">
  Team Settings
</DropdownLink>

<!-- チーム一覧 (新規追加) -->
<DropdownLink :href="route('teams.index')">
  Teams List
</DropdownLink>

<DropdownLink v-if="$page.props.jetstream.canCreateTeams" :href="route('teams.create')">
  Create New Team
</DropdownLink>
```

#### レスポンシブ版チームメニューの修正

```vue
<!-- Responsive Team Management（350行目周辺） -->
<div class="block px-4 py-2 text-xs text-gray-400">Manage Team</div>

<!-- Team Settings -->
<ResponsiveNavLink
  :href="route('teams.show', $page.props.auth.user.current_team)"
  :active="route().current('teams.show')"
>
  Team Settings
</ResponsiveNavLink>

<!-- チーム一覧 (新規追加) -->
<ResponsiveNavLink :href="route('teams.index')" :active="route().current('teams.index')">
  Teams List
</ResponsiveNavLink>

<ResponsiveNavLink
  v-if="$page.props.jetstream.canCreateTeams"
  :href="route('teams.create')"
  :active="route().current('teams.create')"
>
  Create New Team
</ResponsiveNavLink>
```

### 2. メニュー配置の詳細

#### 最終的なメニュー構造

```
Team Management
├── Team Settings      (既存) - 現在のチーム設定
├── Teams List         (新規) - 全チーム一覧　← ここに配置
└── Create New Team    (既存) - 新規チーム作成

Switch Teams
├── チーム1 ✅         (既存) - 個別チーム切り替え
├── チーム2            (既存)
└── ...
```

#### 配置理由

1. **Team Settings の後**: 設定→一覧→作成の自然な流れ
2. **Create New Team の前**: 一覧確認してから作成する流れ
3. **Switch Teams とは分離**: 管理機能と切り替え機能の明確な区別

### 3. アクティブ状態の制御

#### ナビゲーションアクティブ状態

```vue
<!-- デスクトップ版では通常のDropdownLinkでOK -->
<DropdownLink :href="route('teams.index')">
  Teams List
</DropdownLink>

<!-- レスポンシブ版ではactive状態を制御 -->
<ResponsiveNavLink :href="route('teams.index')" :active="route().current('teams.index')">
  Teams List
</ResponsiveNavLink>
```

## 成果物

### 修正ファイル

1. `resources/js/Layouts/AppLayout.vue` - チームドロップダウンメニュー修正

## 完了条件

### 機能確認

1. **デスクトップ表示**
   - ヘッダーのチームドロップダウンをクリック
   - 「Teams List」メニューが表示される
   - クリックで `/teams` に遷移

2. **レスポンシブ表示**
   - モバイル表示でハンバーガーメニューを開く
   - Team Management セクションに「Teams List」が表示
   - アクティブ状態が正しく表示される

3. **メニュー順序**
   ```
   Team Management
   ├── Team Settings
   ├── Teams List      ← 正しい位置
   └── Create New Team
   ```

### 視覚的確認

1. **メニュー配置**
   - Team Settings と Create New Team の間に配置
   - 適切なインデントとスタイリング

2. **アクティブ状態**
   - チーム一覧画面では「Teams List」がアクティブ
   - 他の画面では非アクティブ

3. **レスポンシブ対応**
   - デスクトップ・タブレット・モバイルで適切に表示
   - タッチデバイスでの操作性確保

## 技術的考慮事項

### 1. 既存コードとの整合性

- 既存のDropdownLink/ResponsiveNavLinkコンポーネントを使用
- 既存のスタイリングクラスを維持
- ダークモード対応を確保

### 2. Inertia.js ルーティング

- `route('teams.index')` ヘルパーの使用
- `route().current('teams.index')` によるアクティブ判定

### 3. Jetstream チーム機能との統合

- `$page.props.jetstream.hasTeamFeatures` による機能制御
- 既存のチーム切り替え機能との共存

## 注意事項

### 1. 既存機能への影響

- 既存のTeam Management機能に影響なし
- チーム切り替え機能に影響なし
- レスポンシブレイアウトの維持

### 2. ユーザビリティ

- 直感的なメニュー配置
- 管理機能と切り替え機能の明確な分離
- 一貫したナビゲーション体験

### 3. スタイリング

- 既存のTailwind CSSクラスを使用
- ダークモードでの適切な表示
- アクセシビリティの確保

## 実装時の注意点

### 1. ファイル修正箇所の特定

```bash
# AppLayout.vue の該当箇所を確認
grep -n "Team Management" resources/js/Layouts/AppLayout.vue
grep -n "Manage Team" resources/js/Layouts/AppLayout.vue
```

### 2. 両方のメニュー（デスクトップ・レスポンシブ）を修正

- 208行目周辺: デスクトップ版ドロップダウン
- 350行目周辺: レスポンシブ版メニュー
- 両方に同じリンクを追加

### 3. テスト確認

- デスクトップブラウザでの動作確認
- 開発者ツールでレスポンシブ表示確認
- 異なるデバイスサイズでの表示確認

## コードレビューポイント

1. **メニュー順序**: Team Settings → Teams List → Create New Team
2. **アクティブ状態**: レスポンシブ版で適切に設定
3. **インデント**: 既存コードと統一されたフォーマット
4. **命名**: 既存の命名規則に従った記述
