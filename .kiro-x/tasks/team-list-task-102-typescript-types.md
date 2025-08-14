# TASK-102: TypeScript型定義作成

## 概要

チーム一覧画面で使用するTypeScript型定義を作成する。
バックエンドのAPI応答構造に対応した厳密な型定義により、型安全性を確保し、
開発効率とコード品質を向上させる。

## 依存関係

- **依存タスク**: なし（独立して実装可能）
- **後続タスク**: TASK-104, TASK-201, TASK-202

## 実装内容

### 1. チーム関連型定義ファイル作成

**ファイル**: `resources/js/Types/types-team.d.ts`

```typescript
/**
 * チーム基本情報
 */
export interface Team {
  /** チームID */
  id: number
  /** チーム名 */
  name: string
  /** 個人チームフラグ */
  personal_team: boolean
  /** 作成日時 */
  created_at: string
  /** 更新日時 */
  updated_at: string
}

/**
 * チーム詳細情報（一覧画面用）
 */
export interface TeamDetail extends Team {
  /** ユーザーがオーナーかどうか */
  is_owner: boolean
  /** 現在選択中のチームかどうか */
  is_current: boolean
  /** ユーザーのチーム内役割 */
  user_role: TeamRole | null
  /** メンバー数（オーナー除く） */
  members_count: number
  /** 招待中ユーザー数 */
  invitations_count: number
  /** ユーザーの権限情報 */
  permissions: TeamPermissions
}

/**
 * チーム内役割
 */
export type TeamRole = 'admin' | 'editor'

/**
 * チーム権限情報
 */
export interface TeamPermissions {
  /** チーム詳細表示権限 */
  canView: boolean
  /** チーム更新権限 */
  canUpdate: boolean
  /** チーム削除権限 */
  canDelete: boolean
}

/**
 * チーム一覧画面のProps
 */
export interface TeamIndexProps {
  /** チーム一覧 */
  teams: TeamDetail[]
  /** Jetstream設定情報 */
  jetstream: JetstreamConfig
}

/**
 * Jetstream設定情報
 */
export interface JetstreamConfig {
  /** チーム作成権限 */
  canCreateTeams: boolean
}

/**
 * チームフィルター設定
 */
export interface TeamFilters {
  /** 表示対象（所有/所属/全て） */
  ownership: 'owned' | 'member' | 'all'
  /** チームタイプ（個人/通常/全て） */
  type: 'personal' | 'team' | 'all'
  /** 現在チームのみ表示 */
  currentOnly: boolean
  /** 検索文字列 */
  search: string
}

/**
 * チームソート設定
 */
export interface TeamSort {
  /** ソート対象カラム */
  column: 'name' | 'created_at' | 'updated_at' | 'members_count'
  /** ソート方向 */
  direction: 'asc' | 'desc'
}

/**
 * チームアクション種別
 */
export type TeamAction = 'view' | 'switch' | 'delete'

/**
 * チームアクションイベント
 */
export interface TeamActionEvent {
  /** アクション種別 */
  action: TeamAction
  /** 対象チーム */
  team: TeamDetail
}
```

### 2. 共通型定義の拡張

**ファイル**: `resources/js/Types/global.d.ts` (既存ファイルに追加)

```typescript
/**
 * Inertia.js ページProps共通インターフェース
 */
interface PageProps {
  // 既存の定義...

  /** 認証情報 */
  auth: {
    user: User & {
      /** 現在のチーム */
      current_team: Team
      /** 現在のチームID */
      current_team_id: number
      /** 所属している全チーム */
      all_teams: Team[]
    }
  }

  /** Jetstream設定 */
  jetstream: {
    /** チーム機能が有効か */
    hasTeamFeatures: boolean
    /** チーム作成権限があるか */
    canCreateTeams: boolean
  }
}
```

### 3. Element Plus拡張型定義

**ファイル**: `resources/js/Types/element-plus.d.ts`

```typescript
import type { ElTable, ElTableColumn } from 'element-plus'

/**
 * ElTable用のチームデータ
 */
export interface TeamTableData extends TeamDetail {
  /** テーブル用の一意キー */
  _key: string
  /** 表示用チームタイプ */
  _displayType: string
  /** 表示用所有者関係 */
  _displayOwnership: string
}

/**
 * ElTableColumnのスロットプロップス
 */
export interface TeamTableSlotProps {
  row: TeamTableData
  column: any
  $index: number
}

/**
 * ElTable ソートイベント
 */
export interface TeamTableSortEvent {
  column: any
  prop: string
  order: 'ascending' | 'descending' | null
}
```

### 4. Composables用型定義

**ファイル**: `resources/js/Types/composables.d.ts`

```typescript
/**
 * useTeamList Composable の戻り値
 */
export interface UseTeamListReturn {
  /** フィルタリング済みチーム一覧 */
  filteredTeams: ComputedRef<TeamDetail[]>
  /** フィルター設定 */
  filters: Ref<TeamFilters>
  /** ソート設定 */
  sort: Ref<TeamSort>
  /** ローディング状態 */
  isLoading: Ref<boolean>
  /** フィルター更新 */
  updateFilter: (key: keyof TeamFilters, value: any) => void
  /** ソート更新 */
  updateSort: (column: string) => void
  /** フィルター初期化 */
  resetFilters: () => void
}

/**
 * useTeamActions Composable の戻り値
 */
export interface UseTeamActionsReturn {
  /** チーム切り替え */
  switchToTeam: (team: TeamDetail) => Promise<void>
  /** チーム詳細表示 */
  viewTeam: (team: TeamDetail) => void
  /** チーム削除 */
  deleteTeam: (team: TeamDetail) => Promise<void>
  /** アクション実行中状態 */
  isProcessing: Ref<boolean>
}
```

## 成果物

### 新規作成ファイル

1. `resources/js/Types/types-team.d.ts` - チーム関連型定義
2. `resources/js/Types/element-plus.d.ts` - Element Plus拡張型定義
3. `resources/js/Types/composables.d.ts` - Composables用型定義

### 修正ファイル

1. `resources/js/Types/global.d.ts` - 共通型定義の拡張

## 完了条件

### 型定義の整合性確認

1. **TypeScript コンパイル**

   ```bash
   npx vue-tsc --noEmit
   ```

2. **型定義の一貫性**
   - バックエンドAPI応答と一致
   - Element Plus コンポーネントとの互換性
   - Inertia.js Props との整合性

### IDE サポート確認

1. **自動補完**
   - プロパティの自動補完が動作
   - メソッドシグネチャの表示

2. **型チェック**
   - 型エラーの検出
   - 未定義プロパティアクセスの警告

## 技術的考慮事項

### 1. 型安全性

- 厳密な型定義による実行時エラーの予防
- Union型による適切な選択肢の制限
- Optional プロパティの明確な定義

### 2. 拡張性

- 機能追加時の型定義拡張を考慮
- ジェネリック型の活用
- インターフェースの継承による重複排除

### 3. Element Plus 統合

- Element Plus コンポーネントとの型互換性
- カスタムプロパティの適切な型定義
- イベントハンドラーの型安全性

## 注意事項

### 1. バックエンド連携

- API応答構造との一致を維持
- 新しいフィールド追加時の型定義更新
- nullable フィールドの適切な型定義

### 2. Vue 3 Composition API

- `ref`, `computed` との型互換性
- Props の型定義方法
- Emit イベントの型定義

### 3. 保守性

- 型定義の論理的な分割
- 適切なファイル名とディレクトリ構造
- JSDoc コメントによる説明追加

## 使用例

```typescript
// コンポーネントでの使用例
import type { TeamDetail, TeamIndexProps } from '@/Types/types-team'

const props = defineProps<TeamIndexProps>()

const handleTeamAction = (team: TeamDetail) => {
  if (team.permissions.canDelete && !team.personal_team) {
    // 削除処理
  }
}
```
