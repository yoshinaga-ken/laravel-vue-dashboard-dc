import {defineConfig} from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['e2e/**/*', 'node_modules/**/*'],
  },
  resolve: {
    alias: {
      '@': '/resources/js',
    }
  }
});
