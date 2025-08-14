# TASK-401: チーム一覧画面Storybook実装

## タスク概要

チーム一覧画面機能の実装完了に伴い、新規作成されたUIコンポーネントのStorybookストーリーと`Interaction tests`を実装する。特に複合的なUIコンポーネントにおいては、ユーザーの操作フローを自動検証する`Interaction tests`を実装し、コンポーネント単位でのE2Eテスト相当の品質保証を行う。

## 依存関係

**依存タスク**: 基本実装タスク（TASK-101～301）がすべて完了していること

## 実装対象コンポーネント

### 新規作成されたUIコンポーネント

```text
resources/js/Components/Teams/
├── TeamCard.vue                 # チーム詳細カードコンポーネント
├── TeamFilters.vue              # フィルタリング・検索コンポーネント
├── TeamPagination.vue           # ページネーション制御コンポーネント
└── TeamResultsInfo.vue          # 検索結果表示コンポーネント
```

### Storybook実装対象判定

#### Interaction tests実装対象

以下の条件に基づいて判定:

1. **TeamFilters.vue** ✅
   - 複数のUIコンポーネント（検索入力、フィルター選択、タグ表示）で構成
   - 複雑なロジック（デバウンス検索、フィルター状態管理）を含む
   - ユーザーの複合操作フロー（検索→フィルター→クリア）をテスト

2. **TeamCard.vue** ✅
   - 複数のUIコンポーネント（アバター、タグ、ドロップダウン、ボタン）で構成
   - 複雑なロジック（チーム切り替え、削除確認、状態管理）を含む
   - ユーザーの複合操作フロー（表示→アクション→確認）をテスト

#### 基本Storybookのみ実装対象

1. **TeamPagination.vue** 📖
   - Element Plus `ElPagination`のラッパーコンポーネント
   - シンプルなイベント伝播のみのため基本ストーリーのみ

2. **TeamResultsInfo.vue** 📖
   - 表示専用コンポーネント（情報表示＋一部操作）
   - シンプルなUIのため基本ストーリーのみ

## 実装仕様

### 1. TeamFilters.vue Storybook実装

#### 1.1 基本ストーリー

**ファイル**: `stories/components/teams/TeamFilters.stories.ts`

**必要ストーリー**:

- **Default**: 初期状態（空のフィルター）
- **WithInitialFilters**: 初期フィルター設定あり
- **WithSearchResults**: 検索結果が設定された状態
- **AllFiltersActive**: 全フィルターが設定された状態
- **InteractionTest**: 自動操作テスト（Interaction tests）

#### 1.2 Interaction Test仕様

**テストシナリオ**:

```typescript
// Step 1: 検索入力テスト
await userEvent.type(searchInput, 'Test Team')
await waitForDebounce() // 300ms デバウンス待機

// Step 2: チームタイプフィルター選択
await userEvent.click(typeFilter)
await userEvent.click(getByText('Personal Teams'))

// Step 3: メンバー数フィルター選択
await userEvent.click(memberCountFilter)
await userEvent.click(getByText('2-5 members'))

// Step 4: 並び替え選択
await userEvent.click(sortByFilter)
await userEvent.click(getByText('Name (A-Z)'))

// Step 5: アクティブフィルタータグが表示されることを確認
expect(getByTestId('active-filter-search')).toBeVisible()
expect(getByTestId('active-filter-type')).toBeVisible()

// Step 6: 個別フィルタークリア操作
await userEvent.click(getByTestId('clear-filter-search'))
expect(queryByTestId('active-filter-search')).toBeNull()

// Step 7: 全フィルタークリア操作
await userEvent.click(getByTestId('clear-all-filters'))
expect(queryByTestId('active-filter-type')).toBeNull()
```

#### 1.3 Props/Events検証

**Props**:

```typescript
interface TeamFiltersProps {
  filters: TeamFilters
  resultStats?: {
    total: number
    filtered: number
    showing: number
  }
}
```

**Events**:

```typescript
interface TeamFiltersEmits {
  'update:filters': [filters: TeamFilters]
  'filters-changed': [filters: TeamFilters]
}
```

### 2. TeamCard.vue Storybook実装

#### 2.1 基本ストーリー

**ファイル**: `stories/components/teams/TeamCard.stories.ts`

**必要ストーリー**:

- **Default**: 基本のチームカード
- **CurrentTeam**: 現在選択中のチーム表示
- **PersonalTeam**: 個人チーム表示
- **WithMembers**: メンバー情報表示あり
- **OwnerView**: オーナー視点（削除ボタンあり）
- **MemberView**: メンバー視点（削除ボタンなし）
- **InteractionTest**: 自動操作テスト（Interaction tests）

#### 2.2 Interaction Test仕様

**テストシナリオ**:

```typescript
// Step 1: チーム詳細表示ボタンクリック
await userEvent.click(getByTestId('view-team-details'))
expect(mockViewHandler).toHaveBeenCalledWith(team.id)

// Step 2: チーム切り替えボタンクリック（現在チーム以外）
if (team.id !== currentTeamId) {
  await userEvent.click(getByTestId('switch-to-team'))
  expect(mockSwitchHandler).toHaveBeenCalledWith(team.id)
}

// Step 3: アクションドロップダウン操作
await userEvent.click(getByTestId('team-actions-dropdown'))
expect(getByTestId('dropdown-menu')).toBeVisible()

// Step 4: チーム削除操作（オーナーのみ）
if (isOwner && !team.personal_team) {
  await userEvent.click(getByTestId('delete-team-action'))
  expect(mockDeleteHandler).toHaveBeenCalledWith(team.id)
}

// Step 5: メンバー一覧展開操作
await userEvent.click(getByTestId('expand-members'))
expect(getByTestId('members-list')).toBeVisible()

// Step 6: 招待リンク操作
await userEvent.click(getByTestId('copy-invite-link'))
expect(mockCopyHandler).toHaveBeenCalled()
```

#### 2.3 Team Data Mock

**サンプルデータ**:

```typescript
const mockTeamData = {
  id: 1,
  name: 'サンプルチーム',
  personal_team: false,
  members_count: 5,
  invitations_count: 2,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-06-01T00:00:00Z',
  is_owner: true,
  is_current: false,
  user_role: 'admin' as TeamRole,
  permissions: {
    canView: true,
    canUpdate: true,
    canDelete: true,
  },
  recent_members: [
    { id: 1, name: 'User A', profile_photo_url: null },
    { id: 2, name: 'User B', profile_photo_url: null },
  ],
}
```

### 3. TeamPagination.vue Storybook実装

#### 3.1 基本ストーリー

**ファイル**: `stories/components/teams/TeamPagination.stories.ts`

**必要ストーリー**:

- **Default**: 基本ページネーション
- **FirstPage**: 1ページ目表示状態
- **MiddlePage**: 中間ページ表示状態
- **LastPage**: 最終ページ表示状態
- **LargeDataset**: 大量データでのページネーション
- **SmallDataset**: 少量データでのページネーション

#### 3.2 Props仕様

```typescript
interface TeamPaginationProps {
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
  loading?: boolean
}
```

### 4. TeamResultsInfo.vue Storybook実装

#### 4.1 基本ストーリー

**ファイル**: `stories/components/teams/TeamResultsInfo.stories.ts`

**必要ストーリー**:

- **Default**: 基本の結果表示
- **WithFilters**: フィルター適用済み表示
- **NoResults**: 検索結果なし表示
- **Loading**: ローディング状態表示
- **LargePage**: 大量データページ表示

#### 4.2 Props仕様

```typescript
interface TeamResultsInfoProps {
  pagination: PaginationMeta
  filters: TeamFilters
  stats: {
    total: number
    filtered: number
    showing: number
  }
}
```

## 実装ガイドライン

### 1. ファイル配置

```text
stories/components/teams/
├── TeamCard.stories.ts          # チームカードストーリー
├── TeamFilters.stories.ts       # フィルターストーリー
├── TeamPagination.stories.ts    # ページネーションストーリー
└── TeamResultsInfo.stories.ts   # 結果表示ストーリー
```

### 2. 共通設定

#### Meta設定

```typescript
const meta = {
  title: 'Teams/TeamCard', // または適切なカテゴリ
  component: TeamCard,
  tags: ['autodocs'],
  decorators: [
    story => ({
      template: '<div class="p-4 bg-gray-50"><story /></div>',
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `チーム詳細表示用のカードコンポーネント...`,
      },
    },
  },
}
```

#### Interaction Test設定

```typescript
export const InteractionTest: Story = {
  parameters: {
    docs: {
      description: {
        story: `自動操作テストストーリー。以下の操作を自動実行します：...`,
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    console.log('🤖TeamCard InteractionTest Start')

    const TIMEOUT = {
      SHORT: 300,
      MEDIUM: 500,
      LONG: 800,
    }

    // テスト実装...
  },
}
```

### 3. テストデータ管理

#### Mock Data Factory

```typescript
// stories/data/teamMockData.ts
export const createMockTeam = (overrides = {}) => ({
  id: 1,
  name: 'Sample Team',
  personal_team: false,
  // ... デフォルト値
  ...overrides,
})

export const createMockPagination = (overrides = {}) => ({
  current_page: 1,
  last_page: 5,
  per_page: 12,
  total: 60,
  from: 1,
  to: 12,
  ...overrides,
})
```

### 4. Element Plus統合

#### Component Import

```typescript
import { ElButton, ElIcon, ElTag, ElDropdown } from 'element-plus'
import { Plus, Edit, Delete, Switch } from '@element-plus/icons-vue'
```

#### テストID使用

```typescript
// コンポーネント側でdata-testidを設定
<ElButton data-testid="switch-to-team" @click="handleSwitch">

// テスト側で取得
const switchButton = canvas.getByTestId('switch-to-team')
```

### 5. Interaction Test実装パターン

#### エラーハンドリング

```typescript
const stepFunctions = {
  1: async () => {
    try {
      await addSearchFilter('Test Team')
      logFilterState('Step:1 : 検索フィルター追加')
    } catch (error) {
      console.error('❌ Error in Step 1:', error)
      throw error
    }
  },
}
```

#### 非同期操作待機

```typescript
// デバウンス処理の待機
const waitForDebounce = () => new Promise(resolve => setTimeout(resolve, 350))

// アニメーション待機
const waitForTransition = () => new Promise(resolve => setTimeout(resolve, 300))
```

#### 状態検証

```typescript
const verifyFilterState = (expectedFilters: any) => {
  const currentState = getFilterState()
  expect(currentState).toEqual(expectedFilters)
}
```

## 実装優先順位

### Phase 1: 基本Storybook実装

1. TeamResultsInfo.stories.ts
2. TeamPagination.stories.ts

### Phase 2: 複合コンポーネントStorybook実装

1. TeamCard.stories.ts（基本ストーリーのみ）
2. TeamFilters.stories.ts（基本ストーリーのみ）

### Phase 3: Interaction Tests実装

1. TeamFilters.stories.ts（InteractionTest追加）
2. TeamCard.stories.ts（InteractionTest追加）

## 完了条件

### 機能確認

1. **Storybook動作確認**
   - 全ストーリーが正常に表示される
   - Docsページが適切に生成される
   - コンポーネントのProps/Eventsが正しく動作する

2. **Interaction Tests動作確認**
   - 自動操作テストが成功する
   - エラーハンドリングが適切に動作する
   - テスト結果がコンソールに出力される

3. **コードカバレッジ**
   - 主要な操作フローがテストされている
   - エラーケースが適切にハンドリングされている
   - 境界値テストが含まれている

### 品質基準

1. **コード品質**
   - TypeScript型安全性の確保
   - ESLint/Prettierルールの遵守
   - 適切なコメントとドキュメント

2. **テスト品質**
   - 実際のユーザー操作に近いテストシナリオ
   - 適切な待機時間設定
   - 明確なテスト結果ログ

3. **メンテナンス性**
   - 再利用可能なテストヘルパー関数
   - 設定可能なテストパラメーター
   - 明確なファイル構造

## 技術的考慮事項

### 1. Element Plus統合

- Element Plusコンポーネントの適切なテスト方法
- テーマ・ダークモード対応の確認
- レスポンシブ表示の検証

### 2. Vue3 Composition API

- ref/reactive状態の適切なモック
- computed/watchの動作確認
- イベント伝播の検証

### 3. Inertia.js統合

- ページ遷移のモック
- フォーム送信のモック
- ルーティングヘルパーのモック

### 4. GraphQL Mock（将来対応）

- Apollo Clientのモック設定
- GraphQLクエリレスポンスのモック
- ローディング・エラー状態のモック

## 参考実装

### 既存Interaction Tests

- `stories/components/form/ElTextQueryInput.stories.ts`
- `stories/components/form/ElMentionTextarea.stories.ts`

### Storybookドキュメント

- [Storybook Interaction Testing](https://storybook.js.org/docs/writing-tests/interaction-testing)
- [Vue3 + Storybook Best Practices](https://storybook.js.org/docs/get-started/frameworks/vue3-vite)

### Element Plus参考

- [Element Plus Storybook Examples](https://element-plus.org/en-US/component/button.html)
