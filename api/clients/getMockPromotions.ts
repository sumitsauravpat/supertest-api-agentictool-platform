import request from "supertest";

// Purpose — same shape as our real clients (request(baseUrl).get(path)).
// When the real promotions service ships, only the baseUrl passed in changes
// — this function's shape, the test, and the assertions all stay identical.
export async function getMockPromotions(
  baseUrl: string,
  region?: string,
): Promise<{
  status: number;
  body: { found?: boolean; discountPercent?: number; message?: string };
}> {
  const path = region ? `/promotions?region=${region}` : "/promotions";
  const response = await request(baseUrl).get(path);
  return { status: response.status, body: response.body };
}
