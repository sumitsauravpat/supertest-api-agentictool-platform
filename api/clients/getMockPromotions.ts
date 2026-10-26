import request from "supertest";

// Purpose — same shape as our real clients (request(baseUrl).get(path)).
// When the real promotions service ships, only the baseUrl passed in changes
// — this function's shape, the test, and the assertions all stay identical.
export async function getMockPromotions(
  baseUrl: string,
  region: string,
): Promise<{ status: number; body: { found?: boolean; discountPercent?: number } }> {
  const response = await request(baseUrl).get(`/promotions?region=${region}`);
  return { status: response.status, body: response.body };
}
