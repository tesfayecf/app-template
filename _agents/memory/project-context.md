# Project context

Current as of 2026-11-18. Read this for the "why" and the boundaries of the template. For how it is
built see [`ARCHITECTURE.md`](../../ARCHITECTURE.md); for what it includes see the root
[`README.md`](../../README.md).

## What App Template is

A starter repository for products with a Go backend and a React frontend. It provides a working
skeleton (an API with health endpoints, a web app that calls them, an optional SQLite package, a
single-container Docker build and local tooling) and the conventions to grow it. It has no product
domain, schema or authentication: those belong to the product built from it.

The first brief behind the stack (2026-04-20, removed from the repository in commit `9ed17e2`) was
for a single-user application that scrapes and aggregates listings, with a Go monolith split into
decoupled domain components, SQLite plus a Garage S3 store for caching, and a minimal React frontend.
The template keeps the generic parts of that stack.

## Users

- **The owner**: a software engineer who starts new products from this template and develops them
  locally, alone or with coding agents.
- **Coding agents**: work in the template or in a product copied from it, starting at
  [`AGENTS.md`](../../AGENTS.md).

## Status

- Working: Go API with `GET /api/health/live` and `GET /api/health/ready`, CORS and request logging,
  graceful shutdown; web app with routing, a health page, the API client and query conventions;
  Docker image; VS Code tasks.
- Optional SQLite: with `SQLITE_PATH` set, the API opens, checks and migrates the database at
  startup. The template ships no migrations.
- Optional local helpers: `cmd/sqlite.sh` and `cmd/garage.sh` (Garage object storage).

## Non-goals

- A backend framework while the standard library is enough
  ([decision 0001](../decisions/0001-go-api-on-the-standard-library.md)).
- A framework on top of React, such as Next.js or Remix
  ([decision 0002](../decisions/0002-react-and-vite-frontend-with-pnpm.md)).
- A product schema, authentication or business features in the template itself.
- Microservices: the brief asked for one monolith with decoupled components.

## Starting a product from this template

Rename the Go module path in `server/go.mod` (the README quick start says so), rewrite this file for
the product, and keep the decision log as history, appending the product's own decisions.
