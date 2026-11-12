import Link from "next/link";
import { CoverArt } from "@/components/ui/cover-art";
import { getResearchPosts } from "@/lib/research";

/* The research feed: the paper, then every post, newest first. Cards carry no
   border and no rule; space and a hover wash separate them.

   The Grid/List switch is two radio inputs and `:has()`. No state, no client
   JavaScript: the feed stays server-rendered and the switch still works. */

type Entry = {
  href: string;
  slug: string;
  meta: string;
  title: string;
  summary: string;
};

const PAPER: Entry = {
  href: "/paper",
  slug: "paper",
  meta: "Paper",
  title: "An AI Measurement Problem",
  summary:
    "The AI failure crisis is at root a measurement crisis. The argument for Assist-Not-Complete, which the posts below test.",
};

const option =
  "inline-flex h-[30px] cursor-pointer items-center rounded-full px-3.5 text-muted-foreground transition-colors has-[:checked]:bg-foreground/[0.13] has-[:checked]:text-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring";

export async function PostGrid({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const posts = await getResearchPosts();
  const entries: Entry[] = [
    PAPER,
    ...posts.map((p) => ({
      href: `/research/${p.slug}`,
      slug: p.slug,
      meta: `№ ${p.numberLabel} · ${p.date}`,
      title: p.title,
      summary: p.summary,
    })),
  ];
  const Heading = heading;

  return (
    <section aria-labelledby="research-heading" className="group/feed">
      <div className="flex items-center justify-between gap-4">
        <Heading
          id="research-heading"
          className="text-[19px] font-normal tracking-[-0.01em] text-foreground"
        >
          Research
        </Heading>
        <fieldset className="inline-flex gap-1 rounded-full bg-foreground/[0.03] p-[3px] text-[13px]">
          <legend className="sr-only">Layout</legend>
          <label className={option}>
            <input
              type="radio"
              name="feed-layout"
              defaultChecked
              className="sr-only"
            />
            Grid
          </label>
          <label className={option}>
            <input
              id="feed-list"
              type="radio"
              name="feed-layout"
              className="sr-only"
            />
            List
          </label>
        </fieldset>
      </div>

      <ol className="-mx-2 mt-4 grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 group-has-[#feed-list:checked]/feed:grid-cols-1 group-has-[#feed-list:checked]/feed:gap-y-1">
        {entries.map((e, i) => (
          <li key={e.href} className="settle min-w-0">
            <Link
              href={e.href}
              className="group/card block rounded-[20px] p-2 pb-3.5 transition-colors duration-150 hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.03] group-has-[#feed-list:checked]/feed:grid group-has-[#feed-list:checked]/feed:grid-cols-[104px_minmax(0,1fr)] group-has-[#feed-list:checked]/feed:items-center group-has-[#feed-list:checked]/feed:gap-3.5 group-has-[#feed-list:checked]/feed:pb-2 sm:group-has-[#feed-list:checked]/feed:grid-cols-[168px_minmax(0,1fr)] sm:group-has-[#feed-list:checked]/feed:gap-5"
            >
              <CoverArt
                slug={e.slug}
                variant="card"
                priority={i < 3}
                className="mb-3 group-has-[#feed-list:checked]/feed:mb-0"
                imageClassName="transition-transform duration-500 ease-out group-hover/card:scale-[1.03] motion-reduce:transition-none"
              />
              <div className="min-w-0 px-1">
                <p className="font-mono text-[12px] tabular-nums text-muted-foreground/80">
                  {e.meta}
                </p>
                <h3 className="mt-1 mb-1.5 text-[17px] font-normal leading-[1.3] tracking-[-0.01em] text-foreground">
                  {e.title}
                </h3>
                <p className="line-clamp-2 text-[14px] leading-[1.55] text-muted-foreground">
                  {e.summary}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
