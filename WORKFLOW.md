---
tracker:
  kind: linear
  api_key: $LINEAR_API_KEY
  project_slug: "triplex-8c744898bcc5"
  active_states:
    - Todo
    - In Progress
  terminal_states:
    - Done
    - Cancelled
    - Canceled
    - Duplicate
polling:
  interval_ms: 15000
workspace:
  root: $SYMPHONY_WORKSPACE_ROOT
hooks:
  after_create: |
    if [ -f ./.codex/worktree_init.sh ]; then
      bash ./.codex/worktree_init.sh
    else
      if [ -z "${SYMPHONY_SOURCE_REPO_URL:-}" ]; then
        echo "SYMPHONY_SOURCE_REPO_URL is required when .codex/worktree_init.sh is missing." >&2
        exit 1
      fi
      git clone --depth 1 "$SYMPHONY_SOURCE_REPO_URL" .
      npm ci
    fi
  timeout_ms: 180000
agent:
  max_concurrent_agents: 3
  max_turns: 16
codex:
  command: ${SYMPHONY_CODEX_COMMAND:-codex --dangerously-bypass-approvals-and-sandbox --model gpt-5.3-codex --config shell_environment_policy.inherit=all --config model_reasoning_effort=medium --config model_verbosity=medium --config model_auto_compact_token_limit=50000 app-server}
  approval_policy: never
  thread_sandbox: danger-full-access
  turn_sandbox_policy:
    type: dangerFullAccess
---
You are working on Linear issue `{{ issue.identifier }}` for the `triplex-next` repository.

{% if attempt %}
Continuation context:
- This is retry attempt `{{ attempt }}`.
- Resume from the current workspace state unless the existing branch/PR is closed or merged.
- Do not repeat finished validation unless new changes invalidate it.
{% endif %}

Issue context:
- Title: `{{ issue.title }}`
- Current state: `{{ issue.state }}`
- Labels: `{{ issue.labels }}`
- URL: `{{ issue.url }}`

Description:
{% if issue.description %}
{{ issue.description }}
{% else %}
No description was provided.
{% endif %}

Operating rules:
1. This is an unattended orchestration run. Work end to end unless blocked by missing auth, missing secrets, or repository policy that cannot be satisfied in-session.
2. Keep all progress in a single Linear comment titled `## Codex Workpad`. Reuse it if it already exists.
3. Do not edit the Linear issue body for planning. Use the workpad comment instead.
4. Before code changes, reproduce the issue or confirm the requested change target and record concrete evidence in the workpad.
5. Before code changes, sync the branch with `origin/main` using the `pull` skill and record the result in the workpad.
6. Follow repository conventions from `.github/CODING_GUIDELINES.md`.
7. Keep changes scoped to the current ticket. File a separate issue for meaningful out-of-scope work.

Repository-specific quality bar:
1. If source code changes, run `npm run build`.
2. If the change affects component dependencies or exports, also run `npm run deps:cycles`.
3. Do not push while required validation for the touched scope is failing.

GitHub / PR flow:
1. Use the `commit` skill for logical commits.
2. Use the `push` skill to publish the branch and create or update the PR.
3. Keep the PR linked back to the Linear issue.
4. If the repository has labels `symphony` and `automerge`, add them to the PR once the PR is ready for unattended merge.
5. If required validation or GitHub checks fail and the issue cannot be resolved autonomously in the same run, move the issue to `Human Review` with a short blocker summary in the workpad.
6. If required checks are green and no unresolved review feedback remains, enable auto-merge and keep monitoring until the PR merges.
7. After the PR merges, move the issue to `Done`.

Linear state map:
- `Backlog`: out of scope, do nothing.
- `Todo`: immediately move to `In Progress`, create or refresh the workpad, then execute.
- `In Progress`: continue execution.
- `Human Review`: stop autonomous work and wait for a human decision or manual intervention.
- `Done`: terminal, do nothing.

Completion bar before enabling merge:
1. Workpad reflects the real plan, completed tasks, validation, and remaining risks.
2. Required local validation for the scope is green.
3. PR exists and reflects the full change scope.
4. Required CI checks on the PR are green or are actively waiting with auto-merge enabled.
5. No actionable review feedback is left unresolved.
