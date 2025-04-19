import type { Meta, StoryObj } from '@storybook/vue3';
import TextInput from '@/Components/TextInput.vue';

const meta = {
  title: 'Form/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    type: { control: 'select', options: ['text', 'password', 'email', 'number'] },
    disabled: { control: 'boolean' },
    autofocus: { control: 'boolean' },
    class: { control: 'text' },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    modelValue: '',
  },
};

export const WithValue: Story = {
  args: {
    modelValue: 'Hello World',
  },
};

export const Password: Story = {
  args: {
    modelValue: 'password123',
    type: 'password',
  },
};

export const Disabled: Story = {
  args: {
    modelValue: 'Disabled input',
    disabled: true,
  },
};

export const WithCustomClass: Story = {
  args: {
    modelValue: 'Custom styled input',
    class: 'bg-yellow-100 dark:bg-yellow-800',
  },
};
