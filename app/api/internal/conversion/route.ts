import { NextResponse } from "next/server";
import { z } from "zod";

import { hasValidInternalApiKey, INTERNAL_API_KEY_HEADER } from "@/lib/api/auth";
import { getAtsResultBySlug, saveGrowthEvent } from "@/lib/growth/repository";
import type {
  ConversionCallbackPayload,
  ConversionCallbackResponse
} from "@/lib/growth/types";
import { conversionEventTypes } from "@/lib/growth/types";

const conversionPayloadSchema = z.object({
  eventType: z.enum(conversionEventTypes),
  source: z.string().trim().min(1, "Source is required."),
  slug: z.string().trim().min(1).nullable(),
  userId: z.string().trim().min(1).nullable(),
  metadata: z.record(z.unknown()).nullable()
});

export async function POST(request: Request) {
  if (!hasValidInternalApiKey(request)) {
    return NextResponse.json(
      {
        error: `Unauthorized. Provide ${INTERNAL_API_KEY_HEADER}.`
      },
      { status: 401 }
    );
  }

  try {
    const json = await request.json();
    const payload = conversionPayloadSchema.parse(json) as ConversionCallbackPayload;
    const atsResult = payload.slug ? await getAtsResultBySlug(payload.slug) : null;

    await saveGrowthEvent({
      eventType: payload.eventType,
      metadata: {
        source: payload.source,
        slug: payload.slug,
        userId: payload.userId,
        atsResultId: atsResult?.id ?? null,
        atsScore: atsResult?.score ?? null,
        metadata: payload.metadata
      }
    });

    const response: ConversionCallbackResponse = {
      success: true,
      event: {
        eventType: payload.eventType,
        source: payload.source,
        slug: payload.slug,
        userId: payload.userId,
        associatedAtsResultId: atsResult?.id ?? null
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues[0]?.message ?? "Invalid conversion payload."
        },
        { status: 400 }
      );
    }

    console.error("Internal conversion callback failed", error);

    return NextResponse.json(
      {
        error: "Unable to store the conversion event."
      },
      { status: 500 }
    );
  }
}

