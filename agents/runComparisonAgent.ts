// Compares 2 real CI runs' job results and surfaces exactly 3 categories of
// change — mirrors the real QACypress anchor story: net-new regressions,
// net-new fixes, and brand-new tests. Pure deterministic diffing, no LLM.

export interface JobResult {
  name: string;
  conclusion: "success" | "failure" | "skipped" | string;
}

export interface RunComparison {
  newlyFailing: string[]; // passed in the earlier run, failing now
  newlyFixed: string[]; // failed in the earlier run, passing now
  newTests: string[]; // present now, absent from the earlier run
}

export function compareRuns(earlier: JobResult[], later: JobResult[]): RunComparison {
  const earlierByName = new Map(earlier.map((j) => [j.name, j.conclusion]));

  const newlyFailing: string[] = [];
  const newlyFixed: string[] = [];
  const newTests: string[] = [];

  for (const job of later) {
    const before = earlierByName.get(job.name);

    if (before === undefined) {
      newTests.push(job.name);
      continue;
    }

    if (before === "success" && job.conclusion !== "success") {
      newlyFailing.push(job.name);
    }

    if (before !== "success" && job.conclusion === "success") {
      newlyFixed.push(job.name);
    }
  }

  return { newlyFailing, newlyFixed, newTests };
}

export function hasAnyChange(comparison: RunComparison): boolean {
  return (
    comparison.newlyFailing.length > 0 ||
    comparison.newlyFixed.length > 0 ||
    comparison.newTests.length > 0
  );
}
