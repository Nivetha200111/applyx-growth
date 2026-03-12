const STOP_WORDS = new Set([
  "about",
  "after",
  "also",
  "among",
  "and",
  "are",
  "been",
  "build",
  "building",
  "candidate",
  "candidates",
  "can",
  "company",
  "cross",
  "data",
  "deliver",
  "delivering",
  "for",
  "from",
  "have",
  "highly",
  "into",
  "job",
  "knowledge",
  "looking",
  "must",
  "our",
  "partner",
  "role",
  "skills",
  "strong",
  "team",
  "that",
  "the",
  "their",
  "them",
  "they",
  "this",
  "using",
  "will",
  "with",
  "work",
  "working",
  "years",
  "your"
]);

export type AtsScoreResult = {
  score: number;
  keywordMatchPercent: number;
  extractedKeywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#./ -]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isUsefulToken(token: string): boolean {
  return token.length >= 3 && !STOP_WORDS.has(token) && !/^\d+$/.test(token);
}

export function extractKeywords(jobDescription: string): string[] {
  const normalized = normalizeText(jobDescription);

  if (!normalized) {
    return [];
  }

  const tokens = normalized.split(" ").filter(isUsefulToken);
  const counts = new Map<string, number>();

  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return right[0].length - left[0].length;
    })
    .map(([token]) => token)
    .slice(0, 25);
}

function hasKeyword(text: string, keyword: string): boolean {
  return new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i").test(text);
}

function buildRecommendations(missingKeywords: string[], score: number): string[] {
  if (missingKeywords.length === 0) {
    return [
      "Your resume already mirrors the job description well. Focus next on quantified outcomes and clean formatting.",
      "Keep the strongest job-title keywords in your summary and most recent experience entries."
    ];
  }

  const topMissing = missingKeywords.slice(0, 5).join(", ");
  const recommendations = [
    `Add the most important missing keywords to relevant experience bullets: ${topMissing}.`,
    "Use the same terminology as the job description in your summary, skills, and recent project sections.",
    "Pair missing keywords with measurable impact so the resume stays credible and ATS-friendly."
  ];

  if (score < 50) {
    recommendations.push("Rewrite older bullets to better match the target role before applying.");
  }

  return recommendations;
}

export function scoreResume(resumeText: string, jobDescription: string): AtsScoreResult {
  const normalizedResume = normalizeText(resumeText);
  const extractedKeywords = extractKeywords(jobDescription);

  if (extractedKeywords.length === 0) {
    return {
      score: 0,
      keywordMatchPercent: 0,
      extractedKeywords: [],
      matchedKeywords: [],
      missingKeywords: [],
      recommendations: [
        "Add a richer job description so the checker can extract target keywords.",
        "Paste the full resume text so the ATS checker has enough context to score."
      ]
    };
  }

  const matchedKeywords = extractedKeywords.filter((keyword) =>
    hasKeyword(normalizedResume, keyword)
  );
  const missingKeywords = extractedKeywords.filter(
    (keyword) => !matchedKeywords.includes(keyword)
  );
  const keywordMatchPercent = Math.round(
    (matchedKeywords.length / extractedKeywords.length) * 100
  );

  return {
    score: keywordMatchPercent,
    keywordMatchPercent,
    extractedKeywords,
    matchedKeywords,
    missingKeywords,
    recommendations: buildRecommendations(missingKeywords, keywordMatchPercent)
  };
}

