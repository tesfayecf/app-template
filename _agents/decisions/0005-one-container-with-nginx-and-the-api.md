# 0005: One container: Nginx serves the frontend and proxies `/api` to the Go API

- **Status:** Accepted
- **Date:** 2026-09-07

## Context

The application has two parts to deploy: the static frontend build and the Go API binary.

## Decision

- One multi-stage image (`docker/Dockerfile`): pnpm builds the frontend, Go builds a static binary
  (`CGO_ENABLED=0`), and the final stage is `nginx:alpine` with both.
- Nginx serves the frontend and proxies `/api/*` to the API over the container's loopback interface;
  `docker/entrypoint.sh` starts both under `dumb-init`.
- `docker/docker-compose.yml` publishes port 3000 and loads `server/.env` when it exists.
- The frontend calls the API on the same origin by default (`VITE_API_BASE_URL` empty).

## Rationale

Rationale not documented. [`docker/README.md`](../../docker/README.md) describes the setup but not
why one container was chosen. See [open questions](../memory/open-questions.md).

## Alternatives considered

Rationale not documented: separate frontend and API containers, or the Go binary serving the static
files, are the usual alternatives; none is recorded as considered.

## Consequences

- One image to build, publish and run; no CORS in production because requests are same-origin.
- Two processes in one container: `docker/entrypoint.sh` polls both and stops the other when either
  exits, so the container stops and the orchestrator can restart it.
- The image must be built from the repository root so `app/`, `server/` and `docker/` are in context.
