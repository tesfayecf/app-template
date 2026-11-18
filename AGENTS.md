# AGENTS.md

The entry point for any AI coding agent (Claude Code, Codex, Cursor, Aider and others) working in this
repository. It is tool-agnostic. Read it in full, then follow the links for detail. Keep it short and
accurate: update it in the same change that makes it wrong.

## Project overview

App Template is an opinionated starter for products with a Go backend and a React frontend. It is
optimized for short local feedback loops, little framework lock-in on the backend and a frontend
layout that stays readable as features accumulate. A product is started by copying it and building
features on top. The template itself has no product schema and no authentication. High-risk areas:
the SQLite safety code (`server/internal/sqlite/`: integrity checks, backups, quarantine of corrupt
files), because a mistake there loses data in every product built on it.

## Key facts

- Go API in `server/` (module `example.com/app-template/server`, a placeholder to rename), standard
  library `net/http` only: entry point `server/cmd/api/`, routes and middleware in
  `server/internal/httpapi/`, settings in `server/internal/config/`.
- React 19 + Vite + TypeScript web app in `app/`, managed with pnpm 10.6.1; React Router and TanStack
  Query. Source split into `app/src/app`, `app/src/features`, `app/src/shared`.
- The frontend never builds API URLs in components: transport in `app/src/shared/api/`, endpoint
  services and query keys beside each feature ([`app/docs/api-conventions.md`](app/docs/api-conventions.md)).
- Optional SQLite package in `server/internal/sqlite/` (pure-Go driver, WAL, `PRAGMA user_version`
  migrations, backups). When `SQLITE_PATH` is set, `server/cmd/api/database.go` opens, checks, backs up
  and migrates it at startup; a product adds its schema to `appMigrations` there.
- Configuration is environment variables only: `server/.env` (see `server/.env.example`), read by
  `server/internal/config/config.go`; `app/.env` (see `app/.env.example`) for `VITE_*` values.
- Docker: one image, Nginx serves the built frontend and proxies `/api/*` to the Go API
  ([`docker/README.md`](docker/README.md)).
- `.github/agents/` holds generic persona prompts, not project knowledge and not CI.

## Quick start for agents

```bash
cp server/.env.example server/.env && cp app/.env.example app/.env   # never print or commit .env
pnpm --dir app install
./cmd/dev.sh                                  # API on :8080 + web app on http://localhost:3000
(cd server && go test ./...)                  # backend tests: must stay green
pnpm --dir app check                          # frontend lint, types and build
node cmd/check-docs.mjs                       # context docs: links resolve, PRDs stay in _agents/
```

One Go test: `(cd server && go test ./internal/httpapi -run TestName)`. The full gate is in [`run-the-quality-gate.md`](_agents/workflows/run-the-quality-gate.md); all
commands are in [`DEVELOP.md`](DEVELOP.md).

## Repository map

| Path | What is there |
| --- | --- |
| `server/` | Go API: `cmd/api/` entry point, `internal/config`, `internal/httpapi`, `internal/sqlite` |
| `app/` | React + Vite web app; `app/docs/` holds frontend conventions |
| `cmd/` | Shell helpers (`dev.sh`, `sqlite.sh`, `garage.sh`) and `check-docs.mjs` |
| `docker/` | Dockerfile, Compose file, Nginx config, entrypoint |
| `config/` | Configuration for optional local services (Garage) |
| `third-party/` | Place for local tool binaries (git-ignored), with a version note |
| `.vscode/` | Workspace tasks (`workspace:dev`, `workspace:check`) and launch configs |
| `.github/agents/` | Generic persona prompts for GitHub Copilot agents |
| `_agents/` | Project memory, decision records, PRDs, workflows (index below) |
| `.claude/` | Claude Code settings and command pointers only: no project knowledge |
| `DEVELOP.md`, `ARCHITECTURE.md` | Developer guide; system structure |

## Context index

Everything in [`_agents/`](_agents/README.md). Read the file when the "when" column applies.

### Memory (`_agents/memory/`)

| File | Contains | Read when |
| --- | --- | --- |
| [`project-context.md`](_agents/memory/project-context.md) | What the template is and is not, users, status, non-goals, how to start a product from it | Starting on the project; deciding whether something belongs in the template |
| [`conventions.md`](_agents/memory/conventions.md) | Go, frontend, test, git and documentation habits | Before writing code or tests |
| [`lessons-learned.md`](_agents/memory/lessons-learned.md) | What went wrong before and what it taught | Before changing the ESLint config, `VITE_*` variables, startup in `main.go` or documented endpoints |
| [`open-questions.md`](_agents/memory/open-questions.md) | Undocumented rationale, gaps, known defects | Before starting a feature; when you find a bug you will not fix |

### Decisions (`_agents/decisions/`, append-only)

Index and rules: [`README.md`](_agents/decisions/README.md); template: [`TEMPLATE.md`](_agents/decisions/TEMPLATE.md).

| Record | Read before |
| --- | --- |
| [0001 stdlib Go API](_agents/decisions/0001-go-api-on-the-standard-library.md) | Adding a Go dependency, a router or a framework |
| [0002 React + Vite](_agents/decisions/0002-react-and-vite-frontend-with-pnpm.md) | Adding a frontend framework, state library or package manager |
| [0003 feature slices](_agents/decisions/0003-frontend-feature-slices-and-api-layers.md) | Adding a frontend feature, an API call or code under `shared/` |
| [0004 env config](_agents/decisions/0004-configuration-from-environment-variables.md) | Adding a setting |
| [0005 one container](_agents/decisions/0005-one-container-with-nginx-and-the-api.md) | Changing the Dockerfile, Nginx config or how the frontend is served |
| [0006 optional SQLite](_agents/decisions/0006-optional-sqlite-with-user-version-migrations.md) | Touching `server/internal/sqlite/` or adding persistence |
| [0007 context system](_agents/decisions/0007-context-system-agents-docs-and-prds.md) | Changing where documentation or agent instructions live |

### PRDs (`_agents/prds/`, immutable, historical)

[`README.md`](_agents/prds/README.md) is the index with dates, sources and status. It is empty so
far. Read a PRD only to understand the intent behind a past change, never to learn current behavior.

### Workflows (`_agents/workflows/`)

Index: [`README.md`](_agents/workflows/README.md).

| File | Read when |
| --- | --- |
| [`add-an-api-endpoint.md`](_agents/workflows/add-an-api-endpoint.md) | You add or change a route in the Go API |
| [`add-a-frontend-feature.md`](_agents/workflows/add-a-frontend-feature.md) | You add a page or a feature to the web app |
| [`add-a-decision-record.md`](_agents/workflows/add-a-decision-record.md) | You make a significant decision |
| [`run-the-quality-gate.md`](_agents/workflows/run-the-quality-gate.md) | You are about to commit |
| [`deliver-a-change-by-pull-request.md`](_agents/workflows/deliver-a-change-by-pull-request.md) | You are about to open a pull request |

## Human-oriented documents

- [`README.md`](README.md): what the template includes, quick start, structure.
- [`DEVELOP.md`](DEVELOP.md): testing, common tasks, contribution workflow, definition of done.
- [`ARCHITECTURE.md`](ARCHITECTURE.md): components, key flows, constraints.
- [`docker/README.md`](docker/README.md): building and running the container.
- [`app/docs/api-conventions.md`](app/docs/api-conventions.md): how the frontend calls the API.

## Working rules

1. **The application must build and run after every change**, and **all existing tests must pass**
   ([quality gate](_agents/workflows/run-the-quality-gate.md)).
2. **Deliver by pull request** against `master` with a summary, visual proof for UI changes, an
   impact explanation and the validation you ran. Branch as `<type>/<short-description>`, commit in
   conventional style. Procedure: [`deliver-a-change-by-pull-request.md`](_agents/workflows/deliver-a-change-by-pull-request.md).
3. **Record every significant decision** in `_agents/decisions/` before the pull request is opened.
4. **Update project memory** in `_agents/` (and `ARCHITECTURE.md`, `README.md`, `docker/README.md`)
   in the same change that makes it outdated.
5. **PRDs are historical snapshots**, not the source of truth for current behavior. They live only in
   `_agents/prds/` and are never edited except for typos. Never reference a PRD or a requirement
   identifier from code, tests, scripts, configuration, comments or any document outside `_agents/`.
   Describe the behavior and the reason instead.
6. **Don't weaken data safety.** The SQLite package's integrity check, backups, corrupt-file
   quarantine, strictly increasing migration versions and one transaction per migration exist on purpose
   (`server/internal/sqlite/sqlite_test.go` and `server/cmd/api/database_test.go` guard them). A change there needs a test and an
   explicit note in the pull request.
7. **Secrets.** Never read, print or commit `server/.env`, `app/.env` or any secret. No secrets,
   tokens or internal URLs in docs.
8. **Match the code around you.** Go: `gofmt`, standard library first, tests with the standard
   `testing` package. Frontend: TypeScript strict, the ESLint config in `app/eslint.config.js`, the
   service and query-key pattern. Details: [`conventions.md`](_agents/memory/conventions.md).
9. **Never invent rationale.** If a reason is not in the repository or from the owner, write
   "Rationale not documented" and add an entry to `_agents/memory/open-questions.md`.
10. **One home per fact.** Link instead of copying between `README.md`, `docs`, `_agents/` and the
    root files.
