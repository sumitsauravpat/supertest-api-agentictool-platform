import { env } from "../config/env";

export function buildHeader(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    env: env.environment,
    "x-mfe-env": env.serviceEnv,
    "x-mfe-transaction-id": env.transactionId,
  };
}
