---
name: iwas-revenue-digest
description: Produce daily or periodic revenue digests, analyze hourly revenue trends, and identify optimal promo windows for hotspot packages.
---

# IWAS Revenue Digest Skill

Use this skill when the user asks to:
- "Summarize revenue for today or this week."
- "Show peak sales hours and package earnings."
- "Suggest promotional discount windows based on traffic patterns."

## Workflow Procedure

1. **High-Level Financial Overview:**
   - Call `get_dashboard_stats` to retrieve:
     - `earningsToday`, `earningsChange`
     - `monthlyRevenue`, `monthlyExpenses`, and `profit`
     - `activeUsersCount`, `usageGb`

2. **Granular Revenue Breakdown:**
   - Call `get_revenue_breakdown` to extract:
     - `hourlyRevenue`: Identify peak earning hours and low-traffic valleys.
     - `byPackage`: Rank packages by total revenue generated and count.
     - `dailyRevenue`: Track multi-day trajectory.

3. **Promotional Intelligence:**
   - Call `suggest_promo_windows` to discover optimal off-peak discount periods or revenue-boosting opportunities.
   - Cross-reference with `summarize_package_performance` to identify which packages drive the majority of sales volume.

4. **Deliver Digest Report:**
   - Provide a clean executive summary including: Total Today, Top Selling Package, and Growth Rate.
   - Include a concise ASCII or Markdown table showing peak sales time windows.
   - Present 2-3 actionable revenue recommendations (e.g., flash sales during low-traffic windows).
