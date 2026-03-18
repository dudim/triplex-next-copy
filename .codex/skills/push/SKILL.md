---
name: push
description: Push the current branch and create or update the corresponding GitHub pull request.
---

# Push

## Preconditions

- `gh auth status` succeeds.
- Local validation for the changed scope is already green.

## Steps

1. Determine the current branch with `git branch --show-current`.
2. Push to `origin`:
   - `git push -u origin HEAD`
3. If the push fails because the branch is stale, run the `pull` skill, rerun validation, and retry.
4. Ensure a PR exists:
   - create one if missing;
   - otherwise update the existing PR title and description to reflect the full scope.
5. Use a PR title that matches the outcome, not the ticket key alone.
6. Include in the PR body:
   - summary of the change;
   - validation run;
   - remaining risks or follow-ups.
7. If labels `symphony` or `automerge` exist in the repository, add the relevant ones to the PR when appropriate.

## Output

The PR URL and an updated remote branch ready for CI.
