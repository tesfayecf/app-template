# PRDs: the historical requirements archive

A PRD (product requirement document) is a point-in-time statement of what the owner wanted when it
was written. PRDs are **historical records**. They are not a description of the current system, and
PRDs written at different times **may contradict each other**: a later one can remove, rename or
replace what an earlier one asked for.

To find out how the project behaves today, use the sources in this order: the running application
and its tests, then [`ARCHITECTURE.md`](../../ARCHITECTURE.md) and
[`_agents/decisions/`](../decisions/README.md), then [`_agents/memory/`](../memory/). Read a PRD only
to understand the intent behind a past change.

## Rules

- All PRDs live in this folder, in one flat folder with no subfolders.
- A merged PRD is immutable. Only typographical and formatting corrections are allowed.
- When new requirements change or contradict an earlier PRD, write a **new** PRD. Leave the earlier
  one untouched and update its status in the table below.
- The status of a PRD is recorded **only in this index**, never inside the PRD file.
- No code, test, script, build, environment or configuration file, comment or docstring may
  reference a PRD or a requirement identifier taken from one. Describe the behavior and the reason
  where they are needed, and record significant rationale in
  [`_agents/decisions/`](../decisions/README.md).

## Naming convention

```
YYYY-MM-DD-<description>.md
```

- **Date**: the ISO 8601 date on which the PRD was written. For a PRD without a stated date, use the
  date of the commit that first added it.
- **Description**: exactly 3 to 5 words that name the subject, lowercase, joined by hyphens. No
  spaces, underscores, uppercase letters, accents or special characters.
- Name the subject, not the document type: never "prd", "requirements", "spec" or "document", and
  never a generic word such as "update" or "new-feature".
- A plain alphabetical listing of this folder must equal chronological order. When two PRDs share a
  date, choose descriptions that sort in the order they were written.

| Valid | Invalid | Reason |
| --- | --- | --- |
| `2026-11-02-add-team-invitations-flow.md` | `2026-11-02-prd-team-invitations.md` | Contains "prd" |
| `2026-11-15-agent-run-history-view.md` | `2026-11-15-agent_run_history_view.md` | Uses underscores |
| `2026-12-01-redesign-billing-settings-page.md` | `2026-12-01-redesign-the-billing-settings-page-completely.md` | 6 words |

## Index

In chronological order.

| File | Date | Title | Status |
| --- | --- | --- | --- |

No PRD is archived yet.

## Known gap

The first stack brief (written 2026-04-20, deleted in commit `9ed17e2`) is not archived. See
[open questions](../memory/open-questions.md); add it here, named per the convention above, if the
owner wants it kept.
