import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Hairline } from "@/components/site/Hairline";
import { AssistNotComplete } from "@/components/site/AssistNotComplete";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { arrowLink, arrowNudge, primaryCta, reveal, stagger } from "@/components/home/shared";

import {
  DemoHeader,
  DemoPager,
  DemoSection,
  Mono,
  Note,
  Specimen,
  TileGrid,
  Well,
} from "../_components/demo-ui";
import { demoNeighbours } from "../_components/sections";

export const metadata: Metadata = {
  title: "Primitives · Brand system · akaOSS",
  description:
    "The small site-level helpers: the edge-fading hairline, the canonical Assist-Not-Complete link, the theme toggle, and the class idioms that carry the page furniture.",
};

export default function PrimitivesDemo() {
  const { prev, next } = demoNeighbours("primitives");

  return (
    <>
      <DemoHeader
        title="Primitives."
        lede={
          <>
            Not the registry primitives — those live in{" "}
            <Link
              href="/components"
              className="text-foreground underline decoration-border underline-offset-[3px] transition-colors hover:decoration-foreground"
            >
              /components
            </Link>
            . These are the handful of site-level helpers under{" "}
            <Mono>src/components/site/</Mono>, plus the class idioms in{" "}
            <Mono>globals.css</Mono> and{" "}
            <Mono>src/components/home/shared.ts</Mono> that do the rest of the
            work. Small surface on purpose: most of the page furniture is one
            class string used consistently rather than a component.
          </>
        }
        meta="3 components · 6 class idioms"
      />

      {/* ── Hairline ──────────────────────────────────────────────────── */}
      <DemoSection
        id="hairline"
        title="Hairline"
        meta="components/site/Hairline.tsx"
        description={
          <>
            A horizontal rule that fades out at both ends instead of butting
            into the page margin. Quieter than{" "}
            <Mono>border-t</Mono>, which is the point — it separates without
            drawing a line across the whole layout. Used between prose
            sections on the paper and inertial pages.
          </>
        }
      >
        <Well className="flex flex-col gap-8 py-8">
          <div>
            <p className="label mb-4">On a card surface</p>
            <Hairline />
          </div>
          <div>
            <p className="label mb-4">Against a plain border, for comparison</p>
            <div className="border-t border-border" />
          </div>
        </Well>

        <Note>
          The gradient stops at 14% and 86%, so the solid middle is a little
          over 70% of the width. Below roughly 200px the fades meet and the
          rule reads as a smudge — that is the practical floor for it.
        </Note>
      </DemoSection>

      {/* ── AssistNotComplete ─────────────────────────────────────────── */}
      <DemoSection
        id="assist-not-complete"
        title="AssistNotComplete"
        meta="components/site/AssistNotComplete.tsx"
        description={
          <>
            The canonical mention of the thesis. It exists so the phrase is
            never written as plain prose in one place and as a link in
            another: wherever the paradigm is named, it is this component, and
            it always points at the same destination.
          </>
        }
      >
        <Well className="flex flex-col gap-5">
          <p className="text-sm leading-relaxed text-foreground/80">
            Default label, in a sentence: every primitive in the registry is
            an argument for <AssistNotComplete />, made in code rather than
            prose.
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">
            With a custom label: the paradigm is also called{" "}
            <AssistNotComplete label="assist, not complete" /> when the
            sentence wants a lower-case reading.
          </p>
        </Well>

        <Note>
          The underline is <Mono>decoration-from-font</Mono> at the border
          colour and warms to <Mono>--accent-blue</Mono> on hover — one of the
          few places an accent touches text, and it is a hover state on a link
          that is already underlined, so the colour is never carrying the
          meaning on its own.
        </Note>
      </DemoSection>

      {/* ── ThemeToggle ───────────────────────────────────────────────── */}
      <DemoSection
        id="theme-toggle"
        title="ThemeToggle"
        meta="components/site/ThemeToggle.tsx"
        description={
          <>
            The one interactive control in the chrome. It renders the icon for
            the theme you would switch <em>to</em>, not the one you are in,
            and it holds the sun until it has mounted so the server-rendered
            markup and the hydrated markup agree.
          </>
        }
      >
        {/* 250px floor, not the usual 150: the mock bar beside it is 208px of
            unshrinkable content — three items sized to their own text — so at
            375px it has to have the row to itself rather than a half column. */}
        <TileGrid min={250}>
          <Specimen
            label="ThemeToggle"
            hint="live"
            footnote="The real control. Click it — the whole page follows, and every mark on the marks page re-reads its colour."
            center
            minH={64}
          >
            <ThemeToggle />
          </Specimen>
          <Specimen
            label="in a bar"
            hint="as the nav uses it"
            footnote="size-8, rounded-2xl, transparent until hover."
            center
            minH={64}
          >
            <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-[13px] font-light tracking-[0.06em] text-muted-foreground">
              <span>Research</span>
              <span>Registry</span>
              <ThemeToggle />
            </div>
          </Specimen>
        </TileGrid>

        <Note>
          There is a second way to do the same thing:{" "}
          <Mono>ThemeProvider</Mono> registers a global{" "}
          <Mono>d</Mono> hotkey that flips the theme, skipped when a modifier
          is held or when focus is in an input. Press it now — nothing on this
          page is a text field, so it will fire.
        </Note>
      </DemoSection>

      {/* ── .label ────────────────────────────────────────────────────── */}
      <DemoSection
        id="label"
        title=".label"
        meta="globals.css"
        description={
          <>
            The micro-label. Mono, 11px, 0.18em tracking, uppercase, muted —
            it is how every section on the site announces itself without
            spending a heading. Section eyebrows, column headers in the
            footer, the meta line under a masthead.
          </>
        }
      >
        <TileGrid min={200}>
          <Specimen
            label=".label"
            hint="the treatment"
            footnote="font-mono · 0.6875rem · 0.18em · uppercase · --muted-foreground"
            minH={64}
          >
            <p className="label">Human-in-the-loop measurement</p>
          </Specimen>
          <Specimen
            label="as an eyebrow"
            hint="above a heading"
            footnote="The pairing it is designed for."
            minH={64}
          >
            <p className="label">Open source · by akaieuan</p>
            <h3 className="mt-3 text-lg leading-snug font-light tracking-tight text-foreground">
              Open-source software for human-in-the-loop AI
              <span className="text-[color:var(--accent-amber)]">.</span>
            </h3>
          </Specimen>
        </TileGrid>

        <Note>
          It is deliberately not a component. A label is one class on whatever
          element the markup already needed — a <Mono>p</Mono>, a{" "}
          <Mono>span</Mono>, a <Mono>figcaption</Mono> — and wrapping that in
          a React component would buy nothing and cost a nesting level
          everywhere it appears.
        </Note>
      </DemoSection>

      {/* ── Display type ──────────────────────────────────────────────── */}
      <DemoSection
        id="type"
        title="Display type"
        meta="globals.css"
        description={
          <>
            Two families, no third. <Mono>--font-sans</Mono> is Inter and does
            everything human-readable; <Mono>--font-mono</Mono> is JetBrains
            Mono and does everything machine-readable — prop names, token
            names, icon ids, install commands. The display idiom is not a
            serif despite the class name: <Mono>.font-serif</Mono> re-points
            at Inter at weight 300 with tight tracking, kept as a name so
            markdown and older markup that reaches for it lands somewhere
            deliberate.
          </>
        }
      >
        <Well className="flex flex-col gap-6">
          <div>
            <p className="label mb-3">Display · font-light tracking-tight</p>
            <p className="text-3xl font-light tracking-tight text-foreground">
              An AI measurement problem
            </p>
          </div>
          <div>
            <p className="label mb-3">Body · --font-sans</p>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Most AI systems are evaluated on whether they can complete tasks
              autonomously. In deployment they need to assist humans instead.
            </p>
          </div>
          <div>
            <p className="label mb-3">Machine · --font-mono</p>
            <p className="font-mono text-[13px] text-foreground/80">
              npx shadcn@latest add hitl-card
            </p>
          </div>
        </Well>
      </DemoSection>

      {/* ── Surfaces ──────────────────────────────────────────────────── */}
      <DemoSection
        id="surfaces"
        title="Card surfaces"
        meta="globals.css · inline idiom"
        description={
          <>
            Two card languages coexist. The newer one is inline —{" "}
            <Mono>rounded-2xl border border-border/40 bg-card/40</Mono>, what
            every well on this page and in <Mono>/components</Mono> uses. The
            older one is <Mono>.card-surface</Mono>, driven by the{" "}
            <Mono>--card-alpha</Mono> / <Mono>--card-border</Mono> compat
            tokens and brightening its border on hover.
          </>
        }
      >
        <TileGrid min={200}>
          <Specimen
            label="border-border/40 bg-card/40"
            hint="inline"
            footnote="The catalogue well. Flat until something above it changes."
            minH={72}
          >
            <div className="rounded-2xl border border-border/40 bg-card/40 p-4 text-[13px] text-muted-foreground">
              A specimen well.
            </div>
          </Specimen>
          <Specimen
            label=".card-surface"
            hint="hover me"
            footnote="Border brightens over 200ms. Compat tokens, still consumed by registry components."
            minH={72}
          >
            <div className="card-surface p-4 text-[13px] text-muted-foreground">
              Hover to brighten the border.
            </div>
          </Specimen>
          <Specimen
            label=".hover-lift"
            hint="hover me"
            footnote="A 1px rise. The whole hover vocabulary — the site never scales or shadows a card."
            minH={72}
          >
            <div className="hover-lift rounded-2xl border border-border/40 bg-card/40 p-4 text-[13px] text-muted-foreground">
              Hover to lift 1px.
            </div>
          </Specimen>
        </TileGrid>
      </DemoSection>

      {/* ── Link idioms ───────────────────────────────────────────────── */}
      <DemoSection
        id="links"
        title="Link idioms"
        meta="components/home/shared.ts · globals.css"
        description={
          <>
            Four shapes a link takes, all of them class strings rather than
            components: the primary call to action, the arrow link, the
            underline that draws itself on hover, and the plain
            colour-transition link that everything else uses.
          </>
        }
      >
        <Well className="flex flex-wrap items-center gap-x-8 gap-y-6">
          <a href="#links" className={primaryCta}>
            See the projects
            <ArrowUpRight aria-hidden className={arrowNudge} />
          </a>
          <Link href="/research" className={arrowLink}>
            Research
            <ArrowUpRight aria-hidden className={arrowNudge} />
          </Link>
          <a
            href="#links"
            className="underline-anim text-sm text-foreground"
          >
            underline-anim
          </a>
          <Link
            href="/components"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            plain link
          </Link>
        </Well>

        <Note>
          <Mono>arrowNudge</Mono> is the shared piece: every arrow on the site
          moves 2px up and right on the parent&rsquo;s hover, whether it sits
          in a button, a card, or a sentence. It is a{" "}
          <Mono>group-hover</Mono> class, so it only works inside something
          marked <Mono>group</Mono> — which <Mono>primaryCta</Mono> and{" "}
          <Mono>arrowLink</Mono> both already carry.
        </Note>
      </DemoSection>

      {/* ── Entrance ──────────────────────────────────────────────────── */}
      <DemoSection
        id="entrance"
        title="Entrance"
        meta="reveal · stagger(n)"
        description={
          <>
            The landing page&rsquo;s only animation besides the mark: a 700ms
            fade up, staggered 120ms per element top to bottom. It is gated
            behind <Mono>motion-safe:</Mono> on every class in the string, so
            under reduced motion the elements are simply there. Reload this
            page to see it again.
          </>
        }
      >
        <Well className="flex flex-col gap-3 py-8">
          {["First", "Second", "Third", "Fourth"].map((t, i) => (
            <p
              key={t}
              className={`${reveal} text-sm text-muted-foreground`}
              style={stagger(i)}
            >
              {t} — delayed {i * 120}ms
            </p>
          ))}
        </Well>

        <Note>
          <Mono>fill-mode-backwards</Mono> is doing quiet but essential work:
          without it a staggered element renders at its final opacity for the
          length of its delay, flashes, and then plays the fade — which looks
          worse than no animation at all.
        </Note>
      </DemoSection>

      {/* ── Chrome ────────────────────────────────────────────────────── */}
      <DemoSection
        id="chrome"
        title="Chrome"
        meta="Nav · Footer · ::selection"
        description={
          <>
            The remaining site-level components are already on screen, so
            there is nothing to specimen: <Mono>Nav</Mono> is the sticky bar
            at the top of this page and <Mono>Footer</Mono> is the block below
            it. Both are rendered by this catalogue&rsquo;s own layout.
          </>
        }
      >
        <Well>
          <ul className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--accent-blue)]"
              />
              <span>
                <Mono>Nav</Mono> takes an <Mono>active</Mono> key for the
                current destination. This catalogue passes none — it is
                unlisted, and nothing in the bar should light up for it.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--accent-violet)]"
              />
              <span>
                Select this sentence. <Mono>::selection</Mono> is{" "}
                <Mono>--accent-blue</Mono> with <Mono>--background</Mono> text
                — the accent used as a full fill in the one place the site
                allows it, because the browser is going to fill something
                regardless.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--accent-green)]"
              />
              <span>
                Scrollbars are restyled globally to a thin{" "}
                <Mono>--border-strong</Mono> thumb on a transparent track, so
                an overflowing well inside a card does not introduce a piece
                of operating-system grey into the page.
              </span>
            </li>
          </ul>
        </Well>
      </DemoSection>

      <DemoPager prev={prev} next={next} />
    </>
  );
}
