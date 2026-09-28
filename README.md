# IWAS Plugins

Official AI Assistant Plugins & Skills for **IWAS** (**Intelligent WiFi Access & Presence Service**).

This repository contains multi-platform extensions, tools, skills, and model-context protocol (MCP) configurations enabling AI assistants to monitor and manage IWAS deployments.

## Supported Platforms

| Platform | Manifest & Location | Status |
| --- | --- | --- |
| **Cursor Marketplace** | `.cursor-plugin/marketplace.json`, `cursor/` | Pending Review (Submitted) |
| **Anthropic Claude** | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | Supported |
| **OpenAI / ChatGPT** | `openai/plugin.json` | Supported |
| **Cline** | `cline/` | Supported |

Shared branding (`logoUrl`, `contact_email`, screenshots) is defined once in
`config/manifest.config.ts` and written into Cursor / OpenAI / Claude sources
plus `dist/` by `pnpm plugins:build`.

## Included Skills

- **`iwas-network-diagnostics`**: Liveness, FreeRADIUS heartbeat, router telemetry, and error event auditing.
- **`iwas-session-monitor`**: Live session tracking, online user counts, accounting usage per MAC/device.
- **`iwas-revenue-digest`**: Periodic revenue breakdown, package sales analytics, and peak-hour detection.
- **`iwas-package-optimizer`**: Billing package conversion audit, duration tuning, and pricing advice.
- **`iwas-content-publisher`**: Captive portal blog authoring, announcements, and media assets.

## Directory Structure

```text
iwas-plugins/
├── .cursor-plugin/
│   └── marketplace.json            # Repo marketplace (source: ./cursor)
├── .claude-plugin/
│   ├── plugin.json                 # Claude plugin manifest (+ shared logo metadata)
│   └── marketplace.json            # Claude marketplace (owner email + homepage)
├── assets/
│   └── logo.svg                    # Shared brand mark (Cursor / OpenAI / Claude)
├── cursor/                         # Cursor Plugin package (Add-from-folder target)
│   ├── .cursor-plugin/
│   │   ├── marketplace.json        # self-source "." for folder install
│   │   └── plugin.json
│   ├── rules/
│   ├── agents/
│   ├── commands/
│   ├── hooks/
│   ├── skills/
│   └── mcp.json
├── dist/
│   ├── cursor/                     # Built copy of cursor/ (+ refreshed skills)
│   ├── claude/
│   ├── openai/
│   └── iwas-openai-plugin.zip
├── skills/                         # Canonical skills source
├── cline/
├── openai/                         # OpenAI Connected App (logo + screenshots from manifest)
├── config/
├── scripts/
├── LICENSE
└── README.md
```

### Install locally in Cursor

"Add plugins from folder" looks for `.cursor-plugin/marketplace.json` **inside the folder you select**.

1. Build: `pnpm plugins:build` (from monorepo root).
2. Customize → Plugins → **Add from folder**.
3. Select one of:
   - `plugins/cursor`
   - `plugins/dist/cursor`
   - `plugins/` (repo marketplace → loads `./cursor`)
4. Open **Plugins → Configure** on the IWAS plugin and set `CLIENT_ID` / `CLIENT_SECRET`
   (provision with `pnpm mcp:create-client` — Cursor does not support CIMD; production requires static credentials).

## MCP Client Configuration & Authentication

IWAS exposes a high-performance Model Context Protocol (MCP) endpoint over Server-Sent Events (SSE) and HTTP at:
```text
https://getiwas.com/mcp
```

All agent interactions are authenticated using **OAuth 2.1 with PKCE**, strictly scoped to your tenant organization, and subject to fine-grained role-based access control (RBAC).

IWAS supports three client onboarding mechanisms:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. CIMD (Client ID Metadata Document)                                       │
│    • Client provides HTTPS URL as client_id (stateless, SSRF-validated)     │
│    • Zero configuration needed in client                                    │
│    • Recommended for: Claude Desktop, modern CIMD-aware IDEs                │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. DCR (Dynamic Client Registration — RFC 7591)                             │
│    • Client registers dynamically via POST /api/auth/oauth2/register        │
│    • Local Dev: MCP_DCR_MODE=anonymous (Cursor auto-registers unprompted)   │
│    • Production: MCP_DCR_MODE=token (requires Bearer Initial Access Token)  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. Static Pre-Registered Credentials                                        │
│    • Operator creates client via CLI; user configures CLIENT_ID/SECRET      │
│    • Recommended for: Production Cursor IDE, CI/CD & Headless Services      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Option 1: CIMD (Client ID Metadata Document — Zero Configuration)

For clients that implement the OAuth 2.0 Client ID Metadata Document specification, simply specify the IWAS MCP URL. The client automatically discovers endpoints, verifies the authorization server metadata via `/.well-known/oauth-protected-resource`, and dynamically onboards without prior registration.

Add to your MCP settings (e.g. Claude Desktop or CIMD-compatible client):

```json
{
  "mcpServers": {
    "iwas": {
      "url": "https://getiwas.com/mcp"
    }
  }
}
```

*Flow:* On first tool invocation, your client receives a `401 Unauthorized` challenge, opens your default browser for IWAS sign-in, lets you choose the tenant organization, and approves requested scopes.

---

### Option 2: Dynamic Client Registration (DCR — RFC 7591)

#### 2.1 Local Development / Self-Hosted (`MCP_DCR_MODE=anonymous`)
When running IWAS locally or on internal infrastructure with `MCP_DCR_MODE=anonymous`, clients like Cursor can self-register automatically without credentials:

```json
{
  "mcpServers": {
    "iwas": {
      "url": "https://<your-dev-domain>/mcp"
    }
  }
}
```

> **Security Note:** Anonymous DCR is strictly refused in production (`NODE_ENV=production`) to prevent database denial-of-service and client name spoofing.

#### 2.2 Production DCR with Initial Access Token (`MCP_DCR_MODE=token`)
In secure environments where DCR is permitted with authorization, the deployment operator sets an initial secret:
```bash
MCP_DCR_MODE=token
MCP_DCR_INITIAL_ACCESS_TOKEN=<your-random-high-entropy-token>
```

Your automated onboarding script or client registers dynamically by passing the initial access token:

```bash
curl -X POST https://getiwas.com/api/auth/oauth2/register \
  -H "Authorization: Bearer <MCP_DCR_INITIAL_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Cursor Agent",
    "redirect_uris": ["http://localhost:8787/callback"],
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code"],
    "scope": "diagnostics:read diagnostics:write session:read analytics:read package:read blog:read blog:write blog:publish offline_access"
  }'
```

The response returns `client_id` and `client_secret` (or client registration access token) to plug into your client.

---

### Option 3: Static Pre-Registered Credentials (Recommended for Production Cursor)

Because the Cursor IDE's MCP interface currently has no input field for an Initial Access Token, the production-safe standard for Cursor is using **Static Credentials**.

#### Step 1: Provision Client (Operator CLI)
Run the provisioning command on your IWAS server:

```bash
pnpm mcp:create-client -- \
  --client-id cursor \
  --name "Cursor IDE" \
  --redirect-uri http://localhost:8787/callback \
  --redirect-uri https://www.cursor.com/agents/mcp/oauth/callback \
  --redirect-uri cursor://anysphere.cursor-mcp/oauth/callback \
  --scopes "diagnostics:read,diagnostics:write,session:read,analytics:read,package:read,blog:read,blog:write,blog:publish,offline_access" \
  --apply
```

#### Step 2: Configure Client in Cursor (`.cursor/mcp.json` or Settings)
Add the static credentials to your Cursor configuration:

```json
{
  "mcpServers": {
    "iwas": {
      "url": "https://getiwas.com/mcp",
      "auth": {
        "CLIENT_ID": "cursor",
        "CLIENT_SECRET": "<your-provisioned-client-secret>",
        "scopes": [
          "diagnostics:read",
          "diagnostics:write",
          "session:read",
          "analytics:read",
          "package:read",
          "blog:read",
          "blog:write",
          "blog:publish",
          "offline_access"
        ]
      }
    }
  }
}
```

> **IMPORTANT (`offline_access`):** Always include `"offline_access"` in `scopes`. Without it, OAuth access tokens expire after 1 hour with no automatic refresh, forcing you to re-authenticate manually.

---

### Scope Catalog Reference

| Scope | Capability |
| :--- | :--- |
| `diagnostics:read` | Platform/network health, error events, spans, and FreeRADIUS heartbeat (`iwas-network-diagnostics`). |
| `diagnostics:write` | Triage issues (resolve/ignore) via diagnostics tools. |
| `session:read` | Monitor active hotspot sessions, traffic usage per device/MAC (`iwas-session-monitor`). |
| `analytics:read` | Generate revenue digests, sales breakdown, peak-window analytics (`iwas-revenue-digest`). |
| `package:read` | Audit WiFi billing packages and duration pricing (`iwas-package-optimizer`). |
| `blog:read` / `blog:write` / `blog:publish` | Author and publish captive portal announcements (`iwas-content-publisher`). |
| `offline_access` | Enables silent token rotation and background renewal without re-prompting. |

---

## Validation

Verify Cursor marketplace compliance:

```bash
node scripts/validate-template.mjs
```

## Security & Privacy

- Communications with the IWAS API use TLS encryption.
- MCP tools adhere to strict role-based access control (RBAC) and OAuth 2.0 / bearer token authorization.
- Privacy Policy: [https://getiwas.com/privacy](https://getiwas.com/privacy)
- Terms of Service: [https://getiwas.com/terms](https://getiwas.com/terms)

## License

MIT © [9xlayer](https://getiwas.com)
