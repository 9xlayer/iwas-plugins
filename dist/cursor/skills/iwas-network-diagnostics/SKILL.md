---
name: iwas-network-diagnostics
description: Comprehensive health and connectivity diagnostics for IWAS, FreeRADIUS heartbeat, router status, and recent error tracking.
---

# IWAS Network Diagnostics & Observability Skill

Use this skill when the user asks to:
- "Check if the hotspot network, API, or system has any issues."
- "Inspect router online status, FreeRADIUS connectivity, or WireGuard tunnels."
- "Investigate recent error logs, unhandled exceptions, or diagnostic audit trails."
- "Triage open system issues or trace a specific failure by requestId / traceId."
- "Analyze why a request or background flow failed."

---

## Observability Architecture Overview

IWAS features an integrated OpenTelemetry-compatible Observability engine:
- **`ErrorEvent`**: Stores individual runtime exceptions with `requestId`, `method`, `path`, `statusCode`, `stack`, and sanitized `context`.
- **`IssueState`**: Groups failures by deterministic `fingerprint` (source, identity, origin), tracking `occurrenceCount`, auto-escalating severity (`critical`, `error`, `warning`), and triage status (`open`, `resolved`, `ignored`).
- **Distributed Tracing**: Compliant with W3C Trace Context (`traceparent` header: `00-{traceId}-{spanId}-{flags}`) propagated via `AsyncLocalStorage` and tagged with `flowId`.
- **MCP Tool Spans**: Detailed execution traces (`McpToolSpan`) tracking tool arguments, execution duration, and error payloads.

---

## Standard Diagnostics & Debugging Procedure (SDP)

Follow this 5-stage disciplined workflow when troubleshooting:

### Stage 1: Core Service Health & Network Telemetry
1. Call `read_service_health` to verify API liveness and database readiness.
   - If database status is not `up` or liveness fails, immediately flag critical system downtime.
2. Call `get_dashboard_stats` to inspect infrastructure health:
   - `accountingListenerStatus`: Warn the user if degraded or unhealthy.
   - `lastRadiusHeartbeat`: Check if heartbeat timestamp is stale (> 60s) or null (indicating disconnected FreeRADIUS gateway).
   - `routersTotal`, `routersOnline`, and `routersOffline`: Report connected router counts.
   - `tunnelStatus` and `tunnelLastHandshakeAt`: Report WireGuard VPN mesh tunnel status.

### Stage 2: Triage Open Observability Issues
1. Call `list_issues({ status: 'open', limit: 20 })`:
   - Inspect unresolved grouped failures.
   - Note the `occurrenceCount`, `severity`, and `lastSeenAt` timestamp.
   - Prioritize issues with `severity: 'critical'` or high recurrence rates.

### Stage 3: Error Log Extraction & Correlation
1. Call `list_error_events({ limit: 10, statusCode: 500 })` to fetch the latest server-side exceptions.
   - Filter by `pathContains` if the user is investigating a specific route or subsystem.
   - Filter by `statusCode` (e.g., 500, 502, 504, 401, 403).
2. For any suspect error event, extract its `requestId` (which doubles as the W3C `traceId`).

### Stage 4: Deep Trace & Span Analysis
When a `requestId` or `traceId` is identified:
1. Call `get_error_by_request_id({ requestId })`:
   - Extracts the exact sanitized exception stack trace, error message, HTTP method, and route.
   - Review the redacted context parameters for relevant tenant or payload clues.
2. Call `get_mcp_span({ requestId })`:
   - Inspect the tool name, duration (latency), invocation parameters, and whether the tool completed or threw an error.
3. If the failure occurred during an interactive journey (e.g., OAuth, login, token refresh, package purchase), call `list_flow_events({ flowId, limit: 10 })` to inspect stage-by-stage progression.

### Stage 5: Administrative & Security Audit Trail
1. Call `list_audit_logs({ limit: 10 })` to inspect recent administrative actions, permission changes, or configuration updates that might have triggered the regression.

---

## Scope & Permission Handling (Handling Denied / Degraded States)

The agent communicates strictly through the IWAS MCP interface and never connects directly to the underlying database:

1. **Platform Scope Requirements for Deep Diagnostics:**
   - Deep diagnostic tools (`list_error_events`, `get_error_by_request_id`, `list_issues`, `list_flow_events`) require **Platform Scope** (`tier: 'P'`) because error events and system traces are platform-wide records.
   - If an organization-scoped token invokes these tools, the MCP server will return `403 Forbidden` (`INSUFFICIENT_PERMISSIONS`).
   - **Agent Action on 403:** Explain clearly to the user that deep error logs and issue triage require Platform Administrator access. Inform them that Organization Admins can still monitor router telemetry, active sessions, and package performance.

2. **Degraded Connectivity Fallback:**
   - If a diagnostic tool times out or returns an unexpected gateway error:
     - Call `read_service_health` to check if the core API gateway is reachable.
     - Call `get_dashboard_stats` to verify if high-level telemetry is still reporting.
     - If both fail, report that the IWAS API is unreachable rather than guessing or fabricating system state.

---

## Output Format: Root Cause Analysis (RCA) Report

When presenting findings to the user, structure the response clearly:

1. **Status Summary**: Overall system status with visual indicators (`🟢 Healthy`, `🟡 Degraded`, `🔴 Critical`).
2. **Issue Triage Table**: Listing open fingerprints, recurrence counts, and affected routes.
3. **Trace & Error Evidence**: Quoting the exact `requestId`, timestamp, sanitized stack snippet, and execution span duration.
4. **Root Cause Hypothesis**: Explanation of why the component failed.
5. **Remediation Plan**: Immediate operational workaround and permanent code/config fix.
