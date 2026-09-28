---
name: iwas-network-diagnostics
description: Comprehensive health and connectivity diagnostics for IWAS, FreeRADIUS heartbeat, router status, and recent error tracking.
---

# IWAS Network Diagnostics Skill

Use this skill when the user asks to:
- "Check if the hotspot network or system has any issues."
- "Inspect router online status or FreeRADIUS connectivity."
- "Investigate recent error logs or diagnostic audit trails."

## Workflow Procedure

1. **Service Health Check:**
   - Call `read_service_health` to verify core API liveness and database readiness.
   - If database status is not `up` or liveness fails, immediately report critical system downtime.

2. **Dashboard & Network Telemetry:**
   - Call `get_dashboard_stats` to inspect:
     - `accountingListenerStatus`: Warn the user if degraded or unhealthy.
     - `lastRadiusHeartbeat`: Check if heartbeat timestamp is stale or null (indicating disconnected FreeRADIUS gateway).
     - `routersTotal`, `routersOnline`, and `routersOffline`: Report connected router counts.
     - `tunnelStatus` and `tunnelLastHandshakeAt`: Report WireGuard VPN tunnel status.

3. **Error Investigation & Audit Trail:**
   - If owner diagnostics are permitted, call `list_audit_logs` (with `limit: 10`) to check recent administrative or security events.
   - If platform scope is available, call `list_error_events` (with `limit: 10`) to inspect server-side exceptions.
   - If a specific `requestId` is identified, invoke `get_error_by_request_id` or `get_mcp_span` for root-cause analysis.

4. **Synthesize Findings:**
   - Format the response with clear status badges (OK / Warning / Critical).
   - Group by: Core Services, RADIUS & Routing, and Recent Anomalies.
   - Provide actionable remediation steps for any degraded component.
