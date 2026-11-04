# Delivery Plan — Project TA (Testing Agent)

## Summary
- **Scope:** Small HTTP API for giving, listing and retracting kudos, plus a weekly summary, health check and README (Epic EP-101; Features FT-102, FT-103, FT-104).
- **Stories:** 9 (US-105 to US-113).
- **Total points:** 29 (Fibonacci estimates).
- **Sprints:** 2 (capacity 20 points each, default).
  - Sprint 1: 17 points (85% of capacity).
  - Sprint 2: 12 points (60% of capacity).
- **Key risks:** No project checks are configured yet, so test and lint gates must be set up in US-105. The 10-minute delete window and requester rules depend on the PO answers (#179, #180), which are followed here.

## Sprint plan
| Sprint | Stories | Points | Goal |
|---|---|---|---|
| 1 | US-105, US-106, US-107, US-108, US-112, US-110 | 17 | Runnable foundation (scaffold, config, JSON store, HTTP/error layer), kudos give and retract, health check |
| 2 | US-109, US-111, US-113 | 12 | Kudos listing with filter and paging, weekly summary, README and endpoint reference |

## Story order (global rank)
| Rank | Story | Points | MoSCoW | Priority | WSJF | Depends on |
|---|---|---|---|---|---|---|
| 1 | US-105 Project scaffold (devops) | 2 | Must | 1 | 8.5 | — |
| 2 | US-106 Configuration and JSON file store | 3 | Must | 1 | 5.0 | US-105 |
| 3 | US-107 HTTP server, routing, JSON errors | 5 | Must | 1 | 3.4 | US-105, US-106 |
| 4 | US-108 Give kudos: POST /kudos | 3 | Must | 1 | 6.7 | US-106, US-107 |
| 5 | US-112 Health check: GET /health | 1 | Should | 3 | 11.0 | US-107 |
| 6 | US-110 Take back kudos: DELETE /kudos/:id | 3 | Must | 2 | 4.7 | US-107, US-108 |
| 7 | US-109 List kudos: GET /kudos (filter, paging) | 5 | Must | 2 | 3.0 | US-107, US-108 |
| 8 | US-111 Weekly summary: GET /summary?week= | 5 | Must | 2 | 2.6 | US-107, US-108 |
| 9 | US-113 README | 2 | Should | 3 | 4.5 | US-108–US-112 |

WSJF = (business value + time criticality + risk reduction) / points. Scores are planner estimates.

## Critical path
US-105 → US-106 → US-107 → US-108 → US-109 / US-111 → US-113

## Milestones
- **MVP (end of Sprint 1):** Give, retract and health endpoints working with tests. Foundation in place.
- **UAT-ready (end of Sprint 2):** All Must stories done (list, summary), README written.
- **Go-live:** After UAT sign-off, release and smoke test (health check).

## Risks & mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| No project checks configured (typecheck, lint, test, build) | Quality gates unverified | US-105 sets up the scripts; the summary states checks are not yet passing |
| JSON file store concurrency and durability | Lost or corrupted kudos under concurrent writes | Keep store simple and tested in US-106; note limit in README (US-113) |
| Delete rules (requester header, 10-minute window) | Rework if misread | Follow PO answers #179 and #180: X-Requester header, giver only, 403 for non-giver and expired window, 404 checked first |
| Sprint 1 at 85% capacity | Slip into Sprint 2 | US-112 (1 point) is the buffer; move it to Sprint 2 if needed |

## Assumptions
- Capacity is 20 points per 2-week sprint for the AI team.
- Requester identity is passed in the `X-Requester` header; authentication is out of scope.
- Error order for protected operations: 404 (unknown id), then 400 (missing requester), then 403 (not giver or window passed).
- US-112 and US-113 are Should; all other stories are Must.
- Dependencies are planner assumptions based on the solution design module map.
