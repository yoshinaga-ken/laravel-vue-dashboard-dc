import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { fn, expect, userEvent } from 'storybook/test';
import UserArticlesList from '@/Components/Users/UserArticlesList.vue';

const meta = {
  title: 'Users/UserArticlesList',
  component: UserArticlesList,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      template: '<div class="p-4 max-w-2xl"><story /></div>',
    }),
  ],
  argTypes: {
    articlesCount: { control: 'number' },
    articles: { control: 'object' },
    loading: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
ユーザーの投稿記事一覧を表示するコンポーネントです。

## 機能

- **記事統計表示**: 投稿記事数の視覚的表示
- **記事一覧**: タイトル・本文抜粋・タグ付きカード表示
- **インタラクション**: 記事クリック・タグクリック・全記事表示
- **テキスト切り詰め**: 長い本文の適切な表示
- **レスポンシブ対応**: カードレイアウトの調整

## 使用方法

記事データをpropsとして渡すことで一覧表示します。各種イベントをemitします。
        `,
      },
    },
  },
} satisfies Meta<typeof UserArticlesList>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプル記事データ
const sampleArticles = [
  {
    id: "1",
    title: "Vue.js 3の新機能について",
    body: "Vue.js 3では多くの新機能が追加されました。Composition APIやTeleport、Fragment support、Multiple v-modelなどがあります。これらの機能により、より柔軟で保守性の高いアプリケーションを構築できるようになりました。",
    tags: [
      { id: "1", name: "Vue.js" },
      { id: "2", name: "JavaScript" },
      { id: "3", name: "Frontend" }
    ]
  },
  {
    id: "2",
    title: "TypeScriptの型安全性",
    body: "TypeScriptを使用することで、JavaScript開発における型安全性を向上させることができます。コンパイル時のエラー検出、優れた IDE サポート、リファクタリングの容易さなどのメリットがあります。",
    tags: [
      { id: "4", name: "TypeScript" },
      { id: "5", name: "JavaScript" }
    ]
  }
];

const longArticles = Array.from({ length: 5 }, (_, i) => ({
  id: `${i + 1}`,
  title: `記事タイトル ${i + 1} - これは長いタイトルのテストです`,
  body: `これは記事 ${i + 1} の本文です。`.repeat(10) + ` 非常に長い本文のテストを行っています。テキストの切り詰め機能が正しく動作することを確認するために、意図的に長い文章を作成しています。`,
  tags: [
    { id: `${i * 2 + 1}`, name: `タグ${i + 1}` },
    { id: `${i * 2 + 2}`, name: `カテゴリ${i + 1}` }
  ]
}));

export const Default: Story = {
  args: {
    articlesCount: 2,
    articles: sampleArticles,
    loading: false,
    'onArticle-click': fn(),
    'onTag-click': fn(),
    'onView-all-click': fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '記事がある場合の基本表示です。',
      },
    },
  },
};

export const NoArticles: Story = {
  args: {
    articlesCount: 0,
    articles: [],
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: '記事がない場合の表示です。',
      },
    },
  },
};

export const ManyArticles: Story = {
  args: {
    articlesCount: 50,
    articles: longArticles,
    loading: false,
    'onArticle-click': fn(),
    'onTag-click': fn(),
    'onView-all-click': fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '多数の記事がある場合の表示です。テキスト切り詰め機能を確認できます。',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    articlesCount: 0,
    articles: [],
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'ローディング状態の表示です。',
      },
    },
  },
};

// Interaction Test
export const InteractionTest: Story = {
  args: {
    articlesCount: 2,
    articles: sampleArticles,
    loading: false,
    'onArticle-click': fn(),
    'onTag-click': fn(),
    'onView-all-click': fn(),
  },
  parameters: {
    docs: {
      description: {
        story: `
### InteractionTest - 自動操作テスト

UserArticlesListコンポーネントのインタラクション機能を自動的にテストします：

1. **記事クリック** - 記事カードをクリックしてイベント発火確認
2. **タグクリック** - タグをクリックしてイベント発火確認
3. **全記事表示ボタン** - 「すべて見る」ボタンクリックテスト
4. **統計表示確認** - 記事数の表示確認
        `,
      },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    console.log('🤖UserArticlesList InteractionTest Start');

    const TIMEOUT = { SHORT: 300, MEDIUM: 500 };

    // 記事統計の表示確認
    const articlesCount = canvas.getByText('2');
    expect(articlesCount).toBeInTheDocument();

    // 記事タイトルの表示確認
    const article1Title = canvas.getByText('Vue.js 3の新機能について');
    expect(article1Title).toBeInTheDocument();

    // 記事クリックテスト
    const articleCard = article1Title.closest('.group');
    await userEvent.click(articleCard);
    await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));
    expect(args['onArticle-click']).toHaveBeenCalledWith('1');

    // タグクリックテスト
    const vueTag = canvas.getByText('Vue.js');
    await userEvent.click(vueTag);
    await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));
    expect(args['onTag-click']).toHaveBeenCalledWith('Vue.js');

    // 「すべて見る」ボタンクリックテスト
    const viewAllButton = canvas.getByText('すべて見る');
    await userEvent.click(viewAllButton);
    await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));
    expect(args['onView-all-click']).toHaveBeenCalled();

    console.log('🎉 UserArticlesList InteractionTest completed successfully!');
  },
};
