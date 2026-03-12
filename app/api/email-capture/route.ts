import { NextResponse } from "next/server";
import { z } from "zod";

import { trackEvent } from "@/lib/growth/events";
import { saveEmailCapture } from "@/lib/growth/repository";

const payloadSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  context: z.string().max(200).default("unknown")
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = payloadSchema.parse(json);

    await saveEmailCapture(payload.email, payload.context);

    await trackEvent("email_captured", {
      context: payload.context
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid email." },
        { status: 400 }
      );
    }

    console.error("Email capture failed", error);

    return NextResponse.json(
      { error: "Unable to subscribe right now." },
      { status: 500 }
    );
  }
}

