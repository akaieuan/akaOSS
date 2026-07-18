"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  label: string;
  depth: number;
}

export const PAPER_TOC: TocItem[] = [
  { id: "a-measurement-problem", label: "A Measurement Problem", depth: 1 },
  { id: "section-1-understanding-why-autonomous-systems-fail", label: "1. Why Autonomous Systems Fail", depth: 2 },
  { id: "11-the-benchmark-saturation-crisis", label: "1.1 Benchmark Saturation", depth: 3 },
  { id: "12-enterprise-reality-the-95-failure-rate", label: "1.2 The 95% Failure Rate", depth: 3 },
  { id: "13-competing-frameworks-for-understanding-ai-system-failures", label: "1.3 Competing Frameworks", depth: 3 },
  { id: "section-2-where-autonomous-ai-systems-fail-in-practice", label: "2. Where They Fail", depth: 2 },
  { id: "21-multi-hop-reasoning-tasks", label: "2.1 Multi-Hop Reasoning", depth: 3 },
  { id: "22-learning-and-knowledge-retention", label: "2.2 Learning Retention", depth: 3 },
  { id: "23-writing-and-composition-tasks", label: "2.3 Writing Tasks", depth: 3 },
  { id: "section-3-redesigning-ai-systems-for-human-agency", label: "3. Redesigning for Agency", depth: 2 },
  { id: "31-core-principle-assistance-as-augmentation-not-automation", label: "3.1 Assist, Not Automate", depth: 3 },
  { id: "32-explainability-as-core-design-requirement", label: "3.2 Explainability", depth: 3 },
  { id: "33-supporting-facts-and-evidence-based-reasoning", label: "3.3 Supporting Facts", depth: 3 },
  { id: "section-4-rethinking-ai-evaluation-systems", label: "4. Rethinking Evaluation", depth: 2 },
  { id: "41-the-fundamental-measurement-problem", label: "4.1 The Measurement Problem", depth: 3 },
  { id: "42-confidence-calibration-and-uncertainty-quantification", label: "4.2 Confidence Calibration", depth: 3 },
  { id: "43-why-autonomous-systems-fail-evidence-from-competing-frameworks", label: "4.3 Why They Fail (Evidence)", depth: 3 },
  { id: "44-redesigning-evaluation-for-collaborative-systems", label: "4.4 Evaluation Redesign", depth: 3 },
  { id: "moving-from-measurement-crisis-to-collaborative-design", label: "Conclusion", depth: 2 },
  { id: "references", label: "References", depth: 2 },
];

export function PaperTOC() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    PAPER_TOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-60 shrink-0 overflow-y-auto lg:block">
      <p className="label mb-4">On this page</p>
      <nav className="flex flex-col gap-0.5 text-[11px]">
        {PAPER_TOC.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "rounded-md py-1 leading-snug transition-colors",
              item.depth === 1 && "font-semibold",
              item.depth === 2 && "pl-2",
              item.depth === 3 && "pl-5 text-[10.5px]",
              active === item.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
