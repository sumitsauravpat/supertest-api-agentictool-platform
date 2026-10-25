import { createQuoteAndFetchSummary } from "../controllers/createQuoteAndFetchSummary";
import { patchRatePlanBody } from "../fixtures/patchRatePlanBody";

describe("Sales Summary API", () => {
  it("creates a quote and returns a valid sales summary", async () => {
    const summary = await createQuoteAndFetchSummary(patchRatePlanBody);
    expect(summary.successInd).toBe(true);
    expect(summary.data.referenceId).toBeTruthy();
  });
});
