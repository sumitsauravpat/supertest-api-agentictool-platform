// Decides whether a PR is ready to merge, from a real CI run's job results.
// This NEVER merges anything itself — it only produces a verdict + reasons
// for a human (or the notifier) to act on.

export interface JobResult {
  name: string;
  conclusion: "success" | "failure" | "skipped" | string;
}

// The CONTROL SURFACE — tune this per project/team, nothing else needs to change.
export interface MergeReadinessPolicy {
  requiredJobs: string[]; // must be "success" — any failure blocks merge
  bonusJobs: string[]; // informational only — passing adds confidence, never blocks
  minPassRateThreshold?: number; // optional, e.g. 0.95 — an ADDITIONAL gate across ALL jobs
}

export interface MergeReadinessResult {
  ready: boolean;
  reasons: string[];
}

// Our actual pipeline's real policy — live-test is deliberately a bonus job,
// matching its continue-on-error: true setting in ci.yml.
export const DEFAULT_POLICY: MergeReadinessPolicy = {
  requiredJobs: ["lint", "typecheck", "test"],
  bonusJobs: ["live-test"],
};

export function evaluateMergeReadiness(
  jobs: JobResult[],
  policy: MergeReadinessPolicy,
): MergeReadinessResult {
  const reasons: string[] = [];
  let ready = true;

  for (const requiredName of policy.requiredJobs) {
    const job = jobs.find((j) => j.name === requiredName);
    if (!job || job.conclusion !== "success") {
      ready = false;
      reasons.push(
        `Required job "${requiredName}" did not pass (${job?.conclusion ?? "not found"})`,
      );
    } else {
      reasons.push(`Required job "${requiredName}" passed`);
    }
  }

  for (const bonusName of policy.bonusJobs) {
    const job = jobs.find((j) => j.name === bonusName);
    if (job?.conclusion === "success") {
      reasons.push(`Bonus job "${bonusName}" also passed — extra confidence, not required`);
    } else {
      reasons.push(
        `Bonus job "${bonusName}" did not pass (${job?.conclusion ?? "not found"}) — informational only, does not block`,
      );
    }
  }

  if (policy.minPassRateThreshold !== undefined) {
    const passed = jobs.filter((j) => j.conclusion === "success").length;
    const rate = jobs.length > 0 ? passed / jobs.length : 0;
    reasons.push(
      `Overall pass rate: ${(rate * 100).toFixed(0)}% (threshold: ${(policy.minPassRateThreshold * 100).toFixed(0)}%)`,
    );
    if (rate < policy.minPassRateThreshold) {
      ready = false;
      reasons.push("Overall pass rate is below the configured threshold");
    }
  }

  return { ready, reasons };
}
