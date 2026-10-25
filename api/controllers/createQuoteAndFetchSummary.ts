import { getBearerToken } from "../clients/authClient";
import { patchRatePlan } from "../clients/patchRatePlan";
import { getSalesSummary } from "../clients/getSalesSummary";
import type { ResponseDetailsResponse } from "../schemas/getSalesSummary.types";

export async function createQuoteAndFetchSummary(
  body: any,
): Promise<ResponseDetailsResponse> {
  const token = await getBearerToken();
  const patchResult = await patchRatePlan(token, body);
  const quoteId = patchResult.data.referenceId;
  return getSalesSummary(token, quoteId);
}
