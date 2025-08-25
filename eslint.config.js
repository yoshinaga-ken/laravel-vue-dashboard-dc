import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import parserVue from 'vue-eslint-parser'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import configPrettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/.nyc_output/**',
      '**/node_modules/**',
      'vendor/**',
      'storage/**',
      'bootstrap/cache/**',
      'public/build/**',
      '**/*.min.js',
      'storybook-static/**',
      '**/types-graphql.d.ts',
    ],
  },

  // JavaScript基本設定
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
  },

  // TypeScript設定（限定対象）
  {
    files: ['resources/js/Composables/*.ts', 'resources/js/Types/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'prefer-const': 'error',
    },
  },

  // Vue設定（TypeScript化されたComponentsファイル）
  {
    files: [
      'resources/js/Pages/Articles/**/*.vue',
      'resources/js/Pages/Users/**/*.vue',
      'resources/js/Components/Teams/*.vue',
      'resources/js/Components/Users/*.vue',
      'resources/js/Components/ArticleTagsForm.vue',
      'resources/js/Components/VfTextTagsInput.vue',
      'resources/js/Components/ElMentionTextarea.vue',
      'resources/js/Components/ArticlesForm.vue',
      'resources/js/Components/FlashMessages.vue',
      'resources/js/Components/YoutubeVidInput.vue',
      'resources/js/Components/ElTextQueryInput.vue',
      'resources/js/Components/ElTextTagsInput.vue',
      'resources/js/Components/DcSunburstChart.vue',
    ],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Vue基本ルール
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],

      // Element Plus コンポーネント向けルール
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],

      // TypeScript化されたVueファイル専用ルール
      'vue/block-lang': [
        'error',
        {
          script: { lang: 'ts' },
        },
      ],

      // TypeScript厳格チェック（Vue内）
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'prefer-const': 'error',
    },
  },

  // Vue設定（Pages以下の全TypeScript化されたファイル）
  {
    files: [
      'resources/js/Pages/Articles/**/*.vue',
      'resources/js/Pages/Users/**/*.vue',
    ],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Vue基本ルール
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],

      // Element Plus コンポーネント向けルール
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],

      // TypeScript化されたVueファイル専用ルール
      'vue/block-lang': [
        'error',
        {
          script: { lang: 'ts' },
        },
      ],

      // TypeScript厳格チェック（Vue内）
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'prefer-const': 'error',
    },
  },

  // Prettier設定
  configPrettier,
]
