# 0001: The Go API uses the standard library, with no web framework

- **Status:** Accepted
- **Date:** 2026-04-26

## Context

The backend needed an HTTP server, routing, middleware, logging and tests. Go offers many routers and
frameworks; since Go 1.22 the standard `http.ServeMux` matches methods and path patterns.

## Decision

- The API is built on `net/http` (`http.ServeMux` with `"GET /api/..."` patterns), `log/slog` and
  `encoding/json`, with small hand-written middleware (CORS, request logging) in
  `server/internal/httpapi/`.
- Tests use the standard `testing` package and `net/http/httptest`.
- The server is one binary (`server/cmd/api`) with packages under `server/internal/`.
- A framework or extra library is added only under concrete pressure.

## Rationale

The README states the template is optimized for "minimal framework lock-in on the backend" and says
to "keep the backend stdlib-first until concrete pressure justifies adding a framework". The first
stack brief (2026-04-20, removed in commit `9ed17e2`) asked for an efficient and robust Go backend
that is one monolith with decoupled components, tested with the Go standard library.

## Alternatives considered

- **A web framework (Gin, Echo, Fiber) or router (chi):** more lock-in; rejected by the
  stdlib-first rule above. No other comparison is documented.

## Consequences

- No third-party HTTP dependencies; the only module dependency is the SQLite driver.
- Features such as request validation or authentication middleware are written by hand.
- Requires Go 1.22 or later for method patterns (the module targets 1.23).
