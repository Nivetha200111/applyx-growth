import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import { trackEvent } from "@/lib/growth/events";

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source") ?? "unknown";
  const slug = request.nextUrl.searchParams.get("slug");
  const destination = new URL(env.applyxApiBaseUrl);

  destination.searchParams.set("utm_source", "applyx-growth");
  destination.searchParams.set("utm_medium", "referral");
  destination.searchParams.set("utm_campaign", source);

  if (slug) {
    destination.searchParams.set("score_slug", slug);
  }

  await trackEvent("applyx_redirect_clicked", {
    source,
    slug
  });

  return NextResponse.redirect(destination);
}

