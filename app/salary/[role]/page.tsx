import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { EmailCapture } from "@/components/email-capture";
import { getAllSeoRoleSlugs } from "@/lib/seo/roles";
import { getSalaryData } from "@/lib/seo/salary-data";
import { buildBreadcrumbList } from "@/lib/seo/structured-data";
import { env } from "@/lib/env";

type SalaryPageProps = {
  params: { role: string };
};

export const revalidate = 86400;

export function generateStaticParams() {
  return getAllSeoRoleSlugs().map((role) => ({ role }));
}

export function generateMetadata({ params }: SalaryPageProps): Metadata {
  const data = getSalaryData(params.role, getAllSeoRoleSlugs());

  if (!data) {
    return { title: "Salary data not found" };
  }

  return {
    title: `${data.title} Salary (2026) — Ranges by Experience Level`,
    description: data.description,
    alternates: { canonical: `${env.appUrl}/salary/${data.slug}` }
  };
}

function formatSalary(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export default function SalaryPage({ params }: SalaryPageProps) {
  const allSlugs = getAllSeoRoleSlugs();
  const data = getSalaryData(params.role, allSlugs);

  if (!data) {
    notFound();
  }

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Home", url: env.appUrl },
    { name: "Salary Data", url: `${env.appUrl}/salary/software-engineer` },
    { name: `${data.title} Salary`, url: `${env.appUrl}/salary/${data.slug}` }
  ]);

  const maxSalary = Math.max(...data.bands.map((b) => b.high));

  return (
    <div className="page-shell py-16 sm:py-20">
      <JsonLd data={breadcrumbLd} />

      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-200">Salary data</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {data.title} salary in 2026
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
          {data.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/applyx?source=salary-hero"
            className="rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            Tailor your resume with ApplyX
          </Link>
          <Link
            href={`/resume/${data.slug}`}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
          >
            {data.title} resume guide
          </Link>
        </div>
      </section>

      {/* Salary bands */}
      <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-2xl font-semibold text-white">Salary bands ({data.currency})</h2>
        <p className="mt-2 text-sm text-slate-400">
          Based on US market data. Actual compensation varies by location, company size, and total comp structure.
        </p>
        <div className="mt-6 space-y-6">
          {data.bands.map((band) => (
            <div key={band.level}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-medium text-slate-200">{band.level}</h3>
                <span className="text-sm text-slate-400">
                  {formatSalary(band.low)} – {formatSalary(band.high)}
                </span>
              </div>
              <div className="relative mt-2 h-5 w-full rounded-full bg-white/5">
                <div
                  className="absolute inset-y-0 rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                  style={{
                    left: `${(band.low / maxSalary) * 100}%`,
                    width: `${((band.high - band.low) / maxSalary) * 100}%`
                  }}
                />
                <div
                  className="absolute inset-y-0 w-0.5 bg-white/80"
                  style={{ left: `${(band.mid / maxSalary) * 100}%` }}
                  title={`Median: ${formatSalary(band.mid)}`}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Median: {formatSalary(band.mid)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What drives higher pay */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">What drives higher pay</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {data.topPayingFactors.map((factor, i) => (
              <li key={i} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                {factor}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">Negotiation tips</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {data.negotiationTips.map((tip, i) => (
              <li key={i} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-2xl border border-brand-400/15 bg-brand-950/30 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">
          Earning top-band requires a top-tier resume.
        </h2>
        <p className="mt-3 text-slate-300">
          ApplyX tailors your resume to any job description using AI — maximizing your ATS score and interview rate.
        </p>
        <div className="mt-6">
          <Link
            href="/applyx?source=salary-cta"
            className="inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            Get ApplyX free &rarr;
          </Link>
        </div>
      </section>

      {/* Email capture */}
      <section className="mt-8">
        <EmailCapture context={`salary-${data.slug}`} />
      </section>

      {/* Related roles */}
      {data.relatedRoles.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-white">Compare salaries</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.relatedRoles.map((related) => {
              const relatedData = getSalaryData(related, allSlugs);
              if (!relatedData) return null;

              return (
                <Link
                  key={related}
                  href={`/salary/${related}`}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:border-brand-400/30 hover:bg-brand-500/5"
                >
                  {relatedData.title} salary
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Cross-links */}
      <section className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href={`/resume/${data.slug}`} className="text-brand-400 transition hover:text-white">
          {data.title} resume guide &rarr;
        </Link>
        <Link href={`/interview/${data.slug}`} className="text-brand-400 transition hover:text-white">
          {data.title} interview questions &rarr;
        </Link>
        <Link href={`/keywords/${data.slug}`} className="text-brand-400 transition hover:text-white">
          {data.title} ATS keywords &rarr;
        </Link>
      </section>
    </div>
  );
}
