import type { Meta, StoryObj } from '@storybook/vue3';
import { fn, expect } from 'storybook/test';
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
    'data-testid': 'email',
  },
  render: (args) => ({
    components: { TextInput },
    setup() {
      return { args, onUpdateModelValue: fn() };
    },
    template: '<TextInput v-bind="args" @update:modelValue="onUpdateModelValue" />',
  }),
  play: async ({ canvas, userEvent }) => {
    // 👇 Simulate interactions with the component
    // await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

    // - canvasQuery
    // @see https://storybook.js.org/docs/writing-tests/interaction-testing#querying-the-canvas
    // @see https://testing-library.com/docs/queries/about/#types-of-queries
    // - userEvent
    // @see https://storybook.js.org/docs/writing-tests/interaction-testing#simulating-behavior-with-userevent
    const input = canvas.getByTestId('email')
    await userEvent.clear(input);
    await userEvent.type(input, 'email@provider.com');


    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    // await userEvent.click(canvas.getByRole('button'));

    // 👇 Assert DOM structure
    // - expect
    // @see https://storybook.js.org/docs/writing-tests/interaction-testing#asserting-with-expect
    await expect(input).toHaveValue('email@provider.com');

  },
};
