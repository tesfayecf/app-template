# Decision log

Significant decisions about how App Template is built, and why. One file per decision, named
`NNNN-<title>.md`, written from [`TEMPLATE.md`](TEMPLATE.md).

Rules: decisions are **append-only**. A decision that changes is **superseded** by a new record
(set the old status to `Superseded by NNNN`); it is never edited or deleted. A pull request records
its significant decisions here before it is opened. Rationale must come from evidence in the
repository or from the project owner; where it is unknown the record says "Rationale not
documented" and the item is listed in [`../memory/open-questions.md`](../memory/open-questions.md).

The first six records were backfilled on 2026-11-18 from the code, the commit history and the
existing documentation; their dates are the date the decision first appears in the history.

| ID | Title | Status | Date |
| --- | --- | --- | --- |
| [0001](0001-go-api-on-the-standard-library.md) | The Go API uses the standard library, with no web framework | Accepted | 2026-04-26 |
| [0002](0002-react-and-vite-frontend-with-pnpm.md) | React + Vite frontend without a meta-framework, managed with pnpm | Accepted | 2026-04-26 |
| [0003](0003-frontend-feature-slices-and-api-layers.md) | Frontend in feature slices, with API calls in three layers | Accepted | 2026-09-07 |
| [0004](0004-configuration-from-environment-variables.md) | Configuration from environment variables with in-code defaults | Accepted | 2026-04-26 |
| [0005](0005-one-container-with-nginx-and-the-api.md) | One container: Nginx serves the frontend and proxies `/api` to the Go API | Accepted | 2026-09-07 |
| [0006](0006-optional-sqlite-with-user-version-migrations.md) | Optional SQLite package with `user_version` migrations and safety checks | Accepted | 2026-09-07 |
| [0007](0007-context-system-agents-docs-and-prds.md) | One context system: `AGENTS.md`, `_agents/`, `DEVELOP.md`, `ARCHITECTURE.md` | Accepted | 2026-11-18 |
