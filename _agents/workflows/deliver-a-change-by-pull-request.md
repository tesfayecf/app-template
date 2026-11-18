# Workflow: deliver a change by pull request

Full rules: [`DEVELOP.md`](../../DEVELOP.md#contribution-workflow).

1. Branch from `master`: `git switch master && git pull --ff-only`, then
   `git switch -c <type>/<short-description>` (`feat`, `fix`, `refactor`, `docs`, `chore`, `test`).
   One branch is one coherent change.
2. Make the change. Record significant decisions ([workflow](add-a-decision-record.md)) and update
   the `_agents/` files, `ARCHITECTURE.md` and the READMEs the change makes outdated.
3. Run the [quality gate](run-the-quality-gate.md) until green.
4. Commit in conventional style: `<type>(<scope>): <summary>`, with scope `server`, `app`, `docker`
   or `agents` where it helps.
5. Push and open the pull request against `master` (`gh pr create`) with: a summary, visual proof for
   UI or documentation changes, the impact (what changes for users, operators, agents and products
   built from the template), the validation you ran, and an explicit note for any change to
   `server/internal/sqlite/`.
6. Leave the merge to the owner: who may merge and deploy is not yet documented
   ([open questions](../memory/open-questions.md)).
