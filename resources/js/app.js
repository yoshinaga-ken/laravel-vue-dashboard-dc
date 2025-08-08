import './bootstrap'
import '../css/app.css'

import { createApp, provide, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { ZiggyVue } from '../../vendor/tightenco/ziggy'

// element-plus
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import 'animate.css'

// element-plus言語設定の準備
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ja from 'element-plus/es/locale/lang/ja'

// Dayjsの言語設定のインポート
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/ja'

// vuetify
// import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import { updateDarkModeClass } from './Utils/utils.js'
import { apolloClient } from './Utils/apollo-client.js'
import { DefaultApolloClient } from '@vue/apollo-composable'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

// APP_LOCALEに基づいて言語を設定
const appLocale = import.meta.env.VITE_APP_LOCALE || 'en'
const elementLocales = {
  'zh-cn': zhCn,
  en: en,
  ja: ja,
}
const elementLocale = elementLocales[appLocale] || en

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme:
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
  },
})

createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: name =>
    resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
  setup({ el, App, props, plugin }) {
    const app = createApp({
      setup() {
        provide(DefaultApolloClient, apolloClient)
      },
      render: () => h(App, props),
    })

    app
      .use(plugin)
      .use(ZiggyVue)
      // .use(apolloProvider)
      .use(vuetify)
      .use(ElementPlus, {
        locale: elementLocale,
      })
      .mount(el)

    updateDarkModeClass()

    return app
  },
  progress: {
    color: '#4B5563',
  },
})
