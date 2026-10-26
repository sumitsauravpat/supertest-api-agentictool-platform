---
name: run-agent-pipeline
description: End-to-end agentic pipeline — given a Jira ticket key, fetches the requirement via MCP, validates it, generates real code following this repo's conventions, verifies it locally, opens a real PR, and reports merge-readiness. Use when the user gives a ticket key (e.g. "SCRUM-2") and asks to run the agent pipeline on it.
---

# Run Agent Pipeline

Given a Jira ticket key as input, run this exact sequence. Do not skip a step
or reorder them — each step's output is the next step's required input.

## Step 1 — Agent A: fetch + validate the requirement

1. Use the `atlassian` MCP server to fetch the ticket by key. If the MCP
   server isn't connected yet, tell the user to run `/mcp` first and stop.
2. Run `checkRequirementCompleteness` (from `agents/requirementAgent.ts`)
   against the raw description.
3. If `complete` is `false`: STOP. Tell the user exactly which sections are
   missing (`missingSections`) and ask them to add that detail to the ticket
   before re-running. Do not proceed to Step 2 under any circumstances.

## Step 2 — Agent B: generate the code

1. Read `CLAUDE.md` in full — this defines where new code goes and what
   shape it should take in THIS repo.
2. Using the parsed `sections` (scenario, request, expectedResponse,
   prerequisites) from Step 1, write the real code changes needed:
   - A new branch inside the relevant mock server in `api/utils/`
     (validation checks come before business-logic checks)
   - Any client function signature change needed to actually exercise the
     new case (e.g. making a param optional so a test can omit it)
   - One new `it()` block in the matching `api/tests/*.test.ts` file,
     asserting on the real `status` and `body` from `Expected Response`
3. Follow every rule in `CLAUDE.md`'s "Code conventions" section exactly
   (async/await, no var, no silent `any`, etc.)

## Step 3 — Agent C: verify locally, before touching git

1. Run `npm run verify` (typecheck + lint + test).
2. If anything fails: STOP. Report the real failure to the user and do not
   proceed to Step 4. Do not attempt to "fix" it silently without asking.

## Step 4 — Agent D: branch, push, open the PR

1. Create a new branch named `agent/<ticket-key-lowercase>-<short-slug>`
   from the latest `origin/main`.
2. Scan the staged diff for any brand/credential-looking strings before
   committing (same discipline as every other commit in this repo).
3. Commit with a message referencing the ticket key, and explain in 1-2
   sentences that this was agent-generated from the requirement.
4. Push the branch and open a real PR via `gh pr create`, with a body that
   states: what the ticket asked for, what changed, and that this was
   produced by this agent pipeline. Merge stays manual — never merge
   automatically, even if everything passed.

## Step 5 — merge-readiness check + notification

1. Once CI has run on the PR (poll with `gh run list` / `gh run view
   --json jobs` until the run tied to this PR's branch is no longer
   `in_progress`), extract each job's `name` and `conclusion`.
2. Run `evaluateMergeReadiness` (from `agents/mergeReadinessAgent.ts`) with
   `DEFAULT_POLICY` against those real job results.
3. Run `notifyMergeReady` (from `agents/notifyMergeReady.ts`) with the PR
   URL, title, and that result. If no real webhook is configured, this
   just prints what would be sent — that's expected, not a failure.
4. Report the final verdict to the user in plain language: ready or not,
   and why. This is informational only — a human still makes the real
   merge decision.
