# 0002: React + Vite frontend without a meta-framework, managed with pnpm

- **Status:** Accepted
- **Date:** 2026-04-26

## Context

The product needs a web interface on top of the Go API. The frontend is meant to be a thin layer: the
backend owns the behavior.

## Decision

- React with TypeScript, bundled by Vite, as a single-page app in `app/`. No framework on top of
  React (no Next.js, Remix or similar).
- TanStack Query for server state; React Router for routing.
- pnpm (pinned in `app/package.json`) manages packages.

## Rationale

The first stack brief (2026-04-20, removed in commit `9ed17e2`) asked for "a minimal layer on top of
the backend with intelligent caching and efficiency", React with Vite as the bundler, no framework on
top of React, TanStack Query for server state and pnpm for package management, and said the UI was
not the main concern. The same brief also asked for Zustand for client state; it is not in
`app/package.json`, and why it was left out is not documented.

## Alternatives considered

Rationale not documented: no alternative is recorded beyond the brief's exclusion of frameworks on
top of React.

## Consequences

- The build output is static files, which Nginx serves in the container
  ([0005](0005-one-container-with-nginx-and-the-api.md)).
- No server-side rendering.
- Caching of API data is TanStack Query's job, organized by [0003](0003-frontend-feature-slices-and-api-layers.md).
