import type { Meta, StoryObj } from '@storybook/vue3';
import SecondaryButton from '@/Components/SecondaryButton.vue';

const meta = {
  title: 'Button/SecondaryButton',
  component: SecondaryButton,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof SecondaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => ({
    components: { SecondaryButton },
    template: '<SecondaryButton>Cancel</SecondaryButton>',
  }),
};

export const Submit: Story = {
  args: {
    type: 'submit',
  },
  render: () => ({
    components: { SecondaryButton },
    template: '<SecondaryButton type="submit">Submit</SecondaryButton>',
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: () => ({
    components: { SecondaryButton },
    template: '<SecondaryButton disabled>Disabled</SecondaryButton>',
  }),
};
