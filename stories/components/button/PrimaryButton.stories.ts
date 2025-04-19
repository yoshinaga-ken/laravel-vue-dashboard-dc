import type { Meta, StoryObj } from '@storybook/vue3';
import PrimaryButton from '@/Components/PrimaryButton.vue';

const meta = {
  title: 'Button/PrimaryButton',
  component: PrimaryButton,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => ({
    components: { PrimaryButton },
    template: '<PrimaryButton>Click me</PrimaryButton>',
  }),
};

export const Submit: Story = {
  args: {
    type: 'submit',
  },
  render: () => ({
    components: { PrimaryButton },
    template: '<PrimaryButton type="submit">Submit</PrimaryButton>',
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: () => ({
    components: { PrimaryButton },
    template: '<PrimaryButton disabled>Disabled</PrimaryButton>',
  }),
};
