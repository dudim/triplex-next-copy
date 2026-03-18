# Symphony on VPS

This is the simplest production-style deployment path after the local pilot.

## Layout

Recommended directories:

- `/srv/symphony/openai-symphony` for the upstream Symphony repository
- `/srv/symphony/triplex-next` for this repository's `WORKFLOW.md`, docs, and env file
- `/srv/symphony/workspaces` for issue workspaces

## Minimal setup

1. Install base packages:
   - `git`
   - `curl`
   - `build-essential`
   - `openssh-client`
2. Install `mise`.
3. Clone `openai/symphony`.
4. Build the Elixir implementation:
   - `cd /srv/symphony/openai-symphony/elixir`
   - `mise trust`
   - `mise install`
   - `mise exec -- mix setup`
   - `mise exec -- mix build`
5. Copy this repo's files to `/srv/symphony/triplex-next`:
   - `WORKFLOW.md`
   - `.codex/`
   - `.env.symphony`
   - Keep `SYMPHONY_CODEX_COMMAND` quoted in `.env.symphony` if it contains spaces.
   - The default profile is already tuned for lower spend with `gpt-5.1-codex-mini`, low reasoning, low verbosity, and compaction at 30k tokens.
6. Keep `WORKFLOW.md` with the configured Linear slug `triplex-8c744898bcc5`, or update it if the Linear project changes later.
7. Install and enable the systemd unit from `ops/symphony.service`.

## Notes

- Start locally first so auth, GitHub labels, and Linear states are verified before moving to the VPS.
- Use the dedicated machine user and fine-grained PAT from the pilot setup for pushes and merges.
- Keep the workspaces on persistent disk so retries can continue from previous state.
