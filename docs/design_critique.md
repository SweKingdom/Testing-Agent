# Design critique — Kudos API

**Verdict:** approved. No issue that would cause real rework or a defect.

## 1. Architecture
Ranked, all minor:
1. **Router and path params (US-107, US-110).** The `Route` type uses a `RegExp` pattern. US-110 says "No change to app.ts if the router supports path params", but nothing says how the regex hands over the `:id` capture. Agree in `ctx` (for example `ctx.params.id`) in US-107, so US-110 doesn't have to touch the shared router.
2. **`registerKudosRoutes` vs `kudosRoutes`.** US-110 says `registerKudosRoutes`, while US-107 says `...kudosRoutes(deps)`. Use one name. The three kudos stories also share `src/kudos.ts`, so the first story to land creates it. This is a merge-conflict risk, not a defect.
3. **Malformed percent-encoding in the id.** `decodeURIComponent` can throw on `/kudos/%E0%A4%A`. State that this returns 404 and not 500. Matching the raw string avoids the problem.

## 2. Security and data
1. The self-declared `X-Requester` is accepted by the PO (#179) and documented as a risk. No change needed.
2. The 10 KB body cap, the generic 500 and the atomic writes are covered. A corrupt file is never overwritten. Nothing is missing.
3. Minor: the 500 path logs to stderr. Make sure it never logs request bodies or headers. Messages are not personal data, but the logging should be deliberate.

## 3. Delivery and testability
1. The order is workable: US-105 → 106 → 107 → 108/109/110/111/112 → 113. The dependencies are stated.
2. The DELETE order (404, then 400, then 403 requester, then 403 window) matches #179 and #180 across the design, US-107 and US-110. The boundary is `> 10 min` rejected, so exactly 10m00s is allowed, which matches AC 1.
3. US-107 AC 5 (`PUT /kudos`) needs a known route. The test uses a stub, so there is no ordering dependency.
4. Fake-clock tests are possible because the clock is injected.
5. Tests need `tsx`. US-105 must add it as a dev dependency before the other stories run their tests.
