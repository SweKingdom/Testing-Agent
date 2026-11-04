# Solution design — Kudos API

## Architecture overview
Single Node 22 process, TypeScript (ESM, NodeNext), `node:http` only, no runtime dependencies. JSON array in a file as storage. Request flow: `server.ts` → `createApp` (router, error handling) → route handler (feature module) → store.

## Module map

| Module | Responsibility | Story |
|---|---|---|
| package.json, tsconfig*.json, eslint.config.js | Scripts typecheck/lint/test/build/start | US-105 |
| src/version.ts | `VERSION` constant (used by /health) | US-105 |
| src/config.ts | `loadConfig(env)` → port, dataFile | US-106 |
| src/store.ts | `Kudos` type, `createStore(file)`: list/add/remove, serialised atomic writes | US-106 |
| src/errors.ts | `HttpError`, `sendJson`, `readJsonBody` | US-107 |
| src/app.ts | `createApp({store, clock})`, 404/405/500 handling | US-107 |
| src/routes.ts | `buildRoutes(deps)`: one line per feature module | US-107 |
| src/server.ts | Entry point | US-107 |
| src/summary.ts | `parseIsoWeek`, `summarize`, `summaryRoutes` (GET /summary; ISO week via `Date.UTC`, 53-week rule, code-point tie-break) | US-111 |
| src/health.ts | `healthRoutes` (GET /health, no store access) | US-112 |
| README.md, .env.example | Setup, config, endpoint reference; written after endpoint stories | US-113 |
| src/<feature>.ts | Other feature routes (kudos), added by later stories | later |

## Data model
`Kudos {id: UUID string, from, to (1–40, differ), message (1–280), createdAt ISO 8601}`, stored as an array in `data/kudos.json` (git-ignored). Missing file = empty list; corrupt file = error, never overwritten.

## API inventory

| Route | Notes |
|---|---|
| POST /kudos, GET /kudos, DELETE /kudos/:id | Kudos stories |
| GET /summary?week=YYYY-Www | 200 `{week, counts:[{name,count}], top:[{name,count}]}`; invalid/missing week → 400 field `week`; week 53 only in 53-week years (US-111) |
| GET /health | 200 `{ok:true, version}`; no data-file access (US-112) |
Error shape: `{error, field?}`. 400 bad input, 403 forbidden, 404 unknown id/route, 405 wrong method, 413 body > 10 KB, 500 generic.
DELETE order: 404 → 400 (`X-Requester` missing/empty, field `requester`) → 403 not giver (field `requester`, case/trim-insensitive) → 403 window passed (field `id`).

## Security model
Anonymous, no sign-in. Requester identity is a self-declared header (`X-Requester`), not authentication. Input validated at the boundary; body cap 10 KB; 500s expose no internals.

## Integrations
None.

## Key decisions

| Decision | Reason | Alternatives |
|---|---|---|
| `tsx` for tests, `tsc` for build | Runs TS tests without a build step | Node type stripping (less tooling for NodeNext `.js` imports) |
| Features register routes via `routes.ts` array | Parallel stories touch only one line in a shared file | Inline routes in app.ts (merge conflicts) |
| Promise-chain mutex + temp-file/rename | Meets serialised, atomic writes in-process | File lock library (extra dependency, out of scope) |
| Store doesn't validate or generate ids | Keeps the store simple; handlers own rules | Validation in store |
| Clock injected into app | Deterministic 10-minute window and weekly tests | Fake timers |
| Own ISO-week parser with `Date.UTC`, in summary.ts | No dependency; avoids local-time/DST errors | date library (extra dependency) |
| Tie-break with code-point comparison (`<`), not `localeCompare` | Deterministic regardless of ICU/locale | `localeCompare` |
| Summary computed on request from `store.list()` | Small volumes; no cache to invalidate | Cached aggregates |
| README written last (US-113), verified against running server | Docs must match behaviour | Writing in parallel (drift) |

## Risks
| Risk | L | I | Mitigation |
|---|---|---|---|
| Whole-file rewrite per write slows with large data | Low | Low | Small team volumes; database out of scope |
| Multiple processes corrupt/lose writes | Low | Med | Documented: single process only |
| Identity header is spoofable | High | Low | Accepted per PO (#179) |
| No checks until US-105 lands | Med | Med | US-105 is first in order |
