---
paths:
  - package.json
  - pnpm-workspace.yaml
---

# General

## Keep frontend majors on current stack
In-range pnpm updates only. Do not bump jQuery 4 unless the user asks for a dedicated upgrade. Keep lint-staged on v17 (requires Node.js >=22.22.1; config stays in package.json JSON so do not add the optional `yaml` package). Keep Apollo Client on v4 (`@apollo/client` + `rxjs`), GraphQL.js on v17 (`graphql`), and Vue Apollo on v5 (`@vue/apollo-composable`; composable call sites import `@vue/apollo-composable/compat` until they are rewritten to the v5 native options object). Keep Tailwind on v4 (`tailwindcss` + `@tailwindcss/vite`; do not add `@tailwindcss/postcss` alongside the Vite plugin). Dark mode is class-based via `@custom-variant dark (&:where(.dark, .dark *))` because `updateDarkModeClass()` and DcChart toggle `.dark` on `html`/`body`. Vue `<style>` blocks that use `@apply` must `@reference '#app.css'`. Keep Inertia on v3 (`@inertiajs/vue3` + `inertiajs/inertia-laravel`), VueUse on v14 (`@vueuse/core`), Vuetify on v4 (`vuetify`), Vite on v8, laravel-vite-plugin on v3, Vitest on v5, and ESLint on v10. Pin vue-tsc to ~3.2.x; 3.3.x fails type-check with TypeScript 6 baseUrl deprecation (TS5101). This project does not use Inertia SSR or `@inertiajs/vite`; keep laravel-vite-plugin page resolution. Do not add vite-plugin-vuetify unless tree-shaking is requested; the app registers all Vuetify components explicitly. `@storybook/addon-vitest` 10.6 only peers Vitest 3–4; leave the unused addon as-is until Storybook supports Vitest 5.

## pnpm 12 allowBuilds stays at root workspace
pnpm 12 ignores package.json pnpm.onlyBuiltDependencies. Native deps (@parcel/watcher, esbuild, vue-demi) must be allowed in pnpm-workspace.yaml allowBuilds. Keep packages: [] so the root lockfile is the only importer; e2e/ has its own lockfile and must not be a workspace member.
