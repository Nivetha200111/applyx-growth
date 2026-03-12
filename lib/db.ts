import { Pool } from "pg";

import { env, isDatabaseConfigured } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var __applyxGrowthPool: Pool | undefined;
}

export function getPool(): Pool | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (!global.__applyxGrowthPool) {
    global.__applyxGrowthPool = new Pool({
      connectionString: env.databaseUrl
    });
  }

  return global.__applyxGrowthPool;
}

