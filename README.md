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
