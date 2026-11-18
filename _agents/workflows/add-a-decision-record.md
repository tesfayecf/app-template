# Workflow: add a decision record

Record a decision when a change picks a technology or dependency, shapes the data model, changes
authentication, configuration, deployment or a data-safety rule, or reverses an earlier decision. Do
it **before** the pull request is opened.

1. Find the next number in [`../decisions/README.md`](../decisions/README.md).
2. Copy [`../decisions/TEMPLATE.md`](../decisions/TEMPLATE.md) to `../decisions/NNNN-<short-title>.md`
   (lowercase, hyphenated).
3. Fill every section. Rationale must come from evidence (code, a commit, a document) or from the
   project owner. If the reason is unknown, write "Rationale not documented" and add the item to
   [`../memory/open-questions.md`](../memory/open-questions.md). Never invent one.
4. Add a row to the table in `../decisions/README.md`, and a "Read before" row in the `AGENTS.md`
   context index if agents should read it before a kind of change.
5. If the decision replaces an earlier one, set the earlier record's status to `Superseded by NNNN`.
   That is the only edit an accepted record may receive.
6. Update [`ARCHITECTURE.md`](../../ARCHITECTURE.md) if it describes the changed area, and link the
   new record from its "Decisions" section.
7. Run `node cmd/check-docs.mjs`.
