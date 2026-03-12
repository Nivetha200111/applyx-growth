// ---------------------------------------------------------------------------
// Programmatic salary-range generator keyed by role slug.
// Ranges are deterministic estimates based on category and seniority signals
// in the role slug. Designed for SEO traffic on "[Role] salary 2026" queries.
// ---------------------------------------------------------------------------

import { getSeoRole, type SeoRole } from "@/lib/seo/roles";

export type SalaryBand = {
  level: string;
  low: number;
  mid: number;
  high: number;
};

export type SalaryPageData = {
  slug: string;
  title: string;
  description: string;
  currency: string;
  bands: SalaryBand[];
  topPayingFactors: string[];
  negotiationTips: string[];
  relatedRoles: string[];
};

// ── Salary logic ───────────────────────────────────────────────────────────

type CategoryBase = {
  entry: [number, number, number];
  mid: [number, number, number];
  senior: [number, number, number];
  lead: [number, number, number];
};

const CATEGORY_BASES: Record<string, CategoryBase> = {
  engineering: {
    entry: [65000, 82000, 100000],
    mid: [95000, 120000, 150000],
    senior: [140000, 170000, 210000],
    lead: [180000, 220000, 280000]
  },
  data: {
    entry: [60000, 78000, 95000],
    mid: [90000, 115000, 140000],
    senior: [130000, 160000, 200000],
    lead: [170000, 210000, 260000]
  },
  product: {
    entry: [70000, 88000, 108000],
    mid: [100000, 128000, 158000],
    senior: [145000, 175000, 215000],
    lead: [185000, 225000, 285000]
  },
  design: {
    entry: [55000, 72000, 90000],
    mid: [85000, 108000, 135000],
    senior: [125000, 152000, 185000],
    lead: [160000, 198000, 245000]
  },
  marketing: {
    entry: [50000, 65000, 82000],
    mid: [75000, 95000, 120000],
    senior: [110000, 138000, 170000],
    lead: [145000, 180000, 225000]
  },
  sales: {
    entry: [45000, 60000, 78000],
    mid: [70000, 95000, 125000],
    senior: [110000, 145000, 190000],
    lead: [155000, 200000, 270000]
  },
  operations: {
    entry: [48000, 62000, 78000],
    mid: [72000, 92000, 115000],
    senior: [105000, 132000, 165000],
    lead: [140000, 175000, 220000]
  },
  finance: {
    entry: [55000, 70000, 88000],
    mid: [82000, 105000, 132000],
    senior: [120000, 150000, 185000],
    lead: [160000, 200000, 250000]
  },
  people: {
    entry: [48000, 60000, 75000],
    mid: [68000, 88000, 110000],
    senior: [100000, 128000, 158000],
    lead: [135000, 170000, 215000]
  },
  legal: {
    entry: [60000, 78000, 98000],
    mid: [90000, 118000, 148000],
    senior: [135000, 168000, 210000],
    lead: [175000, 220000, 275000]
  }
};

function inferCategory(slug: string): string {
  if (slug.includes("engineer") || slug.includes("developer") || slug.includes("architect") || slug.includes("devops") || slug.includes("sre")) return "engineering";
  if (slug.includes("data") || slug.includes("analyst") && !slug.includes("marketing") && !slug.includes("product") && !slug.includes("financial")) return "data";
  if (slug.includes("product") || slug.includes("program") || slug.includes("project") || slug.includes("scrum")) return "product";
  if (slug.includes("design") || slug.includes("ux") || slug.includes("ui") || slug.includes("art")) return "design";
  if (slug.includes("market") || slug.includes("seo") || slug.includes("content") || slug.includes("brand") || slug.includes("copy") || slug.includes("video") || slug.includes("social")) return "marketing";
  if (slug.includes("sales") || slug.includes("account") || slug.includes("bdr") || slug.includes("revenue") || slug.includes("partnership")) return "sales";
  if (slug.includes("finance") || slug.includes("accountant") || slug.includes("payroll") || slug.includes("fp-and-a") || slug.includes("tax") || slug.includes("controller") || slug.includes("auditor")) return "finance";
  if (slug.includes("recruit") || slug.includes("talent") || slug.includes("people") || slug.includes("hr") || slug.includes("learning") || slug.includes("compensation")) return "people";
  if (slug.includes("legal") || slug.includes("compliance") || slug.includes("privacy") || slug.includes("contract")) return "legal";
  return "operations";
}

function getBands(slug: string): SalaryBand[] {
  const category = inferCategory(slug);
  const base = CATEGORY_BASES[category] ?? CATEGORY_BASES.operations;

  // Add slight variation based on slug hash to make each role unique
  const hash = slug.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const variance = (hash % 10) * 1000 - 5000;

  const adjust = (band: [number, number, number]): [number, number, number] => [
    Math.round((band[0] + variance) / 1000) * 1000,
    Math.round((band[1] + variance) / 1000) * 1000,
    Math.round((band[2] + variance) / 1000) * 1000
  ];

  const bands: SalaryBand[] = [
    { level: "Entry-level (0-2 years)", ...spread(adjust(base.entry)) },
    { level: "Mid-level (3-5 years)", ...spread(adjust(base.mid)) },
    { level: "Senior (6-9 years)", ...spread(adjust(base.senior)) },
    { level: "Lead / Staff (10+ years)", ...spread(adjust(base.lead)) }
  ];

  return bands;
}

function spread(values: [number, number, number]): { low: number; mid: number; high: number } {
  return { low: values[0], mid: values[1], high: values[2] };
}

function topPayingFactors(role: SeoRole): string[] {
  return [
    `Strong proficiency in ${role.keywords[0] ?? "core skills"} and ${role.keywords[1] ?? "related technologies"} commands a 15-25% premium.`,
    "Companies in the San Francisco Bay Area, New York, and Seattle pay 20-40% above the national median.",
    "Remote roles at well-funded startups or FAANG-tier companies frequently exceed the high-end of listed ranges.",
    `Domain expertise in ${role.keywords[2] ?? "specialized areas"} with demonstrable business impact drives the strongest offers.`,
    "Candidates who can demonstrate proficiency during the interview process (not just list skills) earn stronger offers."
  ];
}

function negotiationTips(role: SeoRole): string[] {
  return [
    `Research comparable ${role.title} salaries on Levels.fyi, Glassdoor, and Blind before entering negotiations.`,
    "Never share your current salary first. Ask for the company's budget range instead.",
    "Quantify your impact in previous roles with metrics — this justifies above-median offers.",
    "Negotiate total compensation, not just base salary. Stock, signing bonuses, and benefits can add 20-50%.",
    "Use competing offers as leverage, but only if genuine. Fabricated offers backfire badly.",
    `Tailor your resume with ApplyX to highlight the ${role.keywords.slice(0, 3).join(", ")} skills that command the highest premiums.`
  ];
}

function findRelatedRoles(slug: string, allSlugs: string[]): string[] {
  const parts = slug.split("-");
  return allSlugs
    .filter((s) => s !== slug && parts.some((part) => part.length > 3 && s.includes(part)))
    .slice(0, 5);
}

// ── Public API ─────────────────────────────────────────────────────────────

export function getSalaryData(
  slug: string,
  allSlugs: string[]
): SalaryPageData | null {
  const role = getSeoRole(slug);

  if (!role) {
    return null;
  }

  return {
    slug: role.slug,
    title: role.title,
    description: `${role.title} salary ranges for 2026 across experience levels. Compare entry-level to senior compensation and learn how to negotiate a stronger offer.`,
    currency: "USD",
    bands: getBands(slug),
    topPayingFactors: topPayingFactors(role),
    negotiationTips: negotiationTips(role),
    relatedRoles: findRelatedRoles(slug, allSlugs)
  };
}

