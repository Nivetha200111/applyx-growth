import { env } from "@/lib/env";

export const INTERNAL_API_KEY_HEADER = "x-applyx-internal-api-key";

function getAuthorizationApiKey(request: Request): string | null {
  const authorizationHeader = request.headers.get("authorization");

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length).trim();
}

export function hasValidInternalApiKey(request: Request): boolean {
  const configuredApiKey = env.applyxInternalApiKey.trim();

  if (!configuredApiKey) {
    return false;
  }

  const providedApiKey =
    request.headers.get(INTERNAL_API_KEY_HEADER)?.trim() ?? getAuthorizationApiKey(request);

  return providedApiKey === configuredApiKey;
}

