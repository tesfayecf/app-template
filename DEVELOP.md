# Developing App Template

Coding agents start at [`AGENTS.md`](AGENTS.md). Prerequisites, setup and running the stack are in
the [README quick start](README.md#quick-start); the container build is in
[`docker/README.md`](docker/README.md). This file covers testing, common tasks and how a change is
delivered.

## Testing

| Command | When |
| --- | --- |
| `(cd server && go test ./...)` | Every backend change; before every commit |
| `(cd server && go test ./internal/httpapi -run TestName)` | Iterating on one test |
| `gofmt -l server` and `(cd server && go vet ./...)` | Before committing Go code; both must print nothing |
| `pnpm --dir app typecheck` | Every frontend change |
| `pnpm --dir app check` | Before every commit: lint, typecheck and build |
| `node cmd/check-docs.mjs` | Any change to Markdown files, and before every commit |
| `docker compose -f docker/docker-compose.yml up --build` | Changes to `docker/`, the build or how the frontend is served |

The VS Code task `workspace:check` runs the frontend checks, the Go tests and the docs check in
sequence. Go tests are offline and use only the standard library; SQLite tests write to a temporary
directory.

## Common tasks

| Task | Procedure |
| --- | --- |
| Add an API endpoint | [`add-an-api-endpoint.md`](_agents/workflows/add-an-api-endpoint.md) |
| Add a frontend feature | [`add-a-frontend-feature.md`](_agents/workflows/add-a-frontend-feature.md) |
| Record a decision | [`add-a-decision-record.md`](_agents/workflows/add-a-decision-record.md) |
| Run the gate | [`run-the-quality-gate.md`](_agents/workflows/run-the-quality-gate.md) |
| Open a pull request | [`deliver-a-change-by-pull-request.md`](_agents/workflows/deliver-a-change-by-pull-request.md) |

## Contribution workflow

- Branch from `master` as `<type>/<short-description>`; commit in conventional style
  (`<type>(<scope>): <summary>`).
- Open a pull request against `master` with a summary, visual proof for UI or documentation changes,
  the impact, and the validation you ran. Changes to `server/internal/sqlite/` carry an explicit note
  and a test.
- Record significant decisions in [`_agents/decisions/`](_agents/decisions/README.md) before the pull
  request is opened.

Step by step: [`deliver-a-change-by-pull-request.md`](_agents/workflows/deliver-a-change-by-pull-request.md).

## Definition of done

- The stack starts with `./cmd/dev.sh` and the changed behavior works in the browser or against the API.
- The [quality gate](_agents/workflows/run-the-quality-gate.md) is green.
- New behavior has a test (Go) or has been checked by hand and shown in the pull request (frontend).
- `_agents/`, `ARCHITECTURE.md` and the READMEs are updated where the change made them outdated.

## Troubleshooting

- **`Go binary not found`** from `./cmd/dev.sh`: run with `GO_BIN=/absolute/path/to/go ./cmd/dev.sh`.
- **Requests go to `/api/api/...`**: `VITE_API_BASE_URL` in `app/.env` must be empty for the dev
  proxy, or a full origin for a separate API ([lessons learned](_agents/memory/lessons-learned.md)).
- **The API exits at startup with a SQLite error**: the integrity check or a migration failed; a
  corrupt file is moved aside as `<path>.corrupt-<time>`.
- **The web app cannot reach the API in development**: the Vite proxy sends `/api` to
  `VITE_API_PROXY_TARGET` (default `http://localhost:8080`); check the API is running and
  `CORS_ALLOWED_ORIGINS` in `server/.env` includes the web app origin when calling it directly.
