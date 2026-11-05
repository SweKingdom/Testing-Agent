# Technical overview

## Project scaffold and tooling

Covers US-105.

| Item | Value |
|---|---|
| Runtime | Node.js 22 or later (`engines.node >=22`) |
| Language | TypeScript, strict, `NodeNext` module resolution, ES2023 target |
| Module type | ESM (`"type": "module"`) |
| Runtime dependencies | None |
| Dev dependencies | `typescript`, `eslint`, `@eslint/js`, `typescript-eslint`, `tsx`, `@types/node` |

Scripts:

| Script | Command | Purpose |
|---|---|---|
| `typecheck` | `tsc --noEmit` | Type check |
| `lint` | `eslint .` | Lint with flat config |
| `test` | `node --import tsx --test "test/**/*.test.ts"` | Run `node:test` tests |
| `build` | `tsc -p tsconfig.build.json` | Emit `dist` from `src` |
| `start` | `node dist/server.js` | Run the built server (entry point added by US-107) |

Configuration (`.env`, see `.env.example`):

| Variable | Default | Notes |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `DATA_FILE` | `data/kudos.json` | Storage file; git-ignored |

Source layout: `src/` holds application code, `test/` holds tests, `dist/` is build output (git-ignored).
