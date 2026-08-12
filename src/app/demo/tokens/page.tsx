import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  DemoHeader,
  DemoPager,
  DemoSection,
  Mono,
  Note,
  Well,
} from "../_components/demo-ui";
import { demoNeighbours } from "../_components/sections";
import { CONTRAST, readTokenTables, type TokenTable } from "../_components/tokens";

export const metadata: Metadata = {
  title: "Tokens · Brand system · akaOSS",
  description:
    "The akaOSS palette as swatches: surfaces, lines, text and the five accents, read straight out of globals.css so the page cannot drift from the stylesheet.",
};

const SURFACES = [
  { token: "--background", note: "The page. Warm paper in light, warm near-black in dark." },
  { token: "--card", note: "Lifted surface. Cards read above the page, never level with it." },
  { token: "--popover", note: "Solid dropdown fill, page text must never bleed through." },
  { token: "--muted", note: "Support fill: hover states, inert chips." },
  { token: "--secondary", note: "Same value as muted; kept distinct for shadcn slots." },
];

const LINES = [
  { token: "--border", note: "The default hairline. Alpha over the surface, not a grey." },
  { token: "--input", note: "A step stronger, for control edges." },
  { token: "--ring", note: "Focus. Tuned per theme to clear 3:1 against the background." },
  { token: "--border-strong", note: "Compat alias. Scrollbar thumbs, emphatic rules." },
  { token: "--card-border", note: "Compat alias, consumed by .card-surface." },
  { token: "--hairline", note: "Compat alias, the quietest line in the system." },
];

const TEXT = [
  { token: "--foreground", note: "Body and headings." },
  { token: "--muted-foreground", note: "Secondary prose, labels, metadata." },
  { token: "--card-foreground", note: "Text on a card. Same value as foreground, by design." },
  { token: "--primary", note: "Filled-control background; near-inverse of foreground." },
];

const ACCENTS = [
  { token: "--accent-blue", note: "Links, focus punctuation, ::selection." },
  { token: "--accent-green", note: "Confirmation. Aliased as --accent-emerald for the registry." },
  { token: "--accent-amber", note: "The full stop in the hero headline. Attention, not alarm." },
  { token: "--accent-rose", note: "Rejection and destructive paths." },
  { token: "--accent-violet", note: "The fifth voice, categorical, not semantic." },
];

const RADII = [
  { token: "--radius", note: "The root. Every other radius derives from it." },
  { token: "--radius-card", note: "Compat alias for .card-surface." },
  { token: "--radius-pill", note: "Compat alias for chips and badges." },
];

/** Token name plus its authored value in each theme. */
function TokenMeta({
  token,
  light,
  dark,
  note,
}: {
  token: string;
  light: TokenTable;
  dark: TokenTable;
  note: string;
}) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[12px] text-foreground [overflow-wrap:anywhere]">
        {token}
      </p>
      <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
        {note}
      </p>
      <dl className="mt-2 grid grid-cols-[2.6rem_minmax(0,1fr)] gap-x-2 gap-y-0.5 font-mono text-[10px] text-muted-foreground/70">
        <dt>light</dt>
        <dd className="[overflow-wrap:anywhere]">
          {light[token] ?? "not authored"}
        </dd>
        <dt>dark</dt>
        {/* `.dark` re-declares every colour but not the radii, those cascade
            down from `:root`, which is why they read as inherited here. */}
        <dd className="[overflow-wrap:anywhere]">
          {dark[token] ?? "inherits :root"}
        </dd>
      </dl>
    </div>
  );
}

/** One row: a chip on the left, the machine data on the right. */
function TokenRow({ chip, children }: { chip: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-4 border-t border-border/40 pt-5 first:border-t-0 first:pt-0">
      <div className="flex h-12 w-12 items-center justify-center">{chip}</div>
      {children}
    </div>
  );
}

export default async function TokensDemo() {
  const { light, dark } = await readTokenTables();
  const { prev, next } = demoNeighbours("tokens");

  return (
    <>
      <DemoHeader
        title="Tokens."
        lede={
          <>
            Every swatch below is filled with <Mono>var(--token)</Mono>, so it
            is the live value in whichever theme you are reading in. The
            authored values printed beside it are parsed out of{" "}
            <Mono>src/app/globals.css</Mono> at build time rather than
            restated here, a palette page that keeps its own copy of the
            palette goes wrong quietly. Flip the theme and the whole page
            moves with it.
          </>
        }
        meta={`${Object.keys(light).length} tokens in :root · ${Object.keys(dark).length} in .dark`}
      />

      {/* ── Surfaces ──────────────────────────────────────────────────── */}
      <DemoSection
        id="surfaces"
        title="Surfaces"
        meta="fill"
        description={
          <>
            Five fills, all on the same hue (107) at near-zero chroma. The
            hierarchy is lightness and alpha, never colour, which is what
            lets the palette carry two themes without either one looking
            tinted.
          </>
        }
      >
        <Well className="flex flex-col gap-5">
          {SURFACES.map((s) => (
            <TokenRow
              key={s.token}
              chip={
                <span
                  className="h-12 w-12 rounded-xl border border-border"
                  style={{ background: `var(${s.token})` }}
                />
              }
            >
              <TokenMeta token={s.token} light={light} dark={dark} note={s.note} />
            </TokenRow>
          ))}
        </Well>

        <Note>
          <Mono>--background</Mono> and <Mono>--card</Mono> are close on
          purpose and the border is what separates them, so every chip above
          is drawn with one, without it the first two swatches would be
          invisible against the page in light theme and against the card in
          dark.
        </Note>
      </DemoSection>

      {/* ── Lines ─────────────────────────────────────────────────────── */}
      <DemoSection
        id="lines"
        title="Lines and borders"
        meta="alpha over surface"
        description={
          <>
            None of these are a colour in the usual sense. They are the
            foreground at 6–20% alpha, so a border always sits at the same
            relative distance from whatever it is drawn on. Each chip shows
            the token twice: as a 1px box edge and as a solid bar.
          </>
        }
      >
        <Well className="flex flex-col gap-5">
          {LINES.map((l) => (
            <TokenRow
              key={l.token}
              chip={
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl border"
                  style={{ borderColor: `var(${l.token})` }}
                >
                  <span
                    className="h-4 w-6 rounded-sm"
                    style={{ background: `var(${l.token})` }}
                  />
                </span>
              }
            >
              <TokenMeta token={l.token} light={light} dark={dark} note={l.note} />
            </TokenRow>
          ))}
        </Well>
      </DemoSection>

      {/* ── Text ──────────────────────────────────────────────────────── */}
      <DemoSection
        id="text"
        title="Text"
        meta="on --background"
        description={
          <>
            Two working values and two that exist to satisfy shadcn&rsquo;s
            slot contract. The site uses <Mono>--foreground</Mono> and{" "}
            <Mono>--muted-foreground</Mono> for effectively everything;
            hierarchy below that comes from opacity on the foreground
            (<Mono>text-foreground/80</Mono>,{" "}
            <Mono>text-muted-foreground/70</Mono>) rather than from more
            tokens.
          </>
        }
      >
        <Well className="flex flex-col gap-5">
          {TEXT.map((t) => (
            <TokenRow
              key={t.token}
              chip={
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-lg font-light"
                  style={{ color: `var(${t.token})` }}
                >
                  Aa
                </span>
              }
            >
              <TokenMeta token={t.token} light={light} dark={dark} note={t.note} />
            </TokenRow>
          ))}
        </Well>
      </DemoSection>

      {/* ── Accents ───────────────────────────────────────────────────── */}
      <DemoSection
        id="accents"
        title="Accents"
        meta="5 hues · punctuation only"
        description={
          <>
            Five accents, treated as punctuation rather than as fills. They
            appear as dots beside a project name, as the full stop in the hero
            headline, as a hover colour on an underline, as the tint on a
            pixel expression: never as a button background, never as a panel,
            never as a gradient.
          </>
        }
      >
        <Well className="flex flex-col gap-5">
          {ACCENTS.map((a) => (
            <TokenRow
              key={a.token}
              chip={
                <span
                  className="h-12 w-12 rounded-xl"
                  style={{ background: `var(${a.token})` }}
                />
              }
            >
              <TokenMeta token={a.token} light={light} dark={dark} note={a.note} />
            </TokenRow>
          ))}
        </Well>

        <div className="mt-5">
          <Well>
            <p className="label">In use</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
              {ACCENTS.map((a) => (
                <span key={a.token} className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full"
                    style={{ background: `var(${a.token})` }}
                  />
                  <span className="text-sm font-light tracking-tight text-foreground">
                    {a.token.replace("--accent-", "")}
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-foreground/80">
              A sentence ending in an accent
              <span style={{ color: "var(--accent-amber)" }}>.</span> That dot,
              a 6px status dot, and a hover underline are the whole of it.
            </p>
          </Well>
        </div>

        <Note>
          <Mono>--accent-emerald</Mono> is an alias for{" "}
          <Mono>--accent-green</Mono>, kept alive in both themes because
          registry components already shipped consuming that name. It is not a
          sixth colour.
        </Note>
      </DemoSection>

      {/* ── Contrast ──────────────────────────────────────────────────── */}
      <DemoSection
        id="contrast"
        title="Contrast"
        meta="vs --background"
        description={
          <>
            Measured by converting the authored oklch to sRGB and applying the
            WCAG 2.x relative-luminance formula. Worth reading honestly rather
            than rounding in the palette&rsquo;s favour.
          </>
        }
      >
        <Well className="overflow-x-auto">
          <table className="w-full min-w-[26rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-border/60">
                <th className="label pb-3 font-normal">Token</th>
                <th className="label pb-3 font-normal">Light</th>
                <th className="label pb-3 font-normal">Dark</th>
              </tr>
            </thead>
            <tbody>
              {CONTRAST.map((c) => (
                <tr key={c.token} className="border-b border-border/40 last:border-b-0">
                  <td className="py-3 pr-4 font-mono text-[11px] text-foreground [overflow-wrap:anywhere]">
                    {c.token}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="size-2.5 shrink-0 rounded-full border border-border"
                        style={{ background: c.lightHex }}
                      />
                      <span
                        className={
                          c.light < 4.5
                            ? "font-mono text-[11px] text-[color:var(--accent-amber)]"
                            : "font-mono text-[11px] text-muted-foreground"
                        }
                      >
                        {c.light.toFixed(2)}:1
                      </span>
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="size-2.5 shrink-0 rounded-full border border-border"
                        style={{ background: c.darkHex }}
                      />
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {c.dark.toFixed(2)}:1
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Well>

        <Note>
          The light theme is where the palette is tight. The five accents run
          from 3.27:1 (amber) to 5.15:1 (violet) against the paper, and two of
          them, amber at 3.3:1 and rose at 4.1:1, sit below the 4.5:1 that
          WCAG 1.4.3 asks of normal-size text. Amber clears the 3:1 that 1.4.11
          asks of a graphical object, but only just. That band is the reason
          the accents are kept on marks, dots, rules and hover states rather
          than on small text: at the sizes the site actually uses them, the
          numbers hold. The dark theme is not the constraint, everything
          there is at 6.8:1 or better.
        </Note>
      </DemoSection>

      {/* ── Radius ────────────────────────────────────────────────────── */}
      <DemoSection
        id="radius"
        title="Radius"
        meta="one root · derived scale"
        description={
          <>
            <Mono>--radius</Mono> is the only authored value; Tailwind&rsquo;s{" "}
            <Mono>sm</Mono> through <Mono>4xl</Mono> are multiples of it in{" "}
            <Mono>@theme inline</Mono>. Catalogue wells and cards use{" "}
            <Mono>rounded-2xl</Mono>, which is <Mono>--radius × 1.8</Mono>.
          </>
        }
      >
        <Well className="flex flex-col gap-5">
          {RADII.map((r) => (
            <TokenRow
              key={r.token}
              chip={
                <span
                  className="h-12 w-12 border border-border bg-muted"
                  style={{ borderRadius: `var(${r.token})` }}
                />
              }
            >
              <TokenMeta token={r.token} light={light} dark={dark} note={r.note} />
            </TokenRow>
          ))}
        </Well>

        {/* Written as literal utility classes, not `var(--radius-<step>)`:
            the derived scale lives in `@theme inline`, where Tailwind resolves
            the multiplication into the utility rather than guaranteeing a
            custom property survives to the browser. */}
        <div className="mt-5 flex flex-wrap gap-3">
          {[
            { step: "sm", cls: "rounded-sm", mult: "×0.6" },
            { step: "md", cls: "rounded-md", mult: "×0.8" },
            { step: "lg", cls: "rounded-lg", mult: "×1" },
            { step: "xl", cls: "rounded-xl", mult: "×1.4" },
            { step: "2xl", cls: "rounded-2xl", mult: "×1.8" },
            { step: "3xl", cls: "rounded-3xl", mult: "×2.2" },
          ].map((r) => (
            <div key={r.step} className="flex flex-col items-center gap-2">
              <span
                className={`h-14 w-14 border border-border bg-card/60 ${r.cls}`}
              />
              <span className="font-mono text-[10px] text-muted-foreground/70">
                {r.step} {r.mult}
              </span>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoPager prev={prev} next={next} />
    </>
  );
}
