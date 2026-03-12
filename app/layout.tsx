import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import "./globals.css";

import { JsonLd } from "@/components/json-ld";
import { buildOrganization } from "@/lib/seo/structured-data";
import { env } from "@/lib/env";

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
      <body className="text-slate-50 antialiased">
        <JsonLd data={orgLd} />
        <div className="min-h-screen">
          <header className="border-b border-white/10 backdrop-blur">
            <div className="page-shell flex items-center justify-between py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight text-white">
                ApplyX
              </Link>

              <nav className="flex items-center gap-4 text-sm text-slate-300">
                <Link href="/interview/software-engineer" className="transition hover:text-white">
                  Interview Prep
                </Link>
                <Link href="/salary/software-engineer" className="transition hover:text-white">
                  Salaries
                </Link>
                <Link href="/keywords/software-engineer" className="transition hover:text-white">
                  ATS Keywords
                </Link>
                <Link href="/blog/how-to-pass-ats-screening" className="transition hover:text-white">
                  Guides
                </Link>
                <Link
                  href="/applyx?source=site-nav"
                  className="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-500"
                >
                  Get ApplyX
                </Link>
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="border-t border-white/10">
            <div className="page-shell py-12">
              <div className="grid gap-8 md:grid-cols-4">
                {/* Brand */}
                <div>
                  <Link href="/" className="text-lg font-semibold text-white">
                    ApplyX
                  </Link>
                  <p className="mt-3 text-sm text-slate-400">
                    Free career resources and AI-powered resume tailoring for job seekers.
                  </p>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Resources
                  </h4>
                  <nav className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                    <Link href="/interview/software-engineer" className="transition hover:text-white">Interview Questions</Link>
                    <Link href="/salary/software-engineer" className="transition hover:text-white">Salary Explorer</Link>
                    <Link href="/keywords/software-engineer" className="transition hover:text-white">ATS Keywords</Link>
                    <Link href="/resume/software-engineer" className="transition hover:text-white">Resume Guides</Link>
                  </nav>
                </div>

                {/* Guides */}
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Guides
                  </h4>
                  <nav className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                    <Link href="/blog/how-to-pass-ats-screening" className="transition hover:text-white">Pass ATS Screening</Link>
                    <Link href="/blog/resume-format-2026" className="transition hover:text-white">Resume Format 2026</Link>
                    <Link href="/blog/tailored-resume-vs-generic" className="transition hover:text-white">Tailored vs Generic Resume</Link>
                    <Link href="/blog/job-search-strategy-2026" className="transition hover:text-white">Job Search Strategy</Link>
                  </nav>
                </div>

                {/* Product */}
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Product
                  </h4>
                  <nav className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                    <Link href="/applyx?source=footer" className="transition hover:text-white">ApplyX — AI Resume Tailor</Link>
                    <Link href="/compare/applyx-vs-jobscan" className="transition hover:text-white">ApplyX vs Jobscan</Link>
                    <Link href="/compare/applyx-vs-resumeworded" className="transition hover:text-white">ApplyX vs Resume Worded</Link>
                  </nav>
                </div>
              </div>

              <div className="mt-10 border-t border-white/10 pt-6 flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                <p>&copy; {new Date().getFullYear()} ApplyX. Free career resources for everyone.</p>
                <Link href="/applyx?source=site-footer" className="text-brand-400 transition hover:text-white">
                  Get ApplyX — AI Resume Tailor &rarr;
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
