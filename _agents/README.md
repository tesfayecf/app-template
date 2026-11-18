# `_agents/`: project memory, decisions, PRDs and workflows

This folder is the single home for knowledge about **developing** App Template and the products
built from it, written for developers and for AI coding agents. It is tool-agnostic. What the
template includes and how to start it is in the root [`README.md`](../README.md). The entry point for
agents is [`AGENTS.md`](../AGENTS.md).

## Layout

| Folder | What it holds | Changes how |
| --- | --- | --- |
| [`memory/`](memory/) | Facts about the project that are not obvious from the code: context, conventions, lessons learned, open questions | Edited in place whenever it becomes inaccurate |
| [`decisions/`](decisions/README.md) | One record per significant decision, with context, rationale, alternatives and consequences | Append-only. A changed decision is superseded by a new record, never edited or deleted |
| [`prds/`](prds/README.md) | The chronological archive of product requirement documents | Immutable snapshots. A new requirement is a new file |
| [`workflows/`](workflows/README.md) | Repeatable procedures: add an endpoint or a feature, add a decision, run the gate, deliver a change | Edited in place when the procedure changes |

Not here: system structure ([`ARCHITECTURE.md`](../ARCHITECTURE.md)), setup
([`README.md`](../README.md)), testing and the contribution procedure ([`DEVELOP.md`](../DEVELOP.md)),
container builds ([`docker/README.md`](../docker/README.md)). Link to them; do not copy them.

## Reading order for a first look

1. [`memory/project-context.md`](memory/project-context.md): what the template is and is not.
2. [`ARCHITECTURE.md`](../ARCHITECTURE.md): how it is built.
3. [`decisions/README.md`](decisions/README.md): why it is built that way.
4. [`memory/conventions.md`](memory/conventions.md) and [`memory/lessons-learned.md`](memory/lessons-learned.md): how to work on it and what went wrong before.
5. [`memory/open-questions.md`](memory/open-questions.md): what is unknown or deferred.

## Where the truth about current behavior is

To learn how the project behaves **today**, consult, in this order:

1. The running application and its tests.
2. [`ARCHITECTURE.md`](../ARCHITECTURE.md) and [`decisions/`](decisions/README.md).
3. [`memory/`](memory/).

PRDs are **historical snapshots**. They record what was wanted when they were written, they may
contradict each other, and they are never an authority on current behavior. Read one only to
understand the intent behind a past change. No code, test, script, build, environment or
configuration file, comment or docstring may reference a PRD or a requirement identifier from one;
write the behavior and the reason instead.

## Maintenance rules

- **Decisions are append-only.** Supersede, do not edit or delete. Record a decision before the pull
  request that makes it is opened ([workflow](workflows/add-a-decision-record.md)).
- **PRDs are immutable** once merged, except for typographical or formatting fixes. When
  requirements change or contradict an earlier PRD, write a new one and update the earlier PRD's
  status in the [index](prds/README.md). Status is recorded only in the index.
- **Memory is current-state.** Update a memory file in the same pull request that makes it
  inaccurate. Date statements that will go stale.
- **Every pull request** that changes behavior, architecture or conventions updates the relevant
  files in this folder.
- **Never invent rationale.** Evidence from the repository or the project owner only; otherwise write
  "Rationale not documented" and add an entry to [`memory/open-questions.md`](memory/open-questions.md).
- **No secrets, credentials, tokens or internal URLs** anywhere in this folder.
- **No duplication.** One fact, one place, linked from elsewhere.
- `node cmd/check-docs.mjs` enforces the link and PRD rules; run it with the quality gate.

## Index of files

Maintained in [`AGENTS.md`](../AGENTS.md) (the context index), which says when to read each file.

## Starting a product from this template

The files here describe the template. A product built from it keeps the structure and the decisions
(they are still its history), rewrites [`memory/project-context.md`](memory/project-context.md) for
the product, and records its own decisions from the next free number.
