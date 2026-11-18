# 0003: Frontend in feature slices, with API calls in three layers

- **Status:** Accepted
- **Date:** 2026-09-07

## Context

A frontend that grows feature by feature tends to scatter API URLs, query keys and shared helpers
across components.

## Decision

- `app/src/` is split into `app/` (bootstrap, router, shell), `features/` (one folder per product
  slice, owning its UI and data hooks) and `shared/` (only what several features need).
- API access has three layers ([`app/docs/api-conventions.md`](../../app/docs/api-conventions.md)):
  transport in `shared/api/client.ts`, endpoint paths and response types in a feature service, and
  TanStack Query keys in a feature key module. Components never build API URLs.
- One `QueryClient` (`shared/api/queryClient.ts`); mutations invalidate the narrowest affected key.

## Rationale

The README states the template aims for "a frontend structure that stays readable as features
accumulate" and says to put product behavior in `features` first and promote code to `shared` only
when several features truly need it. Introduced in commit `ffae2f0` ("Add frontend application
foundation").

## Alternatives considered

Rationale not documented: no alternative layout is recorded. Layering by type (all components in one
folder, all hooks in another) is the common alternative this rules out.

## Consequences

- Adding an endpoint on the frontend touches a service and a key module, not just a component.
- `shared/` stays small; reviewers question anything added there.
