# Architecture

How App Template is built. What it includes and how to start it: [`README.md`](README.md). Why it is
built this way: [`_agents/decisions/`](_agents/decisions/README.md).

## Overview

Two programs: a Go HTTP API (`server/`) and a React single-page app (`app/`). In development they run
side by side and Vite proxies `/api` to the API. In production one container runs both behind Nginx.
An optional SQLite package provides local persistence for products built from the template.

## Components

| Component | Path | Responsibility | Depends on | Used by |
| --- | --- | --- | --- | --- |
| API entry point | `server/cmd/api/` | Load config, open the optional database, build the server, listen, shut down gracefully on SIGINT/SIGTERM (10 s) | `config`, `httpapi`, `sqlite` | Docker image, `cmd/dev.sh` |
| Config | `server/internal/config/` | Read environment variables with defaults; fail on invalid durations | Standard library | Entry point, `httpapi` |
| HTTP API | `server/internal/httpapi/` | Routes (`/api/health/live`, `/api/health/ready`), CORS and logging middleware, JSON helpers | `config` | Entry point |
| SQLite | `server/internal/sqlite/` | Open with WAL and safe pragmas, quarantine corrupt files, migrate by `user_version`, integrity check, backups | `modernc.org/sqlite` | API entry point, when `SQLITE_PATH` is set |
| App bootstrap | `app/src/app/` | Providers, router, shell, error and not-found pages | `shared` | `main.tsx` |
| Features | `app/src/features/` | One slice per product area: UI, service, query keys (`health` today) | `shared/api` | Router |
| Shared API | `app/src/shared/api/` | `apiRequest` transport, `ApiError`, the one `QueryClient` | Browser `fetch` | Features |
| Container | `docker/` | Build both parts, run Nginx and the API in one image | Both programs | Deployments |

## Configuration

API settings are environment variables (`server/.env.example`), read once at startup by
`config.Load`. Frontend values are `VITE_*` variables fixed at build time (`app/.env.example`).
See [decision 0004](_agents/decisions/0004-configuration-from-environment-variables.md).

## Data model

None in the template. A product appends its migrations to `appMigrations` in
`server/cmd/api/database.go`
([decision 0006](_agents/decisions/0006-optional-sqlite-with-user-version-migrations.md)).

## Key flows

### Request in development

```text
browser :3000 ──> Vite dev server ──(/api/*, proxy)──> Go API :8080 ──> handler ──> JSON
                     └── other paths: the React app (client-side routing)
```

### Request in the container

```text
browser :3000 ──> Nginx :80 ──(/api/*)──> Go API 127.0.0.1:8080
                    ├── /assets/*: built static files
                    └── other paths: index.html (client-side routing)
```

### Frontend data fetch

```text
Component ──useQuery(key, fn)──> <feature>.keys.ts + <feature>.service.ts
          ──> shared/api/client.ts apiRequest ──fetch──> /api/...
          <── typed response, or ApiError; cached by the shared QueryClient
```

### API startup and shutdown

`config.Load` → open the database if `SQLITE_PATH` is set (next flow) → `httpapi.NewServer` (middleware: logging → CORS → mux) → `ListenAndServe` in a
goroutine. On SIGINT or SIGTERM, `Shutdown` drains connections for up to 10 seconds; a listen error
exits with status 1.

### Opening the SQLite database at startup

`sqlite.Open` → on "malformed" or "not a database" errors, rename the file and its `-wal`/`-shm`
to `<path>.corrupt-<time>` and open a fresh one → `IntegrityCheck` (failure stops startup) →
`BackupDatabase` to `SQLITE_BACKUP_DIR` when an existing schema has pending migrations → `Migrate`
(one transaction per version). The database is closed after the server shuts down.

## Constraints

- Standard library first on the backend ([0001](_agents/decisions/0001-go-api-on-the-standard-library.md)).
- No framework on top of React ([0002](_agents/decisions/0002-react-and-vite-frontend-with-pnpm.md)).
- Components never build API URLs ([0003](_agents/decisions/0003-frontend-feature-slices-and-api-layers.md)).
- The Go binary is built with `CGO_ENABLED=0`, so dependencies must be pure Go.
- SQLite allows one open connection: one writer at a time.

## Agents

Coding agents work from [`AGENTS.md`](AGENTS.md) and the `_agents/` folder
([decision 0007](_agents/decisions/0007-context-system-agents-docs-and-prds.md)). The application
itself has no agent integration.

## Decisions

All records: [`_agents/decisions/README.md`](_agents/decisions/README.md).
[0001](_agents/decisions/0001-go-api-on-the-standard-library.md) backend,
[0002](_agents/decisions/0002-react-and-vite-frontend-with-pnpm.md) frontend stack,
[0003](_agents/decisions/0003-frontend-feature-slices-and-api-layers.md) frontend layout,
[0004](_agents/decisions/0004-configuration-from-environment-variables.md) configuration,
[0005](_agents/decisions/0005-one-container-with-nginx-and-the-api.md) container,
[0006](_agents/decisions/0006-optional-sqlite-with-user-version-migrations.md) SQLite,
[0007](_agents/decisions/0007-context-system-agents-docs-and-prds.md) context system.
