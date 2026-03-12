import { saveGrowthEvent } from "@/lib/growth/repository";
import type { PublicGrowthEventType } from "@/lib/growth/types";

export async function trackEvent(
  eventType: PublicGrowthEventType,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    await saveGrowthEvent({
      eventType,
      metadata
    });
  } catch (error) {
    console.error("Failed to track growth event", {
      eventType,
      error
    });
  }
}

