# Workflow: run the local quality gate

The gate before every commit. The VS Code task `workspace:check` runs the same checks in sequence.

1. Backend: `(cd server && go vet ./... && go test ./...)`, and `gofmt -l server`, which must print
   nothing.
2. Frontend: `pnpm --dir app check` (lint, typecheck, build). Lint warnings (mostly indentation) do
   not fail the gate; do not add new ones in files you touch.
3. Docs: `node cmd/check-docs.mjs` (links resolve, PRDs only referenced inside `_agents/`).
4. If anything fails, fix the **cause**, not the test (do not weaken an assertion to get green), and
   re-run until green.
5. If `docker/` or the build changed: `docker compose -f docker/docker-compose.yml up --build` and
   check `http://localhost:3000` and `http://localhost:3000/api/health/ready`.
