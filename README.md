# 60-Minute Build Challenge

A full-stack MVP web application for the NxtWave "Build Your First AI Project in 60 Minutes" workshop campaign.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, how it works, example project, final CTA |
| `/challenge` | Interactive 3-step challenge wizard |
| `/dashboard` | Campaign owner dashboard (also accessible at `/admin`) |

---

## Key Configuration

### Workshop Registration URL

**File:** `src/config.ts`

```ts
export const WORKSHOP_REGISTRATION_URL = '__REPLACE_WITH_OFFICIAL_REGISTRATION_URL__';
```

Replace the placeholder with the official NxtWave registration URL. Once configured:
- The "Register for the Workshop" button activates automatically.
- Campaign attribution parameters (`utm_source`, `ref`, `utm_campaign`) are appended to the URL.

Do not invent a URL. The button shows a developer notice until the real URL is set.

---

## Features Implemented

### Landing Page
- Responsive navbar with mobile menu
- Hero section with floating card animation
- Four-stage campaign explanation (Attract, Engage, Convert, Amplify)
- How It Works — 4-step student journey
- Example project blueprint card (clearly labelled as example)
- Final CTA section

### Interactive Challenge (3 Steps)
- **Step 1:** Category selection + custom problem description with validation
- **Step 2:** Optional project definition fields (target user, inputs, outputs)
- **Step 3:** Generated blueprint with all 12 required sections
- Challenge state persisted to localStorage (survives page refresh)
- "Edit My Idea" returns to step 2 without losing inputs
- "Start Again" requires confirmation before resetting
- Loading state during blueprint generation (~1.8s)
- Error state with retry option

### Project Blueprint
- 12 structured sections: title, problem, user, solution, features, I/O, first version, tools, 60-min plan, starter prompt, limitation, next step
- **Copy Blueprint** — copies full Markdown to clipboard
- **Download Blueprint** — downloads `.md` file
- Success feedback on copy/download actions
- Prototype notice: clearly states template-based generation, not a live AI call

### Workshop Registration CTA
- Uses `WORKSHOP_REGISTRATION_URL` from `src/config.ts`
- Inactive (shows dev notice) until URL is configured
- Tracks `workshop_cta_clicked` event with attribution
- Appends `utm_source`, `ref`, `utm_campaign` to registration URL without altering the destination

### Referral & Sharing
- Generated referral code per session (format: `BMC-XXXXXX`)
- Native Web Share API if browser supports it; clipboard fallback otherwise
- Pre-written invitation message
- Tracks `referral_link_copied` and `share_clicked` events
- Prototype notice: referral attribution is not server-verified

### Campaign Dashboard (`/dashboard` or `/admin`)
- **KPI Cards:** Challenge starts, blueprints generated, workshop CTA clicks, confirmed registrations (not connected notice), total spend, cost per click
- **7-Day Target Tracker:** Editable daily actuals vs. cumulative targets (30/70/140/230/320/420/500)
- **Budget Tracker:** Editable actual spend per category, remaining budget calculation
- **Source Tracking Table:** Editable starts, completions, clicks, spend per source (registrations marked "Not Connected")
- **Event Log Summary:** Counts for all 9 tracked events
- **Export CSV:** Downloads complete dashboard data
- **Reset Demo Data:** Clears all dashboard data and event log (requires confirmation)
- All data stored in localStorage

### Analytics & Attribution
- 9 events tracked: `landing_page_view`, `challenge_started`, `problem_submitted`, `blueprint_generated`, `blueprint_copied`, `blueprint_downloaded`, `workshop_cta_clicked`, `referral_link_copied`, `share_clicked`
- Campaign source captured from URL params on first load (`utm_source`, `ref`)
- No sensitive personal data recorded
- Structured for easy external analytics integration (stub `sendToExternal` in `src/analytics.ts`)

---

## Architecture

```
src/
├── config.ts           — Workshop URL, campaign constants
├── analytics.ts        — Event tracking (localStorage + external stub)
├── storage.ts          — Challenge & dashboard state (localStorage)
├── projectGenerator.ts — Blueprint generation (template-based)
├── attribution.ts      — Referral code & share URL utilities
├── App.tsx             — Router
├── main.tsx            — Entry point
├── index.css           — Design system (warm blush palette)
├── components/
│   ├── Navbar
│   ├── HeroSection
│   ├── CampaignStages
│   ├── HowItWorks
│   ├── ExampleProject
│   ├── ChallengeWizard    — Main 3-step wizard
│   ├── ProjectBlueprint   — Blueprint display + copy/download
│   ├── WorkshopRegistrationCTA
│   └── ReferralShare
└── pages/
    ├── LandingPage
    ├── ChallengePage
    └── DashboardPage
```

---

## Prototype Limitations

1. **No backend:** All data is stored in the browser's localStorage. Data is not shared across devices or browsers.
2. **No real AI API:** Blueprints are generated using structured templates per category. This is clearly labelled in the UI. To connect a real model, replace `generateBlueprint()` in `src/projectGenerator.ts`.
3. **Registration not tracked:** The "Confirmed Registrations" field in the dashboard is not connected to any registration system. It is intentionally labelled "Not Connected."
4. **Referral attribution is unverified:** Referral codes are client-side only. There is no server-side verification that a referral code led to an actual registration.
5. **Analytics are local-only:** Events are stored in localStorage. No events are sent to external services. Add your analytics service in `sendToExternal()` in `src/analytics.ts`.
6. **Dashboard is not access-controlled:** The `/dashboard` route has no authentication. It is appropriate for a local demo only.

---

## Analytics Events

All events are stored locally in `localStorage` under `challenge_analytics_events`. None are sent to external services in this prototype.

| Event | When fired |
|---|---|
| `landing_page_view` | App loads |
| `challenge_started` | User clicks any "Start" CTA |
| `problem_submitted` | User advances from Step 1 |
| `blueprint_generated` | Blueprint successfully generated |
| `blueprint_copied` | "Copy Blueprint" clicked |
| `blueprint_downloaded` | "Download Blueprint" clicked |
| `workshop_cta_clicked` | "Register for Workshop" clicked |
| `referral_link_copied` | Referral link or invitation copied |
| `share_clicked` | Share button clicked |

---

## Demo Script (3-Minute Run-Through)

**Student Journey:**
1. Open `/` — show the landing page, highlight the 4-stage campaign structure
2. Click "Start the 60-Minute Challenge"
3. Select "Studying and exam preparation"
4. Enter: *"Students don't know how to prioritise subjects before exams with overlapping deadlines"*
5. Click Continue — on Step 2, fill in target user: *"Final-year engineering students"*
6. Click "Help Me Shape My Idea" — show the loading state, then the blueprint
7. Show each section of the blueprint (title, solution, 60-min plan, starter prompt)
8. Click "Copy Blueprint" → show success feedback
9. Click "Download Blueprint" → show the `.md` file download
10. Scroll down — show Workshop CTA (dev notice if URL not configured)
11. Show the referral share section with the referral code

**Dashboard:**
1. Open `/dashboard`
2. Show KPI cards — challenge starts = 1, blueprint = 1, etc.
3. Enter Day 1 actual registrations: `5`
4. Show how the progress bar updates
5. Enter spend for one category
6. Click "Export CSV" → show the download
7. Highlight the "Not Connected" badge on registrations and the prototype notice

---

## How This Supports 500 Registrations in 7 Days

The challenge creates a **low-friction, high-value engagement** that converts passive awareness into active intent:

1. **Attract** — Students share a link to a free, beginner-friendly AI challenge. Lower entry barrier than registering directly.
2. **Engage** — The 3-step wizard produces a personalised, useful artefact (the blueprint). Students feel accomplished.
3. **Convert** — Immediately after generating a blueprint, the workshop CTA appears with momentum: *"You've taken the first step."*
4. **Amplify** — Every student gets a referral code. Peer sharing multiplies reach without additional spend.

The ₹2,000 budget supports ambassador incentives and a small paid test, while the challenge itself creates organic sharing at zero marginal cost per share.
