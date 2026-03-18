# Symphony integration plan

This repository now includes a starter `Symphony` contract for Linear-driven agent work:

- `WORKFLOW.md` defines how Symphony should pick up Linear tasks and drive Codex.
- `.codex/skills/*` adds repo-local guidance for pull, push, commit, merge, and Linear updates.
- `.github/workflows/symphony-automerge.yml` enables GitHub auto-merge for PRs labeled `automerge`.

## What is already wired

1. Symphony can be pointed at this repository with `WORKFLOW.md`.
2. Agents are instructed to use the existing quality gates in this repo:
   - `npm run build`
   - `npm run test-unit`
   - `npm run test-e2e` for UI/runtime changes
   - `npm run deps:cycles` when dependency graphs or exports change
3. Auto-merge is opt-in by PR label and still respects GitHub branch protection.
4. The default Codex profile is cost-conservative:
   - model `gpt-5.1-codex-mini`
   - `model_reasoning_effort=low`
   - `model_verbosity=low`
   - `model_auto_compact_token_limit=30000`
   - `agent.max_turns=12`

## Required external setup

1. Linear
   - Create or choose the target project.
   - The current configured project slug is `triplex-8c744898bcc5`.
   - Recommended statuses for the new project:
     - `Backlog`
     - `Todo`
     - `In Progress`
     - `Human Review`
     - `Done`
     - `Cancelled`
     - `Duplicate`
   - `Human Review` is the catch-all manual state for failed CI, missing secrets, or policy conflicts the agent cannot resolve itself.
   - Create a personal or service `LINEAR_API_KEY`.

2. GitHub
   - Remove mandatory human approval from branch protection.
   - Keep required status checks enabled for CI.
   - Enable repository auto-merge.
   - Create the PR label `automerge`.
   - Optionally create the PR label `symphony`.
   - Recommended first rollout: a dedicated machine user with a fine-grained PAT.
   - Ensure the machine user that runs Symphony can:
      - push branches;
      - create PRs;
      - read checks and review state;
      - merge PRs or enable auto-merge.

3. Codex / Symphony host
   - Install `codex` with `app-server` support.
   - Export:
     - `LINEAR_API_KEY`
     - `SYMPHONY_SOURCE_REPO_URL`
     - `SYMPHONY_WORKSPACE_ROOT`
   - Optional:
      - `SYMPHONY_CODEX_COMMAND`
   - If you source `.env.symphony` in `zsh` or `bash`, quote command values with spaces, for example:
     - `SYMPHONY_CODEX_COMMAND='codex --model gpt-5.1-codex-mini --config shell_environment_policy.inherit=all --config model_reasoning_effort=low --config model_verbosity=low --config model_auto_compact_token_limit=30000 app-server'`
   - Install repository dependencies in each workspace via `.codex/worktree_init.sh`.
   - For VPS deployment, use the systemd example in `ops/symphony.service`.

## Token and cost control

There is no confirmed hard per-run token budget knob exposed in the current `codex app-server` schema.

The current repository defaults reduce spend using supported settings instead:

- cheaper coding model: `gpt-5.1-codex-mini`
- lower reasoning depth: `model_reasoning_effort=low`
- shorter answers: `model_verbosity=low`
- earlier context compaction: `model_auto_compact_token_limit=30000`
- fewer allowed turns per issue: `agent.max_turns=12`

If you want to make runs even cheaper, reduce one or more of:

- `agent.max_turns`
- `model_auto_compact_token_limit`
- model choice in `SYMPHONY_CODEX_COMMAND`

## Recommended rollout

1. Pilot mode
   - Run Symphony locally first.
   - Let it create PRs, watch CI, and auto-merge low-risk tickets.
   - If CI is red or auth/policy blocks the run, let the ticket fall into `Human Review`.

2. Semi-automatic merge
   - Move Symphony to a VPS.
   - Keep required checks.
   - Use the `automerge` label only for ticket classes you trust.

3. Full unattended merge
   - Keep required checks only.
   - Remove any remaining policy that assumes a human approval gate.
   - Revisit bot permissions explicitly.

## Open decisions

1. Where Symphony will run: local machine, dedicated VM, or CI-hosted service.
2. When to move from local pilot to VPS as the always-on runner.
