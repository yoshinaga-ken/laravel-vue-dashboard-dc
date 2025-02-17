import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './vendor/laravel/jetstream/**/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            // background-colorを拡張
            backgroundColor: {
                theme: {
                    col: 'var(--bg-theme-col)',
                    col2: 'var(--bg-theme-col2)',
                }
            },
            // text-colorを拡張
            textColor: {
                theme: {
                    col: 'var(--text-theme-col)',
                    col2: 'var(--text-theme-col2)',
                }
            },
        },
    },

    plugins: [forms, typography],
};
