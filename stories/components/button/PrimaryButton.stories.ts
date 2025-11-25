import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import PrimaryButton from '@/Components/PrimaryButton.vue';

const meta = {
  title: 'Button/PrimaryButton',
  component: PrimaryButton,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
  },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { PrimaryButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<PrimaryButton v-bind="args" @click="onClick">Click me</PrimaryButton>',
  }),
};

export const Submit: Story = {
  args: {
    type: 'submit',
  },
  render: (args) => ({
    components: { PrimaryButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<PrimaryButton v-bind="args" @click="onClick">Submit</PrimaryButton>',
  }),
};

export const Reset: Story = {
  args: {
    type: 'reset',
  },
  render: (args) => ({
    components: { PrimaryButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<PrimaryButton v-bind="args" @click="onClick">Reset</PrimaryButton>',
  }),
};
