/* The one paragraph the home page owes a visitor: why the research is open
   and the code is not. No headline; the feed below is the page. The figures
   are from OpenAI's October 2026 kernel report, which the paragraph links. */

import Link from "next/link";

const SOURCE = "https://openai.com/index/a-thousand-fewer-paths-to-root/";

export function Intro() {
  return (
    <section aria-label="About this site">
      <p className="text-[13px] leading-6 text-muted-foreground">
        Research open · code closed, for now
      </p>
      <p className="mt-2 max-w-[42rem] text-lede font-light text-muted-foreground">
        In October one AI pipeline built{" "}
        <a
          href={SOURCE}
          target="_blank"
          rel="noopener noreferrer"
          className="font-normal text-foreground underline-offset-4 hover:underline"
        >
          948 working Linux root exploits
        </a>{" "}
        at about $1,300 each. Discovery scales with compute; checking still
        runs on people. So my code is closed{" "}
        <span className="font-normal text-foreground">
          until I have local protection
        </span>
        , and the research stays open.{" "}
        <Link
          href="/research/012-windowless"
          className="whitespace-nowrap font-normal text-foreground underline-offset-4 hover:underline"
        >
          Why →
        </Link>
      </p>
    </section>
  );
}
