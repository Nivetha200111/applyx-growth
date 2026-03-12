// ---------------------------------------------------------------------------
// Programmatic interview-question generator keyed by role slug.
// Every role gets unique, high-value questions covering behavioural,
// technical, and situational categories — maximising long-tail SEO.
// ---------------------------------------------------------------------------

import { getSeoRole, type SeoRole } from "@/lib/seo/roles";

export type InterviewCategory = "behavioral" | "technical" | "situational";

export type InterviewQuestion = {
  question: string;
  category: InterviewCategory;
  tip: string;
};

export type InterviewPageData = {
  slug: string;
  title: string;
  description: string;
  questions: InterviewQuestion[];
  relatedRoles: string[];
};

// ── Question templates ─────────────────────────────────────────────────────

function behavioralQuestions(role: SeoRole): InterviewQuestion[] {
  return [
    {
      question: `Tell me about a time you solved a difficult problem as a ${role.title}.`,
      category: "behavioral",
      tip: "Use the STAR method: Situation, Task, Action, Result. Quantify the result whenever possible."
    },
    {
      question: `Describe a situation where you had to collaborate across teams in a ${role.title} role.`,
      category: "behavioral",
      tip: "Highlight your communication skills and how you navigated different priorities."
    },
    {
      question: `How do you handle tight deadlines or competing priorities?`,
      category: "behavioral",
      tip: "Show your prioritization framework and give a concrete example of when you used it."
    },
    {
      question: `Tell me about a time you received constructive feedback and how you responded.`,
      category: "behavioral",
      tip: "Demonstrate growth mindset. Explain the feedback, what you changed, and the outcome."
    },
    {
      question: `Describe your most impactful project as a ${role.title}.`,
      category: "behavioral",
      tip: "Focus on measurable business impact: revenue, efficiency, user growth, or cost savings."
    }
  ];
}

function technicalQuestions(role: SeoRole): InterviewQuestion[] {
  const kw = role.keywords;
  const primary = kw.slice(0, 4);
  const secondary = kw.slice(4, 8);

  return [
    {
      question: `How would you explain ${primary[0] ?? "your core skill"} to a non-technical stakeholder?`,
      category: "technical",
      tip: "Use analogies and focus on business impact rather than implementation details."
    },
    {
      question: `Walk me through how you would use ${primary[1] ?? "a key tool"} and ${primary[2] ?? "a related technology"} together in a real project.`,
      category: "technical",
      tip: "Describe a concrete project. Show depth by mentioning trade-offs and alternatives you considered."
    },
    {
      question: `What is your approach to ${secondary[0] ?? "quality assurance"} in a ${role.title} workflow?`,
      category: "technical",
      tip: "Demonstrate systematic thinking. Mention specific tools, processes, or frameworks you follow."
    },
    {
      question: `How do you stay current with evolving best practices in ${primary[3] ?? role.keywords[0] ?? "your field"}?`,
      category: "technical",
      tip: "Name specific resources: newsletters, communities, conferences, or open-source projects."
    },
    {
      question: `Explain a trade-off you made between ${secondary[1] ?? "speed"} and ${secondary[2] ?? "quality"} in a recent ${role.title} project.`,
      category: "technical",
      tip: "Show decision-making maturity. Explain the context, the trade-off, and how you validated the decision."
    }
  ];
}

function situationalQuestions(role: SeoRole): InterviewQuestion[] {
  return [
    {
      question: `If you joined a new team as a ${role.title} and found the existing processes broken, what would you do first?`,
      category: "situational",
      tip: "Show you would observe and listen before proposing changes. Mention building relationships with the team."
    },
    {
      question: `How would you handle a disagreement with a senior colleague about the right approach to a ${role.title} task?`,
      category: "situational",
      tip: "Demonstrate respectful pushback. Use data and evidence to support your view, but remain open-minded."
    },
    {
      question: `Imagine the requirements change dramatically halfway through a project. How do you adapt?`,
      category: "situational",
      tip: "Explain your process for reassessing priorities, communicating the impact, and re-planning."
    },
    {
      question: `How would you onboard a new team member into your ${role.title} workflow?`,
      category: "situational",
      tip: "Show empathy and structure. Mention documentation, pair sessions, and gradual ramp-up."
    },
    {
      question: `A critical ${role.keywords[0] ?? "deliverable"} is behind schedule. How do you communicate this to stakeholders?`,
      category: "situational",
      tip: "Be transparent about the delay. Present a revised timeline and what you need to get back on track."
    }
  ];
}

// ── Related roles ──────────────────────────────────────────────────────────

function findRelatedRoles(slug: string, allSlugs: string[]): string[] {
  const parts = slug.split("-");
  return allSlugs
    .filter((s) => s !== slug && parts.some((part) => part.length > 3 && s.includes(part)))
    .slice(0, 5);
}

// ── Public API ─────────────────────────────────────────────────────────────

export function getInterviewData(
  slug: string,
  allSlugs: string[]
): InterviewPageData | null {
  const role = getSeoRole(slug);

  if (!role) {
    return null;
  }

  return {
    slug: role.slug,
    title: role.title,
    description: `Top 15 ${role.title} interview questions with expert answer tips. Prepare for behavioral, technical, and situational rounds.`,
    questions: [
      ...behavioralQuestions(role),
      ...technicalQuestions(role),
      ...situationalQuestions(role)
    ],
    relatedRoles: findRelatedRoles(slug, allSlugs)
  };
}

