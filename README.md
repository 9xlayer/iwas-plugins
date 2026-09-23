# IWAS Plugins

Official AI Assistant Plugins & Skills for **IWAS** (**Intelligent WiFi Access & Presence Service**).

This repository contains multi-platform extensions, tools, skills, and model-context protocol (MCP) configurations enabling AI assistants to monitor and manage IWAS deployments.

## Supported Platforms

| Platform | Manifest & Location | Status |
| --- | --- | --- |
| **Cursor Marketplace** | `.cursor-plugin/marketplace.json`, `plugins/iwas/` | Pending Review (Submitted) |
| **Anthropic Claude** | `.claude-plugin/plugin.json` | Supported |
| **OpenAI / ChatGPT** | `openai/plugin.json` | Supported |
| **Cline** | `cline/`, `plugins/cline/iwas-gitnexus.ts` | Supported |

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
│   └── marketplace.json            # Cursor Marketplace catalog definition
├── dist/                           # Compiled distribution bundles for each platform
│   ├── cursor/                     # Cursor pre-built bundle (.cursor/mcp.json + skills)
│   ├── claude/                     # Claude bundle (.claude-plugin/plugin.json + marketplace.json + skills)
│   ├── openai/                     # OpenAI bundle (plugin.json + mcp.json + skills)
│   └── iwas-openai-plugin.zip      # Packaged zip for OpenAI portal upload
├── plugins/
│   ├── iwas/                       # Cursor plugin package
│   │   ├── .cursor-plugin/
│   │   │   └── plugin.json
│   │   ├── assets/logo.svg
│   │   ├── mcp.json
│   │   └── skills/
│   └── cline/                      # Cline tools & workflow rules
├── skills/                         # Canonical skills directory
├── config/                         # Unified plugin manifest configuration
├── scripts/
│   └── validate-template.mjs       # Cursor template verification script
├── LICENSE
└── README.md
```

## MCP Client Configuration & Authentication

IWAS exposes a high-performance Model Context Protocol (MCP) endpoint over Server-Sent Events (SSE) and HTTP at:
```text
https://getiwas.com/mcp   (or http://localhost:3001/mcp in local dev)
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
      "url": "http://localhost:3001/mcp"
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
    "scope": "network:read session:read analytics:read package:read offline_access"
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
  --scopes "network:read,session:read,analytics:read,package:read,content:write,offline_access" \
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
          "network:read",
          "session:read",
          "analytics:read",
          "package:read",
          "content:write",
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
| `network:read` | Check hotspot health, router online status, FreeRADIUS heartbeat (`iwas-network-diagnostics`). |
| `session:read` | Monitor active hotspot sessions, traffic usage per device/MAC (`iwas-session-monitor`). |
| `analytics:read` | Generate revenue digests, sales breakdown, peak-window analytics (`iwas-revenue-digest`). |
| `package:read` | Audit WiFi billing packages and duration pricing (`iwas-package-optimizer`). |
| `content:write` | Author announcements and captive portal news articles (`iwas-content-publisher`). |
| `diagnostics:read` | Platform-level error events and spans (platform owner only). |
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
