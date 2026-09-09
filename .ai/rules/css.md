---
paths:
  - 'resources/css/**'
---

# Css

## Tailwind v4 class dark and @reference
This app toggles dark mode by adding `.dark` on html/body (`updateDarkModeClass`, DcChart, Storybook addon-themes). Keep `@custom-variant dark (&:where(.dark, .dark *))` in app.css; do not rely on prefers-color-scheme. Vue `<style>` blocks that use `@apply` must `@reference '#app.css'` (package.json `imports`). Build with `@tailwindcss/vite` only — do not also enable `@tailwindcss/postcss`.
