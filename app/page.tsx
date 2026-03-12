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

const STORY_STEPS = [
  {
    label: "Level 01",
    title: "Find your class",
    description:
      "Pick a role and unlock interview questions, salary maps, ATS keywords, and resume tactics."
  },
  {
    label: "Level 02",
    title: "Beat the ATS dungeon",
    description:
      "Use the exact language recruiters and screeners are searching for before your resume gets filtered out."
  },
  {
    label: "Level 03",
    title: "Equip ApplyX",
    description:
      "Take everything you learned and turn it into a tailored resume for the exact job description."
  }
];

const VIBE_SIGNALS = [
  "NO CORPORATE BEIGE",
  "MORE STORY, LESS BROCHURE",
  "JOB HUNT = QUEST MODE",
  "FREE GUIDES + BIG ENERGY"
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

      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="animate-in-up">
          <div className="flex flex-wrap gap-2">
            {VIBE_SIGNALS.map((signal) => (
              <span key={signal} className="retro-chip">
                {signal}
              </span>
            ))}
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase tracking-[-0.04em] text-white sm:text-7xl">
            The internet arcade for
            <span className="block bg-gradient-to-r from-slate-100 via-stone-200 to-slate-300 bg-clip-text text-transparent">
              surviving the job hunt
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Grow is where the ApplyX story starts: a retro guidebook packed with interview
            cheat codes, salary maps, ATS secrets, and resume upgrades for {SEO_ROLE_COUNT}+
            roles.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#quest-map" className="retro-button">
              Start the quest
            </Link>
            <Link href="/applyx?source=homepage-hero" className="retro-button retro-button--ghost">
              Jump to ApplyX
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="retro-panel p-4">
              <p className="retro-kicker">Roles</p>
              <p className="mt-2 text-3xl font-black text-slate-100">{SEO_ROLE_COUNT}+</p>
              <p className="mt-2 text-sm text-slate-300">Character classes with guides and data.</p>
            </div>
            <div className="retro-panel p-4">
              <p className="retro-kicker">Content</p>
              <p className="mt-2 text-3xl font-black text-stone-200">500+</p>
              <p className="mt-2 text-sm text-slate-300">Screens of research before you even hit apply.</p>
            </div>
            <div className="retro-panel p-4">
              <p className="retro-kicker">Upgrade</p>
              <p className="mt-2 text-3xl font-black text-slate-200">10s</p>
              <p className="mt-2 text-sm text-slate-300">To tailor your resume once the plan is clear.</p>
            </div>
          </div>
        </div>

        <div className="animate-in-up delay-1">
          <div className="retro-monitor">
            <div className="retro-monitor__topbar">
              <span />
              <span />
              <span />
            </div>

            <div className="space-y-5">
              <div>
                <p className="retro-kicker">Story mode</p>
                <h2 className="mt-2 text-2xl font-black uppercase text-white">Your quest map</h2>
              </div>

              <div className="space-y-4">
                {STORY_STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    className="group rounded-[1.4rem] border border-slate-400/15 bg-slate-950/60 p-4 transition duration-300 hover:-translate-y-1 hover:border-slate-200/20 hover:shadow-[0_0_24px_rgba(15,23,42,0.28)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-300">
                          {step.label}
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-white">{step.title}</h3>
                      </div>
                      <span className="text-3xl font-black text-slate-300/80">0{index + 1}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.4rem] border border-slate-300/15 bg-white/5 p-4 text-sm text-slate-200">
                Cursor detector, neon transitions, and weird internet energy enabled.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="quest-map" className="mt-14">
        <div className="retro-panel p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="retro-kicker">Main quest loop</p>
              <h2 className="mt-2 text-2xl font-black uppercase text-white">
                Learn free. Click deeper. Convert when ready.
              </h2>
            </div>
            <Link href="/blog/how-to-pass-ats-screening" className="retro-button retro-button--ghost">
              See a sample guide
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="story-card">
              <span className="story-card__icon">01</span>
              <h3 className="mt-4 text-xl font-bold text-white">Get pulled in by the vibe</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Instead of sounding like a corporate brochure, the site feels like something worth
                exploring. The design is part of the hook.
              </p>
            </div>
            <div className="story-card">
              <span className="story-card__icon">02</span>
              <h3 className="mt-4 text-xl font-bold text-white">Deliver actual value fast</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Role pages, salary pages, and ATS guides answer real questions immediately so users
                have a reason to stay.
              </p>
            </div>
            <div className="story-card">
              <span className="story-card__icon">03</span>
              <h3 className="mt-4 text-xl font-bold text-white">Trigger the upgrade path</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Once the user trusts the content, ApplyX becomes the obvious power-up for the
                actual application.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="retro-panel p-6">
            <p className="retro-kicker">Boss fights</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-white">What you unlock here</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link href="/interview/software-engineer" className="quest-tile">
                <span className="quest-tile__emoji">🎯</span>
                <h3 className="quest-tile__title">Interview boss patterns</h3>
                <p className="quest-tile__copy">
                  Behavioral, technical, and situational questions for {SEO_ROLE_COUNT}+ roles.
                </p>
              </Link>
              <Link href="/salary/software-engineer" className="quest-tile">
                <span className="quest-tile__emoji">💰</span>
                <h3 className="quest-tile__title">Salary maps</h3>
                <p className="quest-tile__copy">
                  Comp ranges and negotiation scripts so you stop guessing.
                </p>
              </Link>
              <Link href="/keywords/software-engineer" className="quest-tile">
                <span className="quest-tile__emoji">🔑</span>
                <h3 className="quest-tile__title">ATS keycards</h3>
                <p className="quest-tile__copy">
                  Exact keywords that unlock interview visibility in machine filters.
                </p>
              </Link>
              <Link href="/resume/software-engineer" className="quest-tile">
                <span className="quest-tile__emoji">📄</span>
                <h3 className="quest-tile__title">Resume loadouts</h3>
                <p className="quest-tile__copy">
                  Real bullet patterns and structure ideas for each role.
                </p>
              </Link>
            </div>
          </div>

          <div className="retro-panel p-6">
            <p className="retro-kicker">Why it works</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-white">Not polished. Memorable.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Job seekers scroll past generic “professional” landing pages all day. This version is
              trying to feel alive, surprising, and worth sharing while still being useful.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <div className="rounded-2xl border border-slate-300/15 bg-white/5 px-4 py-3">
                Neon UI creates a stronger first impression.
              </div>
              <div className="rounded-2xl border border-slate-300/15 bg-white/5 px-4 py-3">
                Story framing makes the content easier to understand.
              </div>
              <div className="rounded-2xl border border-slate-300/15 bg-white/5 px-4 py-3">
                Stronger emotional hook can lead to more clicks into ApplyX.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roles" className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="retro-kicker">Choose your avatar</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-white">Pick a role</h2>
          </div>
          <p className="max-w-xl text-sm text-slate-300">
            Every role page branches into interview prep, salary data, ATS keywords, and resume strategy.
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

      {articles.length > 0 && (
        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="retro-kicker">Secret levels</p>
              <h2 className="mt-2 text-3xl font-black uppercase text-white">Guides worth opening</h2>
            </div>
            <Link href={`/blog/${articles[0]?.slug ?? ""}`} className="retro-button retro-button--ghost">
              Open a guide
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {articles.slice(0, 4).map((article, index) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className={`article-card article-card--${(index % 4) + 1}`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-300">
                  {article.category} / {article.readingTime}
                </p>
                <span className="mt-4 block text-xl font-bold text-white">{article.title}</span>
                <p className="mt-3 text-sm leading-6 text-slate-300">{article.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <div className="retro-panel p-8 text-center sm:p-12">
          <p className="retro-kicker">Final upgrade</p>
          <h2 className="mt-3 text-4xl font-black uppercase text-white sm:text-5xl">
            Done exploring? Equip ApplyX.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
            Once you know the role, the salary, the keywords, and the interview traps, ApplyX
            turns that research into a tailored resume built for the exact job description.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/applyx?source=homepage-cta" className="retro-button">
              Launch ApplyX free
            </Link>
            <Link href="/compare/applyx-vs-jobscan" className="retro-button retro-button--ghost">
              Compare with Jobscan
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <EmailCapture context="homepage" />
      </section>
    </div>
  );
}
