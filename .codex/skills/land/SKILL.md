---
name: land
description: Watch the PR to completion and merge it safely once GitHub requirements are satisfied.
---

# Land

## Goals

- Keep the PR conflict-free with `main`.
- Wait for required GitHub checks.
- Enable or use auto-merge when the repository policy allows it.

## Preconditions

- `gh auth status` succeeds.
- The current branch has an open PR.
- The working tree is clean.

## Steps

1. Identify the PR number for the current branch with `gh pr view`.
2. Check mergeability. If the PR is conflicting, run the `pull` skill, rerun validation, and push the updated branch.
3. Read open review threads and issue comments. Address actionable feedback or reply with a justified pushback before merging.
4. Wait for required checks with `gh pr checks --watch`.
5. If checks fail:
   - inspect the failing run;
   - fix the issue locally;
   - commit with the `commit` skill;
   - push with the `push` skill;
   - wait again.
6. If the PR has the `automerge` label or repository policy allows unattended merge, enable GitHub auto-merge:
   - `gh pr merge --auto --squash --delete-branch`
7. If auto-merge is not allowed, merge only when the issue is explicitly in `Merging` and all required checks and reviews are satisfied.
8. After merge, update the Linear issue state to `Done`.

## Guardrails

- Do not bypass branch protection.
- Do not merge while required review feedback is unresolved.
- Do not force-push unless history was intentionally rewritten and `--force-with-lease` is required.
