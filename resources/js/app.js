import './bootstrap';
import '../css/app.css';

import {createApp, provide, h} from 'vue';
import {createInertiaApp} from '@inertiajs/vue3';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import {ZiggyVue} from '../../vendor/tightenco/ziggy';

// element-plus
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import 'animate.css'

// vuetify
// import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import {updateDarkModeClass} from './Utils/utils.js';
import {apolloClient} from './Utils/apollo-client.js';
import {DefaultApolloClient} from "@vue/apollo-composable"

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  },
})

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
  setup({el, App, props, plugin}) {
    const app = createApp({
      setup() {
        provide(DefaultApolloClient, apolloClient)
      },
      render: () => h(App, props)
    });

    app
      .use(plugin)
      .use(ZiggyVue)
      // .use(apolloProvider)
      .use(vuetify)
      .mount(el);

    updateDarkModeClass();

    return app;
  },
  progress: {
    color: '#4B5563',
  },
});
