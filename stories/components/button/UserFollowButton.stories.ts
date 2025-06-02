import type { Meta, StoryObj } from '@storybook/vue3';
import { fn } from 'storybook/test';
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
  render: (args) => ({
    components: { UserFollowButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<UserFollowButton v-bind="args" @click="onClick" />',
  }),
};

export const Followed: Story = {
  args: {
    user: {
      ...mockUser,
      is_followed_by: true,
    },
  },
  render: (args) => ({
    components: { UserFollowButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<UserFollowButton v-bind="args" @click="onClick" />',
  }),
};

export const Disabled: Story = {
  args: {
    user: mockUser,
    disabled: true,
  },
  render: (args) => ({
    components: { UserFollowButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<UserFollowButton v-bind="args" @click="onClick" />',
  }),
};

export const WithFollowersList: Story = {
  args: {
    user: mockUser,
    isFollowersUserList: true,
  },
  render: (args) => ({
    components: { UserFollowButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<UserFollowButton v-bind="args" @click="onClick" />',
  }),
};

export const WithFollowingList: Story = {
  args: {
    user: mockUser,
    isFollowingUserList: true,
  },
  render: (args) => ({
    components: { UserFollowButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<UserFollowButton v-bind="args" @click="onClick" />',
  }),
};

export const WithBothLists: Story = {
  args: {
    user: mockUser,
    isFollowersUserList: true,
    isFollowingUserList: true,
  },
  render: (args) => ({
    components: { UserFollowButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<UserFollowButton v-bind="args" @click="onClick" />',
  }),
};
