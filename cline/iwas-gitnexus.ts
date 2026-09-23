/**
 * IWAS — GitNexus workflow plugin (Cline Plugin SDK)
 *
 * Keeps the GitNexus knowledge graph fresh automatically:
 *  - afterTool: when a git commit/merge/rebase/push tool result is seen,
 *    fire-and-forget `node .gitnexus/run.cjs analyze` so `impact`/`context`/
 *    `detect_changes` never silently go stale.
 *
 * Install (Cline CLI / ClineCore):
 *   cline plugin install ./plugins/cline/iwas-gitnexus.ts --cwd .
 *   # or copy to .cline/plugins/iwas-gitnexus.ts (auto-discovered)
 *
 * NOTE: plugin hooks are the Cline SDK mechanism (CLI/ClineCore). The VS Code
 * extension's plugin/hook support should be verified before relying on it —
 * for VS Code the equivalent behavior is enforced by `.clinerules/06-workflow.md`.
 */
import { execFile } from "node:child_process"
import type { AgentPlugin } from "@cline/sdk"

const GIT_MUTATION_RE = /\bgit\s+(commit|merge|rebase|push|am|cherry-pick)\b/
const COMMAND_LIKE_TOOLS = /command|exec|shell|terminal/i

function isGitMutation(record: { name?: string; input?: unknown }): boolean {
  const toolName = record.name ?? ""
  const inputText = JSON.stringify(record.input ?? {})
  return (
    // dedicated git tools (if the runtime exposes them)
    /^git(_.*)?$/.test(toolName) ||
    // generic command execution whose input mentions a git mutation
    (COMMAND_LIKE_TOOLS.test(toolName) && GIT_MUTATION_RE.test(inputText))
  )
}

function refreshGitNexusIndex(): void {
  const nodeBin = process.platform === "win32" ? "node.exe" : "node"
  execFile(
    nodeBin,
    [".gitnexus/run.cjs", "analyze"],
    { cwd: process.cwd(), timeout: 120_000 },
    (err, _stdout, stderr) => {
      if (err) {
        console.error(`[iwas-gitnexus] index refresh failed: ${err.message}`)
        if (stderr) console.error(`[iwas-gitnexus] ${stderr.slice(0, 400)}`)
        return
      }
      console.log("[iwas-gitnexus] GitNexus index refreshed after git mutation.")
    },
  )
}

const plugin: AgentPlugin = {
  name: "iwas-gitnexus",
  manifest: { capabilities: ["hooks"] },
  hooks: {
    afterTool: async (context) => {
      try {
        const record = (context?.record ?? {}) as { name?: string; input?: unknown }
        if (isGitMutation(record)) {
          refreshGitNexusIndex()
        }
      } catch (error) {
        // Observational hook — never break the agent run.
        console.error(`[iwas-gitnexus] hook error: ${String(error)}`)
      }
      return undefined
    },
  },
}

export default plugin
