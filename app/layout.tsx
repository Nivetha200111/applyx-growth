import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import "./globals.css";

import { JsonLd } from "@/components/json-ld";
import { RetroEffects } from "@/components/retro-effects";
import { buildOrganization } from "@/lib/seo/structured-data";
import { env } from "@/lib/env";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body"
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  metadataBase: new URL(env.appUrl),
  title: {
    default: "ApplyX — Interview Prep, Salary Data & Resume Guides for 130+ Roles",
    template: "%s | ApplyX"
  },
  description:
    "Free career resources: interview questions, salary data, ATS keywords, resume guides, and job search strategy articles for 130+ roles.",
  openGraph: {
    type: "website",
    siteName: "ApplyX",
    title: "ApplyX — Interview Prep, Salary Data & Resume Guides for 130+ Roles",
    description:
      "Free career resources: interview questions, salary data, ATS keywords, resume guides for 130+ roles."
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyX — Interview Prep, Salary Data & Resume Guides",
    description:
      "Free career resources for 130+ roles. Interview questions, salary data, resume keywords, job search guides."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const orgLd = buildOrganization();

  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${spaceMono.variable} retro-body text-slate-50 antialiased`}>
        <JsonLd data={orgLd} />
        <RetroEffects />
        <div className="min-h-screen overflow-hidden">
          <div className="retro-marquee" aria-hidden="true">
            <div className="retro-marquee-track">
              <span>FREE INTERVIEW PREP</span>
              <span>SALARY DATA FOR 130+ ROLES</span>
              <span>ATS KEYWORD GUIDES</span>
              <span>AI RESUME TAILORING</span>
              <span>CAREER RESOURCES</span>
              <span>FREE INTERVIEW PREP</span>
              <span>SALARY DATA FOR 130+ ROLES</span>
              <span>ATS KEYWORD GUIDES</span>
            </div>
          </div>

          <header className="sticky top-0 z-30 border-b border-brand-400/20 bg-slate-950/78 backdrop-blur-xl">
            <div className="page-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Link href="/" className="inline-flex items-center gap-3 text-white transition hover:scale-[1.01]">
                  <span className="retro-logo">ApplyX</span>
                  <span className="hidden text-xs uppercase tracking-[0.35em] text-brand-300 sm:inline">
                    Grow
                  </span>
                </Link>
                <p className="mt-2 text-xs uppercase tracking-[0.28em] text-slate-400">
                  Free career resources for job seekers
                </p>
              </div>

              <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
                <Link href="/interview/software-engineer" className="retro-nav-pill">
                  Interview Prep
                </Link>
                <Link href="/salary/software-engineer" className="retro-nav-pill">
                  Salaries
                </Link>
                <Link href="/keywords/software-engineer" className="retro-nav-pill">
                  ATS Keywords
                </Link>
                <Link href="/blog/how-to-pass-ats-screening" className="retro-nav-pill">
                  Guides
                </Link>
                <Link href="/applyx?source=site-nav" className="retro-button retro-button--small">
                  Get ApplyX
                </Link>
              </nav>
            </div>
          </header>

          <main className="relative z-10">{children}</main>

          <footer className="relative z-10 border-t border-brand-400/20 bg-slate-950/65">
            <div className="page-shell py-12">
              <div className="grid gap-8 md:grid-cols-4">
                <div className="retro-panel p-6">
                  <Link href="/" className="text-lg font-semibold text-white">
                    ApplyX
                  </Link>
                  <p className="mt-3 text-sm text-slate-300">
                    Free career resources and AI-powered resume tailoring for job seekers.
                    Interview prep, salary data, ATS keywords, and resume guides for 130+ roles.
                  </p>
                </div>

                <div className="retro-panel p-6">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-300">
                    Resources
                  </h4>
                  <nav className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
                    <Link href="/interview/software-engineer" className="transition hover:text-brand-200">Interview Questions</Link>
                    <Link href="/salary/software-engineer" className="transition hover:text-brand-200">Salary Explorer</Link>
                    <Link href="/keywords/software-engineer" className="transition hover:text-brand-200">ATS Keywords</Link>
                    <Link href="/resume/software-engineer" className="transition hover:text-brand-200">Resume Guides</Link>
                  </nav>
                </div>

                <div className="retro-panel p-6">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-300">
                    Guides
                  </h4>
                  <nav className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
                    <Link href="/blog/how-to-pass-ats-screening" className="transition hover:text-brand-200">Pass ATS Screening</Link>
                    <Link href="/blog/resume-format-2026" className="transition hover:text-brand-200">Resume Format 2026</Link>
                    <Link href="/blog/tailored-resume-vs-generic" className="transition hover:text-brand-200">Tailored vs Generic Resume</Link>
                    <Link href="/blog/job-search-strategy-2026" className="transition hover:text-brand-200">Job Search Strategy</Link>
                  </nav>
                </div>

                <div className="retro-panel p-6">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-300">
                    Product
                  </h4>
                  <nav className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
                    <Link href="/applyx?source=footer" className="transition hover:text-brand-200">ApplyX — AI Resume Tailor</Link>
                    <Link href="/compare/applyx-vs-jobscan" className="transition hover:text-brand-200">ApplyX vs Jobscan</Link>
                    <Link href="/compare/applyx-vs-resumeworded" className="transition hover:text-brand-200">ApplyX vs Resume Worded</Link>
                  </nav>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 border-t border-brand-400/20 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
                <p>&copy; {new Date().getFullYear()} ApplyX. Free career resources for everyone.</p>
                <Link href="/applyx?source=site-footer" className="text-brand-300 transition hover:text-white">
                  Try ApplyX free &rarr;
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
