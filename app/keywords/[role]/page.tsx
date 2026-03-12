import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { EmailCapture } from "@/components/email-capture";
import { getAllSeoRoleSlugs, getSeoRole } from "@/lib/seo/roles";
import { buildFaqPage, buildBreadcrumbList, buildHowTo } from "@/lib/seo/structured-data";
import { env } from "@/lib/env";

type KeywordsPageProps = {
  params: { role: string };
};

export const revalidate = 86400;

export function generateStaticParams() {
  return getAllSeoRoleSlugs().map((role) => ({ role }));
}

export function generateMetadata({ params }: KeywordsPageProps): Metadata {
  const role = getSeoRole(params.role);

  if (!role) {
    return { title: "Keywords page not found" };
  }

  return {
    title: `${role.title} Resume Keywords for ATS (2026)`,
    description: `The top ${role.keywords.length} ATS keywords every ${role.title} resume needs in 2026. Copy them, check your score, and tailor your resume.`,
    alternates: { canonical: `${env.appUrl}/keywords/${role.slug}` }
  };
}

function keywordPriority(index: number, total: number): string {
  const ratio = index / total;
  if (ratio < 0.3) return "Critical";
  if (ratio < 0.6) return "Important";
  return "Useful";
}

function priorityColor(priority: string): string {
  if (priority === "Critical") return "border-rose-400/25 bg-rose-400/10 text-rose-100";
  if (priority === "Important") return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  return "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";
}

export default function KeywordsPage({ params }: KeywordsPageProps) {
  const allSlugs = getAllSeoRoleSlugs();
  const role = getSeoRole(params.role);

  if (!role) {
    notFound();
  }

  const faqLd = buildFaqPage([
    {
      question: `What are the most important ATS keywords for a ${role.title} resume?`,
      answer: `The top ATS keywords for a ${role.title} resume include: ${role.keywords.slice(0, 6).join(", ")}. Include them in your summary, skills, and experience sections.`
    },
    {
      question: `How many keywords should I include in my ${role.title} resume?`,
      answer: `Aim to naturally include 10-15 relevant keywords. Focus on the ones that appear most frequently in target job descriptions.`
    },
    {
      question: "How do I know if my resume has enough keywords?",
      answer: "Use a free ATS checker to score your resume against a specific job description. A score above 70% indicates strong keyword alignment."
    }
  ]);

  const howToLd = buildHowTo(
    `How to optimize your ${role.title} resume with ATS keywords`,
    `Step-by-step guide to adding the right keywords to your ${role.title} resume.`,
    [
      { name: "Identify target keywords", text: `Review the keywords listed on this page and compare them against the job descriptions you are targeting.` },
      { name: "Audit your current resume", text: "Use the free ATS checker to score your resume and identify which keywords are missing." },
      { name: "Add keywords naturally", text: "Weave missing keywords into your summary, skills section, and experience bullets without keyword stuffing." },
      { name: "Re-check your score", text: "Run the ATS checker again to verify improvement. Aim for 70%+ keyword match." },
      { name: "Tailor per application", text: "Use a resume tailoring tool to automatically adapt your resume for each unique job description." }
    ]
  );

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Home", url: env.appUrl },
    { name: "ATS Keywords", url: `${env.appUrl}/keywords/software-engineer` },
    { name: `${role.title} Keywords`, url: `${env.appUrl}/keywords/${role.slug}` }
  ]);

  const relatedRoles = allSlugs
    .filter((s) => s !== role.slug && role.slug.split("-").some((part) => part.length > 3 && s.includes(part)))
    .slice(0, 6);

  return (
    <div className="page-shell py-16 sm:py-20">
      <JsonLd data={faqLd} />
      <JsonLd data={howToLd} />
      <JsonLd data={breadcrumbLd} />

      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-200">ATS keywords</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {role.title} resume keywords
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
          These are the top {role.keywords.length} ATS-relevant keywords every {role.title} resume
          should include in 2026. Copy them into your resume, then let ApplyX tailor it to any job description.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/applyx?source=keywords-hero"
            className="rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            Tailor your resume with ApplyX
          </Link>
          <Link
            href={`/resume/${role.slug}`}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
          >
            Full resume guide
          </Link>
        </div>
      </section>

      {/* Keyword grid */}
      <section className="mt-12 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-semibold text-white">Keywords by priority</h2>
        <p className="mt-2 text-sm text-slate-400">
          Priority is based on frequency in real {role.title} job descriptions. Use critical
          keywords in your summary and top experience bullets.
        </p>
        <div className="mt-6 space-y-4">
          {role.keywords.map((keyword, index) => {
            const priority = keywordPriority(index, role.keywords.length);
            const color = priorityColor(priority);

            return (
              <div
                key={keyword}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 w-5 text-right">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-white">{keyword}</span>
                </div>
                <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${color}`}>
                  {priority}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* How to use */}
      <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-semibold text-white">How to use these keywords</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <span className="font-semibold text-brand-200">Summary section:</span> Include 3-4
            critical keywords naturally. Example: &ldquo;Experienced {role.title} with expertise in{" "}
            {role.keywords.slice(0, 3).join(", ")}.&rdquo;
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <span className="font-semibold text-brand-200">Skills block:</span> List all relevant
            keywords in a comma-separated skills section. ATS systems scan this first.
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <span className="font-semibold text-brand-200">Experience bullets:</span> Pair keywords
            with measurable impact. &ldquo;Implemented {role.keywords[0] ?? "key technology"}{" "}
            resulting in 25% improvement in delivery time.&rdquo;
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <span className="font-semibold text-brand-200">Projects section:</span> Name the tools
            and technologies you used. Every keyword in context adds ATS weight.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-2xl border border-brand-400/15 bg-brand-950/30 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Next step</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Stop guessing which keywords to use.
        </h2>
        <p className="mt-3 text-slate-300">
          Check your score for free, or let <strong className="text-white">ApplyX</strong> rewrite your resume bullets with the right keywords automatically.
        </p>
        <div className="mt-6">
          <Link
            href="/applyx?source=keywords-cta"
            className="inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            Get ApplyX free &rarr;
          </Link>
        </div>
      </section>

      {/* Email capture */}
      <section className="mt-8">
        <EmailCapture context={`keywords-${role.slug}`} />
      </section>

      {/* Related roles */}
      {relatedRoles.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-white">Keywords for related roles</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedRoles.map((slug) => {
              const related = getSeoRole(slug);
              if (!related) return null;

              return (
                <Link
                  key={slug}
                  href={`/keywords/${slug}`}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-brand-400/40 hover:bg-brand-500/10"
                >
                  {related.title} keywords
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Cross-link mesh */}
      <section className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href={`/resume/${role.slug}`} className="text-brand-300 transition hover:text-white">
          {role.title} resume guide &rarr;
        </Link>
        <Link href={`/interview/${role.slug}`} className="text-brand-300 transition hover:text-white">
          {role.title} interview questions &rarr;
        </Link>
        <Link href={`/salary/${role.slug}`} className="text-brand-300 transition hover:text-white">
          {role.title} salary data &rarr;
        </Link>
        <Link href="/applyx?source=keywords-crosslink" className="text-brand-400 transition hover:text-white">
          Get ApplyX &rarr;
        </Link>
      </section>
    </div>
  );
}

