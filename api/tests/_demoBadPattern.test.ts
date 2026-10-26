// DEMO FILE — deliberately bad, to prove the review agent's reject path for real.
// Not meant to be merged; see the PR comment this triggers.

describe("Demo of anti-patterns the review agent should catch", () => {
  it("waits on a hardcoded delay instead of real data", async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const btn = { locator: (sel: string) => sel }.locator(".submit-button");
    const userId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    console.log(btn, userId);
  });
});
