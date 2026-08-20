---
name: content-humanizer
description: >
  Transform AI-generated content into human-sounding writing via AI pattern
  detection, rhythm restoration, and authenticity scoring. Use when content
  sounds robotic, uses AI cliches, or the user wants to humanize or fix AI
  writing.
license: MIT
metadata:
  version: 1.0.0
  author: borghei
  category: marketing
  domain: content
  updated: 2026-03-09
---
# Content Humanizer

Transform machine-sounding content into writing that reads like it came from a real person with real opinions and real experience.

---

## Table of Contents

- [Keywords](#keywords)
- [Quick Start](#quick-start)
- [Core Workflows](#core-workflows)
- [AI Pattern Detection Catalog](#ai-pattern-detection-catalog)
- [Humanization Techniques](#humanization-techniques)
- [Voice Injection Framework](#voice-injection-framework)
- [Rhythm and Cadence Repair](#rhythm-and-cadence-repair)
- [Specificity Replacement Guide](#specificity-replacement-guide)
- [Before and After Examples](#before-and-after-examples)
- [Best Practices](#best-practices)
- [Integration Points](#integration-points)

---

## Keywords

content humanizer, AI content, humanize writing, AI detection, natural writing, authentic content, AI cliches, robotic writing, brand voice, personality injection, writing rhythm, AI patterns, content authenticity, human voice, AI tells, content polishing, voice consistency, writing style, content quality

---

## Clarify First

Before humanizing, confirm these inputs. If any is unknown or vague, ASK — do not assume:

- [ ] **Mode** — audit-only (annotated report) or full humanization rewrite (sets the deliverable and how invasive edits are)
- [ ] **Content type** — docs, blog post, marketing copy, or email (determines how much personality to inject vs. preserve clarity)
- [ ] **Brand voice** — guidelines or one example of writing they love (without it, voice injection is guesswork)

Stop rule: ask only the 2-3 that most change the output. If the user says "just draft it," proceed and list your assumptions at the top of the artifact.

## Quick Start

### Detect AI Patterns in Content

1. Scan for overused filler words (delve, landscape, crucial, leverage, robust)
2. Check for hedging chains ("It's important to note that...")
3. Count em-dash frequency (more than 2 per 500 words = AI fingerprint)
4. Evaluate paragraph structure uniformity (identical patterns = AI)
5. Flag all unattributed vague claims ("Many companies," "Studies show")
6. Score severity: High (10+ tells per 500 words = full rewrite needed)

### Humanize a Draft

1. Replace all filler words with plain-language alternatives
2. Vary sentence length deliberately (short, long, medium, fragment)
3. Replace every vague claim with a specific data point or honest qualification
4. Break uniform paragraph structure with fragments, questions, and asides
5. Add friction and imperfection (qualifications, direction changes, opinions)
6. Inject brand voice if voice guidelines exist

---

## Core Workflows

### Workflow 1: AI Pattern Audit (Diagnostic Only)

Scan content without editing. Produce an annotated report.

**Step 1: Run Detection Scan**

Flag every instance in these categories with severity ratings:
- Critical (kills credibility): Overused filler words, hedging chains, identical paragraph structure, lack of specificity
- Medium (softens impact): Em-dash overuse, false certainty, generic conclusions
- Minor (polish only): Slightly repetitive transitions, mild formatting uniformity

**Step 2: Count and Score**

| Metric | Threshold |
|--------|-----------|
| AI tells per 500 words | < 3 = minor edits needed, 3-7 = significant editing, 8+ = full rewrite |
| Unique paragraph structures | < 3 patterns in 1,000+ words = AI fingerprint |
| Vague claims without attribution | Any = flag each one |
| Sentences starting with "It is" | > 3 per 1,000 words = flag |

**Step 3: Deliver Audit Report**

```markdown
## AI Pattern Audit
Content: [Title or description]
Word count: [X]
AI Tell Count: [X] (Critical: [X], Medium: [X], Minor: [X])
Recommendation: [Minor edits / Significant editing / Full rewrite]

### Critical Issues
[Each issue with line reference, pattern category, and specific fix]

### Medium Issues
[Same format]

### Minor Issues
[Same format]
```

### Workflow 2: Full Humanization Pass

Transform the content from AI-sounding to authentically human.

**Step 1: Remove AI Filler Words**

Never just delete — always replace with something better or restructure the sentence:

| AI Phrase | Replacement Options |
|-----------|-------------------|
| "delve into" | "look at," "dig into," "break down," or restructure without the phrase |
| "the [X] landscape" | "how [X] works today," "the current state of [X]" |
| "leverage" | "use," "apply," "put to work" |
| "crucial" / "vital" / "pivotal" | State the thing and let it be self-evidently important |
| "furthermore" / "moreover" | Start the next sentence directly, or use "and" or "also" |
| "robust" / "comprehensive" | Replace with specific description of what it actually covers |
| "facilitate" / "foster" | "help," "make easier," "allow," "create" |
| "navigate this challenge" | "handle this," "deal with this," "get through this" |
| "in order to" | "to" |
| "it is important to note that" | Delete the phrase; start with the actual note |
| "it goes without saying" | If it goes without saying, do not say it |
| "at the end of the day" | Delete entirely or replace with specific conclusion |
| "a wide range of" | Specify the range or say "many" |

**Step 2: Fix Sentence Rhythm**

AI produces uniform sentence length (18-22 words per sentence). The ear goes numb.

Deliberately vary:
- Break long sentences into two
- Add a short sentence after a long one. Like this.
- Use fragments for emphasis. Especially for emphasis.
- Let some sentences run when the thought needs room to unwind
- Mix declarative, interrogative, and imperative forms

Target rhythm patterns:
- Long. Short. Long, long. Short.
- Question? Answer. Proof.
- Claim. Specific example. So what?

**Step 3: Replace Generic with Specific**

Every vague claim is an invitation to doubt:

Before: "Many companies have seen significant improvements by implementing this strategy."

After (if you have data): "HubSpot published their onboarding funnel data in 2023 — companies that hit first-value in 7 days showed 40% higher 90-day retention."

After (if you do not have data): "I don't have a controlled study to cite, but in every SaaS onboarding flow I've worked on, the pattern is the same: earlier activation = higher retention."

Honest qualification beats vague authority.

**Step 4: Vary Paragraph Structure**

Break the uniform pattern (Statement > Explanation > Example > Bridge):
- Single-sentence paragraph for emphasis
- Question paragraph: pose a question, then answer it
- List in the middle when items are genuinely parallel
- Aside or parenthetical that reveals personality
- Confession: "I got this wrong the first time"
- Fragment paragraph. Just one thought. Then move on.

**Step 5: Add Friction and Imperfection**

Real people:
- Change direction mid-thought: "Actually, let me back up..."
- Qualify things they are uncertain about
- Have opinions that might be wrong: "I might be wrong about this, but..."
- Notice things: "What's interesting here is..."
- React: "Which, if you've ever tried to debug this, you know is maddening."
- Acknowledge tradeoffs: "This works, but it costs you..."

### Workflow 3: Voice Injection

After removing AI patterns, inject the brand's specific personality.

**Step 1: Extract Voice from Examples**

If brand guidelines exist, reference them. If not, request one example of writing the brand loves. Extract:
- Sentence length preference (short punchy vs. flowing)
- Formality level (contractions, slang, jargon policy)
- Humor usage (dry wit, self-deprecating, none)
- Relationship stance (peer-to-peer, expert-to-student, provocateur)
- Signature phrases or patterns

**Step 2: Apply Voice Techniques**

| Technique | How to Apply |
|-----------|-------------|
| Personal anecdotes | "We saw this firsthand when building X" |
| Direct address | Talk to the reader as "you," not "users" or "teams" |
| Opinions without apology | "We think the industry is wrong about this" |
| The aside | Brief parenthetical showing you know more than you are saying |
| Rhythm signature | Match the sentence pattern from the brand's best examples |
| Controlled imperfection | Strategic fragments, direction changes, honest qualifications |

**Step 3: Consistency Check**

After voice injection, verify:
- Voice is consistent from intro to conclusion (no drift)
- Tone matches the content type (blog post vs. docs vs. email)
- Personality does not override clarity (if a joke obscures the point, cut the joke)
- The piece sounds like the same person wrote all of it

---

## AI Pattern Detection Catalog

### Category 1: Overused Filler Words (Critical)

These words appear disproportionately in AI-generated text:

**Tier 1 — Instant Tells:**
delve, landscape (metaphorical), crucial, vital, pivotal, leverage, robust, comprehensive, holistic, foster, facilitate, ensure, navigate (metaphorical), utilize, furthermore, moreover, in addition

**Tier 2 — Suspicious in Clusters:**
streamline, optimize, innovative, cutting-edge, game-changer, paradigm, synergy, ecosystem, empower, unlock, harness, transformative, seamless

### Category 2: Hedging Chains (Critical)

AI hedges constantly because it does not want to be wrong:
- "It's important to note that..."
- "It's worth mentioning that..."
- "One might argue that..."
- "In many cases," "In most scenarios,"
- "It goes without saying..."
- "Needless to say..."

### Category 3: Structural Uniformity (Critical)

Every paragraph follows the same SEEB pattern:
Statement > Explanation > Example > Bridge

Real writing varies. Some paragraphs are one sentence. Some are lists. Some are questions followed by answers. Some digress and come back.

### Category 4: Specificity Vacuum (Critical)

AI replaces specific claims with vague ones to avoid being wrong:
- "Many companies" (which ones?)
- "Studies show" (which studies?)
- "Significantly improved" (by how much?)
- "Leading brands" (name one)
- "A growing number of" (how many?)
- "Best practices suggest" (whose best practices?)

### Category 5: Em-Dash Overuse (Medium)

One or two em-dashes per piece: fine. Em-dash in every other paragraph: AI fingerprint.

### Category 6: False Certainty (Medium)

AI asserts confidently about things nobody can be certain about. "Companies that do X are more successful." According to what data? Based on what sample size?

### Category 7: Generic Conclusions (Medium)

AI conclusions restate the introduction:
"In this article, we explored X, Y, and Z. By implementing these strategies, you can achieve..."

No human concludes like this. Real conclusions add something new or nail the exit line.

---

## Rhythm and Cadence Repair

### The Problem

AI writing has metronomic consistency. Every sentence is roughly the same length. The reader's attention flatlines.

### The Fix

Map sentence lengths and deliberately vary them:

**Before (AI rhythm):**
> Content marketing is an essential strategy for modern businesses. It helps build trust with potential customers over time. Creating high-quality content requires careful planning and execution. The most effective content strategies combine data-driven insights with creative storytelling.

Every sentence: 8-10 words. Same structure. Same length.

**After (human rhythm):**
> Content marketing works. Not because it is clever — because it builds trust before you ever ask for a sale. That takes time. It takes planning. And honestly? It takes more failed drafts than anyone likes to admit. But the companies that figure it out — the ones that combine real data with stories that actually land — they win. Not quickly. But permanently.

Mixed length. Fragments. Questions. Repetition for emphasis. Direction changes.

### Rhythm Patterns to Use

| Pattern | When to Use |
|---------|-------------|
| Long. Short. | After complex explanation, punch with a short statement |
| Question? Answer. | Engage the reader, then satisfy the curiosity |
| Claim. Evidence. So what? | Make a point, prove it, explain why it matters |
| List. Then prose. | Present options or items, then return to narrative |
| Confession. Lesson. | Admit a mistake, extract the learning |

---

## Specificity Replacement Guide

### The Rule

Every vague claim must become either specific or honestly qualified. There is no third option.

### Replacement Patterns

| Vague | Specific Alternative | Honest Qualification |
|-------|---------------------|---------------------|
| "Many companies" | "In a 2024 Gartner survey of 1,200 enterprises" | "In the teams I've worked with" |
| "Studies show" | "A Stanford study published in Nature (2023)" | "I haven't seen controlled studies, but the pattern is..." |
| "Significant improvement" | "A 34% reduction in churn over 6 months" | "Noticeable improvement — I'd estimate 20-30% range" |
| "Industry leaders" | "Stripe, Notion, and Linear" | "The companies I'd point to as examples" |
| "Best practices" | "[Organization]'s published framework recommends" | "What I've seen work consistently" |
| "Growing trend" | "Adoption grew from 12% to 47% between 2022 and 2025" | "Anecdotally, I'm seeing more teams try this" |

---

## Before and After Examples

### Example 1: SaaS Product Description

**Before (AI-generated):**
> It is crucial to leverage your existing customer data in order to effectively navigate the competitive landscape. Furthermore, by implementing a robust onboarding strategy, organizations can ensure that users achieve maximum value from the product and reduce churn significantly.

**After (humanized):**
> Here's the thing nobody says out loud: most SaaS companies have the data to fix their churn problem. They just do not look at it until after customers leave.
>
> Your activation funnel tells you everything. Your best cohorts, your worst, the exact moment the drop-off happens. You do not need another tool — you need someone to stop ignoring what the tool is already showing you.
>
> Nail onboarding first. Everything else is downstream.

### Example 2: Marketing Blog Post

**Before (AI-generated):**
> In the rapidly evolving landscape of digital marketing, it is essential for businesses to leverage cutting-edge strategies to stay ahead of the competition. By implementing a comprehensive content marketing approach, organizations can foster meaningful connections with their target audience and drive sustainable growth.

**After (humanized):**
> Digital marketing changes fast. That part is true. But the companies that actually grow? They are not chasing every new tactic. They are doing the boring stuff well.
>
> Write content people want to read. Answer questions your customers actually ask. Do it consistently for 12 months. It is not exciting advice. But it works — and the "cutting-edge strategies" usually do not.

---

## Best Practices

1. **Audit before editing** — Know what is wrong before you fix it. A piece with 3 AI tells needs polish. A piece with 15 needs a rewrite. The approach is different.

2. **Preserve what works** — Some AI-generated paragraphs are genuinely good. Flag them before rewriting so you do not accidentally destroy the best parts.

3. **Do not over-humanize** — Adding too much personality to technical documentation makes it harder to use. Match the humanity level to the content type.

4. **Get voice context first** — Guessing the brand voice and being wrong wastes time. Ask for one example of writing they love before injecting personality.

5. **Read aloud** — The single most effective test. If it sounds like a press release when read aloud, it is not human enough.

6. **Replace, do not just delete** — Removing "furthermore" leaves a gap. Replace with a better transition or restructure the flow.

7. **Specific beats clever** — A specific data point does more for credibility than a witty phrase. Prioritize substance over style.

8. **Consistency over personality** — A mildly interesting but consistent voice beats a wildly creative voice that shifts every paragraph.

9. **One pass at a time** — Detect first, humanize second, inject voice third. Trying to do all three simultaneously produces inconsistent results.

10. **Flag the specificity gap** — You can make prose flow better, but you cannot invent proof points. If the piece makes five vague claims with zero data, the author needs to provide the specifics. Flag this clearly.

---

## Integration Points

- **Content Production** — Use to create the initial draft. Run Content Humanizer after drafting, before SEO optimization.
- **Copywriting** — Use for conversion copy (landing pages, CTAs, headlines). Content Humanizer works on longer-form pieces.
- **Content Strategy** — Use when deciding what content to create. Not for voice or draft execution.
- **AI SEO** — Use after humanizing to optimize for AI search citation. Human-sounding content gets cited more, but still needs structure for extraction.
- **Brand Guidelines** — Reference brand voice and personality standards before voice injection.
- **Copy Editing** — Use after humanization for grammar, fact-checking, and editorial consistency passes.

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| Content still sounds AI-generated after humanization pass | Only surface-level word replacements done — structural uniformity and hedging patterns remain | Run all three passes in order: filler removal, rhythm repair, specificity replacement. Address structure, not just words |
| Brand voice inconsistent after editing | Voice injection done without reference examples or clear guidelines | Request one example of writing the brand loves before injecting voice; extract formality, humor, and relationship stance |
| Over-humanized technical documentation | Personality injection applied to content that needs clarity over personality | Match humanization level to content type — docs need clarity; blog posts and marketing copy need personality |
| Specificity gaps flagged but cannot be filled | Writer does not have access to real data, expert quotes, or original research | Flag clearly as "author must provide" — humanizer cannot invent proof points. Honest qualification beats vague authority |
| AI detection tools still flagging content | Structural patterns (SEEB uniformity) persist despite word-level changes | Vary paragraph structures deliberately — single-sentence paragraphs, questions, fragments, asides, confessions |
| Readability dropped after humanization | Informal language and fragments reduced Flesch score | Balance personality with readability — fragments are fine but complex vocabulary can hurt scores. Target Flesch 60-70 |
| Google SynthID or similar tool detects AI origin | Content was generated with tools that embed watermarks (e.g., Google Gemini) | Rewrite substantially rather than editing in place; change structure, not just words. SynthID detection is statistical |

---

## Success Criteria

- **AI tell density**: Fewer than 3 AI tells per 500 words after humanization pass (from baseline of 8+ pre-edit)
- **Unique paragraph structures**: At least 4 distinct paragraph patterns in any 1,000-word piece (vs. uniform SEEB pattern)
- **Specificity rate**: Zero vague claims remaining without either specific data or honest qualification
- **Voice consistency**: Consistent formality level, humor usage, and relationship stance from introduction to conclusion
- **Read-aloud test**: Content sounds natural when read aloud — no press-release cadence or robotic phrasing
- **Readability maintenance**: Flesch Reading Ease stays within 55-75 range after humanization (no degradation)
- **Brand voice match**: Content passes brand voice review with 90%+ alignment to documented voice guidelines

---

## Scope & Limitations

**In scope:**
- AI pattern detection and audit (diagnostic only or with edits)
- Filler word replacement with context-appropriate alternatives
- Sentence rhythm and cadence repair
- Paragraph structure diversification
- Specificity replacement (vague claims to specific or honestly qualified)
- Voice injection from brand guidelines or example content
- Consistency checking across full-length pieces

**Out of scope:**
- Content creation from scratch (use Content Production)
- Grammar and spelling correction (use Copy Editing)
- SEO optimization (use SEO Specialist or Content Production optimization pass)
- Content strategy or topic selection (use Content Strategy)
- AI content generation or LLM API integration
- Plagiarism detection or originality verification

**Known limitations:**
- Cannot add specificity where no data exists — must flag for author input
- AI detection tools (GPTZero, Originality.ai, Google SynthID) have false positive rates of 10-30%
- Voice injection without clear brand guidelines produces inconsistent results
- Humanization of very short content (<300 words) may not have enough surface area for meaningful improvement
- Content watermarked by AI generation tools (SynthID) may require substantial rewriting beyond pattern-level edits

---

## Scripts

```bash
# Score content for AI patterns and generate audit report
python scripts/readability_scorer.py article.md --json

# Detect AI filler words and hedging patterns with counts
python scripts/ai_pattern_detector.py article.md --verbose

# Analyze content for humanization opportunities
python scripts/content_scorer.py article.md --json
```

---

## Ideas adoptadas de humanizer (2026-08-20)

Adopted from the public repo `blader/humanizer` (based on Wikipedia's "Signs of AI writing," maintained by WikiProject AI Cleanup). Patterns and safeguards not covered above.

### Hard rule: never invent facts

Stronger than "flag the specificity gap": never add a fact, name, number, date, quote, or citation that does not come from the source or the user. Before delivering, ask two questions:

1. "What still sounds AI-generated?"
2. "Did the rewrite add or lose any fact, name, number, date, quote, or claim?"

Any unsupported addition or lost claim is an error, not a style choice.

### Additional AI patterns to detect

- **"Not X but Y" constructions** — "It's not just a song, it's a statement." Also clipped negative endings ("no guessing"). State the point directly.
- **Forced groups of three** — "innovation, inspiration, and industry insights." Break the triad unless the ideas genuinely come in threes.
- **Synonym cycling and repeated openings** — "the protagonist... the main character... the central figure," or three sentences in a row starting with "She." Fix the repeated pattern (merge, reorder), do not ban the word.
- **False "from X to Y" ranges** — "from the Big Bang to the cosmic web, from stars to dark matter" when X and Y form no real range. List the items plainly.
- **Shallow -ing add-ons** — "...highlighting," "...reflecting," "...showcasing" tacked onto a fact to fake depth. Cut the phrase; keep the fact.
- **Avoiding is/are/has** — "serves as," "stands as," "boasts," "features" → "is," "has."
- **Inflated legacy claims** — "a testament to," "marking a pivotal moment," "underscores its importance," "evolving landscape." State the fact without the significance wrapper.
- **Sales language for places/products** — "nestled," "vibrant," "breathtaking," "must-visit," "rich cultural heritage."
- **Vague name-dropping** — listing outlets or follower counts to prove importance ("cited in NYT, BBC, FT, and The Hindu... 500,000 followers") with no context. Keep only citations that say what was said and where.
- **Passive voice hiding the actor** — "The results are preserved automatically" → "The system preserves the results automatically."

### Formatting tells

- Excessive bold; lists where every item is "**Label:** sentence restating the label."
- Title Case In Every Heading — use sentence case.
- Decorative emojis on headings and list items.

### Chatbot artifacts left in the text

- "I hope this helps!", "Certainly!", "Would you like me to expand...?"
- Knowledge-cutoff disclaimers and speculative gap-fills ("details are scarce... she likely grew up in a middle-class household"). State what the source does not show, or cut the sentence — never present a guess as fact.
- Announcing the point instead of making it ("Let's dive in," "Here's what you need to know"). Casual versions count too ("one thing that bit me, so pay attention").
- A heading restated in its own first sentence ("## Performance / Speed matters."). Delete the restatement.

### Meta-discourse tells (subtler)

- **Deeper-truth framing** — "the real question is," "at its core," "what really matters," "fundamentally."
- **Formulaic sayings** — "X is the Y of Z," "X becomes a trap," "the currency of." Replace the aphorism with the specific claim.
- **Fake-candid openers as hooks** — standalone "Honestly?", "Look,", "Here's the thing," "Let's be honest" before a routine point. (Mid-sentence "honestly" in casual writing is fine.)
- **Answering objections no one raised** — "I'm not saying...", "To be clear...", "This isn't really about..." when the objection appears nowhere else. Keep only defenses whose source is named or answered in full.
- **Rejecting fake alternatives** — "One might be tempted to...", "An obvious approach would be..." introducing an option no reader would consider, dismissed in a clause and never mentioned again.

### Caution: humanization moves that are themselves AI tells

Several techniques taught above become fingerprints when overdone:

- A row of dramatic fragments ("No aesthetic prior. No nostalgia. The old rules were gone.") — one short sentence adds emphasis; a drumroll of fragments reads as staged.
- "Here's the thing" and similar openers (used in this skill's own examples) — vary or drop them; they are now a recognized AI hook.
- Stacked qualifiers from repeated editing ("could potentially possibly") — keep one qualifier only when the meaning needs it.

Apply the personality techniques from Workflow 2 Step 5 sparingly, not on every paragraph.

### False positives: what NOT to flag

One tell proves nothing; look for several stock patterns together.

- Em dashes alone — many editors and journalists use them heavily. (Adjust the "2 per 500 words" threshold when the writer's sample shows otherwise.)
- Curly quotes alone — Word, macOS, and most CMSes auto-curl.
- Formal or academic vocabulary that is not on the filler list.
- One short fragment, or deliberate repeated openings for rhythm ("She came. She saw. She conquered.").
- Letter-style salutations and sign-offs; common transitions ("however," "additionally") in isolation.
- Never rewrite watched phrases inside quotations, titles, proper names, or examples where the phrase is discussed rather than used.

### Human details to preserve

Keep unless they hurt the meaning: specific odd details ("the lawyer who used to work upstairs from my dentist"), mixed feelings and unresolved tension, era-bound slang and references, genuine asides and self-corrections. A provided writing sample overrides all style rules here — if the writer uses em dashes or quirks, keep them at the writer's own rate.

### File mode

When humanizing a file directly, change prose only: keep code blocks, YAML front matter, data, and link targets intact, and write only the final text to the file (no annotations inside the file).
