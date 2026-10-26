// Agent for Flow 2 — reviews a PR's real diff for 5 real anti-patterns.
// Pure deterministic string/regex checks — no LLM call inside this file.

export interface FileDiff {
  path: string;
  addedLines: string[];
}

export interface ReviewFinding {
  rule: string;
  message: string;
  line: string;
}

function isTestFile(path: string): boolean {
  return path.endsWith(".test.ts");
}

const HARDCODED_WAIT = /\b(setTimeout\s*\(|sleep\s*\(|waitForTimeout\(\s*\d)/;
const RAW_SELECTOR = /\.(locator|querySelector)\(\s*['"][.#]/;
const SILENT_ANY = /:\s*any\b/;
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const BARE_URL = /https?:\/\/[^\s'"]+/;

export function reviewFile(file: FileDiff): ReviewFinding[] {
  const findings: ReviewFinding[] = [];

  file.addedLines.forEach((line, i) => {
    if (HARDCODED_WAIT.test(line)) {
      findings.push({
        rule: "hardcoded-wait",
        message: "Hardcoded wait/sleep instead of real auto-waiting",
        line,
      });
    }

    if (isTestFile(file.path) && RAW_SELECTOR.test(line)) {
      findings.push({
        rule: "raw-selector",
        message: "Raw CSS selector instead of a role-based locator",
        line,
      });
    }

    if (SILENT_ANY.test(line)) {
      const prevLine = file.addedLines[i - 1] ?? "";
      if (!prevLine.includes("eslint-disable")) {
        findings.push({
          rule: "silent-any",
          message: "`any` used without an explicit eslint-disable comment",
          line,
        });
      }
    }

    if (isTestFile(file.path) && (UUID.test(line) || EMAIL.test(line) || BARE_URL.test(line))) {
      findings.push({
        rule: "hardcoded-value",
        message:
          "A real-looking value is hardcoded directly in the test instead of coming from a fixture/test-data helper",
        line,
      });
    }
  });

  if (isTestFile(file.path)) {
    const hasNewTest = file.addedLines.some((l) => /\b(it|test)\s*\(/.test(l));
    const hasAssertion = file.addedLines.some((l) => l.includes("expect("));
    if (hasNewTest && !hasAssertion) {
      findings.push({
        rule: "missing-assertion",
        message: "A new test block was added with no expect(...) assertion anywhere in the diff",
        line: "",
      });
    }
  }

  return findings;
}

export function reviewDiff(files: FileDiff[]): ReviewFinding[] {
  return files.flatMap(reviewFile);
}

// Turns a real `gh pr diff` text blob into one FileDiff per changed file.
export function parseDiff(rawDiff: string): FileDiff[] {
  const fileBlocks = rawDiff.split(/^diff --git /m).slice(1);

  return fileBlocks.map((block) => {
    const pathMatch = block.match(/a\/(\S+) b\/(\S+)/);
    const path = pathMatch ? pathMatch[2] : "unknown";
    const addedLines = block
      .split("\n")
      .filter((l) => l.startsWith("+") && !l.startsWith("+++"))
      .map((l) => l.slice(1));
    return { path, addedLines };
  });
}
