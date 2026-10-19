# Selected Work — Redesign & Implementation Spec

Status: **draft for approval** (no code written yet)
Scope: replace the current static 2-up card grid in `src/components/sections/WorkSection.tsx`
with an interactive, on-brand project showcase.
Files allowed to change: `WorkSection.tsx`, `ProjectCard.tsx` (split into new parts),
`WorkSection.css`. Additive only — no other section is touched.

---

## 1. Why the current section feels flat

| Symptom | Root cause today |
| --- | --- |
| Reads as "two boring images" | Two equal cards, same weight, no focal point (no hierarchy). |
| No interaction beyond a lift | Hover only scales image 1.04 and reveals a badge. Nothing to *explore*. |
| Disconnected from the site's craft | The hero is a physics-driven 3D wallet; this is a plain CSS grid. |
| No storytelling | Title + 1 line + tag pills; no case-study feel, no outcome/metric. |
| Static layout | Fixed 2 x N grid; no motion language, no cursor play, no depth. |

The rest of the page has a strong identity (see §2). The work section is the one block that ignores it.

---

## 2. The "vibe" we must match (extracted from the live codebase)

**Color tokens (already in the project)**
- Primary navy/indigo: `#111A5C` (`--navy-primary`), hover `#1a2779`, deep `#0a103c`.
- Muted text: `#58617d` / `#5c5c70`. Subtle borders: `rgba(17,26,92,0.08)`.
- Page bg: `#F3F3F3` (`--page-bg`). Surfaces: `#ffffff` / `#FAFAFC`.
- Hero accent palette (mapped in `whatWeDo/config.js`): blue `#2b7ffb`, green `#19b954`,
  yellow `#fcc80c`, orange `#fb6b07`, charcoal `#1e1e1e`, mint `#10B981`.

**Shape + surface language**
- Pills everywhere (`border-radius: 9999px`), cards `20–28px` radius.
- Hairline borders `1px solid rgba(17,26,92,0.08)` + soft long shadows
  (`0 14px 32px -14px rgba(26,15,92,0.12)`).
- No hard black; depth comes from layered soft shadows + inset highlights.

**Typography**
- Body/copy: Plus Jakarta Sans. Eyebrow: 11–12px, weight 700, `0.14em`, uppercase, navy 72%.
- Headline: weight 500–700, `letter-spacing: -0.02…-0.03em`, tight line-height.

**Motion language (from `src/motion/tokens.js`) — reuse these, do not invent new ones**
- Ease out: `[0.22, 1, 0.36, 1]`. Durations: `fast 0.25` / `base 0.5` / `slow 0.9`.
- Springs: `soft {120,20}`, `snappy {300,26}`, `pop {420,16}`, `bouncy {180,14}`.
- Staggers: word `0.08`, line `0.06`, tile `0.045`. Rise distance `28`, slide `24`.
- Scroll-reveal, then a single deliberate "hero" motion (like the revenue-card tilt).

**The hero metaphor we can echo:** the hero is a *fanned deck of cards* you could almost
pick up. The work section should feel like the same deck, laid out for inspection.

---

## 3. Design concept: "The Project Deck"

> A curated deck of case studies you browse like physical cards — a satisfying, tactile
> interaction that mirrors the hero's wallet/card fan and finally makes the section *play*.

**Core idea:** one large "focus" card + a live index. You move through the deck; the next
case study arrives with a clip-path wipe and a spring settle, metadata cross-fades, and a
project-accent color travels from the index row into the card (chip, cursor ring, progress).

Two panes (desktop):

```
┌─────────────────────────────────────────────────────────────────────┐
│  SELECTED WORK                                                       │
│  Projects we're proud of                       [ View all work  → ]  │
│  Carefully engineered web applications…                              │
│                                                                       │
│  ┌───────────────────────────────┐   ┌────────────────────────────┐  │
│  │                               │   │ 01  Classly                │  │  ← rows are buttons
│  │      FOCUS MEDIA CARD         │   │     Web App · Dashboard ●  │  │
│  │   (4:3, 24px radius, depth)   │   ├────────────────────────────┤  │
│  │                               │   │ 02  Hazz                   │  │
│  │   [ View case study → ]       │   │     Web App · UI/UX     ●  │  │
│  └───────────────────────────────┘   ├────────────────────────────┤  │
│         ● ● ○ ○  01 / 04             │ 03  Aura Fintech           │  │
│                                      ├────────────────────────────┤  │
│         ← hover / focus / drag →     │ 04  Haven Hospitality      │  │
│                                      └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Interaction model (the "interactive" part)**
1. **Index hover/focus** → preview swaps in the focus card with a masked wipe + spring scale.
2. **Index click** → "commit": card does a small pop, badge becomes active, URL hash updates
   (`#work-classly`) — no route needed yet.
3. **Keyboard**: `↑/↓` or `←/→` move the active index (roving `tabindex`), `Enter` commits,
   `Home/End` jump. Fully operable without a mouse.
4. **Drag / swipe** on the focus card (Framer Motion `drag="x"`, low dragElastic) cycles the deck;
   an accent progress bar reflects position; momentum + rubber-band.
5. **Cursor play (desktop, hover-capable only)**: a small "View →" cursor ring that lags behind
   the pointer over the media (spring `soft`), translating the hero's 3D-cursor motif into 2D.
6. **Idle auto-advance** only while the section is in view AND the user has not interacted,
   paused on hover/focus, disabled under `prefers-reduced-motion`.

**Why this beats a grid:** it gives the section a *point of view*, reuses the site's card
metaphor, is genuinely explorable, and degrades to a simple stacked list on mobile.

---

## 4. Layout & responsive rules

- Container mirrors current: `max-width: 1200px`, `padding: 96px 24px 120px`.
- Desktop `≥ 1024px`: two columns `minmax(0, 1.15fr) / minmax(0, 0.85fr)`, gap `48px`, items `center`.
- Tablet `640–1023px`: single column — header, focus card, then horizontal snap-scroll index.
- Mobile `< 640px`: header, focus card (4:3), index becomes horizontal scroll-snap chips;
  drag/swipe is the primary affordance; `View all work` is full-width pill (as today).
- Focus card: `aspect-ratio: 4/3`, radius `24px`, hairline border, layered shadow.
- Nothing overlaps the floating pill nav: keep `scroll-margin-top` (currently `112px`).

---

## 5. Motion choreography (numbers)

| Step | Trigger | Motion | Token |
| --- | --- | --- | --- |
| 1 | Section enters viewport (threshold 0.2) | Eyebrow fades, headline words rise `28`, stagger `0.08` | `DIST.rise`, `STAGGER.word`, `DUR.slow` |
| 2 | after header (~0.55s) | Focus card rises `28` + scale `0.96→1`, index rows slide in `24`, stagger `0.06` | `CARD_ENTRANCE`, `STAGGER.line` |
| 3 | Active project changes | Image wipe via `clip-path` (`inset` from right, `0.55s` `EASE.out`) + scale `1.04→1`; meta cross-fade `0.3s`; accent color transition `0.4s` | `EASE.out` |
| 4 | Hover a row | Row underline grows, number tints to project accent, focus card pointer ring appears (spring `soft`) | `SPRING.soft` |
| 5 | Commit | Badge pops (`scale 0.9→1`, spring `pop`), progress dot fills | `SPRING.pop` |
| 6 | Idle (6s, allowed) | Auto-advance every 6s, pauses on hover/focus | `DUR.base` |

Positioning rule (learned from the hero): **never animate `x`/`y` on the same element that is
positioned with `transform`.** Use an outer positioned wrapper + an inner `motion` element.

---

## 6. Component / file plan

```
src/components/sections/
├─ WorkSection.tsx        // orchestrator: state, selection, keyboard, idle timer, a11y
├─ ProjectCard.tsx        // FOCUS CARD ONLY (media, wipe, badge, cursor ring, drag)
├─ WorkIndex.tsx          // NEW: interactive index list (rows = buttons, roving tabindex)
├─ useProjectDeck.ts      // NEW: small hook — active index, next/prev/select, reduced-motion
└─ WorkSection.css        // all styles for the three parts (BEM-ish, same naming style)
```

**`projects` data** — extend the existing shape (keep current fields, additive only):

```ts
export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  year: string;        // NEW  e.g. "2025"
  accent: string;      // NEW  one of the hero accents, used for dot/ring/underline
}
```
`accent` per project: Classly→`#2b7ffb`, Hazz→`#19b954`, Aura→`#fb6b07`, Haven→`#fcc80c`.

**State (in `WorkSection.tsx`)**
- `activeIndex` (number), `hasEntered` (unchanged IntersectionObserver),
  `userInteracted` (disables idle), `prefersReduced` (Framer `useReducedMotion`).
- Keyboard handler on the index `role="listbox"`, rows `role="option"` + `aria-selected`.
- Idle timer cleared on hover/focus/visibility change.

**A11y (non-negotiable)**
- Index is a real `listbox`; rows get `aria-selected`, `aria-controls="work-focus"`.
- Focus card has `id="work-focus"`, `aria-live="polite"` on a visually-hidden status that
  announces the active title; media has the existing descriptive `alt`.
- Focus ring: `2px solid var(--navy-primary)` offset `6px` (matches current pattern).
- `prefers-reduced-motion`: no wipe/idle/drag inertia — instant swaps, opacity-only fades.
- Contrast: all text ≥ 4.5:1 (navy on `#F3F3F3`, muted `#58617d` on white) — audit in QA.

---

## 7. Copy (unchanged unless you say otherwise)
- Eyebrow: `SELECTED WORK`
- Headline: `Projects we're proud of`
- Subtitle: `Carefully engineered web applications, digital products, and brand experiences.`
- CTA: `View all work →`
- Per project: existing `title`, `description`, `tags`, plus `year`.

---

## 8. Out of scope / assumptions
- No router work; commit only updates the hash. Real case-study pages are a later task.
- Images stay the current `picsum` placeholders until real assets exist.
- No new dependencies (Framer Motion, React, Tailwind already present).
- All other sections, the navbar, hero, and every `*_LAYOUT` config stay untouched.

---

## 9. Acceptance criteria
1. Section is keyboard-operable end-to-end; `Esc`/blur never traps focus.
2. Hovering/focusing an index row swaps the focus card with a masked wipe, < 600 ms.
3. Drag/swipe cycles projects on desktop and mobile; snapping feels springy, not floaty.
4. `prefers-reduced-motion: reduce` → no movement, no idle, content fully readable.
5. Layout holds at 360 / 768 / 1024 / 1440 px with no overflow or nav overlap.
6. Lighthouse a11y ≥ 95 on the section; no layout shift (CLS) from image swap.
7. Visually indistinguishable token usage: navy `#111A5C`, bg `#F3F3F3`, 24px radius,
   `rgba(17,26,92,0.08)` borders, motion tokens from `src/motion/tokens.js`.

---

## 10. Build order (when approved)
1. Extend `Project` type + data (`year`, `accent`). 2. `useProjectDeck` hook.
3. `WorkIndex` + focus card split. 4. CSS (desktop first). 5. Keyboard + drag + idle.
6. Responsive passes. 7. Reduced-motion + a11y audit. 8. `npm run build` + visual QA
   at 4 widths.

---

## 11. Decision needed from you
Pick one, and I'll implement exactly that:

- **A. Project Deck (recommended)** — index + focus card + wipe + drag + cursor ring (above).
- **B. Cinematic full-bleed carousel** — one huge edge-to-edge project, minimal chrome, arrows.
- **C. Editorial flip index** — big numbered list; hover shows a cursor-following image; click expands.

Defaults if you don't reply: concept **A**, motion tokens as specced, copy unchanged,
`picsum` placeholders kept.
