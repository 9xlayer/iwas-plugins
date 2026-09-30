---
name: triage-issues
description: Triage active system issues and unhandled failure clusters across IWAS
---

Execute the system issue triage workflow from `iwas-network-diagnostics`:

1. **Verify Health Baseline:**
   - Call `read_service_health` to verify API liveness and database readiness.

2. **Retrieve Open Issues:**
   - Call `list_issues({ status: 'open', limit: 20 })` to fetch all unresolved grouped failures.

3. **Categorize & Prioritize:**
   - Group by severity (`critical`, `error`, `warning`) and origin source (`http`, `auth`, `mcp`, `scheduled`, `browser`).
   - Highlight any issue with an escalating occurrence count or recent `lastSeenAt` timestamp.

4. **Summarize Top Issues:**
   - Format a table with: Fingerprint, Title, Severity, Recurrence Count, and Last Seen.
   - For any critical issue, retrieve the latest sample via `list_error_events` and report the failing route.

5. **Action Plan:**
   - Prioritize remediation order based on customer-facing and financial impact.
