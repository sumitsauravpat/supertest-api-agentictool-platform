import { notifyMergeReady } from "./notifyMergeReady";

describe("Merge-ready notifier", () => {
  it("prints the real message (not ready) when no webhook is configured — never merges anything", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await notifyMergeReady({
      prUrl: "https://github.com/sumitsauravpat/supertest-api-agentictool-platform/pull/1",
      prTitle: "Add API test coverage for the promotions service error case (SCRUM-1)",
      result: {
        ready: false,
        reasons: ['Required job "typecheck" did not pass (failure)'],
      },
    });

    const printed = logSpy.mock.calls.map((call) => call[0]).join("\n");
    expect(printed).toContain("❌");
    expect(printed).toContain("NOT ready");
    expect(printed).toContain("typecheck");

    logSpy.mockRestore();
  });

  it("marks ready clearly when the policy says ready", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await notifyMergeReady({
      prUrl: "https://github.com/sumitsauravpat/supertest-api-agentictool-platform/pull/1",
      prTitle: "Add API test coverage for the promotions service error case (SCRUM-1)",
      result: { ready: true, reasons: ["Required job \"lint\" passed"] },
    });

    const printed = logSpy.mock.calls.map((call) => call[0]).join("\n");
    expect(printed).toContain("✅");
    expect(printed).toContain("Ready for a human to review and merge.");

    logSpy.mockRestore();
  });
});
