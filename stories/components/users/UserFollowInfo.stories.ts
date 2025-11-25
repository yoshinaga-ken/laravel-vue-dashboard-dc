import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { fn, expect, userEvent } from 'storybook/test';
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
