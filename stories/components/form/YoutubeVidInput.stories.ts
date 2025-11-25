import type { Meta, StoryObj } from '@storybook/vue3-vite';
import YoutubeVidInput from '@/Components/YoutubeVidInput.vue';

const meta = {
  title: 'Form/YoutubeVidInput',
  component: YoutubeVidInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
  },
} satisfies Meta<typeof YoutubeVidInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    modelValue: '',
  },
};

export const WithVideoId: Story = {
  args: {
    modelValue: 'dQw4w9WgXcQ',
  },
};

export const WithUrl: Story = {
  args: {
    modelValue: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
};
