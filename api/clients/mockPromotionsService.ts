// Purpose — stub for a real promotions service that's still being built by another team.
// The real API contract isn't finalized yet, so this mock matches the AGREED shape
// (from the API contract discussion) and lets our automation keep moving without
// depending on a service that doesn't exist yet. Once the real service ships, this
// file gets deleted and clients point at the real endpoint instead.
export async function mockPromotionsService(
  region: string,
): Promise<{ found: boolean; discountPercent?: number }> {
  if (region === "Ontario") {
    return { found: true, discountPercent: 15 };
  }
  return { found: false };
}
