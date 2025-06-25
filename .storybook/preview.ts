import type { Preview } from "@storybook/vue3";
import { setup } from "@storybook/vue3";
import { withThemeByClassName } from "@storybook/addon-themes";
import { provide } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClient } from '../resources/js/Utils/apollo-client';
import '../resources/css/app.css';

// Vuetify
// import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

// Element Plus
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'element-plus/dist/index.css';
import 'animate.css';

// ダーク/ライトテーマの自動判定
const defaultTheme =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: { mdi }
  },
  theme: {
    defaultTheme,
  },
});

setup(app => {
  app.use(vuetify);
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: defaultTheme,
    }),
    (story) => ({
      components: { story },
      setup() {
        provide(DefaultApolloClient, apolloClient);
        return {};
      },
      template: '<div><story /></div>',
    }),
  ],
};

export default preview;
