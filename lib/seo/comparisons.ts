// ---------------------------------------------------------------------------
// Comparison page data for "ApplyX vs [Competitor]" SEO pages.
// These capture bottom-of-funnel search traffic from people comparing tools.
// ---------------------------------------------------------------------------

export type ComparisonFeature = {
  feature: string;
  applyx: string;
  competitor: string;
};

export type ComparisonPage = {
  slug: string;
  competitorName: string;
  competitorDescription: string;
  title: string;
  description: string;
  verdict: string;
  features: ComparisonFeature[];
};

const COMPARISONS: ComparisonPage[] = [
  {
    slug: "applyx-vs-jobscan",
    competitorName: "Jobscan",
    competitorDescription: "Jobscan is an ATS optimization tool that compares your resume against a job description and provides a match rate with suggestions for improvement.",
    title: "ApplyX vs Jobscan (2026) — Which Resume Tool Is Better?",
    description: "Compare ApplyX and Jobscan side-by-side. Features, pricing, ATS scoring, and resume tailoring compared in detail.",
    verdict: "Jobscan is a solid ATS scanner, but it only tells you what to fix — you still do the work manually. ApplyX goes further: it reads the job description and rewrites your resume bullets automatically using AI. If you want a score, Jobscan works. If you want a tailored resume ready to submit, ApplyX delivers.",
    features: [
      { feature: "ATS keyword scoring", applyx: "Free, unlimited", competitor: "Free (limited), paid for full reports" },
      { feature: "AI resume tailoring", applyx: "Yes — rewrites bullets to match JD", competitor: "No — shows suggestions only" },
      { feature: "Cover letter generation", applyx: "Free tool included", competitor: "Not available" },
      { feature: "Interview prep", applyx: "120+ role-specific question banks", competitor: "Not available" },
      { feature: "Salary data", applyx: "120+ roles with salary bands", competitor: "Not available" },
      { feature: "PDF/DOCX download", applyx: "ATS-optimized output in both formats", competitor: "Not available" },
      { feature: "Pricing", applyx: "Free tier (3/mo), Basic $2.99/mo, Premium $6.99/mo", competitor: "Free (limited), Pro $49.95/quarter" },
      { feature: "Job tracker", applyx: "Built-in with signal scoring", competitor: "Not available" }
    ]
  },
  {
    slug: "applyx-vs-resumeworded",
    competitorName: "Resume Worded",
    competitorDescription: "Resume Worded provides AI-powered resume scoring and feedback, including line-by-line suggestions and an ATS keyword match tool.",
    title: "ApplyX vs Resume Worded (2026) — Full Feature Comparison",
    description: "Compare ApplyX and Resume Worded features, pricing, and capabilities. See which tool gives you the best chance at landing interviews.",
    verdict: "Resume Worded provides detailed scoring and line-by-line feedback, which is helpful for understanding your resume's weaknesses. However, you still need to manually implement every suggestion. ApplyX automates the tailoring process: paste a JD and get a fully rewritten, ATS-optimized resume. For speed and results, ApplyX wins.",
    features: [
      { feature: "ATS keyword scoring", applyx: "Free, unlimited", competitor: "Free (limited), paid for detailed reports" },
      { feature: "AI resume tailoring", applyx: "Yes — full rewrite per JD", competitor: "No — provides suggestions" },
      { feature: "Line-by-line feedback", applyx: "Focused on missing keywords and impact", competitor: "Yes — detailed per-bullet feedback" },
      { feature: "Cover letter tools", applyx: "Free cover letter generator", competitor: "Not available" },
      { feature: "Interview prep", applyx: "120+ role question banks", competitor: "Not available" },
      { feature: "Pricing", applyx: "Free tier (3/mo), Basic $2.99/mo, Premium $6.99/mo", competitor: "Free (limited), Pro $19/month" },
      { feature: "Output format", applyx: "PDF and DOCX download", competitor: "No output generation" }
    ]
  },
  {
    slug: "applyx-vs-teal",
    competitorName: "Teal",
    competitorDescription: "Teal is a job search management platform that includes a resume builder, job tracker, and AI-assisted resume tailoring.",
    title: "ApplyX vs Teal (2026) — Resume Tailoring Comparison",
    description: "Compare ApplyX and Teal for AI resume tailoring, job tracking, and ATS optimization. See which tool helps you apply faster.",
    verdict: "Teal offers a broader job search management suite with a resume builder and tracker. ApplyX focuses more narrowly on the critical bottleneck: getting your resume past the ATS. ApplyX's AI tailoring is deeper (full bullet rewrites vs. suggestions), and the free tools ecosystem (ATS checker, cover letters, interview prep, salary data) provides more value for job seekers who want everything in one place.",
    features: [
      { feature: "AI resume tailoring", applyx: "Full AI rewrite per JD", competitor: "AI-assisted suggestions" },
      { feature: "Resume builder", applyx: "Upload and tailor existing resume", competitor: "Built-in resume builder" },
      { feature: "Job tracker", applyx: "Built-in with authenticity signals", competitor: "Built-in with bookmarking" },
      { feature: "ATS scoring", applyx: "Free, unlimited", competitor: "Included in resume analysis" },
      { feature: "Free tools", applyx: "ATS checker, cover letters, interview prep, salary data, keywords", competitor: "Limited free tier" },
      { feature: "Pricing", applyx: "Free (3/mo), Basic $2.99/mo, Premium $6.99/mo", competitor: "Free (limited), Pro $9/week" }
    ]
  },
  {
    slug: "applyx-vs-kickresume",
    competitorName: "Kickresume",
    competitorDescription: "Kickresume is an online resume builder with templates, an AI writer, and a cover letter builder.",
    title: "ApplyX vs Kickresume (2026) — AI Resume Tools Compared",
    description: "Compare ApplyX and Kickresume for resume creation, AI tailoring, and ATS optimization. See which approach gets more interviews.",
    verdict: "Kickresume excels at creating beautiful resumes from scratch with its template library and AI writer. ApplyX takes a different approach: you bring your existing resume, and ApplyX rewrites it to match a specific job description. If you need to build a resume from zero, Kickresume is great. If you need to tailor an existing resume for maximum ATS pass rate, ApplyX is the better tool.",
    features: [
      { feature: "Resume builder", applyx: "Upload-and-tailor model", competitor: "Full template-based builder" },
      { feature: "AI tailoring per JD", applyx: "Yes — rewrites bullets to match each JD", competitor: "AI writer for general content" },
      { feature: "ATS scoring", applyx: "Free, unlimited", competitor: "Basic ATS check included" },
      { feature: "Templates", applyx: "ATS-optimized PDF/DOCX output", competitor: "35+ visual templates" },
      { feature: "Cover letter", applyx: "Free generator tool", competitor: "AI cover letter builder" },
      { feature: "Pricing", applyx: "Free (3/mo), Basic $2.99/mo, Premium $6.99/mo", competitor: "Free (limited), Premium $19/month" }
    ]
  }
];

const COMPARISON_MAP = new Map<string, ComparisonPage>(
  COMPARISONS.map((c) => [c.slug, c])
);

export function getAllComparisonSlugs(): string[] {
  return COMPARISONS.map((c) => c.slug);
}

export function getComparison(slug: string): ComparisonPage | null {
  return COMPARISON_MAP.get(slug) ?? null;
}

