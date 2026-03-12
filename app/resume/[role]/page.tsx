import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { EmailCapture } from "@/components/email-capture";
import { getAllRoleSlugs, getRoleContent } from "@/lib/ats/roles";
import { buildBreadcrumbList } from "@/lib/seo/structured-data";
import { env } from "@/lib/env";

type ResumeRolePageProps = {
  params: {
    role: string;
  };
};

export const revalidate = 86400;

export function generateStaticParams() {
  return getAllRoleSlugs().map((role) => ({ role }));
}

export function generateMetadata({ params }: ResumeRolePageProps): Metadata {
  const role = getRoleContent(params.role);

  if (!role) {
    return {
      title: "Resume guide not found"
    };
  }

  return {
    title: `${role.title} Resume Guide (2026) — Template, Keywords & Tips`,
    description: role.summary,
    alternates: { canonical: `${env.appUrl}/resume/${role.slug}` }
  };
}

export default function ResumeRolePage({ params }: ResumeRolePageProps) {
  const role = getRoleContent(params.role);

  if (!role) {
    notFound();
  }

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Home", url: env.appUrl },
    { name: "Resume Guides", url: `${env.appUrl}/resume/software-engineer` },
    { name: `${role.title} Resume`, url: `${env.appUrl}/resume/${role.slug}` }
  ]);

  return (
    <div className="page-shell py-16 sm:py-20">
      <JsonLd data={breadcrumbLd} />

      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-200">Resume guide</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {role.title} resume template
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">{role.summary}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/applyx?source=resume-hero"
            className="rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            Tailor your resume with ApplyX
          </Link>
          <Link
            href={`/keywords/${role.slug}`}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
          >
            {role.title} ATS keywords
          </Link>
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold text-white">Example resume structure</h2>
          <div className="mt-6 space-y-5">
            {role.sections.map((section) => (
              <div key={section.heading} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white">{section.heading}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold text-white">Common ATS keywords</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {role.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-brand-400/25 bg-brand-500/10 px-3 py-1 text-sm text-brand-100"
              >
                {keyword}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Use these terms only when they accurately reflect your work. ATS optimization works
            best when the wording is both relevant and truthful.
          </p>
          <Link
            href={`/keywords/${role.slug}`}
            className="mt-3 inline-block text-sm text-brand-400 transition hover:text-white"
          >
            See full keyword list with priorities &rarr;
          </Link>
        </aside>
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-2xl border border-brand-400/15 bg-brand-950/30 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">
          Don&apos;t just read about it — tailor your actual resume.
        </h2>
        <p className="mt-3 text-slate-300">
          ApplyX reads the job description and rewrites your resume automatically — maximizing your ATS score.
        </p>
        <div className="mt-6">
          <Link
            href="/applyx?source=resume-cta"
            className="inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            Get ApplyX free &rarr;
          </Link>
        </div>
      </section>

      {/* Email capture */}
      <section className="mt-8">
        <EmailCapture context={`resume-${role.slug}`} />
      </section>

      {/* Cross-links */}
      <section className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href={`/interview/${role.slug}`} className="text-brand-400 transition hover:text-white">
          {role.title} interview questions &rarr;
        </Link>
        <Link href={`/salary/${role.slug}`} className="text-brand-400 transition hover:text-white">
          {role.title} salary data &rarr;
        </Link>
        <Link href={`/keywords/${role.slug}`} className="text-brand-400 transition hover:text-white">
          {role.title} ATS keywords &rarr;
        </Link>
      </section>
    </div>
  );
}
