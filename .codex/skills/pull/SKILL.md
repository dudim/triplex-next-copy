---
name: pull
description: Merge the latest origin/main into the current branch before or during ticket work.
---

# Pull

## Goals

- Keep the working branch current with `origin/main`.
- Resolve conflicts conservatively and rerun affected validation.

## Steps

1. Confirm the working tree is clean.
2. Enable rerere if available:
   - `git config rerere.enabled true`
   - `git config rerere.autoupdate true`
3. Fetch remote refs with `git fetch origin`.
4. Fast-forward the current branch from remote if needed:
   - `git pull --ff-only origin $(git branch --show-current)`
5. Merge `origin/main` into the current branch:
   - `git -c merge.conflictstyle=zdiff3 merge origin/main`
6. If conflicts appear, resolve them file by file, then rerun the validation affected by those files.
7. Record the merge result in the Linear workpad.

## Ask Only If Blocked

Ask the user only when the conflict requires a product decision that cannot be inferred from code, tests, or local docs.
