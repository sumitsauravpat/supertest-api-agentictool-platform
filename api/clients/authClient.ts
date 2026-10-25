import request from "supertest";
import { env } from "../config/env";

export async function getBearerToken(): Promise<string> {
  const response = await request(env.tokenUrl).post("").type("form").send({
    grant_type: "client_credentials",
    scope: env.scope,
    client_id: env.clientId,
    client_secret: env.clientSecret,
  });

  return response.body.access_token;
}
