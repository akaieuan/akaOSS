# Typography and motion: one scale, one easing

2026-09-02. Design record for the akaoss refresh on `design/typography-motion`.

## Why

The site set type in thirteen distinct pixel sizes below 16px, five of them
arbitrary (`text-[10.5px]`, `text-[11.5px]`, `text-[12.5px]`, …), and its
nine page headings used five different sizes, with the home hero the smallest
heading on the site. Motion was roughly a hundred `transition-*` utilities on
Tailwind's default 150ms ease, one hand-typed card string copied into five
files, no keyboard-focus treatment beyond the browser's own, and reduced
motion honoured only by the mark and the hero. None of that was a style; it
was drift.

The brief: keep akaSTYLE (Inter light, mono micro-labels, warm oklch
neutrals, accents as punctuation) and add Apple's discipline: one scale, one
easing, one card, one button shape.

## Decisions

### Type scale (`globals.css`, `@theme`)

| step      | size          | lh   | tracking | for                                |
| --------- | ------------- | ---- | -------- | ---------------------------------- |
| `display` | 36→48px fluid | 1.05 | -0.03em  | the hero                           |
| `title-1` | 28→36px fluid | 1.12 | -0.025em | page heading                       |
| `title-2` | 22px          | 1.25 | -0.02em  | section heading                    |
| `title-3` | 18px          | 1.35 | -0.01em  | card title, list row               |
| `lede`    | 17px          | 1.55 |          | the paragraph under a heading      |
| `body`    | 15px          | 1.6  |          | prose                              |
| `small`   | 13px          | 1.55 |          | captions, blurbs, mono meta lines  |
| `meta`    | 11px          | 1.5  |          | mono ids, dates, hints, chips      |

Tailwind's `text-xs` / `text-sm` remain for single-line UI (nav, pager,
buttons) and `text-xs` for mono commands. Weight stays explicit at the call
site (`font-light`, `font-medium`); the step owns size, leading and tracking,
so a heading reads `text-title-2 font-light` and nothing else.

Inter loads with `axes: ["opsz"]` (14–32): `title-1` and `display` render
in the Display cut with no second font. `text-wrap: balance` on h1–h3,
`text-wrap: pretty` on p.

### Motion

- `--ease-out-quart` = `cubic-bezier(0.25, 1, 0.5, 1)`, set as Tailwind's
  `--default-transition-timing-function` with
  `--default-transition-duration: 200ms`. Every existing `transition-*`
  utility inherits both.
- The hero `reveal` keeps its 700ms / 120ms stagger, now on the house easing
  and a 12px rise.
- `.settle`: below-the-fold blocks rise 12px and fade as they enter, via
  `animation-timeline: view()` over `entry 0%` → `entry 60%`. It animates
  `translate` so it composes with `.card-link`'s `transform`. Gated by
  `@supports` and `prefers-reduced-motion: no-preference`; any other browser
  or preference sees the content in place. Applied to cards, feed rows and
  short sections, never to the hero or to tall sections.
- A global reduced-motion rule collapses every transition and timed
  animation.

### Surfaces and controls

- `.card` (surface) and `.card-link` (2px rise, solid fill, 80ms press)
  replace the string that was copied into five files. `.hover-lift` is
  removed; `.card-surface` stays because registry components consume its
  compat tokens.
- `:focus-visible`: a 2px `--ring` outline with 2px offset, not animated.
  `ThemeToggle` drops its private ring and `outline-none`.
- One button shape: the pill. `primaryCta` is `rounded-full` with a 2%
  press on `:active`.

### Colour

Running text uses `foreground`, `foreground/80` (secondary) and
`muted-foreground`. The `muted-foreground/70` and `/80` variants on running
text are flattened to `muted-foreground`; `/40` stays for the `·` separators.

## Out of scope

- `components/hitl/*`. The registry primitives ship to users; a change there
  is a registry rebuild and a mirror to hitl-ai2, so it is its own pass.
- `components/inertial/*`, the research exhibits.
- hitl-ai2's `apps/demo-langgraph/app/globals.css`, which still carries the
  pre-oklch hex theme. Align it in its own change.
- `LAYERS` and `PATTERNS` in `lib/content.ts` are unused and say "Eleven
  primitives". Delete separately.

## Verification

`pnpm typecheck && pnpm build`, then the home, `/projects/hitl-kit`,
`/components`, `/registry` and `/research` at 375px and 1280px in both
themes, keyboard-tab through a page for the ring, and a reduced-motion pass.
