import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { fn } from 'storybook/test'
import TeamResultsInfo from '@/Components/Teams/TeamResultsInfo.vue'
import type { PaginationMeta, TeamFilters, TeamStatsWithPagination } from '@/Types/types-team'

const meta = {
  title: 'Teams/TeamResultsInfo',
  component: TeamResultsInfo,
  tags: ['autodocs'],
  decorators: [
    story => ({
      template: '<div class="p-4 bg-gray-50"><story /></div>',
    }),
  ],
  argTypes: {
    pagination: { control: 'object' },
    filters: { control: 'object' },
    stats: { control: 'object' },
  },
  parameters: {
    docs: {
      description: {
        component: `
チーム一覧の検索結果表示用コンポーネントです。

## 機能

- **結果表示**: 「XX件中YY-ZZ件表示」形式での検索結果情報表示
- **フィルター状態表示**: アクティブなフィルターをタグ形式で表示
- **ページ件数選択**: 表示件数の動的変更機能
- **フィルタークリア**: 個別フィルターまたは全フィルターのクリア機能
- **レスポンシブ対応**: デスクトップ・モバイル表示の最適化

## 使用方法

1. \`pagination\` プロパティでページネーション情報を設定
2. \`filters\` プロパティで現在のフィルター状態を設定
3. \`stats\` プロパティで統計情報を設定
4. イベントハンドラーでページ件数変更やフィルタークリアを処理
        `,
      },
    },
  },
} satisfies Meta<typeof TeamResultsInfo>

export default meta
type Story = StoryObj<typeof meta>

// サンプルデータ作成関数
const createMockPagination = (overrides: Partial<PaginationMeta> = {}): PaginationMeta => ({
  current_page: 1,
  last_page: 5,
  per_page: 12,
  total: 60,
  from: 1,
  to: 12,
  links: [],
  ...overrides,
})

const createMockFilters = (overrides: Partial<TeamFilters> = {}): TeamFilters => ({
  search: '',
  type: 'all',
  memberCount: '',
  sortBy: 'name_asc',
  ...overrides,
})

const createMockStats = (
  overrides: Partial<TeamStatsWithPagination> = {}
): TeamStatsWithPagination => ({
  total: 60,
  filtered: 60,
  showing: 12,
  personal: 1,
  shared: 59,
  owned: 5,
  member: 55,
  current: 1,
  ...overrides,
})

// 結果表示用の共通関数
function renderStatsDisplay() {
  return `
    <div class="mt-4 p-3 bg-white rounded border">
      <h4 class="text-sm font-medium text-gray-700 mb-2">コンポーネントの状態:</h4>
      <div class="text-xs text-gray-600 space-y-1">
        <div><strong>Total:</strong> {{ args.stats.total }}</div>
        <div><strong>Filtered:</strong> {{ args.stats.filtered }}</div>
        <div><strong>Showing:</strong> {{ args.stats.showing }}</div>
        <div><strong>Current Page:</strong> {{ args.pagination.current_page }}</div>
        <div><strong>Per Page:</strong> {{ args.pagination.per_page }}</div>
      </div>
    </div>
  `
}

// 各ストーリーの説明文
const descriptions = {
  default: `
### 基本的な使用例

フィルターが適用されていない基本状態です。60件のチームが存在し、そのうち最初の12件を表示しています。
  `,
  withFilters: `
### フィルター適用済み表示

検索フィルターとタイプフィルターが適用された状態です。アクティブなフィルターがタグ形式で表示されています。
  `,
  filtered: `
### フィルター結果表示

全60件中、フィルターによって25件に絞り込まれた状態です。フィルター結果数が括弧内に表示されます。
  `,
  noResults: `
### 検索結果なし表示

検索条件に一致するチームが存在しない場合の表示です。
  `,
  largePage: `
### 大量データページ表示

1ページあたり48件表示の設定で、大量のデータを表示している状態です。
  `,
  loading: `
### ローディング状態表示

データ読み込み中の状態表示です。ページ件数選択が無効化されます。
  `,
}

export const Default: Story = {
  args: {
    pagination: createMockPagination(),
    filters: createMockFilters(),
    stats: createMockStats(),
    onPerPageChanged: fn(),
    onFilterRemoved: fn(),
    onAllFiltersCleared: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.default,
      },
    },
  },
  render: args => ({
    components: { TeamResultsInfo },
    setup() {
      return { args }
    },
    template: `
      <TeamResultsInfo
        :pagination="args.pagination"
        :filters="args.filters"
        :stats="args.stats"
        @per-page-changed="args.onPerPageChanged"
        @filter-removed="args.onFilterRemoved"
        @all-filters-cleared="args.onAllFiltersCleared"
      />
      ${renderStatsDisplay()}
    `,
  }),
}

export const WithFilters: Story = {
  args: {
    pagination: createMockPagination(),
    filters: createMockFilters({
      search: 'development',
      type: 'shared',
      memberCount: '2-5',
    }),
    stats: createMockStats(),
    onPerPageChanged: fn(),
    onFilterRemoved: fn(),
    onAllFiltersCleared: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.withFilters,
      },
    },
  },
  render: args => ({
    components: { TeamResultsInfo },
    setup() {
      return { args }
    },
    template: `
      <TeamResultsInfo
        :pagination="args.pagination"
        :filters="args.filters"
        :stats="args.stats"
        @per-page-changed="args.onPerPageChanged"
        @filter-removed="args.onFilterRemoved"
        @all-filters-cleared="args.onAllFiltersCleared"
      />
      ${renderStatsDisplay()}
    `,
  }),
}

export const Filtered: Story = {
  args: {
    pagination: createMockPagination({
      total: 60,
      from: 1,
      to: 12,
    }),
    filters: createMockFilters({
      search: 'test',
    }),
    stats: createMockStats({
      total: 60,
      filtered: 25,
      showing: 12,
    }),
    onPerPageChanged: fn(),
    onFilterRemoved: fn(),
    onAllFiltersCleared: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.filtered,
      },
    },
  },
  render: args => ({
    components: { TeamResultsInfo },
    setup() {
      return { args }
    },
    template: `
      <TeamResultsInfo
        :pagination="args.pagination"
        :filters="args.filters"
        :stats="args.stats"
        @per-page-changed="args.onPerPageChanged"
        @filter-removed="args.onFilterRemoved"
        @all-filters-cleared="args.onAllFiltersCleared"
      />
      ${renderStatsDisplay()}
    `,
  }),
}

export const NoResults: Story = {
  args: {
    pagination: createMockPagination({
      current_page: 1,
      last_page: 1,
      per_page: 12,
      total: 0,
      from: null,
      to: null,
    }),
    filters: createMockFilters({
      search: 'nonexistent',
    }),
    stats: createMockStats({
      total: 0,
      filtered: 0,
      showing: 0,
    }),
    onPerPageChanged: fn(),
    onFilterRemoved: fn(),
    onAllFiltersCleared: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.noResults,
      },
    },
  },
  render: args => ({
    components: { TeamResultsInfo },
    setup() {
      return { args }
    },
    template: `
      <TeamResultsInfo
        :pagination="args.pagination"
        :filters="args.filters"
        :stats="args.stats"
        @per-page-changed="args.onPerPageChanged"
        @filter-removed="args.onFilterRemoved"
        @all-filters-cleared="args.onAllFiltersCleared"
      />
      ${renderStatsDisplay()}
    `,
  }),
}

export const LargePage: Story = {
  args: {
    pagination: createMockPagination({
      current_page: 3,
      last_page: 10,
      per_page: 48,
      total: 480,
      from: 97,
      to: 144,
    }),
    filters: createMockFilters(),
    stats: createMockStats({
      total: 480,
      filtered: 480,
      showing: 48,
    }),
    onPerPageChanged: fn(),
    onFilterRemoved: fn(),
    onAllFiltersCleared: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.largePage,
      },
    },
  },
  render: args => ({
    components: { TeamResultsInfo },
    setup() {
      return { args }
    },
    template: `
      <TeamResultsInfo
        :pagination="args.pagination"
        :filters="args.filters"
        :stats="args.stats"
        @per-page-changed="args.onPerPageChanged"
        @filter-removed="args.onFilterRemoved"
        @all-filters-cleared="args.onAllFiltersCleared"
      />
      ${renderStatsDisplay()}
    `,
  }),
}

export const Loading: Story = {
  args: {
    pagination: createMockPagination(),
    filters: createMockFilters(),
    stats: createMockStats(),
    loading: true,
    onPerPageChanged: fn(),
    onFilterRemoved: fn(),
    onAllFiltersCleared: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.loading,
      },
    },
  },
  render: args => ({
    components: { TeamResultsInfo },
    setup() {
      return { args }
    },
    template: `
      <TeamResultsInfo
        :pagination="args.pagination"
        :filters="args.filters"
        :stats="args.stats"
        :loading="args.loading"
        @per-page-changed="args.onPerPageChanged"
        @filter-removed="args.onFilterRemoved"
        @all-filters-cleared="args.onAllFiltersCleared"
      />
      ${renderStatsDisplay()}
    `,
  }),
}
