const DEFAULT_APPLYX_URL = "https://applyx.space";
const DEFAULT_APP_URL = "http://localhost:3000";

function parseUrl(value: string | undefined, fallback: string): string {
  try {
    return new URL(value ?? fallback).toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const env = {
  appUrl: parseUrl(process.env.NEXT_PUBLIC_APP_URL, DEFAULT_APP_URL),
  applyxApiBaseUrl: parseUrl(process.env.APPLYX_API_BASE_URL, DEFAULT_APPLYX_URL),
  applyxInternalApiKey: process.env.APPLYX_INTERNAL_API_KEY ?? "",
  databaseUrl: process.env.DATABASE_URL ?? ""
};

export function isDatabaseConfigured(): boolean {
  return env.databaseUrl.length > 0;
}

