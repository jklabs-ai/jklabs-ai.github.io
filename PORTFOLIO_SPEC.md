# Cursor Specification: Joseph Kim Portfolio — revised

Complete build specification. Save this file in the portfolio repository as PORTFOLIO_SPEC.md and ask Cursor Agent to read it. Existing biographical and project copy is supplied by the owner, not independently verified. Follow the inspect-first workflow below.

```text
Build my personal portfolio site in the currently open repository. Do not assume it is empty.
Expected hosting: GitHub Pages at https://jklabs-ai.github.io, from main branch root.

# Inspect-first workflow
1. Before editing, inspect the working directory, existing files, git status, branch and git remote -v. Do not print secrets. Confirm that this is the intended portfolio repository, not DataPlug or TraceNote.
2. Check whether the GitHub remote matches owner jklabs-ai and repository jklabs-ai.github.io. If it differs, stop and explain the deployment URL/path implications for owner approval before implementing. Do not rewrite remotes or rename repositories.
3. Preserve uncommitted work and existing useful files. Never reset, clean, force checkout, delete or overwrite unrelated work. If there is an existing framework-based site, explain the conflict with the static-site brief and wait for approval before replacing it.
4. Return a short implementation plan and any genuine blockers, then STOP. Do not implement until I approve.
5. After approval, implement in three passes: (a) static content and responsive layout, (b) themes/navigation/rocket, (c) writing data, metadata and checks. Do not request approval for each routine file edit, but stop for consequential ambiguities.
6. Do not commit, push, deploy, install packages or change repository settings without separate approval. Never access or change other repositories to copy DataPlug code. Reproduce only the behavior described here.

# Hard constraints
- Plain HTML + CSS + a small amount of vanilla JS. No framework, no npm, no build step, no external fonts, no CDNs, no analytics, no cookies.
- Use ONLY the copy I provide below. Do not invent metrics, customers, revenue, users, dates or claims. If something is missing, leave a clearly marked HTML comment `<!-- TODO: ... -->` rather than making it up.
- Keep supplied editorial copy exactly as written. Fix layout by wrapping/resizing containers, not rewriting copy. You may add functional accessibility text (e.g. theme-toggle labels). Flag suspected factual inconsistencies for owner review; do not silently correct them.
- Mobile-first and fully responsive (test at 320px, 375px, 768px, 1024px, 1280px and 1440px widths).
- Accessible: semantic HTML (header, nav, main, section, article, footer), one h1, logical heading order, visible focus states, alt text on all images, colour contrast at least WCAG AA, prefers-reduced-motion respected.
- Fast: total page weight under 500 KB excluding screenshots; lazy-load screenshots.

# File structure
/index.html
/styles.css
/main.js                      (themes, section tracking, rocket, Writing rendering; small vanilla JS only)
/data/posts.json              (Writing entries; start as an empty array [])
/assets/img/favicon.svg       ("JK" monogram, near-black square, white letters)
/assets/img/og-image.png      (1200x630 link-preview image: "Joseph Kim" + positioning line, black on white, accent bar)
/assets/img/projects/         (empty folder with .gitkeep; screenshots go here later)
/assets/img/posts/            (empty folder with .gitkeep; optional writing thumbnails)
/assets/resume/               (empty folder with .gitkeep; I will add Joseph-Kim-Resume.pdf)
/.nojekyll                    (empty file so GitHub Pages serves files as-is)
/README.md                    (what the site is, how to preview locally, how to add a post, how to add screenshots)

For og-image.png: use Python and Pillow only if already available; save a reproducible script as /scripts/make_og_image.py. No package installation without approval. If generation is unavailable, create /assets/img/og-image-template.html as a 1200x630 screenshot template, report the missing PNG as a pre-publication TODO, and do not emit metadata pointing to a nonexistent image. Keep this share image black on white regardless of the visitor's theme. Never create a fake PNG by renaming HTML or SVG.

# Design
- Utilitarian, neutral, editorial. Light theme: white background #FFFFFF, text #111111, secondary text #555555, decorative borders #E5E5E5, deep teal accent #0F5C5C. Dark theme and contrast requirements are specified below. Use one teal accent family, not additional decorative colours.
- System font stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif. Monospace for small tech tags: ui-monospace, SFMono-Regular, Menlo, monospace.
- Single column, max-width 760px, centred, generous vertical spacing (sections ~96px apart on desktop, ~64px on mobile). Base font 17px, line-height 1.6.
- Buttons: solid accent for the primary (Resume PDF), outlined for the rest; 44px min tap height.
- No hero images, gradients, parallax or continuous animation. Only subtle hover/focus transitions, anchor scrolling and the one-shot rocket animation specified below are allowed.
- Sticky slim top bar: name links to #top on the left; icon-only theme toggle on the right. On wide screens use the right-hand section rail instead of duplicate header section links. On narrower/touch layouts show a second header row with horizontally scrollable text links (Projects, Writing, Background, Contact); keep the theme toggle in the first row. No hamburger menu. See exact navigation rules below.

# Language scope
- English only for launch. Set <html lang="en">. No language picker, translation API, extra locale routes, duplicate pages or i18n framework. Keep readable semantic content so a separately commissioned translation can be added later.

# Light / dark theme
- Use CSS custom properties for ALL interface colours: page, surfaces, text, secondary text, links, buttons, outlines, tags, status pills, details panels, navigation labels, Writing placeholders and selection. No partial dark mode.
- Dark starting palette: background #111315, surface #191D20, text #F2F4F5, secondary #B5BEC4, decorative border #343C42, accent #7BCAC3. Use dark text on pale-teal filled buttons. Verify actual rendered contrast, not just palette swatches. WCAG AA: normal text >=4.5:1, large text >=3:1, essential control boundaries/state indicators >=3:1 against adjacent colours. Decorative hairlines may remain subtle.
- Use inline SVG line icons, never emoji, external icon fonts or icon libraries. Show a SUN when the current theme is light and a CRESCENT MOON when the current theme is dark. The icon represents CURRENT state, not the destination. Moon is an open crescent, not a full circle.
- Use a native button with type="button", minimum 44x44 CSS px target and visible focus ring. Accessible name describes the action: "Switch to dark mode" in light mode, "Switch to light mode" in dark mode. Decorative SVG aria-hidden="true". Update icon and label together; do not use ambiguous toggle semantics.
- First visit follows prefers-color-scheme. A manual toggle persists only the theme preference in localStorage. This is permitted despite the no-cookies/no-analytics requirement. Wrap storage reads/writes in try/catch; blocked storage must not break toggling or any other feature.
- Apply the initial theme with a tiny synchronous inline head script before styles/paint to prevent the wrong-theme flash. Set color-scheme appropriately. Follow system-theme changes only until the visitor makes a manual selection; saved explicit preference wins on later visits.
- Without JS, use the OS colour preference via CSS and hide the nonfunctional toggle. Core content and ordinary links must still work.
- Switching theme must not reload, jump scroll position or close open case studies. Screenshots retain original colours; do not invert photographs/screenshots.

# Minimal right-hand section navigation
- Targets in order: Projects (#projects), Writing (#writing), Background (#background), Contact (#contact). Hero uses #top. Use real anchor links.
- Show rail only at viewport width >=1200px AND hover:hover AND pointer:fine. Fix it at the right edge, vertically centred, with generous clearance from the centred 760px content and a right inset >=16px.
- Each item visually appears as a minimal horizontal bar approximately 16-24px wide and 2px high, but its link hit area is at least 44x44px. Use an accessible nav label "Page sections" and accessible link names.
- Reveal the corresponding section title to the LEFT on hover and keyboard focus. Labels must not shift layout, cover article text or clip against the screen edge. Make them part of the link, not hover-only tooltips requiring a mouse. Give the active bar a distinct shape/length as well as colour.
- Track exactly one active section after leaving the hero. Use aria-current="location" only on the active destination. During the hero, no section is active. Support scrolling in either direction, direct fragment URLs, resized windows, expanded/collapsed details and Writing content inserted after fetch. Do not rely on cached initial document heights.
- Contact must become active at the document bottom, even if too short to cross a normal activation threshold. At the top/hero, clear section active states. Apply consistent states to rail and narrow-screen links.
- Below 1200px OR on coarse-pointer/non-hover devices, hide the rail completely and use the header text-link row. No hover-dependent mobile navigation; no rail overlapping content.
- Clicking any section link immediately initiates movement to its target. Use a short native smooth scroll under normal motion preferences; instantaneous movement under reduced motion. Respect sticky-header height so headings remain visible, including the taller mobile header. Retain real fragment navigation and back/forward behavior. No long scrolling sequence or scroll hijacking. Where focus is moved programmatically, use a focusable destination heading with tabindex="-1" and preventScroll so keyboard navigation continues at the destination.
- Keep ordinary header section links as the fallback when JS is unavailable; hide the enhancement-only rail in that case.

# Rocket back to top
- Use a fixed bottom-right native anchor to #top with accessible name "Back to top". Inline SVG minimal line-art rocket, oriented up or diagonally up-right; no emoji, flames, particles or sound. Minimum 44x44px target, visible focus ring, comfortable inset including mobile safe-area insets.
- Reveal only when the visitor is within 240px of the document bottom AND has scrolled at least one viewport from the top. Use current document dimensions, accounting for resize, fetched posts and opened/closed case studies. Hide again when outside that region. Short pages should not show it unnecessarily.
- On activation, shake ONLY the rocket SVG very slightly for about 160ms (2-3px translation and <=5deg rotation), once, then return to #top with native smooth scrolling. No looping, layout shift or long delay. Ignore repeated triggers during that short launch sequence and reset reliably; avoid leaving the button disabled.
- With prefers-reduced-motion: reduce, skip both shake and smooth scroll and return instantly. If the preference changes, honor it on the next interaction.
- After activation, move keyboard focus to the hero heading with preventScroll; the hidden rocket must not retain focus. Do not steal focus when visibility changes due to ordinary scrolling; if currently focused, keep it visible until blur. Hidden controls must not be keyboard-focusable.
- Keep rocket below and separate from the section rail. It must not cover footer text, contact links or mobile header navigation; reserve space as needed.
- Without JS, provide a simple normal-flow "Back to top" anchor near the footer; no dead rocket control. Print hides all floating controls.

# <head> / SEO / link previews
- <title>Joseph Kim | AI Product and Strategy Operator</title>
- meta description: "Founder-operator turning AI capabilities into deployed products and workflows. Case studies: DataPlug and TraceNote."
- canonical: https://jklabs-ai.github.io/
- Open Graph + Twitter card tags (og:title, og:description, og:url, og:type=website, og:image=https://jklabs-ai.github.io/assets/img/og-image.png with width 1200 / height 630, twitter:card=summary_large_image). Absolute URLs.
- favicon link to /assets/img/favicon.svg
- JSON-LD Person schema: name Joseph Kim, url https://jklabs-ai.github.io/, sameAs ["https://www.linkedin.com/in/josephkimhk/", "https://github.com/jklabs-ai"].

# Page content (use verbatim)

## Hero
- h1: Joseph Kim
- Positioning line (large): Founder-operator turning AI capabilities into deployed products and workflows.
- Sub-paragraph: I scope the problem, design the product and ship working prototypes, using Cursor and AI as my implementation tools. Then I build the go-to-market and operating systems around them. Previously founded AlgoBlocks, a Draper-backed DeFi aggregator.
- "Open to" line (small label style, accent): Open to: AI deployment strategy, AI product, and strategy & operations leadership roles. Hong Kong or remote.
- Buttons (in this order):
  1. Resume (PDF) -> /assets/resume/Joseph-Kim-Resume.pdf (primary, opens in new tab)
  2. LinkedIn -> https://www.linkedin.com/in/josephkimhk/
  3. GitHub -> https://github.com/jklabs-ai
  4. Email -> mailto:0xjosephk@pm.me
  External HTTP(S) links open in a new tab with rel="noopener noreferrer". Mailto links use normal mail handling, not a forced new browser tab.

## Selected Projects
Section intro: Two products I owned end to end, from problem definition to a live deployment. My role on both: product owner. I defined the problem, scope, flows and decisions, and built the code with Cursor under my direction.

Render each project as an <article> card with: title, one-line tagline, status pill, 2-3 sentence summary, tech tags, link buttons, an optional screenshot slot, and a native <details><summary>Read the case study</summary> ... </details> expander (no JS) containing the subsections below.

Screenshot slots: /assets/img/projects/dataplug-1.png and tracenote-1.png. Only render a figure when its image exists; otherwise leave an HTML TODO comment, not an empty frame or broken request. If an existing screenshot fails at runtime, remove its figure gracefully. Supply descriptive alt text and dimensions/aspect ratio to avoid layout shifts. Do not fabricate screenshots.

### Project 1: DataPlug
- Title: DataPlug
- Tagline: API monitoring that checks the response, not just the status code.
- Status pill: Live · Development paused
- Summary: A 200 OK with an empty result is still a failed check. DataPlug calls a saved endpoint on demand or about every five minutes, then checks the HTTP status, one JSON rule and a response-time limit. It fires a webhook when a monitor flips between healthy and down.
- Tech tags: Next.js 15 · React 19 · TypeScript · Tailwind · Supabase Auth & Postgres · pg_cron · Webhooks
- Links: Live product -> https://www.dataplug.dev
- Under the link buttons, small muted text: "Source code available on request." (The repo is private; do not link to it.)

Case study (inside <details>):

**The problem.** Small engineering teams often only learn an API has failed when a person notices, or when their monitor treats any HTTP 200 as success. DataPlug is for teams that provide APIs their customers depend on, and teams that depend on critical third-party APIs and need to check them against their own requirements.

**What it does.**
- Save up to five monitors: URL, HTTP method, expected status code.
- Call private endpoints with a bearer token or an API key header.
- Require one JSON path (e.g. `data.status`) to exist, or an array to be non-empty.
- Fail the check if the response is slower than a 1-15 second limit.
- Run checks manually or on a ~5-minute schedule; view the latest result and recent history (healthy, down, timeout, status code, latency, error).
- Send a webhook when a monitor changes between healthy and down.

**Key product decisions.**
1. Check the response, not only the status code. One JSON path and one check type keep setup to a few fields. Trade-off: a passing check doesn't prove the payload is business-correct.
2. Active checks, no agent. DataPlug sends its own requests, so there's nothing to install. Trade-off: failures that only real users hit can be missed.
3. Alert on state change only. Webhooks fire on `monitor.failed` and `monitor.recovered`, not on every failed run, so no alert spam. A failed webhook never fails the check.
4. A narrow free MVP. Five monitors, five-minute checks, a short history, $0, no credit card. Founding-customer pricing was an email conversation, not a checkout. Easy to try; no in-app revenue flow.
5. Scheduling in the database. A Supabase `pg_cron` job calls a secured app route about every five minutes, instead of relying on the host's cron.

**How it's built.** One Next.js app serves the marketing site, dashboard and the check worker. Supabase handles accounts (Auth) and stores monitors and history (Postgres with row-level security). A database job wakes up every five minutes and calls the deployed app with a shared secret. Local unit tests cover the core decision logic (monitor limits, check timing, latency rounding, auth flows): 72 passing in the documented run.

**Status.** Live at dataplug.dev. Completed the Launch incubation programme. New commercial development is paused; the repository is kept as the record of the MVP.

### Project 2: TraceNote
- Title: TraceNote
- Tagline: Voice-first contact capture for event networking, inside Telegram.
- Status pill: Live private beta · Paused
- Summary: Scan a contact's Telegram QR code and record a short voice note. TraceNote transcribes it, uses AI to extract structured CRM fields and a follow-up draft, and saves a searchable, exportable record. It never sends a message for you.
- Tech tags: Python · python-telegram-bot · Google Cloud Speech-to-Text · DeepSeek LLM · SQLite · Telegram Mini App · Railway · Vercel
- Links: Website -> https://tracenote.app | Bot -> https://t.me/traceNotebot
- Under the link buttons, small muted text: "Source code available on request." (The repo is private; do not link to it.)

Case study (inside <details>):

**The problem.** Conferences produce high-intent contacts but weak follow-through. Details live in memory, notes apps or scattered chats; CRM entry is slow; a personal follow-up is easy to put off. TraceNote targets the seconds after a handshake: minimal taps, voice-first, structured output, so follow-up can happen the same day.

**Who it's for.** Business development, partnerships and sales people who network at conferences and side events, and solo operators who want a lightweight personal CRM inside Telegram rather than a full CRM setup.

**How it works.**
1. Tap "Scan Contact QR" in the bot; a Telegram Mini App reads the contact's profile QR.
2. Send a voice note about the conversation.
3. Google Speech-to-Text transcribes it, with phrase hints for names, companies and events.
4. An LLM returns strict JSON: name, company, role, where you met, context, follow-up action, reminder date and a draft message.
5. The record is cleaned, saved and confirmed in chat. Search it, list contacts or export to CSV.
6. If there's a Telegram handle and a draft, review it with Edit, Copy or Open Chat. You send it yourself.

**Key product decisions.**
1. Telegram-first, not a standalone app. Users already message contacts there; nothing to install. Trade-off: bound to Telegram's UX and API limits.
2. Voice note, not a typed form. Fastest capture while walking between booths. Trade-off: transcription and extraction errors, handled with phrase hints and prompt rules (e.g. resolving "next Friday" to a real date).
3. Structured extraction, not a chatbot. The model must return a fixed JSON schema, which makes records searchable and exportable.
4. No auto-send. Drafts are suggestions with copy and open-chat shortcuts, preserving trust and user control at the cost of a few extra taps.
5. Simple infrastructure. SQLite scoped per user and an optional user whitelist for private beta, instead of a managed database and a full auth system.

**How it's built.** A Python bot on Railway, a static QR-scanning Mini App on Vercel, Google Cloud Speech-to-Text for transcription, DeepSeek for structured extraction, and SQLite for contacts and lightweight product analytics (an owner-only funnel view).

**What I learned.** The pain was weaker than I assumed. Many field BD people capture informally: the strongest make mental notes or write things up in a notebook or back at the hotel, and some already use dedicated capture devices that sync to their CRM. A new capture habit inside Telegram wasn't a strong enough pull, which points to an ICP or pain-intensity mismatch. Next time I'd test how often and how badly the problem hurts before building the full loop.

**Status.** The bot and site are live in private beta. Development is paused.

## Writing
- Section intro: Notes on AI deployment, product and operating strategy.
- Render cards from /data/posts.json, newest first. Schema per entry:
  { "title": string, "url": string, "platform": "LinkedIn" | "Medium" | "Substack" | "X" | "Site" | string, "date": "YYYY-MM-DD", "summary": string (one line), "image": optional path under /assets/img/posts/, "featured": optional boolean }
- Card: thumbnail on top (16:9, object-fit cover). If no image, show a neutral fallback block with the platform name in small caps on a light grey background. Then platform · date (formatted "14 Nov 2026"), title (link), one-line summary. Whole card clickable, opens in new tab.
- Grid: 1 column on mobile, 2 columns from 768px.
- Empty state (posts.json is []): a single muted line: "Writing is on the way. For now, I post on LinkedIn." with a link to my LinkedIn.
- Include the empty state in static HTML before JS runs. If fetch fails or JSON is invalid, preserve that state without an uncaught exception. Handle a missing thumbnail with the platform fallback. Validate entries, allow only HTTP(S) post destinations and local image paths, and use DOM textContent rather than injecting strings with innerHTML. Parse YYYY-MM-DD as a date-only value so timezone conversion cannot change its day. The optional featured flag is reserved metadata for now; ordering remains newest first.
- In README, document exactly how to add a post: add an object to posts.json, optionally drop an image into /assets/img/posts/, commit.

## Background
Short intro line: Founder, operator and strategy lead across digital assets, fintech and AI.

List (company bold, role, then one line):
- **Selvara** · Founder · Independent advisory practice: fundraising readiness and strategy for early-stage Web3, fintech and insurtech founders.
- **AlgoBlocks** · Founder · Built and led a Draper-backed DeFi aggregator from scratch: USD 2.3M+ raised from Draper and tier-one crypto VCs, 120,000+ users, 50+ protocol and marketing partnerships. UC Berkeley SkyDeck.
- **BC Group (now rebranded as OSL)** · VP and Senior Advisor, Hong Kong · Evaluated 300+ blockchain startups and helped facilitate USD 220M+ in institutional capital.
- **Earlier** · Strategy, research and advisory roles at Sterling Capital Partners, Control Risks and JLL.
- **Education** · MBA, HKUST · Blockchain Strategy, Oxford Saïd Business School · Undergraduate studies in the United States.

Below the list: "Full details in my resume." linking to the PDF, only when the PDF exists.

Resume availability applies everywhere: if /assets/resume/Joseph-Kim-Resume.pdf is absent, omit all Resume links and this sentence, leave HTML TODO comments, and list this as a publication blocker. Do not create a fake resume, dead links or a disabled primary CTA. With no PDF, LinkedIn becomes the first visible hero action using the primary style; restore the specified Resume-first hierarchy once the owner supplies the PDF.

## Contact / Footer
- Heading: Contact
- Line: The fastest way to reach me is email or LinkedIn.
- Repeat the Email, LinkedIn, GitHub and Resume links.
- Small print: "jklabs is my personal build handle for AI prototypes, not a company." · "Last updated November 2026" · "© 2026 Joseph Kim"

# Behaviour details
- Smooth-scroll anchor links (CSS scroll-behavior, disabled under prefers-reduced-motion); offset for the sticky bar via scroll-margin-top.
- Add print styles: force light colours, hide navigation/floating controls, show useful external link URLs, and show case-study content even when details are collapsed. Avoid clipping or huge blank spaces.
- No console errors. Validate HTML.

# Acceptance checks and handoff
After implementation, run checks actually available; do not install tools without approval or claim tests you did not run.
- Validate HTML and JSON syntax, internal fragment destinations, local asset references and JS syntax with available tools. Check no runtime console errors or unexpected failed requests, except explicitly reported pre-publication omissions.
- If browser tools are available, test 320, 375, 768, 1024, 1280 and 1440 CSS px, plus 200% zoom, both themes, keyboard-only controls and reduced motion. Check no horizontal page overflow, clipping, unreadable copy or floating controls over content. Navigation text row may itself scroll horizontally.
- Test theme initial OS preference, saved override, reload persistence and blocked storage. Test case studies remain open during theme changes.
- Test all section links, direct hashes, active-state changes up/down, Contact at page bottom, expanded details and delayed Writing load. Verify touch layout has no hover-only controls.
- Test rocket appearance/disappearance, one-shot shake, repeated clicks, reduced motion, focus returning to hero and short-page behavior.
- Test Writing with [] and temporary sample entries (including missing image and malformed data); remove test entries before handoff. Do not publish invented writing.
- Test core content/links with JS disabled; confirm print styles hide controls and expose case studies.
- Report: files changed; checks actually performed and results; unperformed checks with manual instructions; every TODO and pre-publication blocker, including owner verification of supplied claims/statuses.
- README: local preview command `python3 -m http.server 8000`, then http://localhost:8000; if Python is unavailable, report that rather than installing a tool. Explain why opening index.html directly cannot fetch Writing JSON. Include how to add posts, screenshots and the resume, theme behavior, English-only scope and expected GitHub Pages source main / (root).
- Finish with a short PROJECT_STATUS.md recording completed work, checks, open TODOs and next steps for a fresh Cursor session. Never store secrets or unnecessary personal data.
- STOP for owner review. Do not commit, push, deploy, change remotes or alter GitHub settings.
```
