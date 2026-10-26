import { createQuoteAndFetchSummary } from "../controllers/createQuoteAndFetchSummary";
import { patchRatePlanBody } from "../fixtures/patchRatePlanBody";

// Purpose — hits the REAL BFF. Excluded from the default `npm test` / CI run
// (see jest.config.js testPathIgnorePatterns) since it depends on an
// external environment we don't control. Run manually via `npm run test:live`.
describe("Sales Summary API (live BFF)", () => {
  it("creates a quote and returns a valid sales summary", async () => {
    const summary = await createQuoteAndFetchSummary(patchRatePlanBody);
    expect(summary.successInd).toBe(true);
    expect(summary.data.referenceId).toBeTruthy();
  });
});
