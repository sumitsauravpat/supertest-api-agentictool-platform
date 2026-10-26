---
name: compare-runs
description: Compares two CI runs on this repo and posts the real differences to Slack via n8n — new failures (regressions), newly fixed jobs, and brand-new jobs. Use when the user says something like "compare the old and new run", "qa compare runs", or gives two specific run numbers/URLs.
---

# Compare Runs

Given either two specific run identifiers, or no specifics (meaning "the
last 2 completed runs on main"), run this exact sequence.

## Step 1 — fetch both runs' real job results

1. Use the `github` MCP server to find the runs (if no specifics were
   given, the 2 most recent COMPLETED runs on `main` for the `CI`
   workflow — skip any still `in_progress`).
2. For each run, get every job's `name` and `conclusion`.
3. If the MCP server isn't connected yet, tell the user to run `/mcp`
   first and stop.

## Step 2 — compute the real diff

Use `compareRuns` (from `agents/runComparisonAgent.ts`) with the EARLIER
run first, the LATER run second — order matters, this is what decides
"newly failing" vs "newly fixed".

## Step 3 — post it

Use `notifyRunDiff` (from `agents/notifyRunDiff.ts`) with both run URLs
and the comparison result.

- Pass the `N8N_WEBHOOK_URL` environment variable as the `webhookUrl`
  argument, if it's set.
- If it's NOT set, that's expected right now (n8n isn't wired up yet) —
  the function will just print what WOULD be sent. Report that plainly,
  don't treat it as an error.

## Step 4 — report back

Tell the user, in plain language: which 2 runs were compared, and the
real result — "no change," or exactly which jobs are newly failing,
newly fixed, or brand new. Never claim something was posted to Slack if
no real webhook was configured.
