export const publicGrowthEventTypes = [
  "ats_check_started",
  "resume_scored",
  "score_page_viewed",
  "applyx_redirect_clicked",
  "cover_letter_generated",
  "email_captured"
] as const;

export const conversionEventTypes = [
  "signup",
  "resume_tailored",
  "payment_completed"
] as const;

export type PublicGrowthEventType = (typeof publicGrowthEventTypes)[number];
export type ConversionEventType = (typeof conversionEventTypes)[number];
export type GrowthEventType = PublicGrowthEventType | ConversionEventType;

export type ConversionCallbackPayload = {
  eventType: ConversionEventType;
  source: string;
  slug: string | null;
  userId: string | null;
  metadata: Record<string, unknown> | null;
};

export type ConversionCallbackResponse = {
  success: true;
  event: {
    eventType: ConversionEventType;
    source: string;
    slug: string | null;
    userId: string | null;
    associatedAtsResultId: string | null;
  };
};

