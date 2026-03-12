// ---------------------------------------------------------------------------
// JSON-LD structured data builders for rich Google snippets.
// Each function returns a plain object that should be serialised into a
// <script type="application/ld+json"> tag inside the page <head>.
// ---------------------------------------------------------------------------

import { env } from "@/lib/env";

type FaqItem = { question: string; answer: string };

export function buildOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ApplyX",
    url: env.applyxApiBaseUrl,
    description:
      "AI-powered resume tailoring and free job search tools: ATS resume checker, cover letter generator, interview prep, salary data, and resume keyword tools for 130+ job roles.",
    sameAs: []
  };
}

export function buildWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ApplyX Free Tools",
    url: env.appUrl,
    description:
      "Free ATS checker, interview prep, salary data, and resume tools that help job seekers land more interviews.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${env.appUrl}/resume/{search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildFaqPage(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function buildHowTo(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text
    }))
  };
}

export function buildBreadcrumbList(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function buildArticle(article: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${env.appUrl}/blog/${article.slug}`,
    datePublished: article.publishedAt,
    publisher: buildOrganization()
  };
}

export function buildSoftwareApplication() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ApplyX",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: env.applyxApiBaseUrl,
    description:
      "AI resume tailoring that matches your resume to any job description and generates ATS-optimized PDFs.",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        name: "Free",
        description: "3 resume tailors per month"
      },
      {
        "@type": "Offer",
        price: "2.99",
        priceCurrency: "USD",
        name: "Basic",
        description: "30 resume tailors per month"
      },
      {
        "@type": "Offer",
        price: "6.99",
        priceCurrency: "USD",
        name: "Premium",
        description: "Unlimited resume tailors per month"
      }
    ]
  };
}

/** Renders a JSON-LD script tag string for use in metadata. */
export function jsonLdScript(data: Record<string, unknown>): string {
  return JSON.stringify(data);
}
