import type { Meta, StoryObj } from '@storybook/vue3';
import { fn } from 'storybook/test';
import TextInput from '@/Components/TextInput.vue';

const meta = {
  title: 'Form/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    modelValue: '',
  },
  render: (args) => ({
    components: { TextInput },
    setup() {
      return { args, onUpdateModelValue: fn() };
    },
    template: '<TextInput v-bind="args" @update:modelValue="onUpdateModelValue" />',
  }),
};

export const WithValue: Story = {
  args: {
    modelValue: 'Hello World',
  },
  render: (args) => ({
    components: { TextInput },
    setup() {
      return { args, onUpdateModelValue: fn() };
    },
    template: '<TextInput v-bind="args" @update:modelValue="onUpdateModelValue" />',
  }),
};
