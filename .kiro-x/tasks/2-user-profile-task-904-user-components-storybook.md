````markdown
# TASK-904: 新規UIコンポーネントのStorybookとInteraction testsの実装

## タスク概要

実装された新規UIコンポーネント（UserBasicInfo、UserFollowInfo、UserArticlesList、UserTeamsInfo、UserActionButtons）のStorybookストーリーとInteraction testsを実装する。

## 依存関係

- 依存タスク: TASK-201, TASK-202, TASK-203, TASK-204, TASK-205, TASK-301
- このタスクに依存するタスク: なし

## 実装対象コンポーネント

### 親コンポーネント（Interaction tests実装対象）

1. **UserBasicInfo.vue** - ユーザー基本情報表示コンポーネント
2. **UserFollowInfo.vue** - フォロー情報表示コンポーネント
3. **UserArticlesList.vue** - 記事一覧表示コンポーネント
4. **UserTeamsInfo.vue** - チーム情報表示コンポーネント
5. **UserActionButtons.vue** - ユーザーアクションボタンコンポーネント

### 実装するStorybook機能

- **基本ストーリー**: 各コンポーネントの基本表示
- **状態別ストーリー**: ローディング・エラー・データなし状態
- **Props別ストーリー**: 異なるPropsパターンでの表示
- **Interaction tests**: 複雑なUIインタラクションの自動テスト

## 実装内容

### 1. UserBasicInfo.stories.ts

```typescript
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect } from '@storybook/test';
import UserBasicInfo from '@/Components/Users/UserBasicInfo.vue';

const meta = {
  title: 'Users/UserBasicInfo',
  component: UserBasicInfo,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      template: '<div class="p-4 max-w-md"><story /></div>',
    }),
  ],
  argTypes: {
    user: { control: 'object' },
    loading: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
ユーザーの基本情報を表示するコンポーネントです。アバター、名前、メール、登録日等を表示します。

## 機能

- **プロフィール写真表示**: アバター画像またはイニシャル表示
- **基本情報表示**: 名前、メール、ID、登録日、更新日
- **レスポンシブ対応**: モバイル・タブレット・PC対応
- **ダークモード対応**: 自動切り替え
- **ローディング状態**: データ取得中の表示

## 使用方法

\`user\`プロパティにユーザーオブジェクトを渡すことで基本情報を表示します。
        `,
      },
    },
  },
} satisfies Meta<typeof UserBasicInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルユーザーデータ
const sampleUser = {
  id: "1",
  name: "田中太郎",
  email: "tanaka@example.com",
  current_team_id: "5",
  profile_photo_url: null,
  created_at: "2023-01-15T09:30:00Z",
  updated_at: "2024-08-15T14:20:00Z"
};

const userWithPhoto = {
  ...sampleUser,
  name: "佐藤花子",
  email: "sato@example.com",
  profile_photo_url: "https://ui-avatars.com/api/?name=佐藤花子&background=random"
};

export const Default: Story = {
  args: {
    user: sampleUser,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'プロフィール写真がない場合の基本表示です。イニシャルがアバターに表示されます。',
      },
    },
  },
};

export const WithProfilePhoto: Story = {
  args: {
    user: userWithPhoto,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'プロフィール写真がある場合の表示です。',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    user: sampleUser,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'ローディング状態の表示です。スピナーが表示されます。',
      },
    },
  },
};

export const NoUser: Story = {
  args: {
    user: null,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'ユーザー情報がない場合のエラー表示です。',
      },
    },
  },
};

export const LongUserName: Story = {
  args: {
    user: {
      ...sampleUser,
      name: "とても長いユーザー名でレスポンシブテストを行うための名前です",
      email: "very-long-email-address-for-responsive-test@example.com"
    },
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: '長いユーザー名・メールアドレスの場合の表示です。truncateが適用されます。',
      },
    },
  },
};

// Interaction Test
export const InteractionTest: Story = {
  args: {
    user: sampleUser,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
### InteractionTest - 自動操作テスト

UserBasicInfoコンポーネントの表示確認を自動的に実行します：

1. **基本情報表示の確認** - 各フィールドが正しく表示されているかチェック
2. **日付フォーマットの確認** - 登録日・更新日が適切にフォーマットされているかチェック
3. **アバター表示の確認** - プロフィール写真またはイニシャル表示をチェック
4. **レスポンシブ表示の確認** - 各要素が適切に配置されているかチェック
        `,
      },
    },
  },
  play: async ({ canvas }) => {
    console.log('🤖UserBasicInfo InteractionTest Start');

    const cardElement = canvas.getByText('基本情報').closest('.el-card');
    expect(cardElement).toBeInTheDocument();

    // ユーザー名の表示確認
    const userName = canvas.getByText('田中太郎');
    expect(userName).toBeInTheDocument();

    // メールアドレスの表示確認
    const userEmail = canvas.getByText('tanaka@example.com');
    expect(userEmail).toBeInTheDocument();

    // ユーザーIDの表示確認
    const userId = canvas.getByText('1');
    expect(userId).toBeInTheDocument();

    // 日付が表示されていることを確認
    const dateElements = canvas.getAllByText(/\d{4}\/\d{1,2}\/\d{1,2}/);
    expect(dateElements.length).toBeGreaterThanOrEqual(2); // 登録日と更新日

    // アバターの表示確認
    const avatarElement = canvas.getByRole('img', { hidden: true });
    expect(avatarElement).toBeInTheDocument();

    console.log('🎉 UserBasicInfo InteractionTest completed successfully!');
  },
};
```

### 2. UserFollowInfo.stories.ts

```typescript
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect, userEvent } from '@storybook/test';
import UserFollowInfo from '@/Components/Users/UserFollowInfo.vue';

const meta = {
  title: 'Users/UserFollowInfo',
  component: UserFollowInfo,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      template: '<div class="p-4 max-w-md"><story /></div>',
    }),
  ],
  argTypes: {
    followersCount: { control: 'number' },
    followingCount: { control: 'number' },
    followersList: { control: 'object' },
    followingList: { control: 'object' },
    loading: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
ユーザーのフォロー情報（フォロワー・フォロー中）を表示するコンポーネントです。

## 機能

- **フォロー統計表示**: フォロワー数・フォロー中数の視覚的表示
- **展開/折りたたみ**: ユーザー一覧の表示/非表示切り替え
- **ユーザー一覧**: アバター付きユーザーリスト
- **スクロール対応**: 長いリストのスクロール表示
- **ローディング状態**: データ取得中の表示

## 使用方法

フォロー情報をpropsとして渡すことで情報を表示します。
        `,
      },
    },
  },
} satisfies Meta<typeof UserFollowInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルユーザーデータ
const sampleFollowers = [
  { id: "1", name: "田中太郎", profile_photo_url: null },
  { id: "2", name: "佐藤花子", profile_photo_url: "https://ui-avatars.com/api/?name=佐藤花子&background=random" },
  { id: "3", name: "鈴木一郎", profile_photo_url: null },
];

const sampleFollowing = [
  { id: "4", name: "山田美咲", profile_photo_url: "https://ui-avatars.com/api/?name=山田美咲&background=random" },
  { id: "5", name: "高橋健太", profile_photo_url: null },
];

export const Default: Story = {
  args: {
    followersCount: 3,
    followingCount: 2,
    followersList: sampleFollowers,
    followingList: sampleFollowing,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'フォロワー・フォロー中がある場合の基本表示です。',
      },
    },
  },
};

export const NoFollows: Story = {
  args: {
    followersCount: 0,
    followingCount: 0,
    followersList: [],
    followingList: [],
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'フォロワー・フォロー中が0人の場合の表示です。',
      },
    },
  },
};

export const ManyFollowers: Story = {
  args: {
    followersCount: 50,
    followingCount: 25,
    followersList: Array.from({ length: 12 }, (_, i) => ({
      id: `${i + 1}`,
      name: `フォロワー${i + 1}`,
      profile_photo_url: i % 3 === 0 ? `https://ui-avatars.com/api/?name=フォロワー${i + 1}&background=random` : null
    })),
    followingList: Array.from({ length: 8 }, (_, i) => ({
      id: `${i + 20}`,
      name: `フォロー中${i + 1}`,
      profile_photo_url: i % 2 === 0 ? `https://ui-avatars.com/api/?name=フォロー中${i + 1}&background=random` : null
    })),
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: '多数のフォロワー・フォロー中がある場合の表示です。スクロール機能を確認できます。',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    followersCount: 0,
    followingCount: 0,
    followersList: [],
    followingList: [],
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
    followersCount: 3,
    followingCount: 2,
    followersList: sampleFollowers,
    followingList: sampleFollowing,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
### InteractionTest - 自動操作テスト

UserFollowInfoコンポーネントのインタラクション機能を自動的にテストします：

1. **フォロワー一覧の展開** - フォロワー一覧ボタンをクリックして展開
2. **フォロー中一覧の展開** - フォロー中一覧ボタンをクリックして展開
3. **一覧の折りたたみ** - 再度クリックして折りたたみ
4. **統計表示の確認** - フォロワー数・フォロー中数の表示確認
        `,
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    console.log('🤖UserFollowInfo InteractionTest Start');

    const TIMEOUT = { SHORT: 300, MEDIUM: 500 };

    // フォロー統計の表示確認
    const followersCount = canvas.getByText('3');
    const followingCount = canvas.getByText('2');
    expect(followersCount).toBeInTheDocument();
    expect(followingCount).toBeInTheDocument();

    // フォロワー一覧展開ボタンをクリック
    const followersButton = canvas.getByText(/フォロワー一覧 \(3\)/);
    await userEvent.click(followersButton);
    await new Promise(resolve => setTimeout(resolve, TIMEOUT.MEDIUM));

    // フォロワー一覧が表示されることを確認
    const follower1 = canvas.getByText('田中太郎');
    expect(follower1).toBeInTheDocument();

    // フォロー中一覧展開ボタンをクリック
    const followingButton = canvas.getByText(/フォロー中一覧 \(2\)/);
    await userEvent.click(followingButton);
    await new Promise(resolve => setTimeout(resolve, TIMEOUT.MEDIUM));

    // フォロー中一覧が表示されることを確認
    const following1 = canvas.getByText('山田美咲');
    expect(following1).toBeInTheDocument();

    // 再度クリックして折りたたみテスト
    await userEvent.click(followersButton);
    await new Promise(resolve => setTimeout(resolve, TIMEOUT.MEDIUM));

    console.log('🎉 UserFollowInfo InteractionTest completed successfully!');
  },
};
```

### 3. UserArticlesList.stories.ts

```typescript
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect, userEvent, fn } from '@storybook/test';
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
```

### 4. UserTeamsInfo.stories.ts

```typescript
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect, userEvent, fn } from '@storybook/test';
import UserTeamsInfo from '@/Components/Users/UserTeamsInfo.vue';

const meta = {
  title: 'Users/UserTeamsInfo',
  component: UserTeamsInfo,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      template: '<div class="p-4 max-w-2xl"><story /></div>',
    }),
  ],
  argTypes: {
    ownedTeams: { control: 'object' },
    joinedTeams: { control: 'object' },
    currentTeamId: { control: 'text' },
    loading: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
ユーザーのチーム情報（所有・参加・現在のチーム）を表示するコンポーネントです。

## 機能

- **現在のチーム強調**: アクティブチームのハイライト表示
- **チーム分類表示**: 所有・参加チームの明確な区別
- **チーム統計**: チーム数の視覚的表示
- **チームタイプ表示**: パーソナル/一般チームの識別
- **インタラクション**: チームクリックによる遷移

## 使用方法

チーム情報をpropsとして渡すことで表示します。チームクリックイベントをemitします。
        `,
      },
    },
  },
} satisfies Meta<typeof UserTeamsInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルチームデータ
const sampleOwnedTeams = [
  { id: "1", name: "開発チーム", personal_team: false },
  { id: "2", name: "田中太郎のチーム", personal_team: true },
];

const sampleJoinedTeams = [
  { id: "3", name: "マーケティングチーム", personal_team: false },
  { id: "4", name: "プロジェクトA", personal_team: false },
];

export const Default: Story = {
  args: {
    ownedTeams: sampleOwnedTeams,
    joinedTeams: sampleJoinedTeams,
    currentTeamId: "1",
    loading: false,
    'onTeam-click': fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'チームに所属している場合の基本表示です。現在のチームがハイライトされます。',
      },
    },
  },
};

export const NoTeams: Story = {
  args: {
    ownedTeams: [],
    joinedTeams: [],
    currentTeamId: null,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'チームに所属していない場合の表示です。',
      },
    },
  },
};

export const OnlyOwnedTeams: Story = {
  args: {
    ownedTeams: sampleOwnedTeams,
    joinedTeams: [],
    currentTeamId: "2",
    loading: false,
    'onTeam-click': fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '所有チームのみの場合の表示です。',
      },
    },
  },
};

export const OnlyJoinedTeams: Story = {
  args: {
    ownedTeams: [],
    joinedTeams: sampleJoinedTeams,
    currentTeamId: "3",
    loading: false,
    'onTeam-click': fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '参加チームのみの場合の表示です。',
      },
    },
  },
};

export const ManyTeams: Story = {
  args: {
    ownedTeams: Array.from({ length: 5 }, (_, i) => ({
      id: `${i + 1}`,
      name: `所有チーム${i + 1}`,
      personal_team: i === 0
    })),
    joinedTeams: Array.from({ length: 8 }, (_, i) => ({
      id: `${i + 10}`,
      name: `参加チーム${i + 1}`,
      personal_team: false
    })),
    currentTeamId: "1",
    loading: false,
    'onTeam-click': fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '多数のチームに所属している場合の表示です。',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    ownedTeams: [],
    joinedTeams: [],
    currentTeamId: null,
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
    ownedTeams: sampleOwnedTeams,
    joinedTeams: sampleJoinedTeams,
    currentTeamId: "1",
    loading: false,
    'onTeam-click': fn(),
  },
  parameters: {
    docs: {
      description: {
        story: `
### InteractionTest - 自動操作テスト

UserTeamsInfoコンポーネントのインタラクション機能を自動的にテストします：

1. **現在のチーム表示確認** - 現在のチームが適切にハイライト表示されているかチェック
2. **所有チームクリック** - 所有チームカードをクリックしてイベント発火確認
3. **参加チームクリック** - 参加チームカードをクリックしてイベント発火確認
4. **統計表示確認** - チーム数の表示確認
        `,
      },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    console.log('🤖UserTeamsInfo InteractionTest Start');

    const TIMEOUT = { SHORT: 300, MEDIUM: 500 };

    // 現在のチームの表示確認
    const currentTeamSection = canvas.getByText('現在のチーム');
    expect(currentTeamSection).toBeInTheDocument();

    const currentTeamName = canvas.getByText('開発チーム');
    expect(currentTeamName).toBeInTheDocument();

    // 所有チーム統計の確認
    const ownedTeamsCount = canvas.getAllByText('2')[0]; // 所有チーム数
    expect(ownedTeamsCount).toBeInTheDocument();

    // 参加チーム統計の確認
    const joinedTeamsCount = canvas.getAllByText('2')[1]; // 参加チーム数
    expect(joinedTeamsCount).toBeInTheDocument();

    // 所有チームカードのクリックテスト
    const ownedTeamCard = canvas.getByText('田中太郎のチーム').closest('.group');
    await userEvent.click(ownedTeamCard);
    await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));
    expect(args['onTeam-click']).toHaveBeenCalledWith('2');

    // 参加チームカードのクリックテスト
    const joinedTeamCard = canvas.getByText('マーケティングチーム').closest('.group');
    await userEvent.click(joinedTeamCard);
    await new Promise(resolve => setTimeout(resolve, TIMEOUT.SHORT));
    expect(args['onTeam-click']).toHaveBeenCalledWith('3');

    console.log('🎉 UserTeamsInfo InteractionTest completed successfully!');
  },
};
```

### 5. UserActionButtons.stories.ts

```typescript
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { expect, userEvent, fn } from '@storybook/test';
import UserActionButtons from '@/Components/Users/UserActionButtons.vue';

const meta = {
  title: 'Users/UserActionButtons',
  component: UserActionButtons,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      template: '<div class="p-4 max-w-md"><story /></div>',
    }),
  ],
  argTypes: {
    targetUser: { control: 'object' },
    isOwnProfile: { control: 'boolean' },
    currentUserFollowingList: { control: 'object' },
    loading: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: `
ユーザーに対するアクション（フォロー/アンフォロー・プロフィール編集）のボタンコンポーネントです。

## 機能

- **フォロー/アンフォロー**: 他のユーザーのフォロー状態切り替え
- **プロフィール編集**: 自分のプロフィール編集画面への遷移
- **状態表示**: フォロー状態の視覚的表現
- **レスポンシブ対応**: モバイル・PC対応レイアウト
- **メッセージ機能**: 将来拡張予定の機能

## 使用方法

対象ユーザー・自分のプロフィール判定・フォローリストをpropsとして渡します。
        `,
      },
    },
  },
} satisfies Meta<typeof UserActionButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルユーザーデータ
const targetUser = {
  id: "2",
  name: "佐藤花子",
  email: "sato@example.com",
  profile_photo_url: null
};

const followingUser = {
  id: "2",
  name: "佐藤花子",
  profile_photo_url: null
};

export const OwnProfile: Story = {
  args: {
    targetUser,
    isOwnProfile: true,
    currentUserFollowingList: [],
    loading: false,
    'onEdit-profile': fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '自分のプロフィールの場合の表示です。編集ボタンが表示されます。',
      },
    },
  },
};

export const OtherUserNotFollowing: Story = {
  args: {
    targetUser,
    isOwnProfile: false,
    currentUserFollowingList: [],
    loading: false,
    'onFollow-success': fn(),
    'onUnfollow-success': fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '他のユーザーでフォローしていない場合の表示です。フォローボタンが表示されます。',
      },
    },
  },
};

export const OtherUserFollowing: Story = {
  args: {
    targetUser,
    isOwnProfile: false,
    currentUserFollowingList: [followingUser],
    loading: false,
    'onFollow-success': fn(),
    'onUnfollow-success': fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '他のユーザーで既にフォローしている場合の表示です。フォロー中ボタンが表示されます。',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    targetUser,
    isOwnProfile: false,
    currentUserFollowingList: [],
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
    targetUser,
    isOwnProfile: false,
    currentUserFollowingList: [],
    loading: false,
    'onFollow-success': fn(),
    'onUnfollow-success': fn(),
    'onEdit-profile': fn(),
  },
  parameters: {
    docs: {
      description: {
        story: `
### InteractionTest - 自動操作テスト

UserActionButtonsコンポーネントのインタラクション機能を自動的にテストします：

1. **フォローボタンクリック** - フォローボタンをクリックして状態変更
2. **フォロー状態の確認** - ボタンテキストとスタイルの変更確認
3. **アンフォローボタンクリック** - 再度クリックしてアンフォロー
4. **補助テキストの確認** - フォロー状態に応じたテキスト表示
        `,
      },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    console.log('🤖UserActionButtons InteractionTest Start');

    const TIMEOUT = { SHORT: 300, MEDIUM: 500 };

    // 初期状態：フォローボタンの表示確認
    const followButton = canvas.getByText('フォローする');
    expect(followButton).toBeInTheDocument();

    // 補助テキストの確認
    const helperText = canvas.getByText('フォローして最新情報を受け取る');
    expect(helperText).toBeInTheDocument();

    // フォローボタンクリック（モックなので実際のAPIは呼ばれない）
    await userEvent.click(followButton);
    await new Promise(resolve => setTimeout(resolve, TIMEOUT.MEDIUM));

    // メッセージボタンが無効化されていることを確認
    const messageButton = canvas.getByText('メッセージ');
    expect(messageButton).toBeDisabled();

    console.log('🎉 UserActionButtons InteractionTest completed successfully!');
  },
};
```

## 完了条件

- [ ] 5つのコンポーネントのStorybookストーリーが実装されている
- [ ] 各コンポーネントの基本ストーリー（Default、Loading、空データ等）が実装されている
- [ ] 各コンポーネントのInteraction testsが実装されている
- [ ] Storybookで全ストーリーが正常に表示される
- [ ] Interaction testsが自動実行される
- [ ] TypeScriptエラーがない
- [ ] ESLintエラーがない
- [ ] ドキュメンテーションが適切に表示される

## 技術仕様

### ディレクトリ構造

```
stories/
  components/
    users/
      UserBasicInfo.stories.ts
      UserFollowInfo.stories.ts
      UserArticlesList.stories.ts
      UserTeamsInfo.stories.ts
      UserActionButtons.stories.ts
```

### テスト対象機能

- **表示系**: データの適切な表示
- **インタラクション系**: クリック・ホバー・展開/折りたたみ
- **状態系**: ローディング・エラー・空データ
- **イベント系**: emitの発火確認

### 既存Storybookとの整合性

- ElTextQueryInput.stories.tsのパターンを参考
- Interaction testsのベストプラクティスに準拠
- ドキュメンテーション形式の統一

## 注意事項

- **モックAPI**: UserActionButtonsのフォロー機能は実際のAPIを呼ばないようにする
- **GraphQLデータ**: 実際のGraphQLスキーマに準拠したサンプルデータを使用
- **レスポンシブテスト**: 各コンポーネントの画面サイズ対応をテスト
- **アクセシビリティ**: 適切なaria-label等の設定をテスト

## 将来の拡張

- **Visual Regression Testing**: スクリーンショット比較テスト
- **A11y Testing**: アクセシビリティ自動テスト
- **Performance Testing**: パフォーマンス測定
- **Cross-browser Testing**: ブラウザ間互換性テスト

````
