# IWAS Antigravity Plugin

Official **Google Antigravity** plugin for **IWAS** (**Intelligent WiFi Access & Presence Service**).

This plugin packages IWAS skills, workspace rules, and MCP configurations into a deployable bundle compliant with the [Antigravity Plugin System](https://antigravity.google/docs/plugins/).

## Included Capabilities

### Skills
- `iwas-network-diagnostics`: Liveness, FreeRADIUS heartbeat, router telemetry, and error event auditing.
- `iwas-session-monitor`: Live session tracking, online user counts, accounting usage per MAC/device.
- `iwas-revenue-digest`: Periodic revenue breakdown, package sales analytics, and peak-hour detection.
- `iwas-package-optimizer`: Billing package conversion audit, duration tuning, and pricing advice.
- `iwas-content-publisher`: Captive portal blog authoring, announcements, and media assets.

### Rules
- `observability-and-diagnostics.md`: Enforces live runtime telemetry over speculation.
- `prefer-mcp-live-data.md`: Prioritizes live IWAS MCP data queries over guessed counts.

### MCP Integration
- Connects directly to the IWAS Model Context Protocol endpoint at `https://getiwas.com/mcp` via SSE.

## Installation in Antigravity

### Option 1: Workspace Direct (Recommended for Project Repositories)
Copy or symlink this plugin folder into `.agents/plugins/iwas`:
```bash
mkdir -p .agents/plugins
cp -r plugins/dist/antigravity .agents/plugins/iwas
```

### Option 2: Workspace Config (`.agents/plugins.json`)
Register the plugin directory in your project's `.agents/plugins.json`:
```json
{
  "entries": [
    {
      "path": "plugins/dist/antigravity"
    }
  ]
}
```

### Option 3: Global Installation (`~/.gemini/config/plugins.json`)
To make IWAS available across all projects on your machine, add the path to your global configuration:
```json
{
  "entries": [
    {
      "path": "/path/to/iwas/plugins/dist/antigravity"
    }
  ]
}
```
