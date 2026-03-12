import type { QueryResultRow } from "pg";

import { getPool } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

export type AtsResultRecord = {
  id: string;
  slug: string;
  score: number;
  missingKeywords: string[];
  recommendations: string[];
  createdAt: string;
};

type GrowthEventRecord = {
  id: string;
  eventType: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

type EmailCaptureRecord = {
  id: string;
  email: string;
  context: string;
  createdAt: string;
};

type MemoryStore = {
  atsResults: Map<string, AtsResultRecord>;
  growthEvents: GrowthEventRecord[];
  emailCaptures: EmailCaptureRecord[];
};

type AtsResultRow = QueryResultRow & {
  id: string;
  slug: string;
  score: number;
  missing_keywords: string[];
  recommendations: string[];
  created_at: Date;
};

type GrowthEventRow = QueryResultRow & {
  id: string;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: Date;
};

type GroupedMetricRow = QueryResultRow & {
  day: string;
  event_type: string;
  count: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __applyxGrowthMemoryStore: MemoryStore | undefined;
}

export type DashboardSeriesPoint = {
  day: string;
  value: number;
};

export type DashboardMetrics = {
  atsChecksToday: number;
  scorePageViewsToday: number;
  applyxRedirectsToday: number;
  coverLettersToday: number;
  emailCapturesToday: number;
  conversionRate: number;
  totalIndexablePages: number;
  atsChecksSeries: DashboardSeriesPoint[];
  scorePageViewsSeries: DashboardSeriesPoint[];
  applyxRedirectSeries: DashboardSeriesPoint[];
  coverLetterSeries: DashboardSeriesPoint[];
  emailCaptureSeries: DashboardSeriesPoint[];
};

function getMemoryStore(): MemoryStore {
  if (!global.__applyxGrowthMemoryStore) {
    global.__applyxGrowthMemoryStore = {
      atsResults: new Map<string, AtsResultRecord>(),
      growthEvents: [],
      emailCaptures: []
    };
  }

  return global.__applyxGrowthMemoryStore;
}

function buildSlug(): string {
  return Math.random().toString(36).slice(2, 8);
}

function formatDateKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function enumerateDays(days: number): string[] {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (days - index - 1));
    return formatDateKey(date);
  });
}

function countEvents(
  events: GrowthEventRecord[],
  eventType: string,
  days: number
): DashboardSeriesPoint[] {
  const emptySeries = new Map<string, number>(enumerateDays(days).map((day) => [day, 0]));

  for (const event of events) {
    if (event.eventType !== eventType) {
      continue;
    }

    const day = event.createdAt.slice(0, 10);

    if (emptySeries.has(day)) {
      emptySeries.set(day, (emptySeries.get(day) ?? 0) + 1);
    }
  }

  return [...emptySeries.entries()].map(([day, value]) => ({ day, value }));
}

function roundConversionRate(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}

export async function saveAtsResult(input: {
  score: number;
  missingKeywords: string[];
  recommendations: string[];
}): Promise<AtsResultRecord> {
  const record: AtsResultRecord = {
    id: crypto.randomUUID(),
    slug: buildSlug(),
    score: input.score,
    missingKeywords: input.missingKeywords,
    recommendations: input.recommendations,
    createdAt: new Date().toISOString()
  };

  if (!isDatabaseConfigured()) {
    getMemoryStore().atsResults.set(record.slug, record);
    return record;
  }

  const pool = getPool();

  if (!pool) {
    return record;
  }

  const result = await pool.query<AtsResultRow>(
    `
      insert into ats_results (id, slug, score, missing_keywords, recommendations, created_at)
      values ($1, $2, $3, $4::jsonb, $5::jsonb, now())
      returning id, slug, score, missing_keywords, recommendations, created_at
    `,
    [
      record.id,
      record.slug,
      record.score,
      JSON.stringify(record.missingKeywords),
      JSON.stringify(record.recommendations)
    ]
  );

  return mapAtsResultRow(result.rows[0]);
}

export async function getAtsResultBySlug(slug: string): Promise<AtsResultRecord | null> {
  if (!isDatabaseConfigured()) {
    return getMemoryStore().atsResults.get(slug) ?? null;
  }

  const pool = getPool();

  if (!pool) {
    return null;
  }

  const result = await pool.query<AtsResultRow>(
    `
      select id, slug, score, missing_keywords, recommendations, created_at
      from ats_results
      where slug = $1
      limit 1
    `,
    [slug]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapAtsResultRow(result.rows[0]);
}

export async function saveGrowthEvent(input: {
  eventType: string;
  metadata: Record<string, unknown>;
}): Promise<void> {
  const event: GrowthEventRecord = {
    id: crypto.randomUUID(),
    eventType: input.eventType,
    metadata: input.metadata,
    createdAt: new Date().toISOString()
  };

  if (!isDatabaseConfigured()) {
    getMemoryStore().growthEvents.unshift(event);
    return;
  }

  const pool = getPool();

  if (!pool) {
    return;
  }

  await pool.query<GrowthEventRow>(
    `
      insert into growth_events (id, event_type, metadata, created_at)
      values ($1, $2, $3::jsonb, now())
    `,
    [event.id, event.eventType, JSON.stringify(event.metadata)]
  );
}

// Approximate total indexable pages: roles × 4 page types + blog + comparisons + static
function estimateTotalIndexablePages(): number {
  // This is a fast in-memory estimate to avoid extra imports in the data layer.
  // 120 roles × 4 (resume, interview, salary, keywords) + ~8 blog + ~4 comparisons + ~4 static
  return 120 * 4 + 8 + 4 + 4;
}

export async function getDashboardMetrics(days = 14): Promise<DashboardMetrics> {
  const totalIndexablePages = estimateTotalIndexablePages();

  if (!isDatabaseConfigured()) {
    const memoryEvents = getMemoryStore().growthEvents;
    const atsChecksSeries = countEvents(memoryEvents, "resume_scored", days);
    const scorePageViewsSeries = countEvents(memoryEvents, "score_page_viewed", days);
    const applyxRedirectSeries = countEvents(memoryEvents, "applyx_redirect_clicked", days);
    const coverLetterSeries = countEvents(memoryEvents, "cover_letter_generated", days);
    const emailCaptureSeries = countEvents(memoryEvents, "email_captured", days);

    const atsChecksToday = atsChecksSeries.at(-1)?.value ?? 0;
    const scorePageViewsToday = scorePageViewsSeries.at(-1)?.value ?? 0;
    const applyxRedirectsToday = applyxRedirectSeries.at(-1)?.value ?? 0;
    const coverLettersToday = coverLetterSeries.at(-1)?.value ?? 0;
    const emailCapturesToday = emailCaptureSeries.at(-1)?.value ?? 0;

    return {
      atsChecksToday,
      scorePageViewsToday,
      applyxRedirectsToday,
      coverLettersToday,
      emailCapturesToday,
      conversionRate: roundConversionRate(applyxRedirectsToday, atsChecksToday),
      totalIndexablePages,
      atsChecksSeries,
      scorePageViewsSeries,
      applyxRedirectSeries,
      coverLetterSeries,
      emailCaptureSeries
    };
  }

  const pool = getPool();

  if (!pool) {
    return {
      atsChecksToday: 0,
      scorePageViewsToday: 0,
      applyxRedirectsToday: 0,
      coverLettersToday: 0,
      emailCapturesToday: 0,
      conversionRate: 0,
      totalIndexablePages,
      atsChecksSeries: [],
      scorePageViewsSeries: [],
      applyxRedirectSeries: [],
      coverLetterSeries: [],
      emailCaptureSeries: []
    };
  }

  const result = await pool.query<GroupedMetricRow>(
    `
      select
        to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
        event_type,
        count(*)::text as count
      from growth_events
      where created_at >= now() - make_interval(days => $1)
      group by 1, 2
      order by 1 asc
    `,
    [days]
  );

  const seriesDays = enumerateDays(days);
  const index = new Map<string, Map<string, number>>();

  for (const row of result.rows) {
    if (!index.has(row.event_type)) {
      index.set(row.event_type, new Map<string, number>());
    }

    index.get(row.event_type)?.set(row.day, Number(row.count));
  }

  const makeSeries = (eventType: string): DashboardSeriesPoint[] =>
    seriesDays.map((day) => ({
      day,
      value: index.get(eventType)?.get(day) ?? 0
    }));

  const atsChecksSeries = makeSeries("resume_scored");
  const scorePageViewsSeries = makeSeries("score_page_viewed");
  const applyxRedirectSeries = makeSeries("applyx_redirect_clicked");
  const coverLetterSeries = makeSeries("cover_letter_generated");
  const emailCaptureSeries = makeSeries("email_captured");
  const atsChecksToday = atsChecksSeries.at(-1)?.value ?? 0;
  const scorePageViewsToday = scorePageViewsSeries.at(-1)?.value ?? 0;
  const applyxRedirectsToday = applyxRedirectSeries.at(-1)?.value ?? 0;
  const coverLettersToday = coverLetterSeries.at(-1)?.value ?? 0;
  const emailCapturesToday = emailCaptureSeries.at(-1)?.value ?? 0;

  return {
    atsChecksToday,
    scorePageViewsToday,
    applyxRedirectsToday,
    coverLettersToday,
    emailCapturesToday,
    conversionRate: roundConversionRate(applyxRedirectsToday, atsChecksToday),
    totalIndexablePages,
    atsChecksSeries,
    scorePageViewsSeries,
    applyxRedirectSeries,
    coverLetterSeries,
    emailCaptureSeries
  };
}

export async function saveEmailCapture(
  email: string,
  context: string
): Promise<void> {
  const record: EmailCaptureRecord = {
    id: crypto.randomUUID(),
    email,
    context,
    createdAt: new Date().toISOString()
  };

  if (!isDatabaseConfigured()) {
    const store = getMemoryStore();
    // Deduplicate by email in memory store
    if (!store.emailCaptures.some((e) => e.email === email)) {
      store.emailCaptures.unshift(record);
    }
    return;
  }

  const pool = getPool();

  if (!pool) {
    return;
  }

  await pool.query(
    `
      insert into email_captures (id, email, context, created_at)
      values ($1, $2, $3, now())
      on conflict (email) do update set context = excluded.context, created_at = now()
    `,
    [record.id, record.email, record.context]
  );
}

function mapAtsResultRow(row: AtsResultRow): AtsResultRecord {
  return {
    id: row.id,
    slug: row.slug,
    score: row.score,
    missingKeywords: row.missing_keywords,
    recommendations: row.recommendations,
    createdAt: row.created_at.toISOString()
  };
}

