# IWAS Cursor Plugin

> **IWAS** — Intelligent WiFi Access & Presence Service  
> **Status:** Pending Review (Submitted to Cursor Marketplace)

Distribute intelligent hotspot diagnostics, live session monitoring, revenue optimization, and content publishing directly into Cursor.

## Features

- **Network Diagnostics (`iwas-network-diagnostics`)**: Comprehensive health checks for IWAS API, FreeRADIUS gateway heartbeat, WireGuard VPN tunnels, and router status.
- **Session Monitor (`iwas-session-monitor`)**: Real-time hotspot session auditing, online user counts, accounting metrics, and per-device traffic history.
- **Revenue Digest (`iwas-revenue-digest`)**: Daily and periodic revenue digests, peak sales window analysis, and package sales breakdown.
- **Package Optimizer (`iwas-package-optimizer`)**: WiFi billing package performance audit, pricing and duration recommendations.
- **Content Publisher (`iwas-content-publisher`)**: Author and manage captive portal announcements, venue promotions, and news.

## MCP Connection

This plugin connects to the IWAS remote MCP endpoint:

```json
{
  "mcpServers": {
    "iwas": {
      "url": "https://getiwas.com/mcp"
    }
  }
}
```

## License

MIT © [9xlayer](https://getiwas.com)
