import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { EmailCapture } from "@/components/email-capture";
import { getAllComparisonSlugs, getComparison } from "@/lib/seo/comparisons";
import { buildBreadcrumbList } from "@/lib/seo/structured-data";
import { env } from "@/lib/env";

type ComparePageProps = {
  params: { slug: string };
};

export const revalidate = 86400;

export function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: ComparePageProps): Metadata {
  const data = getComparison(params.slug);

  if (!data) {
    return { title: "Comparison not found" };
  }

  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: `${env.appUrl}/compare/${data.slug}` }
  };
}

export default function ComparePage({ params }: ComparePageProps) {
  const data = getComparison(params.slug);

  if (!data) {
    notFound();
  }

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Home", url: env.appUrl },
    { name: "Comparisons", url: `${env.appUrl}/compare/${data.slug}` },
    { name: data.title, url: `${env.appUrl}/compare/${data.slug}` }
  ]);

  const otherComparisons = getAllComparisonSlugs()
    .filter((s) => s !== data.slug)
    .map((s) => getComparison(s))
    .filter(Boolean);

  return (
    <div className="page-shell py-16 sm:py-20">
      <JsonLd data={breadcrumbLd} />

      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-200">Comparison</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {data.title}
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
          {data.description}
        </p>
      </section>

      {/* Feature comparison table */}
      <section className="mt-12 overflow-x-auto">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold text-white">Feature comparison</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Feature
                  </th>
                  <th className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
                    ApplyX
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {data.competitorName}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.features.map((feature) => (
                  <tr key={feature.feature}>
                    <td className="py-3 pr-4 font-medium text-white">{feature.feature}</td>
                    <td className="py-3 pr-4 text-emerald-200">{feature.applyx}</td>
                    <td className="py-3 text-slate-400">{feature.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* About the competitor */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold text-white">About {data.competitorName}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{data.competitorDescription}</p>
      </section>

      {/* Verdict */}
      <section className="mt-8 rounded-2xl border border-brand-400/20 bg-brand-950/40 p-6">
        <h2 className="text-xl font-semibold text-white">The verdict</h2>
        <p className="mt-3 text-sm leading-7 text-slate-200">{data.verdict}</p>
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-2xl border border-brand-400/15 bg-brand-950/30 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">
          Ready to see the difference?
        </h2>
        <p className="mt-3 text-slate-300">
          Try <strong className="text-white">ApplyX</strong> — AI-powered resume tailoring. Free tier: 3 tailors/month.
        </p>
        <div className="mt-6">
          <Link
            href={`/applyx?source=compare-${data.slug}`}
            className="inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            Get ApplyX free &rarr;
          </Link>
        </div>
      </section>

      {/* Email capture */}
      <section className="mt-8">
        <EmailCapture context={`compare-${data.slug}`} />
      </section>

      {/* Other comparisons */}
      {otherComparisons.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-white">More comparisons</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {otherComparisons.map((comp) =>
              comp ? (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-brand-400/30 hover:bg-brand-500/5"
                >
                  <span className="text-sm font-medium text-white">{comp.title}</span>
                </Link>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* Cross-links */}
      <section className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href="/interview/software-engineer" className="text-brand-400 transition hover:text-white">
          Interview questions &rarr;
        </Link>
        <Link href="/salary/software-engineer" className="text-brand-400 transition hover:text-white">
          Salary data &rarr;
        </Link>
        <Link href="/keywords/software-engineer" className="text-brand-400 transition hover:text-white">
          ATS keywords &rarr;
        </Link>
      </section>
    </div>
  );
}
