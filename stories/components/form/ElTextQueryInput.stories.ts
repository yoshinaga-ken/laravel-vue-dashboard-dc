import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { fn, expect } from 'storybook/test';
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
    appendValueSuggestTypesToKey: { control: 'object' },
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
    tags: ['Laravel', 'Vue.js', 'React'],
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
    tags: 'Input',
    tagsComponentOptions: { // @see [Input options](https://element-plus.org/en-US/component/input.html#input)
      min: 0,
      type: 'number', // @see [html input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
    },
    operators: ['>=', '<=', '='],
  },
  {
    type: 'week',
    title: 'Week',
    tags: 'Input',
    tagsComponentOptions: { // @see [Input options](https://element-plus.org/en-US/component/input.html#input)
      type: 'week', // @see [html input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
    },
    operators: ['='],
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

// トークン表示用の共通関数
function renderTokenDisplay() {
  return `
    <div class="mt-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">トークンの値:</p>
      <pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 text-xs text-gray-800 dark:text-gray-200">{{ tokens }}</pre>
    </div>
  `;
}

// 各ストーリーの説明文
const descriptions = {
  default: `
### 基本的な使用例

空の状態から始まるデフォルトの入力フィールド���す。\`availableTokens\`プロパティにより、利用可能なトークンタイプが定義されています。
  `,
  withTokens: `
### 初期トークン例

\`modelValue\`に初期値を設定した例です。ユーザー、フレームワーク、日付の条��が初期表示されています。
  `,
  withStringTokens: `
### 文字列タイプのトークン

\`string\`タイプのトークンは、キー・オペレータ���・値の構造を持たない単純な文字列検索条件として扱われます。
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
  appendValueSuggestTypesToKey: `
### キーサジェストに値サジェストを追加

\`appendValueSuggestTypesToKey\`プロパティを使うと、キー入力時のサジェスト一覧に、指定したタイプの値サジェストも追加表示されます。
これにより、ユーザーは一度のサジェスト表示で、キーと頻繁に使われる値の両方から選択できます。

例えば、\`['user', 'tag-fw']\`と指定すると、通常のキーサジェストに加えて、UserとTag(Framework)の値が追加表示されます。
値サジェストを選択した場合、\`string\`タイプのトークンとして直接追加されます。
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
      ${renderTokenDisplay()}
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
    availableTokens: sampleAvailableTokens as any,
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
      ${renderTokenDisplay()}
    `,
  }),
};

export const WithStringTokens: Story = {
  args: {
    modelValue: [
      { type: 'string', value: { data: '自由テキスト検索', operator: '' } },
      { type: 'user', value: { data: 'alpha', operator: '=' } },
    ],
    availableTokens: sampleAvailableTokens as any,
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
      ${renderTokenDisplay()}
    `,
  }),
};

export const ObjectTags: Story = {
  args: {
    modelValue: [
      { type: 'object', value: { data: 1, operator: '=' } },
      { type: 'status', value: { data: 'active', operator: '=' } },
    ],
    availableTokens: sampleAvailableTokens as any,
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
      ${renderTokenDisplay()}
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
    availableTokens: sampleAvailableTokens as any,
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
      ${renderTokenDisplay()}
    `,
  }),
};

export const Disabled: Story = {
  args: {
    modelValue: [
      { type: 'user', value: { data: 'alpha', operator: '=' } },
      { type: 'tag-fw', value: { data: 'Vue.js', operator: '=' } },
    ],
    availableTokens: sampleAvailableTokens as any,
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
    availableTokens: sampleAvailableTokens as any,
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

export const AppendValueSuggestTypesToKey: Story = {
  args: {
    modelValue: [],
    availableTokens: sampleAvailableTokens as any,
    appendValueSuggestTypesToKey: ['user', 'tag-fw'],
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.appendValueSuggestTypesToKey,
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
      <div class="mb-4">
        <p class="text-sm text-gray-500">機能説明:</p>
        <ul class="list-disc pl-5 text-sm">
          <li>
            キー入力時のサジェストに、UserとTag(Framework)の値も含まれるようになっています。
          </li>
          <li>
            例えば「Vue.js」や「alpha」などの値をサジェストから選択すると、
            <code>string</code>タイプのトークンとして直接追加されます。
          </li>
          <li>
            この機能は、頻繁に検索される値をショートカットとして提供する場合に便利です。
          </li>
        </ul>
      </div>
      <ElTextQueryInput
        v-model="tokens"
        :available-tokens="args.availableTokens"
        :disabled="args.disabled"
        :input-placeholder="args.inputPlaceholder"
        :append-value-suggest-types-to-key="args.appendValueSuggestTypesToKey"
      />
      ${renderTokenDisplay()}
    `,
  }),
};

/**
 * InteractionTest - E2EテストのInteractionTestをStorybookのplay関数として実装
 * 複数のトークンタイプの追加、編集、削除機能を自動的にテストします
 */
export const InteractionTest: Story = {
  args: {
    modelValue: [],
    availableTokens: sampleAvailableTokens as any,
  },
  parameters: {
    docs: {
      description: {
        story: `
### InteractionTest - 自動操作テスト

このストーリーは、E2EテストのInteractionTestをStorybookのplay関数として実装したものです。
以下の操作を自動的に実行し、コンポーネントの動作を検証します：

1. **User フィルターの追加** - Userキーを選択し、alphaを値として設定
2. **Tag(Category) フィルターの追加** - Tag(Category)キーを選択し、オペレーター!=を選択し、🎥Entertainmentを値として設定
3. **文字列フィルターの直接入力** - "検索キーワード"を直接入力してstringトークンとして追加
4. **トークンの×ボタンによる削除** - 追加したトークンを削除ボタンで削除
5. **Date (From,To) フィルターのテスト** - 日付範囲フィルターの追加
6. **Likes 数値フィルターのテスト** - 数値入力フィルターの追加
7. **トークンの編集モード** - 既存トークンの編集機能
8. **バックスペースキーによる削除** - キーボード操作による削除

このテストは自動実行され、各ステップでコンポーネントの状態を検証します。
        `,
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
      <div>
        <div class="mb-4">
          <p class="text-sm text-gray-500">InteractionTest実行結果:</p>
          <p class="text-xs text-gray-400">下記のコンポーネントで自動操作テストが実行されます</p>
        </div>
        <ElTextQueryInput
          v-model="tokens"
          :available-tokens="args.availableTokens"
          :disabled="args.disabled"
          :input-placeholder="args.inputPlaceholder"
        />
        ${renderTokenDisplay()}
      </div>
    `,
  }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    console.log('🤖InteractionTest Start');

// ===== 定数セクション =====
/**
 * タイムアウト用の定数
 * SHORT: 短い待機時間（キー入力後など） - 300ms is chosen to balance responsiveness and stability.
 * MEDIUM: 中程度の待機時間（アクション完了後など） - 350ms allows for slightly longer operations to complete.
 */
const TIMEOUT = {
  SHORT: 300,
  MEDIUM: 350,
};

    // ===== 実行制御設定 =====
    const runsIndex = 0;
    const runs = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 順番に全て処理する場合
      [6, 7], // Date系のみをやる場合
    ];
    const currentRun = runs[runsIndex];
    let executionCount = 0; // 実行回数カウンター

    // ===== ヘルパー関数群 =====

    /**
     * トークンの現在の状態をログ出力する関数
     * @param message - ログメッセージ
     */
    const logTokenState = (message: string) => {
      console.log(`${message}:`, canvasElement.querySelector('pre')?.textContent);
    };

    /**
     * トークンの状態を検証する関数
     * @param expectedTokens - 期待されるトークン配列
     */
    const verifyTokenState = (expectedTokens: any[]) => {
      expect(canvasElement.querySelector('pre')?.textContent).toBe(JSON.stringify(expectedTokens, null, 2));
    };

    /**
     * Key-Operator-Value形式のフィルターを追加する汎用関数（aria-labelベース）
     * @param keyType - キーのタイプ（例: "user", "tag", "date"）
     * @param operatorValue - 選択するオペレーター値（例: "!=", "=", ">="）
     * @param valueText - 入力する値テキスト（例: "🎥Entertainment", "alpha"）
     * @param isType
     */
    const addKeyOperatorValueFilter = async (
      keyType: string,
      operatorValue: string,
      valueText: string,
      isType: boolean = true
    ) => {
      // ステップ1: キー入力フィールドをクリックしてキー選択
      const keyInput = canvas.queryByLabelText('input-key');
      if (keyInput) {
        await userEvent.click(keyInput);
        await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));

        // キーサジェストをaria-labelで選択
        const keySuggestion = canvas.getByLabelText(`key-type-${keyType}`);
        await userEvent.click(keySuggestion);
        await new Promise(resolve => setTimeout(resolve, TIMEOUT.MEDIUM));
      }

      // ステップ2: オペレーター選択
      if (operatorValue) {
        const operatorInput = canvas.queryByLabelText('input-operator')
        if (operatorInput !== null) {
          // オペレーターをタイピングして選択
          await userEvent.clear(operatorInput);
          await userEvent.type(operatorInput, operatorValue);
          await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));
          await userEvent.keyboard('{Enter}');
          await new Promise(resolve => setTimeout(resolve, TIMEOUT.MEDIUM));
        }
      }

      // ステップ3: 値入力
      if (valueText) {
        const valueInputs = canvas.queryAllByLabelText('input-value');
        if (valueInputs.length) {
          const values = valueText.split(',');
          for (let index = 0; index < values.length; index++) {
            const text = values[index];
            const valueInput = valueInputs[index];
            userEvent.click(valueInput);
            if (isType) {
              await userEvent.clear(valueInput)
              await userEvent.type(valueInput, text);
            } else {
              // Date (From,To)の場合このようにしないと値が設定されない対応
              if (valueInputs.length > 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
                valueInput.value = '';
                await userEvent.type(valueInput, text);
              } else {
                valueInput.value = text
              }
            }
            await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));
          }
          await userEvent.keyboard('{Enter}');
          await new Promise(resolve => setTimeout(resolve, TIMEOUT.MEDIUM));
        }
      }
    };

    /**
     * 文字列フィルターを直接追加する汎用関数
     * @param text - 追加する文字列テキスト
     */
    const addStringFilter = async (text: string) => {
      // キー入力フィールドに直接文字列を入力
      const stringInput = canvas.queryByLabelText('input-key');
      if (stringInput === null) return;
      await userEvent.click(stringInput);
      await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));

      await userEvent.type(stringInput, text);
      await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));
      await userEvent.keyboard('{Enter}');
      await new Promise(resolve => setTimeout(resolve, TIMEOUT.MEDIUM));
    };

    /**
     * トークンの×ボタンをクリックしてフィルタを削除する汎用関数
     * @param tagValue - 削除対象のタグの値（aria-labelで特定）
     */
    const deleteFilter = async (tagValue: string) => {
      const tagElement = canvas.queryByLabelText(`tag-value-${tagValue}`);
      if (tagElement) {
        const closeButton = tagElement.querySelector('.el-tag__close');
        if (closeButton) {
          await userEvent.click(closeButton);
          await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));
        }
      }
    };

    /**
     * トークンを編集する汎用関数
     * @param tagValue - 編集対象のタグの値（aria-labelで特定）
     * @param newValue - 新しい値
     */
    const editToken = async (tagValue: string, newValue: string) => {
      const tag = canvas.queryByLabelText(`tag-value-${tagValue}`);
      if (tag) {
        await userEvent.click(tag);
        const input = canvas.queryByLabelText('input-value');
        if (input) {
          await userEvent.clear(input);
          await userEvent.type(input, newValue);
          await userEvent.keyboard('{Enter}');
          await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));
        }
      }
    };

    // ===== ステップ定義関数群 =====
    const stepFunctions = {
      1: async () => {
        await addKeyOperatorValueFilter('user', null, `alpha-${executionCount}`);
        logTokenState('Step:1 : User フィルターの追加');
      },
      2: async () => {
        await addKeyOperatorValueFilter('tag', '!=', '🎥Entertainment');
        logTokenState('Step:2 : Tag(Category) フィルターの追加');
      },
      3: async () => {
        await addStringFilter(`あ12-${executionCount}`);
        logTokenState('Step:3 : 文字列フィルターの直接入力');
      },
      4: async () => {
        const keyInput = canvas.getByLabelText('input-key');
        await userEvent.click(keyInput);
        await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));
        await userEvent.keyboard('{Backspace}{Backspace}{Backspace}{Backspace}');
        await new Promise(resolve => setTimeout(resolve, TIMEOUT.MEDIUM));
        logTokenState('Step:4 : バックスペースキーによる削除テスト');
      },
      5: async () => {
        await editToken('alpha-1', `🐔beta-${executionCount}`);
        logTokenState('Step:5 : トークンの編集モードテスト');
      },
      6: async () => {
        await addKeyOperatorValueFilter('date', '>=', '2025-04-02', false);
        logTokenState('Step:6 : Date フィルターの追加');
      },
      7: async () => {
        const dateFromTo = '2025-03-10,2025-04-10';
        await addKeyOperatorValueFilter('date_range', null, dateFromTo, false);
        logTokenState('Step:7 : Date (From,To) フィルターの追加');
      },
      8: async () => {
        const expectedTokens =
          [
            {
              "type": "tag",
              "value": {
                "data": "🎥Entertainment",
                "operator": "!="
              }
            },
            {
              "type": "user",
              "value": {
                "data": "🐔beta-5",
                "operator": "="
              }
            },
            {
              "type": "date",
              "value": {
                "data": "2025-04-02",
                "operator": ">="
              }
            },
            {
              "type": "date_range",
              "value": {
                "data": '2025-03-10,2025-04-10',
                "operator": ":"
              }
            }
          ];
        verifyTokenState(expectedTokens);
        logTokenState('Step:8 : トークンの状態を検証');
      },
      9: async () => {
        await deleteFilter('🎥Entertainment');
        await deleteFilter('2025-04-02');
        logTokenState('Step:9 : トークンの×ボタンによる削除');
      },
      10: async () => {
        await addKeyOperatorValueFilter('likes', '>=', `${100 + executionCount * 10}`);
        logTokenState('Step:10 : Likes 数値フィルターの追加');
      },
      11: async () => {
        const expectedTokens = [
          {
            "type": "user",
            "value": {
              "data": "🐔beta-5",
              "operator": "="
            }
          },
          {
            "type": "date_range",
            "value": {
              "data": "2025-03-10,2025-04-10",
              "operator": ":"
            }
          },
          {
            "type": "likes",
            "value": {
              "data": "200",
              "operator": ">="
            }
          }
        ]
        verifyTokenState(expectedTokens);
        logTokenState('Step:11 : トークンの状態を検証');
      },
      12: async () => {
        const clearButton = canvas.getByLabelText('input-clear');
        await userEvent.click(clearButton);
        await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));

        const expectedTokens = [];
        verifyTokenState(expectedTokens);
        logTokenState('Step:12 : 全削除');
      },
    };
    // ===== メイン実行ループ =====
    console.log(`📋 実行パターン:`, currentRun);

    for (const stepNumber of currentRun) {
      executionCount++;

      if (stepFunctions[stepNumber]) {
        try {
          await stepFunctions[stepNumber]();
          await new Promise(resolve => setTimeout(resolve, TIMEOUT.MEDIUM));
        } catch (error) {
          console.error(`❌ Error in Step ${stepNumber}:`, error);
          throw error;
        }
      } else {
        console.warn(`⚠️ Step ${stepNumber} is not defined`);
      }
    }

    console.log('🎉 InteractionTest completed successfully!');
    console.log(`📋 実行パターン:`, currentRun);
  },
};

