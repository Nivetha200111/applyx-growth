import type { MetadataRoute } from "next";

import { getAllSeoRoleSlugs } from "@/lib/seo/roles";
import { getAllBlogSlugs } from "@/lib/blog/articles";
import { getAllComparisonSlugs } from "@/lib/seo/comparisons";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.appUrl;
  const roles = getAllSeoRoleSlugs();
  const blogSlugs = getAllBlogSlugs();
  const comparisonSlugs = getAllComparisonSlugs();
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 }
  ];

  const resumePages: MetadataRoute.Sitemap = roles.map((slug) => ({
    url: `${base}/resume/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  const interviewPages: MetadataRoute.Sitemap = roles.map((slug) => ({
    url: `${base}/interview/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  const salaryPages: MetadataRoute.Sitemap = roles.map((slug) => ({
    url: `${base}/salary/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  const keywordPages: MetadataRoute.Sitemap = roles.map((slug) => ({
    url: `${base}/keywords/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  const comparisonPages: MetadataRoute.Sitemap = comparisonSlugs.map((slug) => ({
    url: `${base}/compare/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75
  }));

  return [
    ...staticPages,
    ...resumePages,
    ...interviewPages,
    ...salaryPages,
    ...keywordPages,
    ...blogPages,
    ...comparisonPages
  ];
}
