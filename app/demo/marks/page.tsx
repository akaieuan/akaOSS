import type { Metadata } from "next";

import { PixelHead, type PixelIcon } from "@/components/brand/pixel-head";
import {
  DemoHeader,
  DemoPager,
  DemoSection,
  Mono,
  Note,
  Specimen,
  TileGrid,
  Well,
} from "@/components/features/style/catalogue";
import { demoNeighbours } from "@/lib/style";

export const metadata: Metadata = {
  title: "Marks · Brand system · akaOSS",
  description:
    "Every PixelHead knockout, dissolve mode and animation behaviour: the one canvas component behind the favicon, the nav mark, the project badges and the hero.",
};

/**
 * The analytic knockouts, in source order. These are functions in normalized
 * -1..1 space; the disc is drawn and the shape is punched out of it.
 * Names are the literal `icon` values, read from `KNOCKOUTS` in
 * `components/brand/pixel-head.tsx`, not invented.
 */
const KNOCKOUTS: { id: PixelIcon; shape: string; use: string }[] = [
  {
    id: "head",
    shape: "figure",
    use: "HITL Kit, in the Toolkits dropdown and the projects grid: the human in the loop.",
  },
  {
    id: "spark",
    shape: "✦ cluster",
    use: "The akaOSS mark itself: nav, footer, favicon, hero.",
  },
  {
    id: "bubble",
    shape: "speech",
    use: "Carried over from the shared component. Nothing on this site claims it.",
  },
  {
    id: "gamepad",
    shape: "controller",
    use: "Carried over from the shared component. Unused here.",
  },
  {
    id: "prompt",
    shape: "terminal",
    use: "Collapse and Hologram. The developer-tooling badge.",
  },
  {
    id: "podium",
    shape: "2·1·3 tiers",
    use: "eval-kit, measurement, ranked.",
  },
  {
    id: "codetag",
    shape: "code tag",
    use: "tag-kit.",
  },
];

/**
 * The mask icons. A different mechanism entirely: hand-authored pixel grids
 * drawn solid, not knocked out of a disc, so `grid` and `variant` have no
 * effect on them.
 */
const MASKS: { id: PixelIcon; shape: string; use: string }[] = [
  {
    id: "sparkmark",
    shape: "18×18",
    use: "One elongated sparkle, authored as the chrome mark, but the shipped chrome draws the spark knockout instead. Currently unused.",
  },
  {
    id: "nyz",
    shape: "14×14",
    use: "Wordmark from the studio component this was ported from. Unused here.",
  },
  {
    id: "pogo",
    shape: "16×16",
    use: "Wordmark from the studio component this was ported from. Unused here.",
  },
];

const MODES = [
  { id: "ash", note: "drifts upward and fades, bottom rows last" },
  { id: "explode", note: "radial, outward from the centre, with spin" },
  { id: "scatter", note: "falls, accelerating, with lateral drift" },
  { id: "glitch", note: "quantised horizontal displacement: the default" },
] as const;

const GRIDS = [12, 16, 22, 30, 40];

export default function MarksDemo() {
  const { prev, next } = demoNeighbours("marks");

  return (
    <>
      <DemoHeader
        title="Marks."
        lede={
          <>
            One canvas component, <Mono>PixelHead</Mono>: draws the favicon,
            the nav mark, every project badge and the hero, all from props. It
            samples a square grid of cells, keeps the ones inside the shape,
            and animates them apart and back together. The pixel colour is
            read from <Mono>--foreground</Mono> and re-read whenever the theme
            flips, so a mark is never the wrong colour for its background.
          </>
        }
        meta={`${KNOCKOUTS.length} knockouts · ${MASKS.length} masks · 4 dissolve modes`}
      />

      {/* ── Knockouts ─────────────────────────────────────────────────── */}
      <DemoSection
        id="knockouts"
        title="Icon knockouts"
        meta="size 88 · grid 24 · once"
        description={
          <>
            The <Mono>icon</Mono> prop. Each of these is a shape function
            punched out of a solid disc. The default{" "}
            <Mono>variant=&quot;negative&quot;</Mono>. They assemble once when
            they scroll into view and then hold; the site uses them at 22–36px
            beside a project name.
          </>
        }
      >
        <TileGrid min={150}>
          {KNOCKOUTS.map((k) => (
            <Specimen
              key={k.id}
              label={k.id}
              hint={k.shape}
              footnote={k.use}
              center
              minH={104}
            >
              <PixelHead size={88} grid={24} icon={k.id} once />
            </Specimen>
          ))}
        </TileGrid>

        <Note>
          Two of these, <Mono>bubble</Mono> and <Mono>gamepad</Mono>, are
          inherited from the component this was ported from and have no owner
          on this site. They are catalogued rather than deleted because the
          component is shared with the studio site; removing them there is a
          separate decision.
        </Note>
      </DemoSection>

      {/* ── Mask icons ────────────────────────────────────────────────── */}
      <DemoSection
        id="masks"
        title="Mask icons"
        meta="size 88 · once"
        description={
          <>
            The same <Mono>icon</Mono> prop, a different mechanism: these are
            hand-authored pixel grids drawn <em>solid</em>, not knocked out of
            a disc. The mask supplies its own resolution, so{" "}
            <Mono>grid</Mono> and <Mono>variant</Mono> are ignored for them,
passing <Mono>grid=40</Mono> to <Mono>nyz</Mono> changes nothing.
          </>
        }
      >
        <TileGrid min={150}>
          {MASKS.map((m) => (
            <Specimen
              key={m.id}
              label={m.id}
              hint={m.shape}
              footnote={m.use}
              center
              minH={104}
            >
              <PixelHead size={88} icon={m.id} once />
            </Specimen>
          ))}
        </TileGrid>
      </DemoSection>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <DemoSection
        id="hero"
        title="The hero treatment"
        meta="size 340 · grid 22 · once · fluid"
        description={
          <>
            Exactly what the landing page renders, at exactly its props:{" "}
            <Mono>
              &lt;PixelHead size={"{340}"} grid={"{22}"} icon=&quot;spark&quot;
              once fluid /&gt;
            </Mono>
            . It assembles once on first sight and then holds. The hero is
            the first thing on the page, so a mark that dissolved every few
            seconds would compete with the headline for the whole visit.
          </>
        }
      >
        <Well className="flex justify-center py-10">
          <PixelHead size={340} grid={22} icon="spark" once fluid />
        </Well>
      </DemoSection>

      {/* ── Dissolve modes ────────────────────────────────────────────── */}
      <DemoSection
        id="dissolve"
        title="Dissolve modes"
        meta="size 96 · grid 22 · looping"
        description={
          <>
            The <Mono>mode</Mono> prop decides how the cells leave and come
            back. All four run the same timeline: a hold, a dissolve, a beat
            of nothing, a reform, and differ only in the per-cell motion and
            in which cells go first. These four loop continuously so the
            difference is visible; everywhere else on the site the marks use{" "}
            <Mono>once</Mono> or <Mono>still</Mono>.
          </>
        }
      >
        <TileGrid min={150}>
          {MODES.map((m) => (
            <Specimen
              key={m.id}
              label={`mode="${m.id}"`}
              footnote={m.note}
              center
              minH={112}
            >
              <PixelHead size={96} grid={22} icon="spark" mode={m.id} />
            </Specimen>
          ))}
        </TileGrid>

        <Note>
          The dissolve order is seeded per mode: <Mono>ash</Mono> keys the
          delay off vertical position, <Mono>explode</Mono> off distance from
          centre, <Mono>scatter</Mono> off pure noise, and <Mono>glitch</Mono>{" "}
          off a per-row hash, which is why glitch reads as scanlines tearing
          rather than as pixels scattering.
        </Note>
      </DemoSection>

      {/* ── Animation behaviours ──────────────────────────────────────── */}
      <DemoSection
        id="animation"
        title="Animation behaviours"
        meta="size 96 · grid 22"
        description={
          <>
            Orthogonal to <Mono>mode</Mono>: how often the animation runs at
            all. The loop pauses itself when the mark scrolls offscreen or the
            tab is hidden, and while a mark sits fully assembled the frame
            loop throttles to nothing rather than repainting an identical
            canvas.
          </>
        }
      >
        <TileGrid min={150}>
          <Specimen
            label="(default)"
            hint="loop"
            footnote="Dissolve and reform forever. Used only here, and on the dissolve specimens above."
            center
            minH={112}
          >
            <PixelHead size={96} grid={22} icon="spark" />
          </Specimen>
          <Specimen
            label="once"
            hint="assemble, hold"
            footnote="Assembles on first visibility, then holds. The hero, and every badge in the projects grid."
            center
            minH={112}
          >
            <PixelHead size={96} grid={22} icon="spark" once />
          </Specimen>
          <Specimen
            label="once shimmer"
            hint="~3Hz, ~4% cells"
            footnote="After settling, a quiet twinkle re-rolls a few percent of cells. Card-size accents."
            center
            minH={112}
          >
            <PixelHead size={96} grid={22} icon="spark" once shimmer />
          </Specimen>
          <Specimen
            label="still"
            hint="one frame, no rAF"
            footnote="Paints once and never schedules a frame. The nav mark, the footer mark, the dropdown badges, the favicon."
            center
            minH={112}
          >
            <PixelHead size={96} grid={22} icon="spark" still />
          </Specimen>
        </TileGrid>

        <Note>
          <Mono>still</Mono> is the one that matters for the chrome. The nav
          and footer render <Mono>grid={"{16}"}</Mono>{" "}
          <Mono>gap={"{0.12}"}</Mono> <Mono>icon=&quot;spark&quot;</Mono>{" "}
          <Mono>still</Mono>, and{" "}
          <Mono>app/icon.svg</Mono> is that same sampling baked to
          rectangles, verified pixel-for-pixel against the component, all 256
          cells.
        </Note>
      </DemoSection>

      {/* ── variant ───────────────────────────────────────────────────── */}
      <DemoSection
        id="variant"
        title="variant"
        meta="size 96 · grid 22 · once"
        description={
          <>
            <Mono>negative</Mono> is the default and is what the entire site
            uses: a solid disc with the shape removed. <Mono>figure</Mono>{" "}
            inverts the relationship. The shape is drawn solid, and the disc
            survives only as a thin ring around it.
          </>
        }
      >
        <TileGrid min={150}>
          <Specimen
            label='variant="negative"'
            hint="default"
            footnote="Shape removed from a solid disc. Every mark on the site."
            center
            minH={112}
          >
            <PixelHead size={96} grid={22} icon="spark" variant="negative" once />
          </Specimen>
          <Specimen
            label='variant="figure"'
            hint="shape + ring"
            footnote="Shape drawn solid inside a hairline ring. Unused on this site."
            center
            minH={112}
          >
            <PixelHead size={96} grid={22} icon="spark" variant="figure" once />
          </Specimen>
          <Specimen
            label='head · "negative"'
            hint="grid 24"
            footnote="The figure knockout is what the face layer is sized against."
            center
            minH={112}
          >
            <PixelHead size={96} grid={24} icon="head" variant="negative" once />
          </Specimen>
          <Specimen
            label='head · "figure"'
            hint="grid 24"
            footnote="Reads as a pixel person standing in a ring."
            center
            minH={112}
          >
            <PixelHead size={96} grid={24} icon="head" variant="figure" once />
          </Specimen>
        </TileGrid>
      </DemoSection>

      {/* ── faces ─────────────────────────────────────────────────────── */}
      <DemoSection
        id="faces"
        title="faces"
        meta="26 expressions · size 176 · grid 24"
        description={
          <>
            <Mono>faces</Mono> draws a 9×8 pixel expression inside the head
            void and cycles it, 26 expressions, some with a two-frame
            chatter, a few tinted with an accent. It is sized against the{" "}
            <Mono>head</Mono> figure at <Mono>grid={"{24}"}</Mono>
            ; on any other knockout the face lands in the middle of the disc
            with nothing to sit in. Nothing on the akaOSS site uses it. The
            lab&rsquo;s mark is the sparkle, but the capability ships in the
            component, so it is catalogued.
          </>
        }
      >
        {/* The cycling mark gets its own full-width well rather than sharing a
            row with the persona tiles: mid-dissolve its canvas is transparent,
            and as a side-by-side column that reads as an empty panel. */}
        <Well className="flex justify-center py-8">
          <PixelHead size={176} grid={24} icon="head" faces />
        </Well>

        <div className="mt-5">
          <TileGrid min={150}>
            <Specimen
              label='face="wink"'
              hint="EXPR 5"
              footnote="A named persona pick."
              center
              minH={96}
            >
              <PixelHead size={80} grid={24} icon="head" face="wink" still />
            </Specimen>
            <Specimen
              label='face="thinking"'
              hint="EXPR 22"
              footnote="The other named pick."
              center
              minH={96}
            >
              <PixelHead size={80} grid={24} icon="head" face="thinking" still />
            </Specimen>
            <Specimen
              label="faceIndex={9}"
              hint="accent amber"
              footnote="Any expression by index."
              center
              minH={96}
            >
              <PixelHead size={80} grid={24} icon="head" faceIndex={9} still />
            </Specimen>
            <Specimen
              label="faceIndex={17}"
              hint="accent violet"
              footnote="Accents come from the expression, not the theme."
              center
              minH={96}
            >
              <PixelHead size={80} grid={24} icon="head" faceIndex={17} still />
            </Specimen>
          </TileGrid>
        </div>

        <Note>
          Worth knowing before you reach for these: the cycle only runs in the
          default dissolve loop. Under <Mono>once</Mono> or <Mono>still</Mono>{" "}
          the component paints a single frame, so <Mono>faces</Mono> collapses
          to one neutral expression. Conversely <Mono>face</Mono> and{" "}
          <Mono>faceIndex</Mono> are only read on those single-frame paths,
in the looping mode they are ignored entirely. The four specimens
          above therefore all carry <Mono>still</Mono>.
        </Note>
      </DemoSection>

      {/* ── grid density ──────────────────────────────────────────────── */}
      <DemoSection
        id="grid"
        title="Grid density"
        meta="size 96 · once"
        description={
          <>
            <Mono>grid</Mono> is cells across, so it is resolution, not size.
            Low counts read as a chunky bitmap and hold up at chrome sizes;
            high counts recover the curve of the disc but turn to mush below
            about 40px.
          </>
        }
      >
        <TileGrid min={132}>
          {GRIDS.map((g) => (
            <Specimen
              key={g}
              label={`grid={${g}}`}
              hint={`${g}×${g}`}
              center
              minH={112}
            >
              <PixelHead size={96} grid={g} icon="spark" once />
            </Specimen>
          ))}
        </TileGrid>

        <Note>
          <Mono>head</Mono> is the exception, and it is a sharp one: at{" "}
          <Mono>grid</Mono> 16 or below it stops sampling the figure function
          and renders a hand-authored 14×14 mask instead, a solid circular
          head with a neutral face knocked out, no body. It is not a
          lower-resolution version of the same drawing, it is a different
          drawing.
        </Note>

        <div className="mt-5">
          <TileGrid min={150}>
            <Specimen
              label="head · grid={14}"
              hint="hand mask"
              footnote="Circle head, face knocked out, no body."
              center
              minH={112}
            >
              <PixelHead size={96} grid={14} icon="head" once />
            </Specimen>
            <Specimen
              label="head · grid={16}"
              hint="hand mask"
              footnote="Pixel-identical to the tile on the left: 16 is the threshold and it is inclusive, so both resolve to the same 14×14 mask."
              center
              minH={112}
            >
              <PixelHead size={96} grid={16} icon="head" once />
            </Specimen>
            <Specimen
              label="head · grid={17}"
              hint="figure"
              footnote="One cell more and it is the figure-in-disc."
              center
              minH={112}
            >
              <PixelHead size={96} grid={17} icon="head" once />
            </Specimen>
          </TileGrid>
        </div>
      </DemoSection>

      {/* ── fluid ─────────────────────────────────────────────────────── */}
      <DemoSection
        id="fluid"
        title="fluid"
        meta="size 340 · grid 22 · once"
        description={
          <>
            Without <Mono>fluid</Mono> the canvas is exactly{" "}
            <Mono>size</Mono> CSS pixels and will push a narrow column
            sideways. With it, the canvas fills its container and caps at{" "}
            <Mono>size</Mono>: the same mark, drawn at the same internal
            resolution, scaled down by CSS. The three wells below are 110px,
            170px and 230px wide; all three hold{" "}
            <Mono>size={"{340}"}</Mono>, and none of them overflows.
          </>
        }
      >
        {/* 110/170/230 rather than a wider spread: at 1280 the main column is
            ~688px, and three wells plus gaps have to clear that or the last one
            drops to a row of its own and the progression stops reading. */}
        <div className="flex flex-wrap items-start gap-3">
          {[110, 170, 230].map((w) => (
            <figure
              key={w}
              className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border/40 bg-card/40 p-5"
              style={{ width: w + 40 }}
            >
              <figcaption className="border-b border-border/40 pb-3 font-mono text-[11px] text-foreground">
                {w}px well
              </figcaption>
              <div style={{ width: w }}>
                <PixelHead size={340} grid={22} icon="spark" once fluid />
              </div>
            </figure>
          ))}
        </div>

        <Note>
          Because the drawing resolution is fixed by <Mono>grid</Mono> and not
          by the rendered width, a fluid mark scaled well below its{" "}
          <Mono>size</Mono> softens rather than re-pixelating. The hero relies
          on this: one component, 340px on a desktop, whatever the column
          allows on a tablet.
        </Note>
      </DemoSection>

      {/* ── remaining props ───────────────────────────────────────────── */}
      <DemoSection
        id="props"
        title="Remaining props"
        meta="gap · color · speed"
        description={
          <>
            The three that do not need a section of their own.{" "}
            <Mono>gap</Mono> is the space between cells as a fraction of one
            cell; <Mono>color</Mono> overrides the theme foreground;{" "}
            <Mono>speed</Mono> multiplies the timeline.
          </>
        }
      >
        <TileGrid min={132}>
          <Specimen label="gap={0}" hint="solid" center minH={104}>
            <PixelHead size={80} grid={22} icon="spark" gap={0} once />
          </Specimen>
          <Specimen label="gap={0.16}" hint="default" center minH={104}>
            <PixelHead size={80} grid={22} icon="spark" once />
          </Specimen>
          <Specimen label="gap={0.4}" hint="airy" center minH={104}>
            <PixelHead size={80} grid={22} icon="spark" gap={0.4} once />
          </Specimen>
          <Specimen
            label="color"
            hint="--accent-blue"
            center
            minH={104}
          >
            <PixelHead
              size={80}
              grid={22}
              icon="spark"
              color="var(--accent-blue)"
              once
            />
          </Specimen>
          <Specimen label="speed={0.4}" hint="looping" center minH={104}>
            <PixelHead size={80} grid={22} icon="spark" speed={0.4} />
          </Specimen>
          <Specimen label="speed={2}" hint="looping" center minH={104}>
            <PixelHead size={80} grid={22} icon="spark" speed={2} />
          </Specimen>
        </TileGrid>

        <Note>
          <Mono>color</Mono> takes any CSS colour, including a token
          reference, but it opts the mark out of the theme observer that
          otherwise re-reads <Mono>--foreground</Mono> on a theme flip. A
          token passed here still resolves per theme; a literal hex will not.
        </Note>
      </DemoSection>

      {/* ── motion & a11y ─────────────────────────────────────────────── */}
      <DemoSection
        id="motion"
        title="Reduced motion and accessibility"
        meta="prefers-reduced-motion"
        description={
          <>
            Under <Mono>prefers-reduced-motion: reduce</Mono> the component
            takes the same path as <Mono>still</Mono>: it paints one fully
            assembled frame and returns without ever scheduling an animation
            frame. Not a slowed-down loop, not a faded one. No loop at all.
            Every specimen on this page, including the four dissolve modes,
            renders as a static mark for a visitor with that preference set.
          </>
        }
      >
        <Well>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Two more things the component decides on your behalf:
          </p>
          <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--accent-blue)]"
              />
              <span>
                The host element is <Mono>aria-hidden</Mono> and the mark is a{" "}
                <Mono>&lt;canvas&gt;</Mono> with no text alternative. That is
                correct. It is decoration everywhere it appears, but it
                means a mark can never be the only label for anything. Every
                specimen on this page carries its own text caption for exactly
                that reason.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--accent-green)]"
              />
              <span>
                Animation is gated on visibility twice over: an{" "}
                <Mono>IntersectionObserver</Mono> stops the loop when the mark
                scrolls out of view, and a{" "}
                <Mono>visibilitychange</Mono> listener stops it when the tab
                is backgrounded. A page of looping marks costs nothing while
                you are reading something else.
              </span>
            </li>
          </ul>
        </Well>
      </DemoSection>

      <DemoPager prev={prev} next={next} />
    </>
  );
}
