import request from "supertest";
import { env } from "../config/env";
import type { PatchRatePlanResponse } from "../schemas/patchRatePlan.types";
import { buildHeader } from "../utils/headers";

export async function patchRatePlan(
  token: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
): Promise<PatchRatePlanResponse> {
  const response = await request(env.baseUrl)
    .patch("/salesSummary/0/ratePlan")
    .type("json")
    .set(buildHeader(token))
    .send(body);

  return response.body;
}
