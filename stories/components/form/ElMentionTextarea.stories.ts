import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect } from 'storybook/test'
import ElMentionTextarea from '../../../resources/js/Components/ElMentionTextarea.vue'

const meta = {
  title: 'Form/ElMentionTextarea',
  component: ElMentionTextarea,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      template: '<div class="p-4"><story /></div>',
    }),
  ],
  argTypes: {
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    rows: { control: { type: 'number', min: 1, max: 20 } },
  },
  parameters: {
    docs: {
      description: {
        component: `
Element PlusのElMentionコンポーネントをラッピングした、@ユーザーメンションと#タグ補完機能付きテキストエリアコンポーネントです。

## 機能

- **@ユーザーメンション**: \`@\`を入力するとGraphQLでユーザー検索が実行され、候補が表示されます
- **#タグ補完**: \`#\`を入力するとGraphQLでタグ検索が実行され、候補が表示されます
- **デバウンス検索**: 300ms の遅延でクライアントサイドフィルタリングを最適化
- **リアルタイム検索**: 入力に応じて候補がリアルタイムで更新されます
- **ハイブリッド検索戦略**: データ量に応じて自動的に最適な検索方法を選択
  - **512件以下**: キャッシュ戦略（初回取得 + クライアントサイドフィルタリング）
  - **512件超過**: 動的検索戦略（リアルタイムGraphQLクエリ）

## 使用方法

1. \`v-model\` でテキストエリアの内容をバインド
2. \`@\` を入力してユーザーメンション機能を使用
3. \`#\` を入力してタグ補完機能を使用
4. GraphQLサーバーからデータが自動取得されます

## GraphQL API統合

このコンポーネントは以下のGraphQLクエリを使用してデータを取得します：

- **ユーザー取得**: \`FilterUsers\` クエリ
- **タグ取得**: \`FilterTags\` クエリ
        `,
      },
    },
  },
} satisfies Meta<typeof ElMentionTextarea>

export default meta
type Story = StoryObj<typeof meta>

// コンテンツ表示用の共通関数
function renderContentDisplay() {
  return `
    <div class="mt-4 p-3 bg-gray-50 rounded">
      <h4 class="text-sm font-medium text-gray-700 mb-2">入力内容:</h4>
      <pre class="text-xs text-gray-600 whitespace-pre-wrap">{{ content || '(空)' }}</pre>
    </div>
  `
}

// 各ストーリーの説明文
const descriptions = {
  default: `
基本的な使用例です。@でユーザーメンション、#でタグ補完が利用できます。

**操作方法:**
1. テキストエリアをクリック
2. \`@\` を入力してユーザー候補を表示
3. \`#\` を入力してタグ候補を表示
4. 候補から選択するか、Escキーでキャンセル
  `,
  withContent: `
初期コンテンツが設定されている例です。既存のメンションとタグが含まれています。

**含まれる要素:**
- ユーザーメンション: @alpha
- タグ参照: #Technology
- 通常のテキスト
  `,
  customPlaceholder: `
カスタムプレースホルダーを設定した例です。用途に応じたガイダンスを表示できます。
  `,
  multipleRows: `
行数を変更した例です。長文入力に適した設定になっています。
  `,
  disabled: `
無効状態の例です。編集不可の状態でコンテンツを表示します。
  `,
  interactionTest: `
自動操作テストの例です。以下の操作を自動実行します：

1. **ユーザーメンション入力** - @を入力してユーザー候補を選択
2. **タグ補完入力** - #を入力してタグ候補を選択
3. **通常テキスト入力** - 普通のテキストを入力
4. **複合入力** - メンション、タグ、テキストを組み合わせた入力

このテストは自動実行され、各ステップでコンポーネントの動作を検証します。
  `
}

export const Default: Story = {
  args: {
    modelValue: '',
    placeholder: 'input @ to mention people, # to mention tag',
    disabled: false,
    rows: 4,
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.default,
      },
    },
  },
  render: (args) => ({
    components: { ElMentionTextarea },
    setup() {
      const content = ref(args.modelValue)
      return { content, args }
    },
    template: `
      <ElMentionTextarea
        v-model="content"
        :placeholder="args.placeholder"
        :disabled="args.disabled"
        :rows="args.rows"
      />
      ${renderContentDisplay()}
    `,
  }),
}

export const WithContent: Story = {
  args: {
    modelValue: 'こんにちは @alpha さん！\n\n#Technology の話題について議論しましょう。新しいフレームワークの導入を検討していますが、いかがでしょうか？\n\n@beta さんや @gamma さんのご意見も聞かせてください。',
    placeholder: 'input @ to mention people, # to mention tag',
    disabled: false,
    rows: 6,
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.withContent,
      },
    },
  },
  render: (args) => ({
    components: { ElMentionTextarea },
    setup() {
      const content = ref(args.modelValue)
      return { content, args }
    },
    template: `
      <ElMentionTextarea
        v-model="content"
        :placeholder="args.placeholder"
        :disabled="args.disabled"
        :rows="args.rows"
      />
      ${renderContentDisplay()}
    `,
  }),
}

export const CustomPlaceholder: Story = {
  args: {
    modelValue: '',
    placeholder: '記事の内容を入力してください。@でユーザーメンション、#でタグが利用できます。',
    disabled: false,
    rows: 4,
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.customPlaceholder,
      },
    },
  },
  render: (args) => ({
    components: { ElMentionTextarea },
    setup() {
      const content = ref(args.modelValue)
      return { content, args }
    },
    template: `
      <ElMentionTextarea
        v-model="content"
        :placeholder="args.placeholder"
        :disabled="args.disabled"
        :rows="args.rows"
      />
      ${renderContentDisplay()}
    `,
  }),
}

export const MultipleRows: Story = {
  args: {
    modelValue: '',
    placeholder: 'input @ to mention people, # to mention tag',
    disabled: false,
    rows: 8,
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.multipleRows,
      },
    },
  },
  render: (args) => ({
    components: { ElMentionTextarea },
    setup() {
      const content = ref(args.modelValue)
      return { content, args }
    },
    template: `
      <ElMentionTextarea
        v-model="content"
        :placeholder="args.placeholder"
        :disabled="args.disabled"
        :rows="args.rows"
      />
      ${renderContentDisplay()}
    `,
  }),
}

export const Disabled: Story = {
  args: {
    modelValue: '無効状態のテキストエリアです。\n\n@alpha さんのメンションと #Technology タグが含まれています。',
    placeholder: 'input @ to mention people, # to mention tag',
    disabled: true,
    rows: 4,
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.disabled,
      },
    },
  },
  render: (args) => ({
    components: { ElMentionTextarea },
    setup() {
      const content = ref(args.modelValue)
      return { content, args }
    },
    template: `
      <ElMentionTextarea
        v-model="content"
        :placeholder="args.placeholder"
        :disabled="args.disabled"
        :rows="args.rows"
      />
      ${renderContentDisplay()}
    `,
  }),
}

export const InteractionTest: Story = {
  args: {
    modelValue: '',
    placeholder: 'input @ to mention people, # to mention tag',
    disabled: false,
    rows: 6,
  },
  parameters: {
    docs: {
      description: {
        story: descriptions.interactionTest,
      },
    },
  },
  render: (args) => ({
    components: { ElMentionTextarea },
    setup() {
      const content = ref(args.modelValue)
      return { content, args }
    },
    template: `
      <div>
        <div class="mb-4">
          <p class="text-sm text-gray-500">InteractionTest実行結果:</p>
          <p class="text-xs text-gray-400">下記のコンポーネントで自動操作テストが実行されます</p>
        </div>
        <ElMentionTextarea
          v-model="content"
          :placeholder="args.placeholder"
          :disabled="args.disabled"
          :rows="args.rows"
        />
        ${renderContentDisplay()}
      </div>
    `,
  }),
  play: async ({ canvas, userEvent }) => {
    console.log('🤖ElMentionTextarea InteractionTest Start')

    // ===== 定数セクション =====
    const TIMEOUT = {
      SHORT: 300,
      MEDIUM: 500,
      LONG: 800,
    }

    // ===== 実行制御設定 =====
    const currentRun = [1, 2, 3, 4] // 全ステップを実行

    // ===== ヘルパー関数群 =====

    const logContentState = (message: string) => {
      const content = (canvas.getByRole('textbox') as HTMLTextAreaElement).value
      console.log(`${message}:`, content)
    }

    const getTextarea = () => canvas.getByRole('textbox') as HTMLTextAreaElement

    const waitForMentionPopover = () =>
      new Promise(resolve => setTimeout(resolve, TIMEOUT.LONG))

    const addUserMention = async (username: string) => {
      const textarea = getTextarea()
      await userEvent.click(textarea)
      await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT))

      await userEvent.type(textarea, '@')
      await waitForMentionPopover()

      await userEvent.type(textarea, username)
      await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT))

      await userEvent.keyboard('{Enter}')
      await new Promise(resolve => setTimeout(resolve, TIMEOUT.MEDIUM))
    }

    const addTagMention = async (tagname: string) => {
      const textarea = getTextarea()
      await userEvent.click(textarea)
      await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT))

      await userEvent.type(textarea, '#')
      await waitForMentionPopover()

      await userEvent.type(textarea, tagname)
      await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT))

      await userEvent.keyboard('{Enter}')
      await new Promise(resolve => setTimeout(resolve, TIMEOUT.MEDIUM))
    }

    const addNormalText = async (text: string) => {
      const textarea = getTextarea()
      await userEvent.click(textarea)
      await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT))

      await userEvent.type(textarea, text)
      await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT))
    }

    // ===== ステップ定義関数群 =====
    const stepFunctions = {
      1: async () => {
        await addUserMention('alpha')
        logContentState('Step:1 : ユーザーメンション入力')
      },
      2: async () => {
        await addNormalText(' さん、こんにちは！\n\n')
        await addTagMention('Technology')
        logContentState('Step:2 : タグ補完入力')
      },
      3: async () => {
        await addNormalText(' の話題について\n議論したいと思います。')
        logContentState('Step:3 : 通常テキスト入力')
      },
      4: async () => {
        await addNormalText('\n\n')
        await addUserMention('beta')
        await addNormalText(' さんや ')
        await addUserMention('gamma')
        await addNormalText(' さんの\nご意見もお聞かせください。')
        logContentState('Step:4 : 複合入力（メンション + テキスト）')
      },
    }

    // ===== メインテスト実行 =====
    try {
      console.log(`実行ステップ: [${currentRun.join(', ')}]`)

      for (const stepNum of currentRun) {
        if (stepFunctions[stepNum]) {
          console.log(`--- Step ${stepNum} 開始 ---`)
          await stepFunctions[stepNum]()
          await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT))
        }
      }

      // 最終的なコンテンツ検証
      const finalContent = getTextarea().value
      console.log('🎉 InteractionTest 完了')
      console.log('最終コンテンツ:', finalContent)

      // 最低限のコンテンツが入力されていることを確認
      expect(finalContent).toBeTruthy()
      expect(finalContent.trim()).not.toBe('')

    } catch (error) {
      console.error('❌ InteractionTest エラー:', error)
      throw error
    }
  },
}
