# Conventions in practice

Current as of 2026-11-18. Commands and the contribution procedure are in
[`DEVELOP.md`](../../DEVELOP.md); this file records the habits the code follows.

## Go (`server/`)

- Go 1.23 (`server/go.mod`; the Docker build uses `golang:1.23-alpine`), formatted with `gofmt`.
- Standard library first: `net/http` with method-and-path patterns on `http.ServeMux`
  (`"GET /api/health/live"`), `log/slog` for logs. Add a dependency only under concrete pressure
  ([decision 0001](../decisions/0001-go-api-on-the-standard-library.md)).
- Everything is under `internal/`, one package per concern: `config` (settings), `httpapi` (routes,
  middleware, JSON helpers), `sqlite` (storage). `cmd/api/main.go` only wires them together.
- Routes are registered in `httpapi.NewServer`; responses go through `WriteJSON` or `WriteError`,
  request bodies through `DecodeJSON` (all in `httpapi/json.go`). All API paths start with `/api/`.
- Errors are wrapped with context: `fmt.Errorf("verb object: %w", err)`.
- New settings: a field in `config.Config`, read in `config.Load` with `getEnv`, `getDuration` or
  `getList` and a default, and a line in `server/.env.example`.

## Tests

- Go tests use only the standard `testing` package and `net/http/httptest`, sit beside the code
  (`*_test.go`) and run offline. SQLite tests use `t.TempDir()`.
- Test names describe behavior (`TestCORSMiddlewareAllowsConfiguredOrigin`).
- The frontend has no test runner yet; `typecheck` and `build` are its checks.

## Frontend (`app/`)

- React 19, TypeScript with `strict` and `noUncheckedIndexedAccess`, Vite, pnpm 10.6.1 (Node 22.14+).
- Layout: `src/app/` (bootstrap, router, shell, error pages), `src/features/<name>/` (each slice owns
  its UI, service and query keys), `src/shared/` (only what several features need).
- API calls follow [`app/docs/api-conventions.md`](../../app/docs/api-conventions.md): transport in
  `shared/api/client.ts`, `<feature>.service.ts` for paths and types, `<feature>.keys.ts` for
  TanStack Query keys, one shared `QueryClient`
  ([decision 0003](../decisions/0003-frontend-feature-slices-and-api-layers.md)).
- Styles in `src/shared/styles/global.css`.
- ESLint config in `app/eslint.config.js` (flat config, TypeScript, React, security, promise, jsdoc);
  it reports many indentation warnings today, which are not treated as failures.

## Git and documentation

- Main branch `master`. Branches `<type>/<short-description>`; commits in conventional style
  (`feat(server): ...`, `fix(app): ...`, `docs: ...`). Earlier history used plain sentences
  ("Add Docker build and runtime support").
- Documentation: one home per fact; update `_agents/` in the same change that makes it stale.
