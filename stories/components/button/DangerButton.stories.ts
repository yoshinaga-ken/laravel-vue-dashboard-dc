import type { Meta, StoryObj } from '@storybook/vue3';
import DangerButton from '@/Components/DangerButton.vue';

const meta = {
  title: 'Button/DangerButton',
  component: DangerButton,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof DangerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => ({
    components: { DangerButton },
    template: '<DangerButton>Delete</DangerButton>',
  }),
};

export const Submit: Story = {
  args: {
    type: 'submit',
  },
  render: () => ({
    components: { DangerButton },
    template: '<DangerButton type="submit">Submit</DangerButton>',
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: () => ({
    components: { DangerButton },
    template: '<DangerButton disabled>Disabled</DangerButton>',
  }),
};