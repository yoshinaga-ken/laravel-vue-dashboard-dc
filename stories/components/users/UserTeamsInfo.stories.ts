import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { fn, expect, userEvent } from 'storybook/test';
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
