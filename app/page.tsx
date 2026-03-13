import Link from "next/link";

import { EmailCapture } from "@/components/email-capture";
import { JsonLd } from "@/components/json-ld";
import { getAllBlogArticles } from "@/lib/blog/articles";
import { SEO_ROLE_COUNT } from "@/lib/seo/roles";
import { buildSoftwareApplication, buildWebSite } from "@/lib/seo/structured-data";

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

const STEPS = [
  {
    label: "Step 1",
    title: "Pick your target role",
    description:
      "Browse interview questions, salary ranges, ATS keywords, and resume guides for your specific role."
  },
  {
    label: "Step 2",
    title: "Learn what gets you through",
    description:
      "Understand the exact keywords, question patterns, and salary benchmarks recruiters expect."
  },
  {
    label: "Step 3",
    title: "Tailor your resume with ApplyX",
    description:
      "Paste any job description and get a resume tailored to match — in seconds, not hours."
  }
];

function titleize(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
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

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="animate-in-up">
          <div className="flex flex-wrap gap-2">
            <span className="retro-chip">FREE FOR EVERYONE</span>
            <span className="retro-chip">130+ ROLES</span>
            <span className="retro-chip">AI-POWERED</span>
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase tracking-[-0.04em] text-white sm:text-7xl">
            Everything you need to
            <span className="block bg-gradient-to-r from-brand-300 via-brand-400 to-brand-200 bg-clip-text text-transparent">
              land your next role
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Interview questions, salary data, ATS keywords, and resume guides for {SEO_ROLE_COUNT}+
            roles — all free. Research your target role, then let ApplyX tailor your resume
            automatically.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#roles" className="retro-button">
              Explore roles
            </Link>
            <Link href="/applyx?source=homepage-hero" className="retro-button retro-button--ghost">
              Try ApplyX free
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="retro-panel p-4">
              <p className="retro-kicker">Roles</p>
              <p className="mt-2 text-3xl font-black text-brand-400">{SEO_ROLE_COUNT}+</p>
              <p className="mt-2 text-sm text-slate-300">With dedicated guides and data.</p>
            </div>
            <div className="retro-panel p-4">
              <p className="retro-kicker">Pages</p>
              <p className="mt-2 text-3xl font-black text-brand-300">500+</p>
              <p className="mt-2 text-sm text-slate-300">Of free career research content.</p>
            </div>
            <div className="retro-panel p-4">
              <p className="retro-kicker">Resume tailor</p>
              <p className="mt-2 text-3xl font-black text-brand-200">10s</p>
              <p className="mt-2 text-sm text-slate-300">To tailor your resume to any JD.</p>
            </div>
          </div>
        </div>

        {/* ── How it works panel ──────────────────────────── */}
        <div className="animate-in-up delay-1">
          <div className="retro-monitor">
            <div className="retro-monitor__topbar">
              <span />
              <span />
              <span />
            </div>

            <div className="space-y-5">
              <div>
                <p className="retro-kicker">How it works</p>
                <h2 className="mt-2 text-2xl font-black uppercase text-white">Three steps</h2>
              </div>

              <div className="space-y-4">
                {STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    className="group rounded-[1.4rem] border border-brand-400/15 bg-slate-950/60 p-4 transition duration-300 hover:-translate-y-1 hover:border-brand-400/25 hover:shadow-[0_0_24px_rgba(5,150,105,0.12)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.32em] text-brand-300">
                          {step.label}
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-white">{step.title}</h3>
                      </div>
                      <span className="text-3xl font-black text-brand-400/40">0{index + 1}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Resource types ───────────────────────────────── */}
      <section className="mt-12">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="retro-panel p-6">
            <p className="retro-kicker">Resources</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-white">What you&apos;ll find here</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link href="/interview/software-engineer" className="quest-tile">
                <span className="quest-tile__emoji">🎯</span>
                <h3 className="quest-tile__title">Interview questions</h3>
                <p className="quest-tile__copy">
                  Behavioral, technical, and situational questions for {SEO_ROLE_COUNT}+ roles with tips on how to answer.
                </p>
              </Link>
              <Link href="/salary/software-engineer" className="quest-tile">
                <span className="quest-tile__emoji">💰</span>
                <h3 className="quest-tile__title">Salary data</h3>
                <p className="quest-tile__copy">
                  Compensation ranges by experience level and negotiation strategies.
                </p>
              </Link>
              <Link href="/keywords/software-engineer" className="quest-tile">
                <span className="quest-tile__emoji">🔑</span>
                <h3 className="quest-tile__title">ATS keywords</h3>
                <p className="quest-tile__copy">
                  The exact keywords your resume needs to pass automated screening filters.
                </p>
              </Link>
              <Link href="/resume/software-engineer" className="quest-tile">
                <span className="quest-tile__emoji">📄</span>
                <h3 className="quest-tile__title">Resume guides</h3>
                <p className="quest-tile__copy">
                  Role-specific structure, bullet examples, and formatting best practices.
                </p>
              </Link>
            </div>
          </div>

          <div className="retro-panel p-6">
            <p className="retro-kicker">Why ApplyX</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-white">Research, then apply smarter</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Most job seekers send the same resume everywhere and wonder why they hear nothing back.
              ApplyX gives you the research to understand what each role needs, then tailors your
              resume to match — automatically.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <div className="rounded-2xl border border-brand-400/15 bg-brand-950/20 px-4 py-3">
                Free guides for every step of the job search.
              </div>
              <div className="rounded-2xl border border-brand-400/15 bg-brand-950/20 px-4 py-3">
                AI resume tailoring that matches your resume to any JD.
              </div>
              <div className="rounded-2xl border border-brand-400/15 bg-brand-950/20 px-4 py-3">
                3 free tailors per month — no credit card required.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roles ────────────────────────────────────────── */}
      <section id="roles" className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="retro-kicker">Browse by role</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-white">Pick your role</h2>
          </div>
          <p className="max-w-xl text-sm text-slate-300">
            Each role page gives you interview questions, salary data, ATS keywords, and a resume guide.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_ROLES.map((slug, index) => (
            <div key={slug} className={`role-card role-card--${(index % 4) + 1}`}>
              <h3 className="text-lg font-bold text-white">{titleize(slug)}</h3>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
                <Link href={`/interview/${slug}`} className="retro-mini-link">Interview</Link>
                <Link href={`/salary/${slug}`} className="retro-mini-link">Salary</Link>
                <Link href={`/keywords/${slug}`} className="retro-mini-link">Keywords</Link>
                <Link href={`/resume/${slug}`} className="retro-mini-link">Resume</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Blog articles ────────────────────────────────── */}
      {articles.length > 0 && (
        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="retro-kicker">Job search guides</p>
              <h2 className="mt-2 text-3xl font-black uppercase text-white">In-depth articles</h2>
            </div>
            <Link href={`/blog/${articles[0]?.slug ?? ""}`} className="retro-button retro-button--ghost">
              Read a guide
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {articles.slice(0, 4).map((article, index) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className={`article-card article-card--${(index % 4) + 1}`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-brand-300">
                  {article.category} / {article.readingTime}
                </p>
                <span className="mt-4 block text-xl font-bold text-white">{article.title}</span>
                <p className="mt-3 text-sm leading-6 text-slate-300">{article.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="mt-16">
        <div className="retro-panel p-8 text-center sm:p-12">
          <p className="retro-kicker">Ready to apply?</p>
          <h2 className="mt-3 text-4xl font-black uppercase text-white sm:text-5xl">
            Let ApplyX tailor your resume
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
            ApplyX reads any job description and rewrites your resume to match — maximizing your
            ATS score for every application. Upload once, tailor for every role. Free tier: 3
            tailors/month.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/applyx?source=homepage-cta" className="retro-button">
              Try ApplyX free
            </Link>
            <Link href="/compare/applyx-vs-jobscan" className="retro-button retro-button--ghost">
              Compare with Jobscan
            </Link>
          </div>
        </div>
      </section>

      {/* ── Email capture ────────────────────────────────── */}
      <section className="mt-10">
        <EmailCapture context="homepage" />
      </section>
    </div>
  );
}
