---
name: iwas-session-monitor
description: Monitor real-time active hotspot sessions, inspect today's session history, and query accounting usage per user or device.
---

# IWAS Session Monitor Skill

Use this skill when the user asks to:
- "Check active users on the WiFi hotspot right now."
- "Inspect today's session log and total bandwidth usage."
- "Lookup accounting details or session duration for a specific user/MAC."

## Workflow Procedure

1. **Active Real-Time Sessions:**
   - Call `list_active_sessions` (with `limit: 20` or requested page size) to retrieve live connected clients.
   - Extract device MAC address, allocated IP, package assigned, connection duration, and data transfer metrics (input/output octets).

2. **Daily Activity & Trends:**
   - Call `list_today_sessions` to evaluate:
     - `activeNow`: Current online count.
     - `totalToday`: Cumulative sessions completed today.
     - `revenueToday`: Direct revenue generated from new session authorizations.

3. **Deep Accounting Query (Optional):**
   - If a specific session ID is targeted, call `get_session_accounting` to retrieve byte-exact accounting packets, stop reasons, and session timeline.

4. **Response Formatting:**
   - Summarize active network load (total active devices, aggregated throughput in MB/GB).
   - Flag any long-running or abnormally high-bandwidth sessions.
   - Present a concise table of active clients with MAC, Duration, and Package.
