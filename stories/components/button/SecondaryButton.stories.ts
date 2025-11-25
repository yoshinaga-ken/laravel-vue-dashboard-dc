import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import SecondaryButton from '@/Components/SecondaryButton.vue';

const meta = {
  title: 'Button/SecondaryButton',
  component: SecondaryButton,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
  },
} satisfies Meta<typeof SecondaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { SecondaryButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<SecondaryButton v-bind="args" @click="onClick">Cancel</SecondaryButton>',
  }),
};

export const Submit: Story = {
  args: {
    type: 'submit',
  },
  render: (args) => ({
    components: { SecondaryButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<SecondaryButton v-bind="args" @click="onClick">Submit</SecondaryButton>',
  }),
};

export const Reset: Story = {
  args: {
    type: 'reset',
  },
  render: (args) => ({
    components: { SecondaryButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<SecondaryButton v-bind="args" @click="onClick">Reset</SecondaryButton>',
  }),
};
