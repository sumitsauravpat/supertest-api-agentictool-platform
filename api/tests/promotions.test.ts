import http from "node:http";
import { startMockPromotionsServer } from "../utils/mockPromotionsServer";
import { getMockPromotions } from "../clients/getMockPromotions";

describe("Promotions service (mocked — real service not yet available)", () => {
  let server: http.Server;
  let mockUrl: string;

  beforeAll(async () => {
    const mock = await startMockPromotionsServer();
    server = mock.server;
    mockUrl = mock.url;
  });

  afterAll(() => {
    server.close();
  });

  it("returns a discount for Ontario", async () => {
    const result = await getMockPromotions(mockUrl, "Ontario");
    expect(result.status).toBe(200);
    expect(result.body.found).toBe(true);
    expect(result.body.discountPercent).toBe(15);
  });

  it("returns no promotion for a region with none", async () => {
    const result = await getMockPromotions(mockUrl, "Alberta");
    expect(result.status).toBe(200);
    expect(result.body.found).toBe(false);
  });

  it("handles the service being down — real error-handling check", async () => {
    const result = await getMockPromotions(mockUrl, "ServerError");
    expect(result.status).toBe(500);
  });
});
