import {
  evaluateMergeReadiness,
  DEFAULT_POLICY,
  type JobResult,
} from "./mergeReadinessAgent";

describe("Merge readiness agent", () => {
  it("matches our REAL PR #1 run — typecheck failed, so NOT ready, even though live-test (bonus) passed", () => {
    const realJobs: JobResult[] = [
      { name: "lint", conclusion: "success" },
      { name: "typecheck", conclusion: "failure" },
      { name: "test", conclusion: "skipped" },
      { name: "live-test", conclusion: "success" },
    ];

    const result = evaluateMergeReadiness(realJobs, DEFAULT_POLICY);

    expect(result.ready).toBe(false);
    expect(result.reasons).toContain('Required job "typecheck" did not pass (failure)');
    expect(result.reasons).toContain(
      'Bonus job "live-test" also passed — extra confidence, not required',
    );
  });

  it("is ready when all required jobs pass, regardless of the bonus job", () => {
    const allGreenExceptBonus: JobResult[] = [
      { name: "lint", conclusion: "success" },
      { name: "typecheck", conclusion: "success" },
      { name: "test", conclusion: "success" },
      { name: "live-test", conclusion: "failure" },
    ];

    const result = evaluateMergeReadiness(allGreenExceptBonus, DEFAULT_POLICY);

    expect(result.ready).toBe(true);
    expect(result.reasons).toContain(
      'Bonus job "live-test" did not pass (failure) — informational only, does not block',
    );
  });

  it("the 95% pass-rate mode: blocks even if required jobs pass, when overall rate is too low", () => {
    const manyJobs: JobResult[] = [
      { name: "lint", conclusion: "success" },
      { name: "typecheck", conclusion: "success" },
      { name: "test", conclusion: "success" },
      { name: "regression-1", conclusion: "failure" },
      { name: "regression-2", conclusion: "failure" },
    ];

    const result = evaluateMergeReadiness(manyJobs, {
      requiredJobs: ["lint", "typecheck", "test"],
      bonusJobs: [],
      minPassRateThreshold: 0.95,
    });

    // 3 of 5 passed = 60% — below the 95% threshold, even though all 3 required jobs passed
    expect(result.ready).toBe(false);
    expect(result.reasons.some((r) => r.includes("60%"))).toBe(true);
  });
});
