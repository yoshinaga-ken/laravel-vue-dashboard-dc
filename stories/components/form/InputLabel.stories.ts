import type { Meta, StoryObj } from '@storybook/vue3';
import InputLabel from '@/Components/InputLabel.vue';

const meta = {
  title: 'Form/InputLabel',
  component: InputLabel,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
  },
} satisfies Meta<typeof InputLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithValue: Story = {
  args: {
    value: 'Email',
  },
};

export const WithSlot: Story = {
  args: {},
  render: () => ({
    components: { InputLabel },
    template: '<InputLabel>Password</InputLabel>',
  }),
};
