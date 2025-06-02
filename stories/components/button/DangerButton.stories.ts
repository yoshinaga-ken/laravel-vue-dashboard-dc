import type { Meta, StoryObj } from '@storybook/vue3';
import { fn } from 'storybook/test';
import DangerButton from '@/Components/DangerButton.vue';

const meta = {
  title: 'Button/DangerButton',
  component: DangerButton,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
  },
} satisfies Meta<typeof DangerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { DangerButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<DangerButton v-bind="args" @click="onClick">Delete</DangerButton>',
  }),
};

export const Submit: Story = {
  args: {
    type: 'submit',
  },
  render: (args) => ({
    components: { DangerButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<DangerButton v-bind="args" @click="onClick">Submit</DangerButton>',
  }),
};

export const Reset: Story = {
  args: {
    type: 'reset',
  },
  render: (args) => ({
    components: { DangerButton },
    setup() {
      return { args, onClick: fn() };
    },
    template: '<DangerButton v-bind="args" @click="onClick">Reset</DangerButton>',
  }),
};
