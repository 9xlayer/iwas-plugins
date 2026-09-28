---
name: check-network-health
description: Run IWAS network health diagnostics via MCP
---

Run the `iwas-network-diagnostics` skill workflow:

1. Call `read_service_health`.
2. Call `get_dashboard_stats` for RADIUS heartbeat, routers, and tunnel status.
3. If permitted, inspect recent `list_audit_logs` / `list_error_events`.
4. Summarize severity and recommended next actions.
