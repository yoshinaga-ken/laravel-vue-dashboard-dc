import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    optimizeDeps: {
        include: [
            'wanakana',
            // Vuetify 4: keep overlay stacking on a single useStack instance in Vite dev.
            // https://vuetifyjs.com/en/getting-started/upgrade-guide/#vite-overlay-z-index-in-dev-mode
            'vuetify/components/VOverlay',
            'vuetify/components/VDialog',
            'vuetify/components/VMenu',
            'vuetify/components/VSelect',
            'vuetify/components/VTooltip',
        ],
    },
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
});
