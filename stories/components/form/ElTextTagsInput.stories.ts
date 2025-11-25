import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ElTextTagsInput from '@/Components/ElTextTagsInput.vue';

const meta = {
  title: 'Form/ElTextTagsInput',
  component: ElTextTagsInput,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      template: '<div class="p-4"><story /></div>',
    }),
  ],
  argTypes: {
    modelValue: { control: { type: 'object' } },
    disabled: { control: { type: 'boolean' } },
    inputVisible: { control: { type: 'boolean' } },
    inputPlaceholder: { control: { type: 'string' } },
    clearable: { control: { type: 'boolean' } },
  },
} satisfies Meta<typeof ElTextTagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    modelValue: [],
    inputVisible: true,
  },
};

export const WithTags: Story = {
  args: {
    modelValue: ['vue', 'react', 'angular'],
    inputVisible: true,
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
    inputVisible: true,
    inputPlaceholder: '新しいタグを入力',
  },
};

export const NotClearable: Story = {
  args: {
    modelValue: ['vue', 'react'],
    inputVisible: true,
    clearable: false,
  },
};
