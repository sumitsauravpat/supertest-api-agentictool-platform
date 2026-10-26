import { compareRuns, hasAnyChange, type JobResult } from "./runComparisonAgent";

describe("Run comparison agent — 3 real categories", () => {
  it("catches a newly failing job (a real regression)", () => {
    const earlier: JobResult[] = [{ name: "lint", conclusion: "success" }];
    const later: JobResult[] = [{ name: "lint", conclusion: "failure" }];

    const result = compareRuns(earlier, later);

    expect(result.newlyFailing).toEqual(["lint"]);
    expect(result.newlyFixed).toEqual([]);
    expect(result.newTests).toEqual([]);
  });

  it("catches a newly fixed job", () => {
    const earlier: JobResult[] = [{ name: "typecheck", conclusion: "failure" }];
    const later: JobResult[] = [{ name: "typecheck", conclusion: "success" }];

    const result = compareRuns(earlier, later);

    expect(result.newlyFixed).toEqual(["typecheck"]);
    expect(result.newlyFailing).toEqual([]);
  });

  it("catches a brand-new job that didn't exist in the earlier run", () => {
    const earlier: JobResult[] = [{ name: "lint", conclusion: "success" }];
    const later: JobResult[] = [
      { name: "lint", conclusion: "success" },
      { name: "live-test", conclusion: "failure" },
    ];

    const result = compareRuns(earlier, later);

    expect(result.newTests).toEqual(["live-test"]);
  });

  it("matches our REAL main branch history — 2 identical failing runs, zero change", () => {
    const sameEveryTime: JobResult[] = [
      { name: "lint", conclusion: "success" },
      { name: "typecheck", conclusion: "failure" },
      { name: "test", conclusion: "skipped" },
      { name: "live-test", conclusion: "success" },
    ];

    const result = compareRuns(sameEveryTime, sameEveryTime);

    expect(hasAnyChange(result)).toBe(false);
  });

  it("all 3 categories at once, in a single comparison", () => {
    const earlier: JobResult[] = [
      { name: "lint", conclusion: "success" },
      { name: "typecheck", conclusion: "failure" },
    ];
    const later: JobResult[] = [
      { name: "lint", conclusion: "failure" }, // newly failing
      { name: "typecheck", conclusion: "success" }, // newly fixed
      { name: "regression-suite", conclusion: "failure" }, // new test
    ];

    const result = compareRuns(earlier, later);

    expect(result.newlyFailing).toEqual(["lint"]);
    expect(result.newlyFixed).toEqual(["typecheck"]);
    expect(result.newTests).toEqual(["regression-suite"]);
    expect(hasAnyChange(result)).toBe(true);
  });
});
