---
paths:
  - package.json
  - pnpm-workspace.yaml
---

# General

## Keep frontend majors on current stack
In-range pnpm updates only. Do not bump Tailwind 4, Vite 8, laravel-vite-plugin 3, Inertia Vue 3, Vitest 5, ESLint 10, Apollo Client 4, GraphQL 17, jQuery 4, Vuetify 4, or VueUse 14 unless the user asks for a dedicated upgrade. Pin vue-tsc to ~3.2.x; 3.3.x fails type-check with TypeScript 6 baseUrl deprecation (TS5101).

## pnpm 12 allowBuilds stays at root workspace
pnpm 12 ignores package.json pnpm.onlyBuiltDependencies. Native deps (@parcel/watcher, esbuild, vue-demi) must be allowed in pnpm-workspace.yaml allowBuilds. Keep packages: [] so the root lockfile is the only importer; e2e/ has its own lockfile and must not be a workspace member.
