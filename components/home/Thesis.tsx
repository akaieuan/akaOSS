import { PARADIGM, THESIS } from "@/lib/content";
import { SectionHead } from "./SectionHead";

export function Thesis() {
  return (
    <section className="settle max-w-[38rem] pb-16">
      <SectionHead title="Thesis" href="/paper" link="read the paper" />
      <p className="mt-4 text-[15px] font-light leading-relaxed text-foreground/85">
        {PARADIGM.def}
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground/70">
        {THESIS.lede}
      </p>
    </section>
  );
}
