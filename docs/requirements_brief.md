# Requirements brief — Kudos API

## Goal
Team members thank each other through a small HTTP API ("kudos"): give, list, take back, see a weekly summary. Built to try AgentStudio end to end, so it stays small.

## In scope
- Project scaffold: Node.js 22, TypeScript, `node:http`, `node:test`, scripts `typecheck`, `lint`, `test`, `build`.
- JSON file storage (`data/kudos.json`, created on first write).
- Config via `PORT` (default 3000) and `DATA_FILE` (default `data/kudos.json`), documented in `.env.example`; `.env` never committed.
- Uniform JSON errors `{ "error", "field" }`: 400 invalid input, 404 unknown id, never 500 for bad input.
- Endpoints: `POST /kudos`, `GET /kudos` (filter `to`, paging), `DELETE /kudos/:id` (within 10 min), `GET /summary?week=`, `GET /health`.
- README: install, run, test, one section per endpoint.

## Out of scope
Sign-in, a UI, editing kudos, email/chat notifications, a database.

## Actors and permissions
- Team member (anonymous, no sign-in). Anyone can give and list kudos, and read the summary.
- Delete: the request must say who is asking. Who may delete is an open question (see Q1).

## Behaviours
| Capability | Normal path | Edge cases |
|---|---|---|
| Give | Valid `from`,`to`,`message` → 201 with saved kudos (`id`, `createdAt` ISO 8601) | Missing/non-string/empty/too long fields → 400 with `field`; `from` = `to` → 400; invalid JSON body → 400; data file absent → created |
| List | Newest first; `to` filter; `limit` (default 20, max 100), `offset` | limit >100 or <1, non-integer, negative offset → 400; empty result → empty list; ties in createdAt keep stable order |
| Delete | Removes kudos if age ≤ 10 min and requester allowed → 204/200 | Unknown id → 404; older than 10 min → rejected; requester missing → 400; not allowed → rejected |
| Summary | Per ISO week (Mon start): count received per person + top 3, ties alphabetical | Invalid/missing week → 400; week with no kudos → empty counts and top3 |
| Health | `{ "ok": true, "version": <package.json> }` | — |
| Concurrency | Writes serialised so parallel requests do not lose data | Corrupt/empty data file handled without 500 on bad input |

## Constraints
Node 22, TypeScript, no framework, no database, `node:test`. JSON file persistence. Env-only config. Unknown routes/methods get JSON errors.

## Dependencies
None external.

## Assumptions
- A1: Name length counted after trimming whitespace; names are case-sensitive for `to` filter and summary.
- A2: Time zone for ISO weeks and the 10-minute window is UTC.
- A3: POST returns 201; successful DELETE returns 204.
- A4: GET /kudos returns `{ "items": [...], "total", "limit", "offset" }`.
- A5: Summary shape `{ "week", "counts": [{ "name", "count" }], "top": [...] }`, counts sorted by count desc then name.
- A6: Unknown route → 404 JSON; unsupported method → 405 JSON.
- A7: "Version" returned as `version` field in /health.
- A8: Delete after 10 minutes returns 403.
- A9: No manual steps: no hosting, secrets, or releases are required.

## Open questions
- Scope/behaviour: Q1 how the requester is identified on DELETE and who may delete (only the giver?). Q2 error status for delete after the 10-minute window (403 vs 400)?
- Manual steps: none found.
