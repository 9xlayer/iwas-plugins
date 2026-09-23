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

## MCP Configuration & Setup in Cursor

IWAS connects to Cursor via **OAuth 2.1** over SSE and HTTP at:
```text
https://getiwas.com/mcp
```

### 1. Production Setup (Static Credentials — Recommended)

Because Cursor's UI does not currently prompt for Initial Access Tokens, production environments use pre-registered static credentials:

1. **Ask your IWAS deployment operator** to provision a client ID and secret via:
   ```bash
   pnpm mcp:create-client -- --client-id cursor --name "Cursor IDE" --redirect-uri http://localhost:8787/callback --scopes "network:read,session:read,analytics:read,package:read,content:write,offline_access" --apply
   ```

2. **Configure `.cursor/mcp.json`:**
   ```json
   {
     "mcpServers": {
       "iwas": {
         "url": "https://getiwas.com/mcp",
         "auth": {
           "CLIENT_ID": "cursor",
           "CLIENT_SECRET": "<your-client-secret>",
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
   > **Note on `offline_access`:** Always specify `"offline_access"` to obtain a refresh token. Without it, access tokens expire after 1 hour, requiring repeated manual sign-in.

### 2. Local Development (Automatic DCR)

When connecting to a local IWAS instance running with `MCP_DCR_MODE=anonymous`:
```json
{
  "mcpServers": {
    "iwas": {
      "url": "https://<your-dev-domain>/mcp"
    }
  }
}
```
Cursor automatically registers dynamically upon first call.

### 3. DCR with Initial Access Token (RFC 7591)

If your environment runs with `MCP_DCR_MODE=token`, register via HTTP before adding to Cursor:
```bash
curl -X POST https://getiwas.com/api/auth/oauth2/register \
  -H "Authorization: Bearer <MCP_DCR_INITIAL_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Cursor IDE",
    "redirect_uris": ["http://localhost:8787/callback"],
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code"],
    "scope": "network:read session:read analytics:read package:read offline_access"
  }'
```
Use the returned `client_id` and `client_secret` in your `.cursor/mcp.json`.

## License

MIT © [9xlayer](https://getiwas.com)
