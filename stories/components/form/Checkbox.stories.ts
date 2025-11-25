import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import Checkbox from '@/Components/Checkbox.vue';

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    value: { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      return { args, onUpdateChecked: fn() };
    },
    template: '<Checkbox v-bind="args" @update:checked="onUpdateChecked" />',
  }),
};

export const Checked: Story = {
  args: {
    checked: true,
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      return { args, onUpdateChecked: fn() };
    },
    template: '<Checkbox v-bind="args" @update:checked="onUpdateChecked" />',
  }),
};

export const WithValue: Story = {
  args: {
    checked: false,
    value: 'option1',
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      return { args, onUpdateChecked: fn() };
    },
    template: '<Checkbox v-bind="args" @update:checked="onUpdateChecked" />',
  }),
};

export const ArrayValue: Story = {
  args: {
    checked: ['option1', 'option2'],
    value: 'option1',
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      return { args, onUpdateChecked: fn() };
    },
    template: '<Checkbox v-bind="args" @update:checked="onUpdateChecked" />',
  }),
};
