#!/usr/bin/env npx tsx
// ---------------------------------------------------------------------------
// ApplyX Bluesky Automation Bot (100% FREE — no paid API)
//
// Posts at a configurable interval about:
//   1. Blog articles on grow.applyx.space
//   2. Role-specific career tips (interview, salary, keywords, resume)
//   3. ApplyX product highlights
//
// Setup:
//   1. Create a Bluesky account at https://bsky.app
//   2. Go to Settings → App Passwords → Add App Password
//   3. Copy the app password
//   4. Set env vars (see below)
//
// Usage:
//   BSKY_HANDLE=youraccount.bsky.social  \
//   BSKY_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx  \
//   POST_INTERVAL_MINUTES=180  \
//   npx tsx scripts/post-bot.ts
//
// Or create .env.bluesky file (see env.bluesky.example)
//
// Commands:
//   npm run post           # Start loop (every 3 hours)
//   npm run post:dry       # Preview posts without sending
//   npm run post:once      # Send one post and exit
// ---------------------------------------------------------------------------

import { BskyAgent, RichText } from "@atproto/api";
import * as fs from "fs";
import * as path from "path";

// ── Config ────────────────────────────────────────────────────────────────

const ENV_FILE = path.resolve(__dirname, "../.env.bluesky");

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

const BSKY_HANDLE = process.env.BSKY_HANDLE ?? "";
const BSKY_APP_PASSWORD = process.env.BSKY_APP_PASSWORD ?? "";
const POST_INTERVAL_MINUTES = parseInt(process.env.POST_INTERVAL_MINUTES ?? "180", 10);
const POST_ONCE = process.env.POST_ONCE === "true";
const DRY_RUN = process.env.DRY_RUN === "true";
const BASE_URL = process.env.POST_BASE_URL ?? "https://grow.applyx.space";
const APPLYX_URL = "https://applyx.space";

// ── Validate credentials ─────────────────────────────────────────────────

function validateCredentials(): void {
  if (DRY_RUN) return;

  const missing: string[] = [];
  if (!BSKY_HANDLE) missing.push("BSKY_HANDLE");
  if (!BSKY_APP_PASSWORD) missing.push("BSKY_APP_PASSWORD");

  if (missing.length > 0) {
    console.error(`❌ Missing env vars: ${missing.join(", ")}`);
    console.error(`\nSetup (takes 2 minutes, 100% free):`);
    console.error(`  1. Create account at https://bsky.app`);
    console.error(`  2. Settings → App Passwords → Add App Password`);
    console.error(`  3. Create .env.bluesky with:`);
    console.error(`     BSKY_HANDLE=youraccount.bsky.social`);
    console.error(`     BSKY_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx`);
    process.exit(1);
  }
}

// ── Bluesky client ───────────────────────────────────────────────────────

async function createAgent(): Promise<BskyAgent> {
  const agent = new BskyAgent({ service: "https://bsky.social" });
  await agent.login({
    identifier: BSKY_HANDLE,
    password: BSKY_APP_PASSWORD,
  });
  console.log(`✅ Logged in as @${BSKY_HANDLE}`);
  return agent;
}

// ── Content library ──────────────────────────────────────────────────────
// Bluesky has a 300 character limit per post.
// URLs are displayed inline (not shortened like Twitter).
// We use RichText to create clickable links.

interface PostContent {
  text: string;
  url: string;
  /** Short label for the link (shown as link text) */
  linkLabel?: string;
}

// ─ Blog article posts ───────────────────────────────────────────────────

const BLOG_ARTICLES = [
  {
    slug: "how-to-pass-ats-screening",
    hooks: [
      "75% of resumes get rejected by ATS before a human sees them.\n\nHere's exactly how to beat it 👇",
      "Your resume isn't getting rejected because you're unqualified.\n\nIt's rejected because the ATS can't read it.",
      "ATS systems reject up to 75% of applicants. Most are qualified.\n\nHere's how to make sure yours gets through 👇",
    ],
  },
  {
    slug: "resume-format-2026",
    hooks: [
      "Your resume gets 7 seconds of human review — IF it passes the ATS.\n\nHere's the format that works in 2026 👇",
      "Stop using creative resume templates.\n\nThey look great to humans but ATS can't read them.",
      "One-column. Reverse chronological. Standard headings.\n\nThe resume format that passes ATS in 2026 👇",
    ],
  },
  {
    slug: "tailored-resume-vs-generic",
    hooks: [
      "Sending the same resume to every job?\n\nThat's why your response rate is 2%.\n\nTailored resumes get 3x more interviews.",
      "A generic resume matches ~40% of keywords.\nA tailored one matches ~85%.\n\nGuess which gets the interview.",
    ],
  },
  {
    slug: "job-search-strategy-2026",
    hooks: [
      "Average job search: 200 apps, 3-6 months.\nStrategic way: 50 apps, 15-30% interview rate.\n\nHere's the playbook 👇",
      "Stop spraying and praying.\n\n5-10 targeted applications/week beats 50 generic ones every time.",
    ],
  },
  {
    slug: "resume-action-verbs",
    hooks: [
      "\"Responsible for\" → \"Led\"\n\"Helped with\" → \"Drove\"\n\"Worked on\" → \"Built\"\n\nThe action verbs that get interviews 👇",
      "Every resume bullet should start with a power verb.\n\nHere are 150+ organized by impact category 👇",
    ],
  },
  {
    slug: "cover-letter-mistakes",
    hooks: [
      "83% of hiring managers say a great cover letter can land an interview even with an imperfect resume.\n\nBut most cover letters are terrible.",
      "\"I am writing to apply for...\"\n\nCongrats, you just wasted your opening line.\n\n10 cover letter mistakes to avoid 👇",
    ],
  },
  {
    slug: "remote-job-search-tips",
    hooks: [
      "Competition for remote roles is 3-5x higher than on-site.\n\nYour resume needs to be sharper than ever.\n\nRemote job search playbook 👇",
    ],
  },
  {
    slug: "career-change-resume",
    hooks: [
      "Switching careers? Your old keywords won't work.\n\nHere's how to translate your experience into a new industry's language 👇",
    ],
  },
];

function blogPosts(): PostContent[] {
  const posts: PostContent[] = [];
  for (const article of BLOG_ARTICLES) {
    for (const hook of article.hooks) {
      posts.push({
        text: hook,
        url: `${BASE_URL}/blog/${article.slug}`,
        linkLabel: "Read the full guide",
      });
    }
  }
  return posts;
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
  { slug: "machine-learning-engineer", title: "ML Engineer" },
  { slug: "full-stack-developer", title: "Full Stack Developer" },
  { slug: "backend-engineer", title: "Backend Engineer" },
  { slug: "qa-engineer", title: "QA Engineer" },
  { slug: "ai-engineer", title: "AI Engineer" },
  { slug: "recruiter", title: "Recruiter" },
  { slug: "financial-analyst", title: "Financial Analyst" },
  { slug: "business-analyst", title: "Business Analyst" },
  { slug: "customer-success-manager", title: "CSM" },
  { slug: "sales-development-representative", title: "SDR" },
];

type RoleType = typeof POPULAR_ROLES[0];

const ROLE_TEMPLATES: Array<(r: RoleType) => PostContent> = [
  (r) => ({
    text: `Interviewing for a ${r.title} role?\n\nWe compiled the top behavioral, technical & situational questions with tips 👇`,
    url: `${BASE_URL}/interview/${r.slug}`,
    linkLabel: `${r.title} interview questions`,
  }),
  (r) => ({
    text: `${r.title} interview coming up?\n\nHere are the questions you'll actually get asked (with how to answer each one) 👇`,
    url: `${BASE_URL}/interview/${r.slug}`,
    linkLabel: `${r.title} interview prep`,
  }),
  (r) => ({
    text: `What does a ${r.title} make in 2026?\n\nSalary bands by experience level + negotiation tips 👇`,
    url: `${BASE_URL}/salary/${r.slug}`,
    linkLabel: `${r.title} salary data`,
  }),
  (r) => ({
    text: `The exact ATS keywords every ${r.title} resume needs in 2026.\n\nRanked by priority 👇`,
    url: `${BASE_URL}/keywords/${r.slug}`,
    linkLabel: `${r.title} resume keywords`,
  }),
  (r) => ({
    text: `Missing these keywords? Your ${r.title} resume is getting filtered out.\n\nThe complete keyword list 👇`,
    url: `${BASE_URL}/keywords/${r.slug}`,
    linkLabel: `${r.title} ATS keywords`,
  }),
  (r) => ({
    text: `${r.title} resume guide:\n\n✅ Structure\n✅ Keywords\n✅ Example bullets\n✅ ATS tips`,
    url: `${BASE_URL}/resume/${r.slug}`,
    linkLabel: `${r.title} resume template`,
  }),
];

function rolePosts(): PostContent[] {
  const posts: PostContent[] = [];
  for (const role of POPULAR_ROLES) {
    for (const template of ROLE_TEMPLATES) {
      posts.push(template(role));
    }
  }
  return posts;
}

// ─ ApplyX product posts ─────────────────────────────────────────────────

function productPosts(): PostContent[] {
  return [
    {
      text: "Applying to jobs is a numbers game.\n\nBut sending 200 identical resumes isn't strategy — it's spam.\n\nApplyX tailors your resume to each JD using AI. 3 free tailors/month.",
      url: APPLYX_URL,
      linkLabel: "Try ApplyX free",
    },
    {
      text: "Most people: 2 hours tailoring one resume.\n\nApplyX users: paste the JD, get a tailored resume in 10 seconds.\n\nFree tier: 3/month.",
      url: APPLYX_URL,
      linkLabel: "Try ApplyX",
    },
    {
      text: "\"I applied to 150 jobs and heard nothing.\"\n\nYour resume was probably the same for all 150.\n\nTailored resumes get 3x more callbacks. ApplyX makes it instant.",
      url: APPLYX_URL,
      linkLabel: "Try ApplyX free",
    },
    {
      text: "Your resume should score 70%+ ATS match for every application.\n\nThat means tailoring every time.\n\nApplyX automates this — paste JD, get tailored resume.",
      url: APPLYX_URL,
      linkLabel: "Try ApplyX",
    },
    {
      text: "Career changers: your old resume keywords don't work for the new role.\n\nApplyX rewrites your bullets with the right keywords. Free to try.",
      url: APPLYX_URL,
      linkLabel: "Try ApplyX free",
    },
    {
      text: "Interview prep, salary data, resume keywords for 130+ roles.\n\nAll free. Then let ApplyX tailor your actual resume.",
      url: BASE_URL,
      linkLabel: "Browse free resources",
    },
  ];
}

// ─ General career tip posts ─────────────────────────────────────────────

function tipPosts(): PostContent[] {
  return [
    {
      text: "Resume tip:\n\nDon't write \"Responsible for managing team\"\n\nWrite \"Led 8-person team, delivering 12 features in Q3 — 40% above target\"\n\nNumbers > vague descriptions.",
      url: `${BASE_URL}/blog/resume-action-verbs`,
      linkLabel: "150+ action verbs for your resume",
    },
    {
      text: "ATS tip:\n\nIf the JD says \"project management\" — write \"project management\" on your resume.\n\nNot \"managed projects.\"\nNot \"project lead.\"\n\nExact match = ATS match.",
      url: `${BASE_URL}/blog/how-to-pass-ats-screening`,
      linkLabel: "Full ATS guide",
    },
    {
      text: "The #1 resume mistake:\n\nCreative templates with columns, icons, and graphics.\n\nHumans love them. ATS can't read them.\n\nStick to single-column, standard headings.",
      url: `${BASE_URL}/blog/resume-format-2026`,
      linkLabel: "Best resume format 2026",
    },
    {
      text: "Your resume summary should have:\n\n→ Job title\n→ Years of experience\n→ 3-4 keywords from the JD\n→ A measurable achievement\n\nAll in 2-3 sentences.",
      url: `${BASE_URL}/resume/software-engineer`,
      linkLabel: "Resume guide with examples",
    },
    {
      text: "Skills section tip:\n\nList keywords from the job description first.\n\nATS scans skills sections before experience.\n\nPut the most important terms where the machine looks first.",
      url: `${BASE_URL}/keywords/software-engineer`,
      linkLabel: "ATS keywords by role",
    },
    {
      text: "Interview tip:\n\nPrepare 3-5 STAR stories before any interview.\n\nSituation → Task → Action → Result\n\nYou can adapt the same stories for different behavioral questions.",
      url: `${BASE_URL}/interview/software-engineer`,
      linkLabel: "Interview prep by role",
    },
    {
      text: "Salary negotiation tip:\n\nNever give a number first.\n\n\"I'd love to understand the full compensation range for this role.\"\n\nThis works every time.",
      url: `${BASE_URL}/salary/software-engineer`,
      linkLabel: "Salary data by role",
    },
    {
      text: "Follow-up tip:\n\nApplied 5 days ago, no response?\n\nSend a brief, professional check-in email.\n\nIt bumps your application back to the top of the pile.",
      url: `${BASE_URL}/blog/job-search-strategy-2026`,
      linkLabel: "Full job search strategy",
    },
  ];
}

// ── Post queue management ────────────────────────────────────────────────

const STATE_FILE = path.resolve(__dirname, "../.post-state.json");

interface PostState {
  usedIndices: number[];
  totalPool: number;
  lastPostAt: string | null;
  postCount: number;
}

function loadState(): PostState {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
    }
  } catch {
    // Corrupted state, start fresh
  }
  return { usedIndices: [], totalPool: 0, lastPostAt: null, postCount: 0 };
}

function saveState(state: PostState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function buildFullPool(): PostContent[] {
  return [
    ...blogPosts(),
    ...rolePosts(),
    ...productPosts(),
    ...tipPosts(),
  ];
}

function pickNextPost(pool: PostContent[], state: PostState): { post: PostContent; index: number } {
  // If pool size changed (new content added), reset
  if (state.totalPool !== pool.length) {
    state.usedIndices = [];
    state.totalPool = pool.length;
  }

  // If all used, reset
  if (state.usedIndices.length >= pool.length) {
    console.log("🔄 All posts used — resetting pool");
    state.usedIndices = [];
  }

  // Pick random unused index
  const available = pool
    .map((_, i) => i)
    .filter((i) => !state.usedIndices.includes(i));

  const randomIdx = available[Math.floor(Math.random() * available.length)]!;
  return { post: pool[randomIdx]!, index: randomIdx };
}

// ── Bluesky post with rich link ──────────────────────────────────────────

async function sendPost(
  agent: BskyAgent | null,
  pool: PostContent[],
  state: PostState
): Promise<void> {
  const { post, index } = pickNextPost(pool, state);

  // Build text with link appended
  const fullText = `${post.text}\n\n${post.url}`;

  console.log(`\n📝 Post #${state.postCount + 1} (pool index ${index}):`);
  console.log(`─────────────────────────────────────`);
  console.log(fullText);
  console.log(`─────────────────────────────────────`);
  console.log(`   chars: ${fullText.length}/300`);

  if (DRY_RUN || !agent) {
    console.log("🏜️  DRY RUN — post not sent");
  } else {
    try {
      // Use RichText to detect and create link facets automatically
      const rt = new RichText({ text: fullText });
      await rt.detectFacets(agent);

      await agent.post({
        text: rt.text,
        facets: rt.facets,
        // Embed a link card for the URL
        embed: {
          $type: "app.bsky.embed.external",
          external: {
            uri: post.url,
            title: post.linkLabel ?? "Read more",
            description: `Free career resources at ${new URL(post.url).hostname}`,
          },
        },
      });
      console.log(`✅ Posted to Bluesky!`);
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (error.status === 429) {
        console.error("⏳ Rate limited — will retry next interval");
        return; // Don't mark as used
      }
      console.error("❌ Failed to post:", error.message ?? err);
      return; // Don't mark as used
    }
  }

  state.usedIndices.push(index);
  state.lastPostAt = new Date().toISOString();
  state.postCount++;
  saveState(state);

  console.log(
    `📊 Stats: ${state.usedIndices.length}/${pool.length} posts used | Total sent: ${state.postCount}`
  );
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("🦋 ApplyX Bluesky Bot (FREE — no API costs)");
  console.log(`   Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  console.log(`   Interval: ${POST_INTERVAL_MINUTES} minutes`);
  console.log(`   Base URL: ${BASE_URL}`);

  validateCredentials();

  const pool = buildFullPool();
  const state = loadState();

  console.log(`   Pool size: ${pool.length} unique posts`);
  console.log(`   Already used: ${state.usedIndices.length}`);
  console.log(`   Total posted: ${state.postCount}`);

  let agent: BskyAgent | null = null;
  if (!DRY_RUN) {
    agent = await createAgent();
  }

  if (POST_ONCE) {
    await sendPost(agent, pool, state);
    return;
  }

  // Initial post
  await sendPost(agent, pool, state);

  // Schedule recurring posts
  const intervalMs = POST_INTERVAL_MINUTES * 60 * 1000;
  console.log(`\n⏰ Next post in ${POST_INTERVAL_MINUTES} minutes...`);

  setInterval(async () => {
    try {
      // Re-login if session expired (sessions last ~2hrs)
      if (!DRY_RUN) {
        try {
          await agent!.getProfile({ actor: BSKY_HANDLE });
        } catch {
          console.log("🔄 Session expired, re-logging in...");
          agent = await createAgent();
        }
      }

      await sendPost(agent, pool, state);
      console.log(`\n⏰ Next post in ${POST_INTERVAL_MINUTES} minutes...`);
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      console.log(`\n⏰ Will retry in ${POST_INTERVAL_MINUTES} minutes...`);
    }
  }, intervalMs);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

