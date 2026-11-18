# 0006: Optional SQLite package with `user_version` migrations and safety checks

- **Status:** Accepted
- **Date:** 2026-09-07

## Context

Products built from the template usually need local persistence, but the template has no product
schema of its own.

## Decision

- `server/internal/sqlite/` provides `Open`, `Migrate`, `CurrentSchemaVersion`, `IntegrityCheck` and
  `BackupDatabase`, on the pure-Go driver `modernc.org/sqlite`.
- Connections use WAL, `foreign_keys(ON)`, a busy timeout, immediate transactions and one open
  connection.
- Migrations are a product-supplied list of `{Version, SQL}` in strictly increasing order; each runs
  in its own transaction and sets `PRAGMA user_version`.
- `Open` moves a corrupt database file (and its `-wal`/`-shm` files) aside as `.corrupt-<time>` and
  starts a fresh one; `BackupDatabase` writes `VACUUM INTO` snapshots.
- It is optional: configured by `SQLITE_PATH` and `SQLITE_BACKUP_DIR`. When the path is set, the API
  startup (`server/cmd/api/database.go`) opens the database, refuses one that fails the integrity
  check, backs up an existing schema before pending migrations, and migrates it to `appMigrations`.

## Rationale

The README says "the template does not impose a product schema" and that products supply their own
migrations to `sqlite.Migrate`. The first stack brief (2026-04-20, removed in commit `9ed17e2`) chose
SQLite as "the best option for fast prototyping and single user scale". The pure-Go driver matches
the Docker build's `CGO_ENABLED=0`, but whether that was the reason, and why migrations are
hand-rolled rather than a migration tool, is not documented. See
[open questions](../memory/open-questions.md).

## Alternatives considered

Rationale not documented: no other database, driver or migration tool is recorded as considered.

## Consequences

- One writer at a time (`SetMaxOpenConns(1)`); fits a single-user product, not a high-write service.
- A corrupt database does not stop startup, but the product starts empty until the quarantined file
  is recovered by hand.
- A failed integrity check or migration stops the API at startup rather than serving bad data.
