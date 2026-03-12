import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { EmailCapture } from "@/components/email-capture";
import { getAllSeoRoleSlugs } from "@/lib/seo/roles";
import { getInterviewData } from "@/lib/seo/interview-data";
import { buildFaqPage, buildBreadcrumbList } from "@/lib/seo/structured-data";
import { env } from "@/lib/env";

type InterviewPageProps = {
  params: { role: string };
};

export const revalidate = 86400;

export function generateStaticParams() {
  return getAllSeoRoleSlugs().map((role) => ({ role }));
}

export function generateMetadata({ params }: InterviewPageProps): Metadata {
  const data = getInterviewData(params.role, getAllSeoRoleSlugs());

  if (!data) {
    return { title: "Interview guide not found" };
  }

  return {
    title: `${data.title} Interview Questions (2026)`,
    description: data.description,
    alternates: { canonical: `${env.appUrl}/interview/${data.slug}` }
  };
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  behavioral: { label: "Behavioral", color: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100" },
  technical: { label: "Technical", color: "border-brand-400/25 bg-brand-500/10 text-brand-100" },
  situational: { label: "Situational", color: "border-amber-400/25 bg-amber-400/10 text-amber-100" }
};

export default function InterviewPage({ params }: InterviewPageProps) {
  const allSlugs = getAllSeoRoleSlugs();
  const data = getInterviewData(params.role, allSlugs);

  if (!data) {
    notFound();
  }

  const faqLd = buildFaqPage(
    data.questions.slice(0, 10).map((q) => ({
      question: q.question,
      answer: q.tip
    }))
  );

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Home", url: env.appUrl },
    { name: "Interview Prep", url: `${env.appUrl}/interview/software-engineer` },
    { name: `${data.title} Interview`, url: `${env.appUrl}/interview/${data.slug}` }
  ]);

  return (
    <div className="page-shell py-16 sm:py-20">
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-200">Interview prep</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {data.title} interview questions
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
          {data.description} Use these to prepare, then let ApplyX tailor your resume
          to match the job description automatically.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/applyx?source=interview-hero"
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

      <section className="mt-12 space-y-5">
        {data.questions.map((q, index) => {
          const cat = CATEGORY_LABELS[q.category] ?? CATEGORY_LABELS.behavioral;

          return (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-slate-500">Q{index + 1}</span>
                <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${cat.color}`}>
                  {cat.label}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-white">{q.question}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                <span className="font-medium text-brand-200">Tip:</span> {q.tip}
              </p>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-2xl border border-brand-400/15 bg-brand-950/30 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">
          Ready to apply? Make sure your resume matches.
        </h2>
        <p className="mt-3 text-slate-300">
          ApplyX reads the job description and tailors your resume automatically — maximizing your ATS score.
        </p>
        <div className="mt-6">
          <Link
            href="/applyx?source=interview-cta"
            className="inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            Get ApplyX free &rarr;
          </Link>
        </div>
      </section>

      {/* Email capture */}
      <section className="mt-8">
        <EmailCapture context={`interview-${data.slug}`} />
      </section>

      {/* Related roles */}
      {data.relatedRoles.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-white">Related interview guides</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.relatedRoles.map((related) => {
              const relatedData = getInterviewData(related, allSlugs);
              if (!relatedData) return null;

              return (
                <Link
                  key={related}
                  href={`/interview/${related}`}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:border-brand-400/30 hover:bg-brand-500/5"
                >
                  {relatedData.title} interview questions
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
        <Link href={`/salary/${data.slug}`} className="text-brand-400 transition hover:text-white">
          {data.title} salary data &rarr;
        </Link>
        <Link href={`/keywords/${data.slug}`} className="text-brand-400 transition hover:text-white">
          {data.title} ATS keywords &rarr;
        </Link>
      </section>
    </div>
  );
}
