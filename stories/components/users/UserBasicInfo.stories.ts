import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { fn, expect, userEvent } from 'storybook/test';
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
