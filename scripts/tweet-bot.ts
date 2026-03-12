#!/usr/bin/env npx tsx
// ---------------------------------------------------------------------------
// ApplyX Twitter Automation Bot
//
// Tweets at a configurable interval about:
//   1. Blog articles on grow.applyx.space
//   2. Role-specific career tips (interview, salary, keywords, resume)
//   3. ApplyX product highlights
//
// Usage:
//   TWITTER_API_KEY=...  \
//   TWITTER_API_SECRET=...  \
//   TWITTER_ACCESS_TOKEN=...  \
//   TWITTER_ACCESS_SECRET=...  \
//   TWEET_INTERVAL_MINUTES=180  \
//   npx tsx scripts/tweet-bot.ts
//
// Or with .env.twitter file:
//   npx tsx scripts/tweet-bot.ts
//
// To run once (single tweet, no loop):
//   TWEET_ONCE=true npx tsx scripts/tweet-bot.ts
// ---------------------------------------------------------------------------

import { TwitterApi } from "twitter-api-v2";
import * as fs from "fs";
import * as path from "path";

// ── Config ────────────────────────────────────────────────────────────────

const ENV_FILE = path.resolve(__dirname, "../.env.twitter");

function loadEnvFile(): void {
  if (fs.existsSync(ENV_FILE)) {
    const lines = fs.readFileSync(ENV_FILE, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

loadEnvFile();

const TWITTER_API_KEY = process.env.TWITTER_API_KEY ?? "";
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET ?? "";
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN ?? "";
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET ?? "";
const TWEET_INTERVAL_MINUTES = parseInt(process.env.TWEET_INTERVAL_MINUTES ?? "180", 10);
const TWEET_ONCE = process.env.TWEET_ONCE === "true";
const DRY_RUN = process.env.DRY_RUN === "true";
const BASE_URL = process.env.TWEET_BASE_URL ?? "https://grow.applyx.space";
const APPLYX_URL = "https://applyx.space";

// ── Validate credentials ─────────────────────────────────────────────────

function validateCredentials(): void {
  const missing: string[] = [];
  if (!TWITTER_API_KEY) missing.push("TWITTER_API_KEY");
  if (!TWITTER_API_SECRET) missing.push("TWITTER_API_SECRET");
  if (!TWITTER_ACCESS_TOKEN) missing.push("TWITTER_ACCESS_TOKEN");
  if (!TWITTER_ACCESS_SECRET) missing.push("TWITTER_ACCESS_SECRET");

  if (missing.length > 0 && !DRY_RUN) {
    console.error(`❌ Missing env vars: ${missing.join(", ")}`);
    console.error(`\nSet them in .env.twitter or as environment variables.`);
    console.error(`\nTo get these credentials:`);
    console.error(`  1. Go to https://developer.x.com/en/portal/dashboard`);
    console.error(`  2. Create a project + app (Free tier is fine)`);
    console.error(`  3. Under "Keys and tokens" get:`);
    console.error(`     - API Key & Secret (Consumer Keys)`);
    console.error(`     - Access Token & Secret (with Read+Write)`);
    process.exit(1);
  }
}

// ── Twitter client ───────────────────────────────────────────────────────

function createClient(): TwitterApi {
  return new TwitterApi({
    appKey: TWITTER_API_KEY,
    appSecret: TWITTER_API_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_SECRET,
  });
}

// ── Content library ──────────────────────────────────────────────────────
// All the tweet templates. Each function returns a { text, url } pair.
// The bot cycles through these randomly without repeating until all used.

interface TweetContent {
  text: string;
  url: string;
}

// ─ Blog article tweets ──────────────────────────────────────────────────

const BLOG_ARTICLES = [
  {
    slug: "how-to-pass-ats-screening",
    title: "How to Pass ATS Screening in 2026",
    hooks: [
      "75% of resumes get rejected by ATS before a human sees them.\n\nHere's exactly how to beat it →",
      "Your resume isn't getting rejected because you're unqualified.\n\nIt's getting rejected because the ATS can't read it.\n\nThe complete guide →",
      "ATS systems reject up to 75% of applicants.\n\nMost of them are qualified.\n\nHere's how to make sure yours gets through →",
    ],
  },
  {
    slug: "resume-format-2026",
    title: "The Best Resume Format for 2026",
    hooks: [
      "Your resume gets 7 seconds of human review — IF it passes the ATS.\n\nHere's the format that works in 2026 →",
      "Stop using creative resume templates.\n\nThey look great to humans but are unreadable by ATS.\n\nThe format that actually gets interviews →",
      "One-column. Reverse chronological. Standard headings.\n\nThis is the resume format that passes ATS in 2026 →",
    ],
  },
  {
    slug: "tailored-resume-vs-generic",
    title: "Tailored vs Generic Resume",
    hooks: [
      "Sending the same resume to every job?\n\nThat's why your response rate is 2%.\n\nTailored resumes get 3x more interviews →",
      "A generic resume matches ~40% of keywords.\nA tailored one matches ~85%.\n\nGuess which one gets the interview →",
      "The #1 reason for low callback rates:\n\nOne resume for every application.\n\nHere's why it doesn't work (and what to do instead) →",
    ],
  },
  {
    slug: "job-search-strategy-2026",
    title: "Job Search Strategy 2026",
    hooks: [
      "The average job search: 200 applications, 3-6 months.\n\nThe strategic way: 50 applications, 15-30% interview rate.\n\nHere's the playbook →",
      "Stop spraying and praying.\n\n5-10 targeted applications/week beats 50 generic ones every time.\n\nThe full strategy →",
      "Most job seekers apply to 200+ jobs with the same resume.\n\nStrategic seekers apply to 50 and get 3x more interviews.\n\nHere's how →",
    ],
  },
  {
    slug: "resume-action-verbs",
    title: "150+ Resume Action Verbs",
    hooks: [
      "\"Responsible for\" → \"Led\"\n\"Helped with\" → \"Drove\"\n\"Worked on\" → \"Built\"\n\nThe action verbs that get interviews →",
      "Every resume bullet should start with a power verb.\n\nHere are 150+ organized by impact category →",
      "Weak: \"Assisted with project management\"\nStrong: \"Orchestrated 12 cross-functional launches\"\n\n150+ action verbs to upgrade your resume →",
    ],
  },
  {
    slug: "cover-letter-mistakes",
    title: "10 Cover Letter Mistakes",
    hooks: [
      "83% of hiring managers say a great cover letter can land you an interview even with an imperfect resume.\n\nBut most cover letters are terrible.\n\nThe 10 mistakes to avoid →",
      "\"I am writing to apply for...\"\n\nCongrats, you just wasted your opening line.\n\n10 cover letter mistakes that kill applications →",
    ],
  },
  {
    slug: "remote-job-search-tips",
    title: "How to Find Remote Jobs in 2026",
    hooks: [
      "Competition for remote roles is 3-5x higher than on-site.\n\nYour resume needs to be sharper than ever.\n\nThe remote job search playbook →",
      "28% of roles are fully remote in 2026.\n\nHere's how to stand out in the most competitive job market →",
    ],
  },
  {
    slug: "career-change-resume",
    title: "Career Change Resume Guide",
    hooks: [
      "Switching careers? Your old keywords won't work.\n\nHere's how to translate your experience into a new industry's language →",
      "Career changers face a unique ATS problem: wrong keywords.\n\nHere's the strategic resume structure that works →",
    ],
  },
];

function blogTweets(): TweetContent[] {
  const tweets: TweetContent[] = [];
  for (const article of BLOG_ARTICLES) {
    for (const hook of article.hooks) {
      tweets.push({
        text: hook,
        url: `${BASE_URL}/blog/${article.slug}`,
      });
    }
  }
  return tweets;
}

// ─ Role-specific career tips ────────────────────────────────────────────

const POPULAR_ROLES = [
  { slug: "software-engineer", title: "Software Engineer" },
  { slug: "data-scientist", title: "Data Scientist" },
  { slug: "product-manager", title: "Product Manager" },
  { slug: "frontend-developer", title: "Frontend Developer" },
  { slug: "data-analyst", title: "Data Analyst" },
  { slug: "ux-designer", title: "UX Designer" },
  { slug: "devops-engineer", title: "DevOps Engineer" },
  { slug: "marketing-manager", title: "Marketing Manager" },
  { slug: "project-manager", title: "Project Manager" },
  { slug: "account-executive", title: "Account Executive" },
  { slug: "machine-learning-engineer", title: "Machine Learning Engineer" },
  { slug: "full-stack-developer", title: "Full Stack Developer" },
  { slug: "backend-engineer", title: "Backend Engineer" },
  { slug: "qa-engineer", title: "QA Engineer" },
  { slug: "sales-development-representative", title: "Sales Development Rep" },
  { slug: "customer-success-manager", title: "Customer Success Manager" },
  { slug: "ai-engineer", title: "AI Engineer" },
  { slug: "recruiter", title: "Recruiter" },
  { slug: "financial-analyst", title: "Financial Analyst" },
  { slug: "business-analyst", title: "Business Analyst" },
];

const ROLE_TEMPLATES = [
  // Interview
  (r: typeof POPULAR_ROLES[0]) => ({
    text: `Interviewing for a ${r.title} role?\n\nWe compiled the top behavioral, technical & situational questions with expert tips →`,
    url: `${BASE_URL}/interview/${r.slug}`,
  }),
  (r: typeof POPULAR_ROLES[0]) => ({
    text: `${r.title} interview coming up?\n\nHere are the questions you'll actually get asked (with how to answer each one) →`,
    url: `${BASE_URL}/interview/${r.slug}`,
  }),
  // Salary
  (r: typeof POPULAR_ROLES[0]) => ({
    text: `What does a ${r.title} make in 2026?\n\nSalary bands by experience level + negotiation tips →`,
    url: `${BASE_URL}/salary/${r.slug}`,
  }),
  (r: typeof POPULAR_ROLES[0]) => ({
    text: `${r.title} salary data (2026):\n\nEntry → Mid → Senior → Staff ranges\n+ what drives higher pay →`,
    url: `${BASE_URL}/salary/${r.slug}`,
  }),
  // Keywords
  (r: typeof POPULAR_ROLES[0]) => ({
    text: `The exact ATS keywords every ${r.title} resume needs in 2026.\n\nRanked by priority →`,
    url: `${BASE_URL}/keywords/${r.slug}`,
  }),
  (r: typeof POPULAR_ROLES[0]) => ({
    text: `Missing these keywords? Your ${r.title} resume is getting filtered out.\n\nThe complete list →`,
    url: `${BASE_URL}/keywords/${r.slug}`,
  }),
  // Resume
  (r: typeof POPULAR_ROLES[0]) => ({
    text: `${r.title} resume guide:\n\n✅ Structure\n✅ Keywords\n✅ Example bullets\n✅ ATS tips\n\nFull template →`,
    url: `${BASE_URL}/resume/${r.slug}`,
  }),
];

function roleTweets(): TweetContent[] {
  const tweets: TweetContent[] = [];
  for (const role of POPULAR_ROLES) {
    for (const template of ROLE_TEMPLATES) {
      tweets.push(template(role));
    }
  }
  return tweets;
}

// ─ ApplyX product tweets ────────────────────────────────────────────────

function productTweets(): TweetContent[] {
  return [
    {
      text: "Applying to jobs is a numbers game.\n\nBut sending 200 identical resumes isn't strategy — it's spam.\n\nApplyX reads the job description and tailors your resume automatically using AI.\n\n3 free tailors/month. No credit card.",
      url: APPLYX_URL,
    },
    {
      text: "The resume you send to a backend engineer role shouldn't look like the one you send to a DevOps role.\n\nApplyX tailors your resume for each job description in seconds →",
      url: APPLYX_URL,
    },
    {
      text: "Most people: spend 2 hours tailoring one resume.\n\nApplyX users: paste the JD, get a tailored resume in 10 seconds.\n\nFree tier: 3/month →",
      url: APPLYX_URL,
    },
    {
      text: "\"I applied to 150 jobs and heard nothing.\"\n\nYour resume was probably the same for all 150.\n\nTailored resumes get 3x more callbacks.\n\nApplyX makes it instant →",
      url: APPLYX_URL,
    },
    {
      text: "Your resume should score 70%+ ATS match for every application.\n\nThat means tailoring it every time.\n\nApplyX automates this → paste JD, get tailored resume.",
      url: APPLYX_URL,
    },
    {
      text: "Career changers: your old resume keywords don't work for the new role.\n\nApplyX reads the new job description and rewrites your bullets with the right keywords.\n\nFree to try →",
      url: APPLYX_URL,
    },
    {
      text: "Stop guessing which keywords to add.\n\nApplyX reads the job description and tailors your resume automatically.\n\nYour ATS score goes from 40% → 85%+ →",
      url: APPLYX_URL,
    },
    {
      text: "Interview prep, salary data, resume keywords for 130+ roles.\n\nAll free on grow.applyx.space\n\nThen let ApplyX tailor your actual resume →",
      url: BASE_URL,
    },
  ];
}

// ─ General career tip tweets ────────────────────────────────────────────

function tipTweets(): TweetContent[] {
  return [
    {
      text: "Resume tip:\n\nDon't write \"Responsible for managing team\"\n\nWrite \"Led 8-person engineering team, delivering 12 features in Q3 — 40% above target\"\n\nNumbers > vague descriptions\n\nMore resume tips →",
      url: `${BASE_URL}/blog/resume-action-verbs`,
    },
    {
      text: "ATS tip:\n\nIf the job description says \"project management\" — write \"project management\" on your resume.\n\nNot \"managed projects.\"\nNot \"project lead.\"\n\nExact match = ATS match.\n\nFull guide →",
      url: `${BASE_URL}/blog/how-to-pass-ats-screening`,
    },
    {
      text: "The #1 resume mistake:\n\nUsing creative templates with columns, icons, and graphics.\n\nHumans love them.\nATS systems can't read them.\n\nStick to single-column, standard headings →",
      url: `${BASE_URL}/blog/resume-format-2026`,
    },
    {
      text: "Your resume summary should have:\n\n→ Your job title\n→ Years of experience\n→ 3-4 keywords from the job description\n→ A measurable achievement\n\nAll in 2-3 sentences. That's it.",
      url: `${BASE_URL}/resume/software-engineer`,
    },
    {
      text: "Skills section tip:\n\nList keywords from the job description first.\n\nATS systems scan skills sections before experience.\n\nPut the most important terms where the machine looks first.",
      url: `${BASE_URL}/keywords/software-engineer`,
    },
    {
      text: "Interview tip:\n\nPrepare 3-5 STAR stories before any interview.\n\nSituation → Task → Action → Result\n\nYou can adapt the same stories for different behavioral questions.\n\nPrep for your role →",
      url: `${BASE_URL}/interview/software-engineer`,
    },
    {
      text: "Salary negotiation tip:\n\nNever give a number first.\n\n\"I'd love to understand the full compensation range for this role before sharing expectations.\"\n\nThis works every time.\n\nSee salary data by role →",
      url: `${BASE_URL}/salary/software-engineer`,
    },
    {
      text: "Follow-up tip:\n\nApplied 5 days ago and no response?\n\nSend a brief, professional check-in email.\n\nIt bumps your application back to the top of the pile.\n\nFull job search strategy →",
      url: `${BASE_URL}/blog/job-search-strategy-2026`,
    },
  ];
}

// ── Tweet queue management ───────────────────────────────────────────────

const STATE_FILE = path.resolve(__dirname, "../.tweet-state.json");

interface TweetState {
  usedIndices: number[];
  totalPool: number;
  lastTweetAt: string | null;
  tweetCount: number;
}

function loadState(): TweetState {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
    }
  } catch {
    // Corrupted state, start fresh
  }
  return { usedIndices: [], totalPool: 0, lastTweetAt: null, tweetCount: 0 };
}

function saveState(state: TweetState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function buildFullPool(): TweetContent[] {
  return [
    ...blogTweets(),
    ...roleTweets(),
    ...productTweets(),
    ...tipTweets(),
  ];
}

function pickNextTweet(pool: TweetContent[], state: TweetState): { tweet: TweetContent; index: number } {
  // If pool size changed (new content added), reset
  if (state.totalPool !== pool.length) {
    state.usedIndices = [];
    state.totalPool = pool.length;
  }

  // If all used, reset
  if (state.usedIndices.length >= pool.length) {
    state.usedIndices = [];
  }

  // Pick random unused index
  const available = pool
    .map((_, i) => i)
    .filter((i) => !state.usedIndices.includes(i));

  const randomIdx = available[Math.floor(Math.random() * available.length)]!;
  return { tweet: pool[randomIdx]!, index: randomIdx };
}

function formatTweet(content: TweetContent): string {
  // Twitter limit is 280 chars. URL takes 23 chars (t.co shortened).
  // We need: text + \n\n + url = text.length + 2 + 23 ≤ 280
  // So text max = 255 chars
  const maxTextLen = 255;
  let text = content.text;
  if (text.length > maxTextLen) {
    text = text.slice(0, maxTextLen - 1) + "…";
  }
  return `${text}\n\n${content.url}`;
}

// ── Main ─────────────────────────────────────────────────────────────────

async function sendTweet(client: TwitterApi, pool: TweetContent[], state: TweetState): Promise<void> {
  const { tweet, index } = pickNextTweet(pool, state);
  const formatted = formatTweet(tweet);

  console.log(`\n📝 Tweet #${state.tweetCount + 1} (pool index ${index}):`);
  console.log(`─────────────────────────────────────`);
  console.log(formatted);
  console.log(`─────────────────────────────────────`);
  console.log(`   chars: ${formatted.length}/280`);

  if (DRY_RUN) {
    console.log("🏜️  DRY RUN — tweet not sent");
  } else {
    try {
      const result = await client.v2.tweet(formatted);
      console.log(`✅ Tweeted! ID: ${result.data.id}`);
    } catch (err: unknown) {
      const error = err as { code?: number; data?: { detail?: string } };
      if (error.code === 429) {
        console.error("⏳ Rate limited — will retry next interval");
        return; // Don't mark as used
      }
      console.error("❌ Failed to tweet:", error.data?.detail ?? err);
      return; // Don't mark as used
    }
  }

  state.usedIndices.push(index);
  state.lastTweetAt = new Date().toISOString();
  state.tweetCount++;
  saveState(state);

  console.log(`📊 Stats: ${state.usedIndices.length}/${pool.length} tweets used | Total sent: ${state.tweetCount}`);
}

async function main(): Promise<void> {
  console.log("🐦 ApplyX Tweet Bot");
  console.log(`   Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  console.log(`   Interval: ${TWEET_INTERVAL_MINUTES} minutes`);
  console.log(`   Base URL: ${BASE_URL}`);

  validateCredentials();

  const client = DRY_RUN ? (null as unknown as TwitterApi) : createClient();
  const pool = buildFullPool();
  const state = loadState();

  console.log(`   Pool size: ${pool.length} unique tweets`);
  console.log(`   Already used: ${state.usedIndices.length}`);
  console.log(`   Total tweeted: ${state.tweetCount}`);

  if (TWEET_ONCE) {
    await sendTweet(client, pool, state);
    return;
  }

  // Initial tweet
  await sendTweet(client, pool, state);

  // Schedule recurring tweets
  const intervalMs = TWEET_INTERVAL_MINUTES * 60 * 1000;
  console.log(`\n⏰ Next tweet in ${TWEET_INTERVAL_MINUTES} minutes...`);

  setInterval(async () => {
    try {
      await sendTweet(client, pool, state);
      console.log(`\n⏰ Next tweet in ${TWEET_INTERVAL_MINUTES} minutes...`);
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      console.log(`\n⏰ Will retry in ${TWEET_INTERVAL_MINUTES} minutes...`);
    }
  }, intervalMs);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

