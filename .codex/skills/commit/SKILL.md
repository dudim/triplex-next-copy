---
name: commit
description: Create a clean git commit for the current ticket work.
---

# Commit

## Goals

- Commit only the intended ticket changes.
- Use a concise conventional subject line.
- Mention validation that was run, or state that validation was not run.

## Steps

1. Inspect `git status` and `git diff --staged`.
2. Stage only the files that belong to the current Linear issue.
3. Use a conventional subject such as `feat(component): ...`, `fix(component): ...`, `docs: ...`, or `chore: ...`.
4. Add a short body with:
   - what changed;
   - why it changed;
   - validation performed.
5. If unrelated files are mixed in, unstage them before committing.

## Output

A single commit that matches the staged diff and the ticket scope.
