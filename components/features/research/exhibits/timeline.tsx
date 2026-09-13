import { cn } from "@/lib/utils";
import {
  Label,
  Mono,
  Note,
  Panel,
  type Tone,
} from "@/components/features/research/inertial/ui";

/**
 * A dated sequence across parallel tracks.
 *
 * No state and no "use client": this renders entirely on the server and ships
 * no JavaScript. Emphasis is carried by the `mark` flag rather than by motion,
 * because the one event worth pausing on should still be obvious in a
 * screenshot, in print, and with styles disabled.
 *
 * Generic on purpose. Any incident narrative with more than one actor can
 * mount this with its own tracks.
 */

export interface TimelineTrack {
  readonly id: string;
  readonly label: string;
  readonly tone: Tone;
}

export interface TimelineEvent {
  readonly date: string;
  readonly track: string;
  readonly label: string;
  /** Where this came from, so a reader can go and check it. */
  readonly source?: string;
  /** The pivot. Gets a ring and a heavier dot. */
  readonly mark?: boolean;
}

const TONE_DOT: Record<Tone, string> = {
  neutral: "bg-foreground/40",
  ok: "bg-[color:var(--accent-emerald)]",
  bad: "bg-[color:var(--accent-rose)]",
  warn: "bg-[color:var(--accent-amber)]",
  muted: "bg-muted-foreground/40",
};

const TONE_CHIP: Record<Tone, string> = {
  neutral: "border-border text-muted-foreground",
  ok: "border-[color:var(--accent-emerald)]/40 text-[color:var(--accent-emerald)]",
  bad: "border-[color:var(--accent-rose)]/50 text-[color:var(--accent-rose)]",
  warn: "border-[color:var(--accent-amber)]/40 text-[color:var(--accent-amber)]",
  muted: "border-border/50 text-muted-foreground",
};

export function Timeline({
  label = "Timeline",
  tracks,
  events,
  footnote,
}: {
  label?: string;
  tracks: readonly TimelineTrack[];
  events: readonly TimelineEvent[];
  footnote?: string;
}) {
  const byId = new Map(tracks.map((t) => [t.id, t]));

  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <Label>{label}</Label>
          <div className="flex flex-wrap gap-1.5">
            {tracks.map((t) => (
              <span
                key={t.id}
                className={cn(
                  "rounded-md border px-2 py-0.5 font-mono text-[10.5px]",
                  TONE_CHIP[t.tone],
                )}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>

        <ol className="mt-5 space-y-0">
          {events.map((e, i) => {
            const track = byId.get(e.track);
            const tone: Tone = track?.tone ?? "muted";
            const last = i === events.length - 1;
            return (
              <li key={`${e.date}-${e.label}`} className="flex gap-4">
                {/* Rail */}
                <div
                  aria-hidden="true"
                  className="flex w-3 shrink-0 flex-col items-center"
                >
                  <span
                    className={cn(
                      "mt-1.5 shrink-0 rounded-full",
                      TONE_DOT[tone],
                      e.mark
                        ? "h-2.5 w-2.5 ring-4 ring-[color:var(--accent-rose)]/15"
                        : "h-1.5 w-1.5",
                    )}
                  />
                  {!last && <span className="w-px flex-1 bg-border/70" />}
                </div>

                {/* Event */}
                <div
                  className={cn(
                    "min-w-0 flex-1",
                    last ? "pb-0" : "pb-5",
                  )}
                >
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <Mono tone="muted" className="tabular-nums">
                      {e.date}
                    </Mono>
                    {track && (
                      <span
                        className={cn(
                          "rounded border px-1.5 py-px font-mono text-[10px]",
                          TONE_CHIP[tone],
                        )}
                      >
                        {track.label}
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-1 text-[13px] leading-relaxed",
                      e.mark ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {e.label}
                  </p>
                  {e.source && (
                    <Note className="mt-1">{e.source}</Note>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </Panel>

      {footnote && <Note>{footnote}</Note>}
    </div>
  );
}
