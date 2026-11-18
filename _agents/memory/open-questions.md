# Open questions, deferred work and technical debt

Current as of 2026-11-18. Add an entry when a decision record says "Rationale not documented", when
work is deferred, or when you find debt. Remove an entry when it is resolved, and say how in the
commit message.

## Decisions whose rationale is not documented

Ask the project owner, then supersede or complete the record.

| Decision | What is unknown |
| --- | --- |
| [0002](../decisions/0002-react-and-vite-frontend-with-pnpm.md) | Which alternatives were weighed, and why Zustand from the first brief was left out |
| [0003](../decisions/0003-frontend-feature-slices-and-api-layers.md) | Which alternative layouts were weighed |
| [0004](../decisions/0004-configuration-from-environment-variables.md) | Why plain environment variables with in-code defaults, rather than a config file or a config library |
| [0005](../decisions/0005-one-container-with-nginx-and-the-api.md) | Why one container with Nginx and the API, rather than separate containers or the Go binary serving the files |
| [0006](../decisions/0006-optional-sqlite-with-user-version-migrations.md) | Why the pure-Go driver `modernc.org/sqlite` and hand-rolled `PRAGMA user_version` migrations rather than a migration tool |

## Missing from the repository

- The first stack brief (`docs/propmts/stack-definition-202604202058.txt`, written 2026-04-20) was
  deleted in commit `9ed17e2`. It explains several decisions but is not archived in
  [`_agents/prds/`](../prds/README.md). It describes a specific product (a listings aggregator), and
  asks for things the template does not have (Zustand for client state, scraping, a Garage cache
  layer). Ask the owner whether to archive it as `2026-04-20-<subject>.md`.

## Undecided policy

- **Who merges pull requests and who deploys (2026-11-18).** Not documented; agents leave the merge
  to the owner until it is.

## Known defects and technical debt

- **Go version notes disagree (2026-11-18).** `server/go.mod` and the Dockerfile use Go 1.23,
  `third-party/docs.md` names a local Go 1.24.5 binary, and the README asks for Go 1.23+. Harmless
  today; align when the toolchain is bumped.
- **Persona prompts in `.github/agents/` (2026-11-18).** About fifty generic personas, some for
  stacks the template does not use (Laravel, Three.js). They are not project knowledge; decide
  whether to keep them.
- **Readiness ignores the database (2026-11-18).** `GET /api/health/ready` answers "ready" without
  checking the SQLite connection. The database is checked at startup only.
