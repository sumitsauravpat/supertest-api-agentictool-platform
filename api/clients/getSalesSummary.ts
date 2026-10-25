import request from "supertest";
import { env } from "../config/env";
import type { ResponseDetailsResponse } from "../schemas/getSalesSummary.types";
import { buildHeader } from "../utils/headers";

export async function getSalesSummary(
  token: string,
  quoteId: string,
): Promise<ResponseDetailsResponse> {
  const response = await request(env.baseUrl)
    .get(`/salesSummary/${quoteId}`)
    .set(buildHeader(token));

  return response.body;
}
