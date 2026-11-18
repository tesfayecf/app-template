# Lessons learned

Pitfalls that already cost time. Each entry is dated and says where the fix lives.

- **An ESLint `ignores` next to `files` is not global (2026-11-18).** `app/eslint.config.js` listed
  `.cache/**` in the same object as `files`, so ESLint linted Vite's dependency cache in `app/.cache`
  and failed with "rule not found" errors. The ignores are now their own config object, which makes
  them global. Keep them that way.
- **The API base URL was applied twice (2026-11-18).** `app/.env.example` set
  `VITE_API_BASE_URL=/api`, and services already use paths starting with `/api/`, so a copied
  `app/.env` sent requests to `/api/api/...`. The example is now empty; set the variable only to a
  separate origin such as `https://api.example.com`. A second name, `VITE_API_ORIGIN`, was removed so
  the build and the client read the same one.
- **A configured feature that nothing used (2026-11-18).** `SQLITE_PATH` was read into the config
  but the API never opened a database, while the README said setting it enabled SQLite. The startup
  now uses it (`server/cmd/api/database.go`, tested in `database_test.go`). When adding a setting,
  add the code that uses it and a test in the same change.
- **`os.Exit` skips deferred cleanup (2026-11-18).** `main` now calls `run`, which returns an error,
  so the database is closed on every path.
- **Docs drift from the code (2026-11-18).** The README named a `/api/healthz` endpoint that does not
  exist; the routes are `/api/health/live` and `/api/health/ready`. Check documented paths and
  commands against the code after any rename.
