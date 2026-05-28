import Link from "next/link";
import { notFound } from "next/navigation";
import {
  days,
  day3Parts,
  findDay3Item,
  type DayPart,
} from "@/lib/curriculum";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return days.map((d) => ({ num: String(d.num) }));
}

// Derive the human-facing demo number/chip label from a demo id.
// demo_2 → "2", demo_2_5 → "2.5", demo_7_8_nextjs → "7/8/8.5", verbal-segments → "✦".
function chipLabel(slug: string): string {
  if (slug === "verbal-segments") return "✦";
  const m = slug.match(/^demo_(.+)$/);
  if (!m) return "•";
  const rest = m[1];
  // Special-case the combined demo
  if (rest === "7_8_nextjs") return "7/8/8.5";
  // demo_2_5 → 2.5; demo_10 → 10; demo_1 → 1
  return rest.replace(/_/g, ".");
}

// Strip the leading "Demo N — " prefix from a shortTitle for cleaner timeline rows.
function trimLeadingNumber(shortTitle: string): string {
  return shortTitle.replace(/^Demos?\s+[^—]+—\s*/, "").replace(/^Verbal segments$/, "Verbal segments");
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  const day = days.find((d) => String(d.num) === num);
  if (!day) notFound();

  const eyebrow = `DAY ${String(day.num).padStart(2, "0")}`;

  return (
    <article className="mx-auto max-w-4xl">
      {/* Header */}
      <header>
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {day.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          {day.blurb}
        </p>
      </header>

      {/* Body */}
      {day.hasDemos && day.parts ? (
        <Day3Timeline parts={day.parts} />
      ) : (
        <ComingSoonBody day={day} />
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Day 3 — vertical timeline
// ---------------------------------------------------------------------------

function Day3Timeline({ parts }: { parts: DayPart[] }) {
  return (
    <div className="mt-10">
      <div className="relative">
        {/* Continuous vertical rail */}
        <div
          aria-hidden
          className="absolute left-[15px] top-2 bottom-2 w-px bg-border"
        />

        <ol className="space-y-8">
          {parts.map((part, idx) => {
            // Subtle horizontal stagger so the path feels alive without breaking alignment.
            const offsets = ["sm:ml-0", "sm:ml-1", "sm:ml-2", "sm:ml-1", "sm:ml-0"];
            const offset = offsets[idx % offsets.length];
            const isLast = idx === parts.length - 1;
            return (
              <li key={part.heading} className="relative">
                <div className="flex gap-5">
                  {/* Rail column with dot */}
                  <div className="relative flex w-8 flex-none flex-col items-center">
                    <span
                      aria-hidden
                      className="z-10 mt-3 size-3 rounded-full bg-primary ring-4 ring-background"
                    />
                  </div>

                  {/* Card */}
                  <div className={cn("min-w-0 flex-1", offset)}>
                    <PartCard part={part} index={idx} />
                  </div>
                </div>

                {/* Chevron between cards */}
                {!isLast && (
                  <div
                    aria-hidden
                    className="relative ml-[15px] flex h-6 -translate-x-1/2 items-center justify-center text-muted-foreground/60"
                  >
                    <ChevronDownIcon />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function PartCard({ part, index }: { part: DayPart; index: number }) {
  const partLabel = day3Parts === undefined ? "" : "";
  // The heading begins with "Part X — ..." or "Parts X–Y — ..." — split into label + title.
  const split = part.heading.split(" — ");
  const partTag = split.length > 1 ? split[0] : `Part ${index + 1}`;
  const partTitle = split.length > 1 ? split.slice(1).join(" — ") : part.heading;
  // Suppress unused var lint
  void partLabel;

  return (
    <Card className="transition hover:ring-foreground/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {partTag}
          </Badge>
        </div>
        <CardTitle className="mt-1 text-lg">{partTitle}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ul className="-mx-2 flex flex-col">
          {part.demoSlugs.map((slug) => {
            const item = findDay3Item(slug);
            if (!item) return null;
            const isVerbal = slug === "verbal-segments";
            const href = isVerbal
              ? "/days/3/verbal-segments"
              : `/days/3/demos/${slug}`;
            return (
              <li key={slug}>
                <Link
                  href={href}
                  className={cn(
                    "group/row flex items-start gap-3 rounded-md px-2 py-2.5 transition",
                    "hover:bg-muted/60"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-6 min-w-[2rem] flex-none items-center justify-center rounded-md px-1.5 font-mono text-xs font-medium tabular-nums",
                      isVerbal
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {chipLabel(slug)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium leading-snug">
                        {trimLeadingNumber(item.shortTitle)}
                      </span>
                      {isVerbal && (
                        <Badge variant="outline" className="font-mono text-[10px]">
                          Verbal
                        </Badge>
                      )}
                      <span
                        aria-hidden
                        className="ml-auto text-muted-foreground/50 transition group-hover/row:translate-x-0.5 group-hover/row:text-primary"
                      >
                        →
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Days 1 & 2 — simple "coming soon" body
// ---------------------------------------------------------------------------

function ComingSoonBody({ day }: { day: { num: number; blurb: string } }) {
  const bulletsByDay: Record<number, string[]> = {
    1: [
      "The lifecycle of a request — from your phone to the server and back",
      "What the server actually does on a typical request",
      "What the user sees come back, and in what order",
      "The Swiggy case study that anchors the rest of the workshop",
    ],
    2: [
      "Source control with Git and GitHub",
      "Branches, commits, and pull requests in practice",
      "Deploying a real site to the internet via Vercel",
      "The day-to-day toolchain of a working web developer",
    ],
  };
  const bullets = bulletsByDay[day.num] ?? [];

  return (
    <div className="mt-10">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Coming soon</Badge>
          </div>
          <CardTitle className="mt-1 text-lg">
            This day is being written
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground">
            Demos and runbooks for this day haven&apos;t been published yet. When
            they are, this page will cover:
          </p>
          <ul className="mt-3 space-y-2">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 flex-none rounded-full bg-primary"
                />
                <span className="text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
