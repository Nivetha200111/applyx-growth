#!/usr/bin/env npx tsx
// ---------------------------------------------------------------------------
// ApplyX Reddit Automation Bot (FREE Reddit API)
//
// Posts genuinely helpful career content to job-seeker subreddits with
// natural links back to grow.applyx.space. Reddit is community-first —
// posts are text-heavy with real value, not link spam.
//
// Setup:
//   1. Create/use a Reddit account
//   2. Go to https://www.reddit.com/prefs/apps
//   3. Click "create another app..." at the bottom
//   4. Select "script", give it a name, set redirect URI to http://localhost
//   5. Note the client ID (under the app name) and secret
//   6. Set env vars below
//
// Usage:
//   npm run reddit           # Start loop (posts every 4 hours)
//   npm run reddit:dry       # Preview posts without sending
//   npm run reddit:once      # Post once and exit
// ---------------------------------------------------------------------------

import Snoowrap from "snoowrap";
import * as fs from "fs";
import * as path from "path";

// ── Config ────────────────────────────────────────────────────────────────

const ENV_FILE = path.resolve(__dirname, "../.env.reddit");

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

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID ?? "";
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET ?? "";
const REDDIT_USERNAME = process.env.REDDIT_USERNAME ?? "";
const REDDIT_PASSWORD = process.env.REDDIT_PASSWORD ?? "";
const REDDIT_INTERVAL_MINUTES = parseInt(process.env.REDDIT_INTERVAL_MINUTES ?? "240", 10);
const POST_ONCE = process.env.POST_ONCE === "true";
const DRY_RUN = process.env.DRY_RUN === "true";
const BASE_URL = process.env.REDDIT_BASE_URL ?? "https://grow.applyx.space";
const APPLYX_URL = "https://applyx.space";

// ── Validate ─────────────────────────────────────────────────────────────

function validateCredentials(): void {
  if (DRY_RUN) return;

  const missing: string[] = [];
  if (!REDDIT_CLIENT_ID) missing.push("REDDIT_CLIENT_ID");
  if (!REDDIT_CLIENT_SECRET) missing.push("REDDIT_CLIENT_SECRET");
  if (!REDDIT_USERNAME) missing.push("REDDIT_USERNAME");
  if (!REDDIT_PASSWORD) missing.push("REDDIT_PASSWORD");

  if (missing.length > 0) {
    console.error(`❌ Missing env vars: ${missing.join(", ")}`);
    console.error(`\nSetup (free, 3 minutes):`);
    console.error(`  1. Go to https://www.reddit.com/prefs/apps`);
    console.error(`  2. Click "create another app..." at the bottom`);
    console.error(`  3. Select "script", name it, redirect URI = http://localhost`);
    console.error(`  4. Copy client ID (under app name) and secret`);
    console.error(`  5. Create .env.reddit with your credentials`);
    process.exit(1);
  }
}

// ── Reddit client ────────────────────────────────────────────────────────

function createClient(): Snoowrap {
  return new Snoowrap({
    userAgent: "applyx-career-tips/1.0 (by /u/" + REDDIT_USERNAME + ")",
    clientId: REDDIT_CLIENT_ID,
    clientSecret: REDDIT_CLIENT_SECRET,
    username: REDDIT_USERNAME,
    password: REDDIT_PASSWORD,
  });
}

// ── Content library ──────────────────────────────────────────────────────
// Reddit requires genuinely helpful, text-heavy posts.
// Links are embedded naturally in the body or as "source" references.
// Each post targets a specific subreddit that matches the content.

interface RedditPost {
  subreddit: string;
  title: string;
  body: string;
  /** "self" for text post, "link" for link post */
  kind: "self" | "link";
  url?: string; // Only for link posts
}

// ── Subreddit targets ────────────────────────────────────────────────────

// These subreddits allow helpful career content:
const SUBREDDITS = {
  resumes: "resumes",           // Resume help and reviews
  jobs: "jobs",                 // General job seeking
  career: "careerguidance",     // Career advice
  cscareer: "cscareerquestions",// CS/tech career questions
  getEmployed: "GetEmployed",   // Getting hired
  jobsearch: "jobsearchhacks",
};

// ── Post templates ───────────────────────────────────────────────────────
// All posts are text-heavy, genuinely helpful, with links as sources.

function allPosts(): RedditPost[] {
  return [
    // ── ATS / Resume tips ──────────────────────────────────────────────

    {
      subreddit: SUBREDDITS.resumes,
      title: "I analyzed how ATS systems actually filter resumes — here's what I found",
      kind: "self",
      body: `I spent a lot of time researching how ATS (Applicant Tracking Systems) actually work, and wanted to share the key takeaways that most people get wrong.

**How ATS actually filters your resume:**

1. It parses your resume text and extracts keywords
2. It compares those keywords against the job description
3. It ranks you by match percentage
4. Below ~60% match = auto-rejected before a human sees it

**The 5 biggest mistakes I see:**

- **Using creative templates** with columns, icons, or graphics. ATS can't read them. Stick to single-column, standard headings.
- **Not mirroring exact JD language.** If the JD says "project management", write "project management" — not "managed projects."
- **Submitting the same resume everywhere.** Each JD has unique keywords. A generic resume matches maybe 40% of them.
- **Empty skills section.** ATS scans your skills block first. List all relevant technical and soft skills there.
- **Images for contact info.** ATS can't read images at all.

**What actually works:**

- Single-column, clean format (reverse chronological)
- Mirror the exact keywords from the job description
- Include both acronyms AND full terms: "Search Engine Optimization (SEO)"
- Standard section headings: "Experience", "Education", "Skills"
- PDF format unless they specifically ask for .docx

I put together a more detailed guide with role-specific keyword lists for 130+ roles if anyone wants to dig deeper: ${BASE_URL}/blog/how-to-pass-ats-screening

Happy to answer questions!`,
    },

    {
      subreddit: SUBREDDITS.jobs,
      title: "The resume format that actually gets interviews in 2026 (based on recruiter data)",
      kind: "self",
      body: `After researching recruiter preferences and ATS compatibility, here's the resume format that consistently performs best:

**The winning structure:**

1. **Contact info** — Name, email, phone, LinkedIn, city/state (no full address)
2. **Professional summary** — 2-3 sentences: your title, years of experience, top 3-4 strengths matching the JD
3. **Skills section** — Compact block of relevant skills, mirroring JD language
4. **Experience** — Reverse chronological, bullets starting with action verbs + measurable results
5. **Education** — Degree, school, year. Add relevant certs if early career.

**Why this works:**

- ATS systems parse it reliably (no confusing multi-column layouts)
- Recruiters can scan it in 7 seconds (the average review time)
- Keywords are front-loaded where ATS weights them most heavily

**Formatting rules:**

- Standard fonts (Arial, Calibri, Times New Roman)
- 10-12pt body, 13-16pt name
- 0.5-1 inch margins
- PDF format
- ONE page for <10 years experience, TWO for 10+

**Bullet formula:** [Action verb] + [what you did] + [measurable result]

❌ "Responsible for managing the marketing team"
✅ "Led 6-person marketing team, driving 34% increase in qualified leads through targeted campaigns"

More detailed guide with examples: ${BASE_URL}/blog/resume-format-2026`,
    },

    {
      subreddit: SUBREDDITS.career,
      title: "Why sending the same resume to every job is killing your response rate (and what to do instead)",
      kind: "self",
      body: `I used to apply to 50+ jobs a week with the same resume and wonder why I wasn't getting callbacks. Then I learned about ATS keyword matching and everything changed.

**The problem:**

A generic resume matches about 30-50% of keywords in any given job description. ATS systems rank candidates by match percentage. At 40%, you're at the bottom of the pile — or filtered out entirely.

**The data:**

Job seekers who tailor their resume per application get 2-3x more interview callbacks. A tailored resume scores 70-90% keyword match vs 30-50% for generic.

**How to tailor in 5 minutes:**

1. Read the JD and highlight the 5-10 most important keywords/requirements
2. Check if your resume contains those exact keywords
3. Rewrite 2-3 experience bullets to include the missing ones (with real context)
4. Update your summary to mirror the job title and top requirements
5. Review and submit

**When it matters most:**

- Changing industries/roles (your old keywords don't match)
- JD uses specific technical terms
- Company has 50+ employees (almost certainly using ATS)
- Competitive role with many applicants

I wrote a longer breakdown here: ${BASE_URL}/blog/tailored-resume-vs-generic

The TL;DR: 10 tailored applications > 100 generic ones. Every time.`,
    },

    {
      subreddit: SUBREDDITS.cscareer,
      title: "Compiled the top ATS keywords for Software Engineer resumes (2026)",
      kind: "self",
      body: `I analyzed a bunch of Software Engineer job descriptions to find the keywords that appear most frequently. If your resume is missing these, ATS systems may be filtering you out.

**Critical (include these no matter what):**
- algorithms, data structures, system design
- unit testing, code review, git
- CI/CD, agile, REST API
- microservices, cloud

**Important:**
- troubleshooting, performance optimization
- documentation, monitoring
- Docker, Kubernetes (if applicable)
- SQL/NoSQL databases

**How to use them:**

- **Summary section:** Include 3-4 naturally. "Software Engineer with 5 years experience in system design, microservices, and cloud-native applications."
- **Skills block:** List all relevant ones. ATS scans this first.
- **Experience bullets:** Pair keywords with measurable results. "Implemented CI/CD pipeline reducing deployment time by 60%."

**Don't keyword stuff.** Only use terms that accurately describe your work. ATS + recruiters both flag obvious stuffing.

I also compiled keyword lists for 130+ other roles (Data Scientist, Product Manager, DevOps, etc.) if anyone's interested: ${BASE_URL}/keywords/software-engineer

What keywords have you found most important for your target roles?`,
    },

    {
      subreddit: SUBREDDITS.getEmployed,
      title: "A practical job search strategy that actually works (step by step)",
      kind: "self",
      body: `Most people's job search: apply to 200 jobs with the same resume, wait, hear nothing, get discouraged.

Here's a better approach that gets 15-30% interview rates:

**Step 1: Define 3-5 target roles**

Don't apply to everything. Pick specific job titles you're qualified for. Research salary ranges to make sure they meet your needs.

**Step 2: Study 10 job descriptions per target role**

Extract the common keywords, requirements, and qualifications. This tells you exactly what employers want.

**Step 3: Build a master resume**

One document with ALL your experience. Use role-specific keywords. This is your source document.

**Step 4: Tailor for each application**

For each job, customize your master resume to match that specific JD. Takes 5-10 minutes per application.

**Step 5: Apply to 5-10 jobs per week (not 50)**

Quality over quantity. 10 tailored applications outperform 50 generic ones.

**Step 6: Follow up at day 5-7**

Brief, professional check-in email. This alone can bump your response rate significantly.

**Step 7: Prep for interviews while you wait**

Practice role-specific questions. The STAR method works for behavioral questions: Situation → Task → Action → Result.

I put together a longer playbook with more details: ${BASE_URL}/blog/job-search-strategy-2026

Also have interview questions, salary data, and keyword lists for 130+ roles if that helps anyone: ${BASE_URL}`,
    },

    {
      subreddit: SUBREDDITS.resumes,
      title: "150+ resume action verbs organized by impact (stop using 'responsible for')",
      kind: "self",
      body: `Weak verbs kill your resume. Here are stronger replacements organized by category:

**Leadership:** Led, Directed, Managed, Oversaw, Spearheaded, Championed, Mentored, Orchestrated, Scaled

**Building:** Built, Developed, Created, Designed, Engineered, Implemented, Launched, Deployed, Shipped, Architected

**Improvement:** Improved, Optimized, Streamlined, Accelerated, Reduced, Modernized, Automated, Simplified, Transformed

**Analysis:** Analyzed, Researched, Evaluated, Identified, Benchmarked, Measured, Forecasted, Validated

**Communication:** Presented, Negotiated, Advocated, Facilitated, Partnered, Collaborated, Documented

**Revenue:** Generated, Drove, Grew, Expanded, Converted, Closed, Exceeded, Captured

**The formula for strong bullets:**

[Action verb] + [what you did] + [measurable result]

❌ "Was responsible for managing the team's quarterly reports"
✅ "Streamlined quarterly reporting process, reducing preparation time by 40% across 3 departments"

**Tips:**
- Different verb for each bullet (don't repeat)
- Present tense for current role, past tense for previous
- Match verbs to the JD when possible
- Always pair with a number/metric

Full list with more examples: ${BASE_URL}/blog/resume-action-verbs`,
    },

    {
      subreddit: SUBREDDITS.career,
      title: "Salary negotiation: why you should never give a number first",
      kind: "self",
      body: `The single most impactful salary negotiation tactic:

**Never give a number first.**

When they ask "What are your salary expectations?", say:

> "I'd love to understand the full compensation range for this role before sharing specific expectations. I'm flexible and want to make sure we're aligned."

**Why this works:**

1. If you go too low, you leave money on the table
2. If you go too high, you might get screened out
3. The company already has a budget range — let them share it first
4. Once you know their range, you can anchor to the top

**Other tips:**

- Research salary bands before the conversation. Know the market rate for your role + experience level.
- Negotiate total comp, not just base (equity, bonus, PTO, remote days, learning budget)
- Get the offer in writing before stopping your job search
- A 10% counter-offer is almost always accepted without pushback
- If they say "we can't go higher on base", ask about signing bonus or equity

I compiled salary data by experience level for 130+ roles if you want to know the ranges for your target: ${BASE_URL}/salary/software-engineer (swap the role in the URL for yours)`,
    },

    {
      subreddit: SUBREDDITS.cscareer,
      title: "Common Software Engineer interview questions and how to prep for them",
      kind: "self",
      body: `Here's what to actually prepare for a Software Engineer interview:

**Behavioral questions (asked in almost every interview):**

- "Tell me about a time you disagreed with a teammate." → Show collaboration, not conflict.
- "Describe a project you're most proud of." → Pick one with measurable impact.
- "How do you handle tight deadlines?" → Show prioritization, not just grinding harder.

Use the STAR method: Situation → Task → Action → Result. Prepare 3-5 stories that you can adapt.

**Technical questions (varies by company):**

- Data structures + algorithms (especially at FAANG)
- System design (for mid/senior roles)
- Language-specific questions
- "Walk me through code you've written"
- Debugging exercises

**Tips:**

1. Research the company's tech stack before the interview
2. Ask clarifying questions — interviewers want to see your thought process
3. Talk through your reasoning out loud during coding questions
4. It's OK to say "I don't know, but here's how I'd figure it out"
5. Prepare 2-3 thoughtful questions to ask THEM

I put together a more comprehensive list of behavioral, technical, and situational questions for SE roles: ${BASE_URL}/interview/software-engineer

Also have interview prep for other roles (PM, Data Science, DevOps, etc.) if interested: ${BASE_URL}`,
    },

    {
      subreddit: SUBREDDITS.jobs,
      title: "How to write a career change resume that gets past ATS",
      kind: "self",
      body: `Career changers have a unique ATS problem: your old job keywords don't match the new role.

Here's how to fix it:

**1. Map your transferable skills**

Analyze 10 job descriptions in your target role. Extract the common keywords. Then map your existing experience to those requirements.

Common transferable skills that cross industries:
- Project management
- Data analysis
- Stakeholder communication
- Process improvement
- Team leadership
- Client relationships

**2. Rewrite your summary as a pivot statement**

❌ "Experienced marketing analyst with 6 years in digital campaigns"

✅ "Former marketing analyst transitioning to product management with 6 years of data-driven decision making, stakeholder alignment, and cross-functional project delivery"

**3. Restructure your experience bullets**

Rewrite them using your target role's language. Same work, different framing.

❌ "Managed Facebook ad campaigns with $200K monthly budget"
✅ "Managed $200K monthly budget across multiple channels, optimizing resource allocation based on ROI analysis — driving 25% improvement in cost efficiency"

The second version works for both marketing AND product/ops roles.

**4. Add a strong skills section**

Load it with your target role's keywords. ATS scans skills sections first.

**5. Include relevant projects/certs**

A Google PM Certificate or a relevant side project shows intentionality and commitment to the new field.

More details on career change resumes: ${BASE_URL}/blog/career-change-resume`,
    },

    {
      subreddit: SUBREDDITS.getEmployed,
      title: "10 cover letter mistakes I see constantly (and how to fix each one)",
      kind: "self",
      body: `83% of hiring managers say a great cover letter can land an interview even with an imperfect resume. But most cover letters are terrible.

**The top 10 mistakes:**

1. **Starting with "I am writing to apply for..."** — Wasted opening line. Start with your strongest qualification or a connection to the company.

2. **Rehashing your resume** — Tell a story your resume can't. Add context, personality, motivation.

3. **Being too generic** — "I am a hard worker with communication skills" says nothing. Be specific.

4. **Not mentioning the company by name** — Reference their products, values, or recent news.

5. **Writing more than one page** — 3-4 paragraphs. That's it.

6. **Missing JD keywords** — Some ATS scan cover letters too.

7. **Wrong tone** — Not "Hey team!" and not "Dear Sir/Madam, I hereby..." Professional but human.

8. **Typos** — Read it aloud before sending.

9. **No call to action** — End with: "I'm available this week and can be reached at..."

10. **Skipping it when it says "optional"** — Always submit one. Shows effort.

**The quick structure:**

- Para 1: Hook + why this specific company/role
- Para 2: Your most relevant achievement with context
- Para 3: How your skills map to their needs
- Para 4: Call to action

Longer guide with fix examples: ${BASE_URL}/blog/cover-letter-mistakes`,
    },

    {
      subreddit: SUBREDDITS.jobsearch,
      title: "How to find remote jobs in 2026 — the realistic playbook",
      kind: "self",
      body: `Remote roles get 3-5x more applications than on-site. Here's how to stand out:

**Remote-specific keywords to add to your resume:**

remote collaboration, asynchronous communication, self-directed, time zone management, distributed team, documentation-first

Also list remote tools: Slack, Notion, Zoom, Loom, Miro, Linear, Jira, GitHub

**Best job boards for remote:**

- We Work Remotely
- Remote.co
- FlexJobs
- Remotive
- Working Nomads
- LinkedIn (set "Remote" filter)

**Pro tip:** Check company career pages directly. Many post remote roles only on their own sites.

**How to stand out:**

1. **Mention remote experience explicitly.** "Contributed to fully distributed team across 4 time zones."
2. **Emphasize written communication.** Remote = async. Show you write clearly.
3. **Show self-direction with metrics.** Remote employers need to trust you deliver without supervision.
4. **Tailor to each JD.** Competition is fierce — generic resumes get buried.

**The math:**

- 28% of roles are fully remote in 2026
- 40% hybrid, 32% on-site
- Remote applications per role: 3-5x higher

Your resume needs to be sharper than ever.

Full guide: ${BASE_URL}/blog/remote-job-search-tips`,
    },

    {
      subreddit: SUBREDDITS.resumes,
      title: "PSA: Your resume's skills section matters more than you think for ATS",
      kind: "self",
      body: `Quick tip that made a big difference for me:

**ATS systems scan your skills section FIRST before experience bullets.**

This means:

1. Don't leave it empty or vague
2. List specific, relevant keywords from the job description
3. Put the most important terms first
4. Include both technical and soft skills that match the JD

**Example for a Software Engineer:**

❌ "Programming, problem solving, teamwork"

✅ "Python, TypeScript, React, Node.js, REST APIs, SQL, Docker, CI/CD, Git, System Design, Agile, Unit Testing, Cloud (AWS), Performance Optimization"

**The strategy:**

- Read the JD
- Highlight every skill/tool they mention
- Add the ones you genuinely have to your skills section
- Use their exact wording (not synonyms)

This alone can push your ATS score from 40% to 60%+. Then tailor your experience bullets to get above 70%.

I compiled the top ATS keywords for 130+ roles if you want to check what matters for your target: ${BASE_URL}/keywords/software-engineer (change the role in the URL)`,
    },

    // ── Product-oriented posts (more subtle) ─────────────────────────

    {
      subreddit: SUBREDDITS.jobs,
      title: "Free career resources I've been using — salary data, interview prep, resume keywords for 130+ roles",
      kind: "self",
      body: `Found a site with some genuinely useful free career resources and thought I'd share:

**What's there:**

- **Interview questions** — Behavioral, technical, and situational Q&A for 130+ roles with answer tips
- **Salary data** — Ranges by experience level (entry → senior → staff) with negotiation tips
- **ATS keywords** — The exact resume keywords ranked by priority for each role
- **Resume guides** — Structure, example bullets, and keyword placement tips

**Roles covered include:** Software Engineer, Data Scientist, Product Manager, UX Designer, Marketing Manager, Financial Analyst, Project Manager, and 120+ more.

Site: ${BASE_URL}

Everything is free, no login required. Has been helpful for prepping applications.

They also make a resume tailoring tool (ApplyX) that reads job descriptions and rewrites your resume to match — ${APPLYX_URL}. Has a free tier.`,
    },

    {
      subreddit: SUBREDDITS.career,
      title: "Data Scientist interview coming up? Here's what to actually prepare for",
      kind: "self",
      body: `I compiled a list of common Data Scientist interview questions across behavioral, technical, and situational categories:

**Behavioral:**
- "Tell me about a project where your analysis changed a business decision"
- "How do you communicate technical findings to non-technical stakeholders?"
- "Describe a time your model didn't perform as expected"

**Technical:**
- Statistics fundamentals (hypothesis testing, confidence intervals, p-values)
- SQL (joins, window functions, CTEs — almost always tested)
- Python/R (pandas, scikit-learn, common ML algorithms)
- Experiment design (A/B testing methodology)
- Feature engineering approaches

**Situational:**
- "You have a dataset with 50 features. Walk me through your approach."
- "Product team wants a recommendation engine. How do you scope it?"
- "Your A/B test shows a 2% lift. Is it significant? What do you do?"

**Tips:**
- Prepare 3-5 STAR stories about data projects with measurable business impact
- Be ready to whiteboard SQL queries
- Know the tradeoffs between common algorithms (when to use what)
- Ask clarifying questions — they want to see your analytical thinking

Full list with answer tips: ${BASE_URL}/interview/data-scientist
Salary data: ${BASE_URL}/salary/data-scientist
ATS keywords: ${BASE_URL}/keywords/data-scientist`,
    },

    {
      subreddit: SUBREDDITS.cscareer,
      title: "Product Manager salary ranges in 2026 (by experience level)",
      kind: "self",
      body: `Compiled salary data for Product Managers across experience levels:

**Ranges (US market, base salary):**

- **Junior/Associate PM:** $85K - $120K (median ~$100K)
- **Mid-level PM:** $115K - $165K (median ~$140K)
- **Senior PM:** $150K - $210K (median ~$175K)
- **Staff/Principal PM:** $185K - $260K+ (median ~$215K)

**What drives higher pay:**

- Company size (FAANG/big tech pays significantly more)
- Location (SF/NYC > other markets, but remote is leveling this)
- Domain expertise (ML/AI, platform, infra PMs command premiums)
- Total comp vs base (equity can 2-3x your base at tech companies)

**Negotiation tips:**

- Never give a number first
- Research the specific company's comp bands (levels.fyi, Glassdoor)
- Negotiate total comp, not just base
- A 10% counter is almost always accepted

Salary data for 130+ other roles: ${BASE_URL}/salary/product-manager (swap role in URL)`,
    },
  ];
}

// ── Post queue management ────────────────────────────────────────────────

const STATE_FILE = path.resolve(__dirname, "../.reddit-state.json");

interface RedditState {
  usedIndices: number[];
  totalPool: number;
  lastPostAt: string | null;
  postCount: number;
}

function loadState(): RedditState {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
    }
  } catch {
    // Corrupted, start fresh
  }
  return { usedIndices: [], totalPool: 0, lastPostAt: null, postCount: 0 };
}

function saveState(state: RedditState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function pickNextPost(pool: RedditPost[], state: RedditState): { post: RedditPost; index: number } {
  if (state.totalPool !== pool.length) {
    state.usedIndices = [];
    state.totalPool = pool.length;
  }
  if (state.usedIndices.length >= pool.length) {
    console.log("🔄 All posts used — resetting pool");
    state.usedIndices = [];
  }

  const available = pool
    .map((_, i) => i)
    .filter((i) => !state.usedIndices.includes(i));

  const randomIdx = available[Math.floor(Math.random() * available.length)]!;
  return { post: pool[randomIdx]!, index: randomIdx };
}

// ── Main ─────────────────────────────────────────────────────────────────

async function submitPost(
  client: Snoowrap | null,
  pool: RedditPost[],
  state: RedditState
): Promise<void> {
  const { post, index } = pickNextPost(pool, state);

  console.log(`\n📝 Post #${state.postCount + 1} (pool index ${index}):`);
  console.log(`─────────────────────────────────────`);
  console.log(`r/${post.subreddit}`);
  console.log(`Title: ${post.title}`);
  console.log(`Body: ${post.body.slice(0, 200)}...`);
  console.log(`─────────────────────────────────────`);

  if (DRY_RUN || !client) {
    console.log("🏜️  DRY RUN — post not submitted");
  } else {
    try {
      const subreddit = client.getSubreddit(post.subreddit);
      const submitLink = subreddit.submitLink.bind(subreddit) as (args: {
        title: string;
        url: string;
      }) => Promise<unknown>;
      const submitSelfpost = subreddit.submitSelfpost.bind(subreddit) as (args: {
        title: string;
        text: string;
      }) => Promise<unknown>;

      if (post.kind === "link" && post.url) {
        await submitLink({
          title: post.title,
          url: post.url
        });
      } else {
        await submitSelfpost({
          title: post.title,
          text: post.body
        });
      }
      console.log(`✅ Posted to r/${post.subreddit}!`);
    } catch (err: unknown) {
      const error = err as { statusCode?: number; message?: string };
      if (error.statusCode === 429) {
        console.error("⏳ Rate limited — will retry next interval");
        return;
      }
      console.error("❌ Failed to post:", error.message ?? err);
      return;
    }
  }

  state.usedIndices.push(index);
  state.lastPostAt = new Date().toISOString();
  state.postCount++;
  saveState(state);

  console.log(
    `📊 Stats: ${state.usedIndices.length}/${pool.length} posts used | Total: ${state.postCount}`
  );
}

async function main(): Promise<void> {
  console.log("🤖 ApplyX Reddit Bot (FREE Reddit API)");
  console.log(`   Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  console.log(`   Interval: ${REDDIT_INTERVAL_MINUTES} minutes`);

  validateCredentials();

  const pool = allPosts();
  const state = loadState();

  console.log(`   Pool size: ${pool.length} unique posts`);
  console.log(`   Already used: ${state.usedIndices.length}`);
  console.log(`   Total posted: ${state.postCount}`);

  let client: Snoowrap | null = null;
  if (!DRY_RUN) {
    client = createClient();
    console.log(`✅ Logged in as u/${REDDIT_USERNAME}`);
  }

  if (POST_ONCE) {
    await submitPost(client, pool, state);
    return;
  }

  // Initial post
  await submitPost(client, pool, state);

  // Schedule recurring
  const intervalMs = REDDIT_INTERVAL_MINUTES * 60 * 1000;
  console.log(`\n⏰ Next post in ${REDDIT_INTERVAL_MINUTES} minutes...`);

  setInterval(async () => {
    try {
      await submitPost(client, pool, state);
      console.log(`\n⏰ Next post in ${REDDIT_INTERVAL_MINUTES} minutes...`);
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      console.log(`\n⏰ Will retry in ${REDDIT_INTERVAL_MINUTES} minutes...`);
    }
  }, intervalMs);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

