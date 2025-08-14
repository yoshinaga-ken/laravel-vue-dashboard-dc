# TeamCard コンポー## 使用方法

```vue
<template>
  <TeamCard
    :team="team"
    :current-team-id="currentTeamId"
    @show-members="handleShowMembers"
    @show-details="handleShowDetails"
    @team-switched="handleTeamSwitched"
  />
</template>

<script setup>
import TeamCard from '@/Components/Teams/TeamCard.vue'
import { ref } from 'vue'

const currentTeamId = ref(1)

const handleShowMembers = team => {
  // メンバー一覧表示処理
}

const handleShowDetails = team => {
  // チーム詳細表示処理
}

const handleTeamSwitched = team => {
  // チーム切り替え後処理
}
</script>
```

## Props

| プロパティ      | 型     | 必須 | 説明                   |
| --------------- | ------ | ---- | ---------------------- |
| `team`          | Team   | ✅   | チーム情報オブジェクト |
| `currentTeamId` | Number | ✅   | 現在選択中のチームID   |

### Team型定義

```typescript
interface Team {
  id: number
  name: string
  personal_team: boolean
  created_at: string
  updated_at: string
  members_count: number
  pending_invitations_count: number
  is_owner: boolean
  is_current: boolean
  user_role: string | null
  permissions: TeamPermissions
  owner: User
  recent_members?: User[]
  recent_invitations?: TeamInvitation[]
}
```

## Events

- `@show-members`: メンバー詳細表示要求時に発火
- `@show-details`: チーム詳細表示要求時に発火
- `@team-switched`: チーム切り替え完了時に発火の情報を表示するカードコンポーネントです。チームの基本情報、統計データ、操作アクションを視覚的に整理し、ユーザーフレンドリーなチーム管理インターフェースを提供します。

## 機能

- **チーム情報表示**: 名前、タイプ、作成者、作成日の表示
- **ステータス表示**: 現在チーム・個人チームの視覚的識別
- **統計情報**: メンバー数、招待数、プロジェクト数の一覧表示
- **メンバープレビュー**: 最新5名のメンバーアバター表示
- **招待管理**: 承認待ち招待の表示
- **チーム操作**: 切り替え、設定、詳細表示のアクション
- **権限制御**: ユーザーの権限に基づく操作可否制御
- **レスポンシブ対応**: デスクトップ・タブレット・モバイル最適化

## Props

```typescript
interface TeamCardProps {
  team: Team // チーム情報
  currentTeamId: number // 現在選択中のチームID
}
```

## Emits

```typescript
interface TeamCardEmits {
  showMembers: [team: Team] // メンバー詳細表示
  showDetails: [team: Team] // チーム詳細表示
  teamSwitched: [team: Team] // チーム切り替え完了
}
```

## 表示内容

### カードヘッダー

- **チームアバター**: 頭文字表示、将来的に画像対応
- **チーム名**: 大きく表示
- **ステータスバッジ**:
  - 現在チーム: ✅ "Current"（緑色）
  - 個人チーム: 👤 "Personal"（青色）
- **作成情報**: 作成日・作成者名

### 統計セクション

- **メンバー数**: 所属メンバー数（オーナー除く）
- **招待数**: 承認待ち招待数
- **プロジェクト数**: 将来対応（現在は0固定）

### アクションエリア

- **Switch**: 他チームへの切り替えボタン
- **Settings**: チーム設定画面への遷移
- **View Details**: 詳細情報表示（将来対応）

## チーム状態表示

### チームタイプ

- **Personal Team**: 特別な背景色・アイコン
- **Shared Team**: 標準表示
- **Current Team**: 強調表示（枠線・背景色）

### 所有者関係

- **Owner**: 👑 アイコン・特別権限表示
- **Member**: 👤 アイコン・制限権限表示

### 操作可能状態

- **切り替え可能**: 非現在チーム
- **設定変更**: 表示権限保有チーム
- **脱退可能**: 非個人チーム・非現在チーム

## 実装済み機能

✅ Element Plus + Tailwind CSS によるモダンなデザイン
✅ チーム基本情報の包括的表示
✅ 視覚的なステータス識別（バッジ・アイコン）
✅ 統計情報のグラフィカル表示
✅ レスポンシブグリッドレイアウト
✅ インタラクティブなアクションボタン
✅ 権限ベースの操作制御
✅ ローディング状態管理
✅ エラーハンドリング
✅ アクセシビリティ対応
✅ TypeScript型安全性
✅ テスト用data-testid属性

## 技術仕様

### コンポーネント構造

```mermaid
TeamCard
├── カードヘッダー
│   ├── アバター表示
│   ├── チーム名 + バッジ
│   └── 作成情報
├── 統計セクション
│   ├── メンバー数表示
│   ├── 招待数表示
│   └── プロジェクト数表示
├── メンバープレビュー
│   ├── アバター一覧（5名まで）
│   └── 追加メンバー数表示
├── 招待情報
│   ├── 招待一覧
│   └── 招待日表示
└── アクションエリア
    ├── 切り替えボタン
    ├── 設定ボタン
    └── 詳細ボタン
```

### 状態管理

```typescript
// ローカル状態
const isSwitching = ref(false) // チーム切り替え中フラグ

// 計算プロパティ
const canLeaveTeam = computed(() => {
  return !props.team.personal_team && props.team.id !== props.currentTeamId
})

const isOwner = computed(() => {
  return props.team.is_owner
})
```

### イベント処理

```typescript
// チーム切り替え
const handleSwitchTeam = async () => {
  isSwitching.value = true
  try {
    await router.put(route('current-team.update'), {
      team_id: props.team.id,
    })
    emit('teamSwitched', props.team)
  } finally {
    isSwitching.value = false
  }
}

// 設定画面遷移
const handleTeamSettings = () => {
  router.visit(route('teams.show', props.team.id))
}
```

## レスポンシブ対応

### デスクトップ（1024px+）

- 3列グリッド表示
- 全情報表示
- フルアクション提供

### タブレット（768-1023px）

- 2列グリッド表示
- 重要情報優先表示
- 主要アクション提供

### モバイル（767px以下）

- 1列表示
- コンパクト情報表示
- 最小限アクション

## テストサポート

### data-testid属性

- `team-card-{id}`: カード全体
- `switch-team-{id}`: 切り替えボタン
- `view-team-{id}`: 設定ボタン
- `current-team-indicator-{id}`: 現在チーム表示
- `personal-team-icon-{id}`: 個人チーム表示

## 基本仕様

- **ファイルパス**: `resources/js/Components/Teams/TeamCard.vue`
- **Storybookファイル**: `stories/components/teams/TeamCard.stories.ts`
- **StorybookのURL**: <http://localhost:6006/?path=/docs/teams-teamcard--docs>
- **技術スタック**: Vue 3 + TypeScript + Element Plus + Tailwind CSS

## 今後の改善点

### UI/UX機能

- [ ] チーム画像アップロード機能
- [ ] リアルタイムメンバー状態表示
- [ ] インタラクティブな統計グラフ
- [ ] ドラッグ&ドロップによる並び替え

### パフォーマンス最適化

- [ ] 画像遅延読み込み: アバター画像の最適化
- [ ] イベント最適化: 不要な再レンダリング防止
- [ ] メモリ効率: 適切なクリーンアップ

### アクセシビリティ

- [ ] キーボード操作: Tabキーでフォーカス移動
- [ ] スクリーンリーダー: 適切なaria-label設定
- [ ] カラーコントラスト: WCAG 2.1 AA準拠## UI状態

### チームタイプ表示

- **Personal Team**: 特別な背景色・アイコン
- **Shared Team**: 標準表示
- **Current Team**: 強調表示（枠線・背景色）

### 所有者関係

- **Owner**: 👑 アイコン・特別権限表示
- **Member**: 👤 アイコン・制限権限表示

### 操作可能状態

- **切り替え可能**: 非現在チーム
- **設定変更**: 表示権限保有チーム
- **脱退可能**: 非個人チーム・非現在チーム
