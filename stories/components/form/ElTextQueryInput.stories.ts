import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import ElTextQueryInput from '@/Components/ElTextQueryInput.vue';

const meta = {
  title: 'Form/ElTextQueryInput',
  component: ElTextQueryInput,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      template: '<div class="p-4"><story /></div>',
    }),
  ],
  argTypes: {
    modelValue: { control: 'object' },
    availableTokens: { control: 'object' },
    disabled: { control: 'boolean' },
    inputPlaceholder: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: `
高度な検索クエリ作成用の入力コンポーネントです。トークンベースの検索条件を構築できます。

## 機能

- **トークンの種類**: キー、オペレーター、値の組み合わせ、または単純な文字列
- **入力補完**: 設定された候補から選択できる自動補完機能
- **トークン編集**: 既存のトークンをクリックして編集可能
- **日付入力**: 日付選択用のDatePicker対応
- **数値入力**: 数値専用の入力フィールド
- **タグオブジェクト**: アイコン付きの複合オブジェクトに対応

## 使用方法

1. \`availableTokens\` プロパティで利用可能なトークン定義を設定
2. \`v-model\` でトークンの配列をバインド
        `,
      },
    },
  },
} satisfies Meta<typeof ElTextQueryInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルトークン定義
const sampleAvailableTokens = [
  {
    type: 'user',
    icon: 'User',
    title: 'User',
    tags: ['alpha', 'beta', 'gamma', 'john', 'jane', 'mike'],
    operators: ['='], // MEMO: 1つの場合operatorの入力がないタイプ
  },
  {
    type: 'user_ope',
    icon: 'User',
    title: 'User',
    tags: ['alpha', 'beta', 'gamma', 'john', 'jane', 'mike'],
    operators: ['=', '!=', '%like%', 'like%', '%like'],
  },
  {
    type: 'tag',
    // icon: 'CollectionTag',
    title: '🔖Tag (Category) ',
    tags: ['🏀Spots', '📰News', '💻Technology', '🎥Entertainment', '👨‍🔬Science'],
    operators: ['=', '!=', '%like%', 'like%', '%like'],
  },
  {
    type: 'tag-fw',
    // icon: 'CollectionTag',
    title: '🔖Tag (Framework) ',
    tags: ['Laravel','Vue.js','React'],
    operators: ['='], // MEMO: 1つの場合operatorの入力がないタイプ
  },
  {
    type: 'date',
    icon: 'Calendar',
    title: 'Date',
    tags: 'DatePicker',
    tagsComponentOptions: { // @see [DatePicker options](https://element-plus.org/en-US/component/date-picker)
      placeholder: 'Enter date',
    },
    operators: ['>=', '<=', '='],
  },
  {
    type: 'date_range',
    icon: 'Calendar',
    title: 'Date (From,To)',
    tags: 'DatePicker',
    tagsComponentOptions: { // @see [DatePicker options](https://element-plus.org/en-US/component/date-picker)
      type: "daterange"
    },
    operators: [':'],
  },
  {
    type: 'likes',
    // icon: 'StarFilled',
    title: '♥️Likes',
    tags: 'InputNumber',
    tagsComponentOptions: { // @see [Input options](https://element-plus.org/en-US/component/input.html#input)
      min: 0,
    },
    operators: ['>=', '<=', '='],
  },
  {
    type: 'object',
    icon: 'Setting',
    title: 'Object',
    tagOptions: { // [ElTagのオプション](https://element-plus.org/en-US/component/tag)
      effect: 'light', // dark|light*|plain
      type: 'success', // primary*|success|info|warning|danger (青|緑|灰|黄|赤)
      // color: 'yellow', // background color
      // size: 'large', // large|default|small
    },
    tags: [
      { id: 1, name: 'ObjectA(id:1)', icon: 'Location' },
      { id: 2, name: 'ObjectB(id:2)', icon: 'Coordinate' },
      { id: 3, name: 'ObjectC(id:3)', icon: 'Guide' },
    ],
    operators: ['=', '!=', '%like%', 'like%', '%like'],
  },
  {
    type: 'status',
    icon: 'CircleCheck',
    title: 'Status',
    tags: [
      { id: 'active', name: '有効', icon: 'Select' },
      { id: 'pending', name: '保留中', icon: 'Loading' },
      { id: 'inactive', name: '無効', icon: 'Close' },
    ],
    operators: ['=', '!='],
  },
];

// 各ストーリーの説明文
const descriptions = {
  default: `
### 基本的な使用例

空の状態から始まるデフォルトの入力フィールドです。\`availableTokens\`プロパティにより、利用可能なトークンタイプが定義されています。
  `,
  withTokens: `
### 初期トークン付き

\`modelValue\`に初期値を設定した例です。ユーザー、フレームワーク、日付の条件が初期表示されています。
  `,
  withStringTokens: `
### 文字列タイプのトークン

\`string\`タイプのトークンは、キー・オペレーター・値の構造を持たない単純な文字列検索条件として扱われます。
  `,
  objectTags: `
### オブジェクトタイプのタグ

タグがオブジェクト形式の場合、\`id\`が値として保存され、\`name\`が表示されます。また、\`icon\`プロパティがあればアイコンも表示されます。
  `,
  submitEvent: `
### 検索実行イベント

\`submit\`イベントをリッスンして検索実行アクションを設定できます。ボタンクリックで検索イベントが発行されます。
  `,
  fullExample: `
### 総合例

複数のタイプのトークンを組み合わせた例です。文字列、キー・オペレーター・値の構造、日付、数値、オブジェクトなど様々なタイプが混在しています。
  `,
  disabled: `
### 無効状態

\`disabled\`プロパティがtrueの場合、入力と編集が無効化されます。
  `,
  customPlaceholder: `
### カスタムプレースホルダー

\`inputPlaceholder\`プロパティで入力フィールドのプレースホルダーテキストをカスタマイズできます。
  `,
};

export const Default: Story = {
  args: {
    modelValue: [],
    availableTokens: sampleAvailableTokens,
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.default,
      },
    },
  },
  render: (args) => ({
    components: { ElTextQueryInput },
    setup() {
      const tokens = ref(args.modelValue);
      return { tokens, args };
    },
    template: `
      <ElTextQueryInput
        v-model="tokens"
        :available-tokens="args.availableTokens"
        :disabled="args.disabled"
        :input-placeholder="args.inputPlaceholder"
      />
      <div class="mt-4">
        <p class="text-sm text-gray-500">入力したトークン:</p>
        <pre class="bg-gray-100 p-2 rounded mt-1 text-xs">{{ tokens }}</pre>
      </div>
    `,
  }),
};

export const WithTokens: Story = {
  args: {
    modelValue: [
      { type: 'user', value: { data: 'alpha', operator: '=' } },
      { type: 'tag-fw', value: { data: 'Vue.js', operator: '=' } },
      { type: 'date', value: { data: '2023-01-01', operator: '>' } },
    ],
    availableTokens: sampleAvailableTokens,
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.withTokens,
      },
    },
  },
  render: (args) => ({
    components: { ElTextQueryInput },
    setup() {
      const tokens = ref(args.modelValue);
      return { tokens, args };
    },
    template: `
      <ElTextQueryInput
        v-model="tokens"
        :available-tokens="args.availableTokens"
        :disabled="args.disabled"
        :input-placeholder="args.inputPlaceholder"
      />
      <div class="mt-4">
        <p class="text-sm text-gray-500">トークンの値:</p>
        <pre class="bg-gray-100 p-2 rounded mt-1 text-xs">{{ tokens }}</pre>
      </div>
    `,
  }),
};

export const WithStringTokens: Story = {
  args: {
    modelValue: [
      { type: 'string', value: { data: '自由テキスト検索', operator: '' } },
      { type: 'user', value: { data: 'alpha', operator: '=' } },
    ],
    availableTokens: sampleAvailableTokens,
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.withStringTokens,
      },
    },
  },
  render: (args) => ({
    components: { ElTextQueryInput },
    setup() {
      const tokens = ref(args.modelValue);
      return { tokens, args };
    },
    template: `
      <ElTextQueryInput
        v-model="tokens"
        :available-tokens="args.availableTokens"
        :disabled="args.disabled"
        :input-placeholder="args.inputPlaceholder"
      />
      <div class="mt-4">
        <p class="text-sm text-gray-500">トークンの値:</p>
        <pre class="bg-gray-100 p-2 rounded mt-1 text-xs">{{ tokens }}</pre>
      </div>
    `,
  }),
};

export const ObjectTags: Story = {
  args: {
    modelValue: [
      { type: 'object', value: { data: 1, operator: '=' } },
      { type: 'status', value: { data: 'active', operator: '=' } },
    ],
    availableTokens: sampleAvailableTokens,
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.objectTags,
      },
    },
  },
  render: (args) => ({
    components: { ElTextQueryInput },
    setup() {
      const tokens = ref(args.modelValue);
      return { tokens, args };
    },
    template: `
      <ElTextQueryInput
        v-model="tokens"
        :available-tokens="args.availableTokens"
        :disabled="args.disabled"
        :input-placeholder="args.inputPlaceholder"
      />
      <div class="mt-4">
        <p class="text-sm text-gray-500">トークンの値:</p>
        <pre class="bg-gray-100 p-2 rounded mt-1 text-xs">{{ tokens }}</pre>
      </div>
    `,
  }),
};

export const FullExample: Story = {
  args: {
    modelValue: [
      { type: 'string', value: { data: 'キーワード検索', operator: '' } },
      { type: 'user', value: { data: 'john', operator: '=' } },
      { type: 'date', value: { data: '2023-04-01', operator: '>' } },
      { type: 'number', value: { data: 100, operator: '>' } },
      { type: 'status', value: { data: 'active', operator: '=' } },
      { type: 'tag', value: { data: '🏀スポーツ', operator: '%like%' } },
    ],
    availableTokens: sampleAvailableTokens,
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.fullExample,
      },
    },
  },
  render: (args) => ({
    components: { ElTextQueryInput },
    setup() {
      const tokens = ref(args.modelValue);
      return { tokens, args };
    },
    template: `
      <ElTextQueryInput
        v-model="tokens"
        :available-tokens="args.availableTokens"
        :disabled="args.disabled"
        :input-placeholder="args.inputPlaceholder"
      />
      <div class="mt-4">
        <p class="text-sm text-gray-500">トークンの値:</p>
        <pre class="bg-gray-100 p-2 rounded mt-1 text-xs">{{ tokens }}</pre>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    modelValue: [
      { type: 'user', value: { data: 'alpha', operator: '=' } },
      { type: 'tag-fw', value: { data: 'Vue.js', operator: '=' } },
    ],
    availableTokens: sampleAvailableTokens,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.disabled,
      },
    },
  },
  render: (args) => ({
    components: { ElTextQueryInput },
    setup() {
      const tokens = ref(args.modelValue);
      return { tokens, args };
    },
    template: `
      <ElTextQueryInput
        v-model="tokens"
        :available-tokens="args.availableTokens"
        :disabled="args.disabled"
        :input-placeholder="args.inputPlaceholder"
      />
    `,
  }),
};

export const CustomPlaceholder: Story = {
  args: {
    modelValue: [],
    availableTokens: sampleAvailableTokens,
    inputPlaceholder: '検索条件を入力...',
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.customPlaceholder,
      },
    },
  },
  render: (args) => ({
    components: { ElTextQueryInput },
    setup() {
      const tokens = ref(args.modelValue);
      return { tokens, args };
    },
    template: `
      <ElTextQueryInput
        v-model="tokens"
        :available-tokens="args.availableTokens"
        :disabled="args.disabled"
        :input-placeholder="args.inputPlaceholder"
      />
    `,
  }),
};
