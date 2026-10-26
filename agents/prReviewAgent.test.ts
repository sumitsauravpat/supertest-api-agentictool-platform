import { reviewFile, reviewDiff, type FileDiff } from "./prReviewAgent";

describe("PR review agent — 5 real anti-patterns", () => {
  it("flags a hardcoded wait/sleep", () => {
    const findings = reviewFile({
      path: "api/tests/example.test.ts",
      addedLines: ["  await page.waitForTimeout(5000);"],
    });
    expect(findings.some((f) => f.rule === "hardcoded-wait")).toBe(true);
  });

  it("flags a raw CSS selector in a test file", () => {
    const findings = reviewFile({
      path: "api/tests/example.test.ts",
      addedLines: ["  const btn = page.locator('.submit-button');"],
    });
    expect(findings.some((f) => f.rule === "raw-selector")).toBe(true);
  });

  it("flags a new test block with no assertion at all", () => {
    const findings = reviewFile({
      path: "api/tests/example.test.ts",
      addedLines: ['it("does something", async () => {', "  const x = 5;", "});"],
    });
    expect(findings.some((f) => f.rule === "missing-assertion")).toBe(true);
  });

  it("does NOT flag missing-assertion when expect() is present", () => {
    const findings = reviewFile({
      path: "api/tests/example.test.ts",
      addedLines: ['it("does something", async () => {', "  expect(true).toBe(true);", "});"],
    });
    expect(findings.some((f) => f.rule === "missing-assertion")).toBe(false);
  });

  it("flags a silent any with no eslint-disable comment", () => {
    const findings = reviewFile({
      path: "api/clients/example.ts",
      addedLines: ["export function foo(body: any) {"],
    });
    expect(findings.some((f) => f.rule === "silent-any")).toBe(true);
  });

  it("does NOT flag any when an eslint-disable comment is right above it", () => {
    const findings = reviewFile({
      path: "api/clients/example.ts",
      addedLines: [
        "// eslint-disable-next-line @typescript-eslint/no-explicit-any",
        "export function foo(body: any) {",
      ],
    });
    expect(findings.some((f) => f.rule === "silent-any")).toBe(false);
  });

  it("flags a hardcoded UUID/email/URL inside a test file", () => {
    const findings = reviewFile({
      path: "api/tests/example.test.ts",
      addedLines: ['  const id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";'],
    });
    expect(findings.some((f) => f.rule === "hardcoded-value")).toBe(true);
  });

  it("does NOT flag hardcoded-value in a non-test file", () => {
    const findings = reviewFile({
      path: "api/clients/example.ts",
      addedLines: ['  const id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";'],
    });
    expect(findings.some((f) => f.rule === "hardcoded-value")).toBe(false);
  });

  it("a genuinely clean diff produces zero findings", () => {
    const clean: FileDiff[] = [
      {
        path: "api/tests/example.test.ts",
        addedLines: [
          'it("returns the right status", async () => {',
          "  const result = await getMockPromotions(mockUrl, \"Ontario\");",
          "  expect(result.status).toBe(200);",
          "});",
        ],
      },
    ];
    expect(reviewDiff(clean)).toEqual([]);
  });
});
