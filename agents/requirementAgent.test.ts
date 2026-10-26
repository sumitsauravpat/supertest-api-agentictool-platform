import { checkRequirementCompleteness } from "./requirementAgent";

const REAL_SCRUM_1_DESCRIPTION = `Add API test coverage for the promotions service error case

Scenario:
The promotions service should reject a request that's missing the required
"region" query parameter, instead of silently treating it as "no promotion found."

Request:
GET /promotions   (no "region" query param at all)

Expected Response:
Status: 400
Body: { "message": "region is required" }

Prerequisites:
Uses the existing mock promotions server (api/utils/mockPromotionsServer.ts) —
no real external promotions service exists yet, same pattern as the other
3 scenarios already covered there.`;

describe("Agent A — requirement completeness check", () => {
  it("accepts the real, fully-documented SCRUM-1 ticket", () => {
    const result = checkRequirementCompleteness(REAL_SCRUM_1_DESCRIPTION);
    expect(result.complete).toBe(true);
    expect(result.missingSections).toEqual([]);
    expect(result.sections?.request).toContain("GET /promotions");
    expect(result.sections?.expectedResponse).toContain("400");
  });

  it("rejects a ticket missing the Prerequisites section", () => {
    const incomplete = REAL_SCRUM_1_DESCRIPTION.split("Prerequisites:")[0];
    const result = checkRequirementCompleteness(incomplete);
    expect(result.complete).toBe(false);
    expect(result.missingSections).toEqual(["Prerequisites"]);
  });

  it("rejects the ORIGINAL one-line ticket (before you added detail)", () => {
    const result = checkRequirementCompleteness(
      "Add API test coverage for the promotions service error case",
    );
    expect(result.complete).toBe(false);
    expect(result.missingSections).toEqual([
      "Scenario",
      "Request",
      "Expected Response",
      "Prerequisites",
    ]);
  });
});
