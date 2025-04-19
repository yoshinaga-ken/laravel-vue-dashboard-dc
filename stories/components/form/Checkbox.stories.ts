import type { Meta, StoryObj } from '@storybook/vue3';
import Checkbox from '@/Components/Checkbox.vue';

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    value: { control: 'text' },
    'update:checked': { action: 'update:checked' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const WithValue: Story = {
  args: {
    checked: false,
    value: 'option1',
  },
};

export const ArrayValue: Story = {
  args: {
    checked: ['option1', 'option2'],
    value: 'option1',
  },
};
