# Project brief — Kudos API

## Goal
A small HTTP API for team members to give, list, retract kudos and see a weekly summary.

## Scope
Five endpoints, JSON file storage, env config, tests, README. See requirements brief.

## Personas
Team member (anonymous; no sign-in).

## Business processes
1. Give kudos: POST /kudos → validate → assign id/createdAt → persist → return.
2. See kudos: GET /kudos[?to][&limit][&offset] → filter → sort newest first → page.
3. Take back: DELETE /kudos/:id with requester → find (404) → check requester and 10-minute window → remove.
4. Weekly summary: GET /summary?week=YYYY-Www → validate → count per recipient → top 3 (ties alphabetical).
5. Health: GET /health → `{ ok, version }`.

## Data entities
Kudos: `id` (string UUID), `from`, `to` (1–40 chars, differ), `message` (1–280), `createdAt` (ISO 8601). Stored as array in `data/kudos.json`.

## Integrations
None.

## Non-functional requirements
Node 22, TypeScript, `node:http` only, `node:test`; scripts typecheck/lint/test/build; never 500 on bad input; serialised file writes.

## Manual steps
None identified (no secrets, hosting, releases or binaries).

## Assumptions
See requirements brief A1–A9.

## Out of scope
Sign-in, UI, editing, notifications, database.

## Checks
No checks exist yet; the scaffold story creates them.
