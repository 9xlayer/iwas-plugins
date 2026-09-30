---
name: investigate-failure
description: Investigate an IWAS runtime failure, exception, or trace by requestId or recent error logs
---

Execute the failure investigation workflow from `iwas-network-diagnostics`:

1. **Target Identification:**
   - If a `requestId` or `traceId` is provided in the prompt:
     - Call `get_error_by_request_id({ requestId })` to extract the exception message, sanitized stack trace, and request context.
     - Call `get_mcp_span({ requestId })` to inspect the tool execution duration, parameters, and return status.
   - If no `requestId` is specified:
     - Call `list_issues({ status: 'open', limit: 5 })` to inspect the most critical or frequent open issue clusters.
     - Call `list_error_events({ limit: 10, statusCode: 500 })` to fetch recent unhandled server errors.
     - Select the latest high-severity `requestId` to drill down.

2. **Audit & Flow Correlation:**
   - Call `list_audit_logs({ limit: 10 })` to see if administrative actions or config changes preceded the incident.
   - If the error belongs to an interactive journey, call `list_flow_events({ flowId, limit: 10 })`.

3. **Synthesize Findings (RCA):**
   - **Symptom & Status**: Quoting status code, path, and error timestamp.
   - **Trace Details**: Execution latency, affected component, and stack trace line.
   - **Root Cause Hypothesis**: Explanation of why the code failed.
   - **Remediation**: Recommended operational mitigation or permanent code fix.
