# CLAUDE.md

Project context for every coding agent, including Claude Code, is in [`AGENTS.md`](AGENTS.md). Read it
first; this file adds nothing to it except the Claude Code specifics below.

@AGENTS.md

## Claude Code specifics

- Shared settings: `.claude/settings.json` (permissions only, no hooks). Personal overrides go in
  `.claude/settings.local.json` (git-ignored).
- The slash command `/check` (`.claude/commands/check.md`) only points to
  [`run-the-quality-gate.md`](_agents/workflows/run-the-quality-gate.md); the procedure lives there.
- `.claude/` holds tool configuration only. Do not store project knowledge there; put it in
  `_agents/`.
