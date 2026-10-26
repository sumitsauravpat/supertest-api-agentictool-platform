---
name: review-pr
description: Reviews a real PR's diff for 5 concrete test-code anti-patterns (hardcoded waits, raw CSS selectors, missing assertions, silent any, hardcoded values in tests), then comments on the PR and either approves it or reassigns it back to the submitter. Use when the user gives a PR number and asks to review it.
---

# Review PR

Given a PR number as input, run this exact sequence.

## Step 1 — pull the real diff

Run `gh pr diff <number>` to get the actual diff text. Do not guess at the
content — always pull the real thing.

## Step 2 — run the deterministic checker

1. Use `parseDiff` (from `agents/prReviewAgent.ts`) to split the raw diff
   into one entry per changed file.
2. Use `reviewDiff` to get the real list of findings — hardcoded waits, raw
   CSS selectors, missing assertions, silent `any`, hardcoded values in
   test files.

## Step 3 — decide and act

- **If `findings` is empty:** the PR is clean. Run
  `gh pr review <number> --approve --body "<summary>"` with a short,
  specific summary of what was checked and found clean.
- **If `findings` is non-empty:** do NOT approve. Instead:
  1. Build one clear comment body listing every finding — the rule name,
     the message, and the actual line it was found on.
  2. Post it with `gh pr comment <number> --body "<comment>"`.
  3. Find the PR's author with `gh pr view <number> --json author`, then
     reassign it back to them with
     `gh pr edit <number> --add-assignee <their-username>`.

## Step 4 — report back

Tell the user plainly: how many files were scanned, how many findings (if
any), and what action was actually taken (approved, or commented +
reassigned). Never claim an action that wasn't actually run.
