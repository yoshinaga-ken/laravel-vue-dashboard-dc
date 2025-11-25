import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VfTextTagsInput from '@/Components/VfTextTagsInput.vue';

const meta = {
  title: 'Form/VfTextTagsInput',
  component: VfTextTagsInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'array' },
    disabled: { control: 'boolean' },
    inputPlaceholder: { control: 'text' },
    clearable: { control: 'boolean' },
  },
} satisfies Meta<typeof VfTextTagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    modelValue: [],
  },
};

export const WithTags: Story = {
  args: {
    modelValue: ['vue', 'react', 'angular'],
  },
};

export const Disabled: Story = {
  args: {
    modelValue: ['vue', 'react'],
    disabled: true,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    modelValue: [],
    inputPlaceholder: '新しいタグを入力',
  },
};

export const NotClearable: Story = {
  args: {
    modelValue: ['vue', 'react'],
    clearable: false,
  },
};
