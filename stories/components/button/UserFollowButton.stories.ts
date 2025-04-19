import type { Meta, StoryObj } from '@storybook/vue3';
import UserFollowButton from '@/Components/UserFollowButton.vue';

const meta = {
  title: 'Button/UserFollowButton',
  component: UserFollowButton,
  tags: ['autodocs'],
  argTypes: {
    user: { control: 'object' },
    disabled: { control: 'boolean' },
    isFollowersUserList: { control: 'boolean' },
    isFollowingUserList: { control: 'boolean' },
  },
} satisfies Meta<typeof UserFollowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser = {
  id: 1,
  name: 'John Doe',
  is_followed_by: false,
  followers: [
    { name: 'Alice' },
    { name: 'Bob' }
  ],
  following: [
    { name: 'Carol' },
    { name: 'Dave' }
  ]
};

export const Default: Story = {
  args: {
    user: mockUser,
  },
};

export const Followed: Story = {
  args: {
    user: {
      ...mockUser,
      is_followed_by: true,
    },
  },
};

export const Disabled: Story = {
  args: {
    user: mockUser,
    disabled: true,
  },
};

export const WithFollowersList: Story = {
  args: {
    user: mockUser,
    isFollowersUserList: true,
  },
};

export const WithFollowingList: Story = {
  args: {
    user: mockUser,
    isFollowingUserList: true,
  },
};

export const WithBothLists: Story = {
  args: {
    user: mockUser,
    isFollowersUserList: true,
    isFollowingUserList: true,
  },
};
