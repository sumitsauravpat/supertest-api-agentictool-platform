import { notifyRunDiff } from "./notifyRunDiff";

describe("Run-diff notifier", () => {
  it("reports no change clearly, when nothing changed", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await notifyRunDiff({
      earlierRunUrl: "https://github.com/.../runs/1",
      laterRunUrl: "https://github.com/.../runs/2",
      comparison: { newlyFailing: [], newlyFixed: [], newTests: [] },
    });

    const printed = logSpy.mock.calls.map((c) => c[0]).join("\n");
    expect(printed).toContain("✅ No change");

    logSpy.mockRestore();
  });

  it("reports all 3 categories when they all occur together", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await notifyRunDiff({
      earlierRunUrl: "https://github.com/.../runs/1",
      laterRunUrl: "https://github.com/.../runs/2",
      comparison: {
        newlyFailing: ["lint"],
        newlyFixed: ["typecheck"],
        newTests: ["regression-suite"],
      },
    });

    const printed = logSpy.mock.calls.map((c) => c[0]).join("\n");
    expect(printed).toContain("Newly failing");
    expect(printed).toContain("lint");
    expect(printed).toContain("Newly fixed");
    expect(printed).toContain("typecheck");
    expect(printed).toContain("New jobs");
    expect(printed).toContain("regression-suite");

    logSpy.mockRestore();
  });
});
