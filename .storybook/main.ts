import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: ["@storybook/addon-docs", "@storybook/addon-links", {
    name: '@storybook/addon-themes',
    options: {
      default: 'light'
    }
  }],

  framework: {
    name: "@storybook/vue3-vite",
    options: {
      viteConfigPath: '../vite.config.js'
    },
  },

  staticDirs: ['../public'],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  }
};

export default config;
