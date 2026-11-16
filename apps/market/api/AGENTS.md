# market-api (legacy)

## Status
A **legacy** NestJS API. It lives in the repo but is **not part of the pnpm
monorepo**: `pnpm-workspace.yaml` excludes it with `"!apps/market/api"`.
Treat it as a standalone project that happens to sit in this folder.

## Runtime
- **Node 16.** The pinned stack (NestJS 7, TypeScript 4.2, TypeORM 0.2,
  `sqlite3` 5.0.8 native module) targets it. Pinned in `.nvmrc` and in
  `engines.node` in `package.json`. Switch before running anything: run
  `nvm use` in this folder (it reads `.nvmrc`). Other workspace packages use
  a newer Node.
- **npm, not pnpm.** Dependencies are locked in `package-lock.json` and
  installed into this package's own `node_modules`.

## Rules
- Run every command from this folder (`cd apps/market/api`), with npm:
  `npm install`, `npm run start:dev`, `npm test`, `npm run test:e2e`, `npm run lint`,
  `npm run ts` (type check).
- Never run `pnpm install` / `pnpm add` here or add this package back to the
  workspace: pnpm would hoist it into the root lockfile and mix its old
  dependencies with the rest of the monorepo.
- Don't import from workspace packages (`@workspace/*`) and don't let other
  packages import from this one. It shares no code, config or tooling with the
  monorepo (its own ESLint, Prettier, tsconfig and Jest setup).
- Keep dependency versions pinned. Don't upgrade NestJS, TypeScript, TypeORM or
  Node as a side effect of another task; an upgrade is its own task, agreed with
  the owner first.
- Write code that compiles on TypeScript 4.2 and runs on Node 16 (no newer
  syntax or Node APIs).
