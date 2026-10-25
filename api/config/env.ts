import "dotenv/config";

interface EnvConfig {
  baseUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  environment: string;
  serviceEnv: string;
  transactionId: string;
}

function requireEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Key  is missing value, Key: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  baseUrl: requireEnv("BASE_URL"),
  tokenUrl: requireEnv("TOKEN_URL"),
  clientId: requireEnv("CLIENT_ID"),
  clientSecret: requireEnv("CLIENT_SECRET"),
  scope: requireEnv("SCOPE"),
  environment: requireEnv("ENVIRONMENT"),
  serviceEnv: requireEnv("SERVICE_ENV"),
  transactionId: requireEnv("TRANSACTION_ID"),
};
