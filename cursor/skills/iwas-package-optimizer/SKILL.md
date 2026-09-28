---
name: iwas-package-optimizer
description: Audit WiFi billing packages, evaluate sales conversion and duration performance, and recommend pricing adjustments.
---

# IWAS Package Optimizer Skill

Use this skill when the user asks to:
- "Review available WiFi packages and pricing."
- "Evaluate which packages are underperforming or driving highest revenue."
- "Optimize hotspot pricing strategy and package duration limits."

## Workflow Procedure

1. **Catalog Inspection:**
   - Call `list_packages` to retrieve all currently active, public, and private packages.
   - For each package, note the price, validity duration (minutes), upload/download rate limits, and data quota caps.
   - If deep package details are needed, call `get_package` with the specific package ID.

2. **Performance Analytics:**
   - Call `summarize_package_performance` to analyze:
     - Revenue share per package over the lookback window.
     - Total sessions authorized under each package.
     - Top performer vs. low-conversion packages.

3. **Strategic Assessment:**
   - Compare package pricing against duration (VND per hour or day).
   - Evaluate whether unlimited time vs. quota-based packages deliver higher margin.
   - Cross-reference with `get_revenue_breakdown` to see if package popularity correlates with specific time-of-day traffic.

4. **Deliver Recommendations:**
   - Provide a comparative overview of all packages.
   - Highlight the #1 revenue driver and any packages with 0 sales.
   - Give 2-3 specific suggestions (e.g., bundle discounts, adjusting speed tier limits, or retiring obsolete plans).
