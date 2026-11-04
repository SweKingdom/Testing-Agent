# Solution design — Kudos API

## Architecture overview
A single Node 22 / TypeScript process using `node:http` only, JSON-file storage (`data/kudos.json`, array of kudos), config from the environment, and `node:test`. No auth, no integrations. The repo currently holds only docs; the scaffold story creates `src/`, the checks and the store.

## Module map (FT-103 view; scaffold names assumed)
| Path | Responsibility | Story |
|---|---|---|
| src/app.ts | Server and router; one line calls `registerKudosRoutes` | scaffold |
| src/errors.ts | `HttpError(status, message, field?)` → `{error, field}` JSON | scaffold |
| src/store.ts | Read all, serialised add / remove writes to the JSON file | scaffold |
| src/kudos.ts | POST, GET and DELETE `/kudos` handlers and validation | US-108, US-109, US-110 |
| src/paging.ts | `parsePaging` | US-109 |
| test/kudos-*.test.ts | One file per story | all |

## Data model
Kudos: `id` string UUID; `from`, `to` string 1–40 (trimmed); `message` string 1–280 (trimmed); `createdAt` ISO 8601 UTC.

## API inventory
| Route | Success | Errors |
|---|---|---|
| POST /kudos | 201 kudos | 400 `{error, field}` (from, to, message, body) |
| GET /kudos?to&limit&offset | 200 `{items, total, limit, offset}` | 400 field `limit` or `offset` |
| DELETE /kudos/:id (header `X-Requester`) | 204 | 404 `id`; 400 `requester`; 403 `requester` (not the giver); 403 `id` (window passed) |
| GET /summary, GET /health | covered by other features | |

DELETE check order: 404 → 400 → 403 requester → 403 window.

## Security model
No sign-in. The requester is a self-declared header, so it is a guard against mistakes, not real authorisation. Input is validated at the boundary, with a body size limit, and bad input never returns 500.

## Integrations
None.

## Key decisions
- Keep all three kudos handlers in one `src/kudos.ts` · lean, under about 300 lines · separate files per route.
- Injected clock and id generator · deterministic tests of the 10-minute window.
- Requester in `X-Requester` header, case/space-insensitive; window expiry is 403 with field `id` · product owner #179, #180.
- Rejected requests validate fully before any store write · no side effects.

## Risks
- The scaffold's names and router shape are not yet known (medium, low): specs say to use the scaffold's names; developers should read the scaffold first.
- Stories share `src/kudos.ts`, so parallel branches may conflict (medium, low): the first one creates it with `registerKudosRoutes`; the others append handlers.
- The requester is not authenticated (certain, accepted): out of scope.
- Concurrent writes to the file (low, medium): all writes go through the serialised store.
