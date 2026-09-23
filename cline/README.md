# Cline Plugins & Workflow (IWAS)

Optimizations for Cline (VS Code extension + CLI/ClineCore).

## What's here

| Path | What it does | Applies to |
| --- | --- | --- |
| `.clinerules/` | Rules (brand, GitNexus, backend/frontend/docs/tests, memory-bank, **workflow rituals**) | All Cline clients |
| `.clineignore` | Keeps file ops fast (skips `.next`, `node_modules`, `dist`, GitNexus binaries) | All Cline clients |
| `scripts/cline/gitnexus-refresh.sh` | One-shot GitNexus index refresh helper | All (used by rules) |
| `plugins/cline/iwas-gitnexus.ts` | Plugin: auto-refresh GitNexus index after git commit/merge/rebase/push | **CLI / ClineCore only** (verify VS Code support) |

## Workflow rituals (`.clinerules/06-workflow.md`)

- After every `git commit`/`merge`/`rebase`/`push` → refresh GitNexus index.
- Before every commit → `detect_changes()`.
- Start complex task → check index freshness + read `memory-bank/`.
- End milestone → update `memory-bank/activeContext.md` + `progress.md`.

## Install the optional plugin (CLI / ClineCore)

```bash
cline plugin install ./plugins/cline/iwas-gitnexus.ts --cwd .
# or copy to the auto-discovered project folder:
#   cp plugins/cline/iwas-gitnexus.ts .cline/plugins/iwas-gitnexus.ts
```

Verify with `cline config` (the plugin appears under `plugins`).

## Notes

- Legacy `settings.json` hooks are replaced by the Plugin SDK (`@cline/sdk`,
  `AgentHooks`: `beforeRun`/`afterRun`/`beforeTool`/`afterTool`/`onEvent`).
- The plugin is fire-and-forget observational (never blocks/cancels the run);
  refresh runs with a 120 s timeout in the background.
- VS Code extension plugin support is unverified — `.clinerules/06-workflow.md`
  provides the same guarantee through agent-driven steps if the plugin is not
  loaded by the IDE extension.
