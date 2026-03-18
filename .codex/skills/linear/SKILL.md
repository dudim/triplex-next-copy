---
name: linear
description: Use Symphony-provided Linear access to read and update the active ticket and its single workpad comment.
---

# Linear

## Goals

- Keep a single `## Codex Workpad` comment current.
- Use Linear as the system of record for ticket state and progress.

## Rules

1. Reuse one workpad comment per issue. Do not create multiple progress threads.
2. Store plan, acceptance criteria, validation, and blockers in that workpad.
3. Keep state transitions tight:
   - `Todo` -> `In Progress` when work starts;
   - `In Progress` -> `Human Review` only when CI, auth, or repository policy blocks unattended completion;
   - `Human Review` -> `Todo` or `In Progress` when a human wants the agent to retry;
   - `In Progress` -> `Done` after successful merge.
4. Do not rewrite the issue body for progress tracking.
5. Use the issue attachments or links for PR URLs when available.
