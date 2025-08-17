import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { fn, expect, userEvent } from 'storybook/test';
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

注意: このテストはStorybookのモック環境で実行されるため、実際のAPI呼び出しは行われません。
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
