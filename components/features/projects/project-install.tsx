import { CopyButton } from "@/components/ui/copy-button";
import type { Project } from "@/lib/projects";

export function ProjectInstall({ project }: { project: Project }) {
  return (
    <section className="settle pb-16">
      <p className="label mb-5">Install</p>
      <div className="flex max-w-2xl flex-col gap-4">
        {project.install.map((step) => (
          <div key={step.command} className="flex flex-col gap-2">
            <span className="label">{step.label}</span>
            <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/40 px-3 py-2.5">
              <pre className="flex-1 overflow-x-auto font-mono text-xs text-foreground">
                <span className="text-muted-foreground">$</span>{" "}
                {step.command}
              </pre>
              <CopyButton text={step.command} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
