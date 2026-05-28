import Link from "next/link";
import { notFound } from "next/navigation";
import { days, findDay3Item } from "@/lib/curriculum";

export function generateStaticParams() {
  return days.map((d) => ({ num: String(d.num) }));
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  const day = days.find((d) => String(d.num) === num);
  if (!day) notFound();

  return (
    <article>
      <div className="text-xs font-semibold uppercase tracking-wide text-[#fc8019]">
        Day {day.num}
      </div>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
        {day.title}
      </h1>
      <p className="mt-4 max-w-2xl text-neutral-700">{day.blurb}</p>

      {!day.hasDemos && (
        <div className="mt-8 rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
          Demos coming soon. The runbooks for this day haven&apos;t been written
          yet.
        </div>
      )}

      {day.hasDemos && day.parts && (
        <div className="mt-10 space-y-10">
          {day.parts.map((part) => (
            <section key={part.heading}>
              <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                {part.heading}
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {part.demoSlugs.map((slug) => {
                  const item = findDay3Item(slug);
                  if (!item) return null;
                  const href =
                    slug === "verbal-segments"
                      ? "/days/3/verbal-segments"
                      : `/days/3/demos/${slug}`;
                  return (
                    <li key={slug}>
                      <Link
                        href={href}
                        className="block h-full rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-[#fc8019] hover:shadow-sm"
                      >
                        <div className="text-sm font-semibold text-neutral-900">
                          {prettyTitle(item.title)}
                        </div>
                        <p className="mt-1.5 text-sm text-neutral-600">
                          {item.summary}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </article>
  );
}

// Strip the "Day 3, Demo N — " prefix for a cleaner card title.
function prettyTitle(title: string): string {
  // Match patterns like: "Day 3, Demo 1 — ..." or "Day 3, Demos 7 / 8 / 8.5 — ..."
  const m = title.match(/^Day\s+\d+,\s+Demos?\s+[^—]+—\s*(.*)$/);
  if (m) return m[1].trim();
  return title;
}
