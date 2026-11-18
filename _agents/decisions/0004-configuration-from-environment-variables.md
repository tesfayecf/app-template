# 0004: Configuration from environment variables with in-code defaults

- **Status:** Accepted
- **Date:** 2026-04-26

## Context

The API needs settings (listen address, timeouts, allowed CORS origins, the optional database path)
that differ between development, Docker and production.

## Decision

- The API reads only environment variables, in `server/internal/config/config.go`, with a default
  for each. Invalid durations make startup fail.
- `server/.env.example` lists every variable; `server/.env` is git-ignored and loaded by Compose when
  present. The web app's build-time values are `VITE_*` variables (`app/.env.example`).

## Rationale

Rationale not documented. See [open questions](../memory/open-questions.md).

## Alternatives considered

Rationale not documented: a config file (YAML, TOML) or a configuration library are the usual
alternatives; none is recorded as considered.

## Consequences

- A new setting is a field in `config.Config`, a line in `config.Load` and a line in
  `server/.env.example`.
- No configuration file to mount in the container; the Docker image stays generic.
