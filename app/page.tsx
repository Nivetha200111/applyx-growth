import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { EmailCapture } from "@/components/email-capture";
import { buildWebSite, buildSoftwareApplication } from "@/lib/seo/structured-data";
import { SEO_ROLE_COUNT } from "@/lib/seo/roles";
import { getAllBlogArticles } from "@/lib/blog/articles";

const POPULAR_ROLES = [
  "software-engineer",
  "data-scientist",
  "product-manager",
  "frontend-developer",
  "data-analyst",
  "ux-designer",
  "devops-engineer",
  "marketing-manager",
  "project-manager",
  "account-executive",
  "machine-learning-engineer",
  "full-stack-developer",
  "backend-engineer",
  "qa-engineer",
  "sales-development-representative",
  "customer-success-manager"
];

function titleize(slug: string): string {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export default function HomePage() {
  const articles = getAllBlogArticles();

  const websiteLd = buildWebSite();
  const appLd = buildSoftwareApplication();

  return (
    <div className="page-shell py-16 sm:py-20">
      <JsonLd data={websiteLd} />
      <JsonLd data={appLd} />

      {/* Hero */}
      <section className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Land your next job.<br />
          <span className="text-brand-400">We&apos;ll help you prepare.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Interview questions, salary data, ATS resume keywords, and resume guides
          for {SEO_ROLE_COUNT}+ roles. Research your target role, then let ApplyX
          tailor your resume automatically.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/applyx?source=homepage-hero"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            Get ApplyX — AI Resume Tailor
          </Link>
          <Link
            href="#roles"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
          >
            Explore roles
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mt-12 flex flex-wrap gap-8 border-y border-white/10 py-6">
        <div>
          <p className="text-2xl font-semibold text-brand-400">{SEO_ROLE_COUNT}+</p>
          <p className="text-sm text-slate-400">Roles covered</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-brand-400">4</p>
          <p className="text-sm text-slate-400">Resource types per role</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-brand-400">500+</p>
          <p className="text-sm text-slate-400">Pages of free content</p>
        </div>
      </section>

      {/* Resource types */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-white">What you&apos;ll find here</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/interview/software-engineer"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-brand-400/30 hover:bg-brand-500/5"
          >
            <span className="text-2xl">🎯</span>
            <h3 className="mt-3 text-base font-semibold text-white group-hover:text-brand-300 transition">
              Interview Questions
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Behavioral, technical &amp; situational Q&amp;A for {SEO_ROLE_COUNT}+ roles.
            </p>
          </Link>
          <Link
            href="/salary/software-engineer"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-brand-400/30 hover:bg-brand-500/5"
          >
            <span className="text-2xl">💰</span>
            <h3 className="mt-3 text-base font-semibold text-white group-hover:text-brand-300 transition">
              Salary Data
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Salary bands by experience level with negotiation tips.
            </p>
          </Link>
          <Link
            href="/keywords/software-engineer"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-brand-400/30 hover:bg-brand-500/5"
          >
            <span className="text-2xl">🔑</span>
            <h3 className="mt-3 text-base font-semibold text-white group-hover:text-brand-300 transition">
              ATS Keywords
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              The exact resume keywords ranked by priority for every role.
            </p>
          </Link>
          <Link
            href="/resume/software-engineer"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-brand-400/30 hover:bg-brand-500/5"
          >
            <span className="text-2xl">📄</span>
            <h3 className="mt-3 text-base font-semibold text-white group-hover:text-brand-300 transition">
              Resume Guides
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Role-specific resume structures, bullet examples, and best practices.
            </p>
          </Link>
        </div>
      </section>

      {/* Popular roles */}
      <section id="roles" className="mt-16">
        <h2 className="text-2xl font-semibold text-white">Explore by role</h2>
        <p className="mt-2 text-sm text-slate-400">
          Pick a role to see interview questions, salary data, keywords, and resume guide.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_ROLES.map((slug) => (
            <div key={slug} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-semibold text-white">{titleize(slug)}</h3>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <Link href={`/interview/${slug}`} className="text-brand-400 hover:text-white transition">Interview</Link>
                <Link href={`/salary/${slug}`} className="text-brand-400 hover:text-white transition">Salary</Link>
                <Link href={`/keywords/${slug}`} className="text-brand-400 hover:text-white transition">Keywords</Link>
                <Link href={`/resume/${slug}`} className="text-brand-400 hover:text-white transition">Resume</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog articles */}
      {articles.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-white">Job search guides</h2>
          <p className="mt-2 text-sm text-slate-400">
            In-depth articles on ATS optimization, resume writing, and job search strategy.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {articles.slice(0, 4).map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-brand-400/30 hover:bg-brand-500/5"
              >
                <span className="text-sm font-medium text-white">{article.title}</span>
                <p className="mt-1 text-xs text-slate-400">{article.readingTime} · {article.category}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ApplyX CTA */}
      <section className="mt-16 rounded-2xl border border-brand-400/15 bg-brand-950/30 p-8 sm:p-12 text-center">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Done researching? Let ApplyX tailor your resume.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
          ApplyX reads any job description and rewrites your resume using AI — maximizing
          your ATS score for every application. Upload once, tailor for every role. Free tier: 3 tailors/month.
        </p>
        <div className="mt-8">
          <Link
            href="/applyx?source=homepage-cta"
            className="inline-block rounded-full bg-brand-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-brand-500"
          >
            Get ApplyX free &rarr;
          </Link>
        </div>
      </section>

      {/* Email capture */}
      <section className="mt-10">
        <EmailCapture context="homepage" />
      </section>
    </div>
  );
}
