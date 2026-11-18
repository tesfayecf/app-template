# 0007: One context system: `AGENTS.md`, `_agents/`, `DEVELOP.md`, `ARCHITECTURE.md`

- **Status:** Accepted
- **Date:** 2026-11-18

## Context

Project knowledge lived in the root `README.md`, `docker/README.md` and `app/docs/`. There was no
entry point for coding agents, no record of why the stack was chosen, and the first stack brief had
been deleted from the repository. `.github/agents/` holds generic persona prompts, not knowledge about
this project.

## Decision

- `AGENTS.md` is the single, tool-agnostic entry point; `CLAUDE.md` only points to it (plus one
  labeled, minimal tool-specific section).
- `_agents/` holds project memory, decision records, workflows and the PRD archive.
- `DEVELOP.md` and `ARCHITECTURE.md` are the human-and-agent entry points for working on and
  understanding the system. `README.md`, `docker/README.md` and `app/docs/` keep their topics and are
  linked, not copied.
- PRDs are historical snapshots in `_agents/prds/`, named `YYYY-MM-DD-<description>.md`, never
  referenced from code or configuration.
- Tool-specific configuration that must stay where a tool reads it (`.claude/settings.json`, thin
  command pointers) is kept to the minimum and holds no project knowledge.
- `cmd/check-docs.mjs` enforces links and the PRD rule; it runs in the `workspace:check` task.

## Rationale

Requested by the project owner on 2026-11-18: port the agent context system already used in the
owner's Metis project to this template, so every product started from it begins with the same
structure. A developer or agent opening the repository for the first time can then understand it,
set it up and learn why past decisions were made without asking anyone.

## Alternatives considered

- **Keep knowledge under `.claude/` or `.github/`:** ties project knowledge to one tool.
- **Keep PRDs in a `docs/` folder:** mixes historical requirements with current documentation.
- **A Python docs test as in Metis:** the template has no Python toolchain; Node is already required,
  so the check is a dependency-free Node script.

## Consequences

- Behavior is determined from the running application and tests first, then `ARCHITECTURE.md` and
  the decisions, then memory; PRDs only explain intent.
- Every pull request that changes behavior, architecture or conventions updates the relevant
  `_agents/` files.
- `node cmd/check-docs.mjs` fails on broken links and on PRD references outside `_agents/`.
