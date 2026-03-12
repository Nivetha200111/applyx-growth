const ROLE_SLUGS = [
  "account-executive",
  "account-manager",
  "accounts-payable-specialist",
  "android-developer",
  "art-director",
  "backend-developer",
  "brand-manager",
  "business-analyst",
  "business-development-manager",
  "cloud-architect",
  "compliance-analyst",
  "content-marketer",
  "copywriter",
  "customer-success-manager",
  "cybersecurity-analyst",
  "data-analyst",
  "data-engineer",
  "data-scientist",
  "database-administrator",
  "demand-generation-manager",
  "devops-engineer",
  "digital-marketing-manager",
  "ecommerce-manager",
  "electrical-engineer",
  "engineering-manager",
  "enterprise-account-executive",
  "event-marketing-manager",
  "finance-manager",
  "financial-analyst",
  "frontend-developer",
  "full-stack-developer",
  "growth-marketer",
  "hr-manager",
  "implementation-manager",
  "inside-sales-representative",
  "ios-developer",
  "it-support-specialist",
  "java-developer",
  "machine-learning-engineer",
  "marketing-analyst",
  "marketing-manager",
  "mechanical-engineer",
  "mobile-developer",
  "network-engineer",
  "operations-manager",
  "partnerships-manager",
  "payroll-specialist",
  "people-operations-manager",
  "performance-marketer",
  "platform-engineer",
  "pricing-analyst",
  "procurement-specialist",
  "product-analyst",
  "product-designer",
  "product-manager",
  "product-marketing-manager",
  "program-manager",
  "project-manager",
  "python-developer",
  "qa-engineer",
  "react-developer",
  "recruiter",
  "revenue-operations-manager",
  "sales-development-representative",
  "sales-engineer",
  "sales-manager",
  "scrum-master",
  "seo-specialist",
  "site-reliability-engineer",
  "social-media-manager",
  "software-architect",
  "software-engineer",
  "solutions-architect",
  "solutions-consultant",
  "sql-developer",
  "staff-accountant",
  "supply-chain-analyst",
  "support-engineer",
  "systems-administrator",
  "talent-acquisition-specialist",
  "technical-account-manager",
  "technical-program-manager",
  "technical-project-manager",
  "technical-recruiter",
  "technical-support-specialist",
  "ui-designer",
  "ux-designer",
  "ux-researcher",
  "video-editor",
  "visual-designer",
  "vp-sales",
  "web-designer",
  "wordpress-developer",
  "customer-support-specialist",
  "operations-analyst",
  "marketing-operations-manager",
  "security-engineer",
  "fp-and-a-analyst",
  "chief-of-staff",
  "bdr-manager",
  "crm-administrator"
] as const;

type RoleCategory =
  | "engineering"
  | "data"
  | "product"
  | "design"
  | "marketing"
  | "sales"
  | "operations"
  | "finance"
  | "people";

type RoleContent = {
  slug: string;
  title: string;
  summary: string;
  keywords: string[];
  sections: Array<{
    heading: string;
    bullets: string[];
  }>;
};

const CATEGORY_KEYWORDS: Record<RoleCategory, string[]> = {
  engineering: [
    "typescript",
    "react",
    "next.js",
    "apis",
    "testing",
    "cloud",
    "ci/cd",
    "architecture",
    "performance",
    "scalability",
    "postgresql",
    "monitoring"
  ],
  data: [
    "sql",
    "python",
    "analytics",
    "dashboards",
    "etl",
    "experimentation",
    "forecasting",
    "statistics",
    "reporting",
    "stakeholder management",
    "tableau",
    "power bi"
  ],
  product: [
    "roadmap",
    "user research",
    "backlog",
    "prioritization",
    "go-to-market",
    "cross-functional",
    "metrics",
    "requirements",
    "launch",
    "discovery",
    "stakeholder alignment",
    "experimentation"
  ],
  design: [
    "figma",
    "wireframes",
    "prototyping",
    "design systems",
    "user research",
    "interaction design",
    "accessibility",
    "usability testing",
    "visual design",
    "journey mapping",
    "component libraries",
    "collaboration"
  ],
  marketing: [
    "seo",
    "content strategy",
    "campaigns",
    "lead generation",
    "analytics",
    "email marketing",
    "paid media",
    "conversion rate optimization",
    "messaging",
    "go-to-market",
    "lifecycle",
    "reporting"
  ],
  sales: [
    "pipeline",
    "prospecting",
    "crm",
    "forecasting",
    "negotiation",
    "quota attainment",
    "discovery",
    "stakeholder management",
    "account planning",
    "presentations",
    "renewals",
    "customer relationships"
  ],
  operations: [
    "process improvement",
    "automation",
    "project management",
    "dashboards",
    "cross-functional",
    "documentation",
    "risk management",
    "vendor management",
    "sops",
    "resource planning",
    "service levels",
    "reporting"
  ],
  finance: [
    "forecasting",
    "budgeting",
    "financial modeling",
    "variance analysis",
    "reporting",
    "excel",
    "reconciliation",
    "audit",
    "cash flow",
    "planning",
    "kpis",
    "controls"
  ],
  people: [
    "recruiting",
    "stakeholder management",
    "candidate experience",
    "onboarding",
    "employee relations",
    "interviewing",
    "talent pipelines",
    "performance management",
    "hris",
    "compliance",
    "communication",
    "program management"
  ]
};

function titleizeRole(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferCategory(slug: string): RoleCategory {
  if (
    slug.includes("developer") ||
    slug.includes("engineer") ||
    slug.includes("architect") ||
    slug.includes("administrator")
  ) {
    return slug.includes("data") ? "data" : "engineering";
  }

  if (
    slug.includes("data") ||
    slug.includes("analytics") ||
    slug.includes("analyst") && (slug.includes("marketing") || slug.includes("product") || slug.includes("pricing"))
  ) {
    return slug.includes("product") ? "product" : slug.includes("marketing") ? "marketing" : "data";
  }

  if (slug.includes("designer") || slug.includes("researcher") || slug.includes("art")) {
    return "design";
  }

  if (slug.includes("sales") || slug.includes("account") || slug.includes("revenue") || slug.includes("bdr")) {
    return "sales";
  }

  if (
    slug.includes("finance") ||
    slug.includes("accountant") ||
    slug.includes("payroll") ||
    slug.includes("fp-and-a")
  ) {
    return "finance";
  }

  if (
    slug.includes("recruiter") ||
    slug.includes("talent") ||
    slug.includes("people") ||
    slug.includes("hr")
  ) {
    return "people";
  }

  if (slug.includes("product") || slug.includes("program") || slug.includes("project") || slug.includes("scrum")) {
    return "product";
  }

  if (
    slug.includes("marketing") ||
    slug.includes("seo") ||
    slug.includes("content") ||
    slug.includes("social") ||
    slug.includes("brand")
  ) {
    return "marketing";
  }

  return "operations";
}

function uniqueKeywords(slug: string, category: RoleCategory): string[] {
  const slugKeywords = slug.split("-").filter((token) => token.length > 2);
  return [...new Set([...slugKeywords, ...CATEGORY_KEYWORDS[category]])].slice(0, 14);
}

function buildSections(title: string, category: RoleCategory): RoleContent["sections"] {
  return [
    {
      heading: "Professional Summary",
      bullets: [
        `Lead with the exact ${title} title and years of relevant experience.`,
        `Mention 3-4 role-specific strengths tied to ${category === "engineering" ? "delivery and systems" : "business outcomes"}.`
      ]
    },
    {
      heading: "Core Skills",
      bullets: [
        "List technical keywords in a compact ATS-friendly skills block.",
        "Mirror the language used in target job descriptions whenever it is truthful."
      ]
    },
    {
      heading: "Experience",
      bullets: [
        "Start each bullet with a strong action verb and end with a measurable result.",
        "Prioritize recent work that proves you can deliver in the target role."
      ]
    },
    {
      heading: "Projects And Tools",
      bullets: [
        "Include projects, systems, or campaigns that show hands-on execution.",
        "Name the tools, workflows, and collaboration environments you used."
      ]
    }
  ];
}

export function getAllRoleSlugs(): string[] {
  return [...ROLE_SLUGS];
}

export function getRoleContent(slug: string): RoleContent | null {
  if (!ROLE_SLUGS.includes(slug as (typeof ROLE_SLUGS)[number])) {
    return null;
  }

  const title = titleizeRole(slug);
  const category = inferCategory(slug);

  return {
    slug,
    title,
    summary: `Use this ${title} resume guide to match ATS requirements, highlight role-relevant keywords, and improve conversion from search traffic into an ATS check.`,
    keywords: uniqueKeywords(slug, category),
    sections: buildSections(title, category)
  };
}

