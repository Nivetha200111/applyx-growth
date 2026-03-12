import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { EmailCapture } from "@/components/email-capture";
import { getAllBlogSlugs, getBlogArticle, getAllBlogArticles } from "@/lib/blog/articles";
import { buildArticle, buildFaqPage, buildBreadcrumbList } from "@/lib/seo/structured-data";
import { env } from "@/lib/env";

type BlogPageProps = {
  params: { slug: string };
};

export const revalidate = 86400;

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: BlogPageProps): Metadata {
  const article = getBlogArticle(params.slug);

  if (!article) {
    return { title: "Article not found" };
  }

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `${env.appUrl}/blog/${article.slug}` }
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  const article = getBlogArticle(params.slug);

  if (!article) {
    notFound();
  }

  const allArticles = getAllBlogArticles().filter((a) => a.slug !== article.slug);

  const articleLd = buildArticle({
    title: article.title,
    description: article.description,
    slug: article.slug,
    publishedAt: article.publishedAt
  });

  const faqLd =
    article.faqs.length > 0
      ? buildFaqPage(article.faqs)
      : null;

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Home", url: env.appUrl },
    { name: "Guides", url: `${env.appUrl}/blog/${getAllBlogSlugs()[0] ?? ""}` },
    { name: article.title, url: `${env.appUrl}/blog/${article.slug}` }
  ]);

  return (
    <div className="page-shell py-16 sm:py-20">
      <JsonLd data={articleLd} />
      {faqLd && <JsonLd data={faqLd} />}
      <JsonLd data={breadcrumbLd} />

      <article className="max-w-3xl">
        <header>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="rounded-full border border-brand-400/25 bg-brand-500/10 px-3 py-0.5 text-xs font-medium text-brand-100">
              {article.category}
            </span>
            <span>{article.readingTime}</span>
            <time dateTime={article.publishedAt}>
              {new Intl.DateTimeFormat("en", {
                year: "numeric",
                month: "long",
                day: "numeric"
              }).format(new Date(article.publishedAt))}
            </time>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
            {article.description}
          </p>
        </header>

        <div className="mt-10 space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="mt-4 text-sm leading-7 text-slate-300">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* FAQ section */}
        {article.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-white">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {article.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <h3 className="text-sm font-semibold text-white">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related links */}
        {article.relatedLinks.length > 0 && (
          <section className="mt-12 rounded-2xl border border-brand-400/20 bg-brand-950/40 p-8">
            <h2 className="text-xl font-semibold text-white">Keep reading</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {article.relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-brand-400/25 bg-brand-500/10 px-5 py-2.5 text-sm font-semibold text-brand-100 transition hover:bg-brand-500/20"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Email capture */}
      <section className="mt-10 max-w-3xl">
        <EmailCapture context={`blog-${article.slug}`} />
      </section>

      {/* More articles */}
      {allArticles.length > 0 && (
        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold text-white">More articles</h2>
          <div className="mt-4 grid gap-3">
            {allArticles.slice(0, 4).map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-brand-400/30 hover:bg-brand-500/5"
              >
                <span className="text-sm font-medium text-white">{related.title}</span>
                <p className="mt-1 text-xs text-slate-400">{related.readingTime}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
