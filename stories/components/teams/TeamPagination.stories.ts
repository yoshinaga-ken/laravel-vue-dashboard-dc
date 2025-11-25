import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import TeamPagination from '@/Components/Teams/TeamPagination.vue'
import type { PaginationMeta } from '@/Types/types-team'

const meta = {
  title: 'Teams/TeamPagination',
  component: TeamPagination,
  tags: ['autodocs'],
  decorators: [
    story => ({
      template: '<div class="p-4 bg-gray-50"><story /></div>',
    }),
  ],
  argTypes: {
    pagination: { control: 'object' },
    loading: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
チーム一覧のページネーション制御コンポーネントです。Element Plus \`ElPagination\` をラッピングし、レスポンシブ対応とチーム一覧特有の機能を提供します。

## 機能

- **ページネーション制御**: ページ番号の移動とページサイズ変更
- **レスポンシブ対応**: デスクトップ・モバイルで異なる表示形式
- **結果情報表示**: 「XX-YY件を表示（全ZZ件中）」形式の情報表示
- **ローディング状態**: データ読み込み中の無効化表示
- **Element Plus統合**: Element Plus \`ElPagination\` のフル機能活用

## 使用方法

1. \`pagination\` プロパティでページネーション情報を設定
2. \`loading\` プロパティでローディング状態を制御
3. \`page-changed\` イベントでページ変更を処理
4. \`per-page-changed\` イベントでページサイズ変更を処理

## レスポンシブ表示

- **デスクトップ**: フル機能ページネーション（ページサイズ選択、ジャンプ機能付き）
- **モバイル**: シンプルな前後ボタンとページ番号表示
        `,
      },
    },
  },
} satisfies Meta<typeof TeamPagination>

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

// 結果表示用の共通関数
function renderPaginationInfo() {
  return `
    <div class="mt-4 p-3 bg-white rounded border">
      <h4 class="text-sm font-medium text-gray-700 mb-2">ページネーション情報:</h4>
      <div class="text-xs text-gray-600 space-y-1">
        <div><strong>Current Page:</strong> {{ args.pagination.current_page }}</div>
        <div><strong>Last Page:</strong> {{ args.pagination.last_page }}</div>
        <div><strong>Per Page:</strong> {{ args.pagination.per_page }}</div>
        <div><strong>Total:</strong> {{ args.pagination.total }}</div>
        <div><strong>From-To:</strong> {{ args.pagination.from }}-{{ args.pagination.to }}</div>
        <div><strong>Loading:</strong> {{ args.loading || false }}</div>
      </div>
    </div>
  `
}

// 各ストーリーの説明文
const descriptions = {
  default: `
### 基本的なページネーション

60件のデータを12件ずつ表示する基本的なページネーション表示です。1ページ目を表示中です。
  `,
  firstPage: `
### 1ページ目表示状態

最初のページを表示している状態です。「前へ」ボタンが無効化されています。
  `,
  middlePage: `
### 中間ページ表示状態

中間のページ（3ページ目）を表示している状態です。前後のページボタンが有効です。
  `,
  lastPage: `
### 最終ページ表示状態

最後のページを表示している状態です。「次へ」ボタンが無効化されています。
  `,
  largeDataset: `
### 大量データでのページネーション

500件の大量データを48件ずつ表示する場合のページネーション表示です。
  `,
  smallDataset: `
### 少量データでのページネーション

15件の少量データを12件ずつ表示する場合のページネーション表示です。
  `,
  singlePage: `
### 単一ページ表示

10件のデータを12件ずつ表示する設定のため、1ページのみとなりページネーション非表示の状態です。
  `,
  loading: `
### ローディング状態

データ読み込み中のためページネーション操作が無効化されている状態です。
  `,
}

export const Default: Story = {
  args: {
    pagination: createMockPagination(),
    loading: false,
    onPageChanged: fn(),
    onPerPageChanged: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.default,
      },
    },
  },
  render: args => ({
    components: { TeamPagination },
    setup() {
      return { args }
    },
    template: `
      <TeamPagination
        :pagination="args.pagination"
        :loading="args.loading"
        @page-changed="args.onPageChanged"
        @per-page-changed="args.onPerPageChanged"
      />
      ${renderPaginationInfo()}
    `,
  }),
}

export const FirstPage: Story = {
  args: {
    pagination: createMockPagination({
      current_page: 1,
      last_page: 8,
      per_page: 12,
      total: 96,
      from: 1,
      to: 12,
    }),
    loading: false,
    onPageChanged: fn(),
    onPerPageChanged: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.firstPage,
      },
    },
  },
  render: args => ({
    components: { TeamPagination },
    setup() {
      return { args }
    },
    template: `
      <TeamPagination
        :pagination="args.pagination"
        :loading="args.loading"
        @page-changed="args.onPageChanged"
        @per-page-changed="args.onPerPageChanged"
      />
      ${renderPaginationInfo()}
    `,
  }),
}

export const MiddlePage: Story = {
  args: {
    pagination: createMockPagination({
      current_page: 3,
      last_page: 8,
      per_page: 12,
      total: 96,
      from: 25,
      to: 36,
    }),
    loading: false,
    onPageChanged: fn(),
    onPerPageChanged: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.middlePage,
      },
    },
  },
  render: args => ({
    components: { TeamPagination },
    setup() {
      return { args }
    },
    template: `
      <TeamPagination
        :pagination="args.pagination"
        :loading="args.loading"
        @page-changed="args.onPageChanged"
        @per-page-changed="args.onPerPageChanged"
      />
      ${renderPaginationInfo()}
    `,
  }),
}

export const LastPage: Story = {
  args: {
    pagination: createMockPagination({
      current_page: 8,
      last_page: 8,
      per_page: 12,
      total: 96,
      from: 85,
      to: 96,
    }),
    loading: false,
    onPageChanged: fn(),
    onPerPageChanged: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.lastPage,
      },
    },
  },
  render: args => ({
    components: { TeamPagination },
    setup() {
      return { args }
    },
    template: `
      <TeamPagination
        :pagination="args.pagination"
        :loading="args.loading"
        @page-changed="args.onPageChanged"
        @per-page-changed="args.onPerPageChanged"
      />
      ${renderPaginationInfo()}
    `,
  }),
}

export const LargeDataset: Story = {
  args: {
    pagination: createMockPagination({
      current_page: 5,
      last_page: 11,
      per_page: 48,
      total: 500,
      from: 193,
      to: 240,
    }),
    loading: false,
    onPageChanged: fn(),
    onPerPageChanged: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.largeDataset,
      },
    },
  },
  render: args => ({
    components: { TeamPagination },
    setup() {
      return { args }
    },
    template: `
      <TeamPagination
        :pagination="args.pagination"
        :loading="args.loading"
        @page-changed="args.onPageChanged"
        @per-page-changed="args.onPerPageChanged"
      />
      ${renderPaginationInfo()}
    `,
  }),
}

export const SmallDataset: Story = {
  args: {
    pagination: createMockPagination({
      current_page: 2,
      last_page: 2,
      per_page: 12,
      total: 15,
      from: 13,
      to: 15,
    }),
    loading: false,
    onPageChanged: fn(),
    onPerPageChanged: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.smallDataset,
      },
    },
  },
  render: args => ({
    components: { TeamPagination },
    setup() {
      return { args }
    },
    template: `
      <TeamPagination
        :pagination="args.pagination"
        :loading="args.loading"
        @page-changed="args.onPageChanged"
        @per-page-changed="args.onPerPageChanged"
      />
      ${renderPaginationInfo()}
    `,
  }),
}

export const SinglePage: Story = {
  args: {
    pagination: createMockPagination({
      current_page: 1,
      last_page: 1,
      per_page: 12,
      total: 10,
      from: 1,
      to: 10,
    }),
    loading: false,
    onPageChanged: fn(),
    onPerPageChanged: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.singlePage,
      },
    },
  },
  render: args => ({
    components: { TeamPagination },
    setup() {
      return { args }
    },
    template: `
      <div>
        <p class="text-sm text-gray-600 mb-4">
          注意: 1ページのみのデータのため、ページネーションは表示されません
        </p>
        <TeamPagination
          :pagination="args.pagination"
          :loading="args.loading"
          @page-changed="args.onPageChanged"
          @per-page-changed="args.onPerPageChanged"
        />
      </div>
      ${renderPaginationInfo()}
    `,
  }),
}

export const Loading: Story = {
  args: {
    pagination: createMockPagination(),
    loading: true,
    onPageChanged: fn(),
    onPerPageChanged: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.loading,
      },
    },
  },
  render: args => ({
    components: { TeamPagination },
    setup() {
      return { args }
    },
    template: `
      <TeamPagination
        :pagination="args.pagination"
        :loading="args.loading"
        @page-changed="args.onPageChanged"
        @per-page-changed="args.onPerPageChanged"
      />
      ${renderPaginationInfo()}
    `,
  }),
}
