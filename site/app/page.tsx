import Link from "next/link";
import { days } from "@/lib/curriculum";

export default function HomePage() {
  return (
    <div>
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Truffles &amp; Tunnels
        </h1>
        <p className="mt-2 text-lg text-neutral-700">
          A multi-day workshop on shipping software.
        </p>
        <p className="mt-4 max-w-2xl text-neutral-700">
          We start with the lifecycle of a real web app (Swiggy), pick up the
          tools a working developer uses every day (Git, GitHub, Vercel), and
          then pull the frontend apart — what the browser does, why frameworks
          exist, and what React and Next.js actually do underneath. The Swiggy
          restaurant card is the running example throughout.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Days
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {days.map((day) => (
            <li key={day.num}>
              <Link
                href={`/days/${day.num}`}
                className="block h-full rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-[#fc8019] hover:shadow-sm"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-[#fc8019]">
                  Day {day.num}
                </div>
                <div className="mt-1 text-lg font-semibold text-neutral-900">
                  {day.title}
                </div>
                <p className="mt-2 text-sm text-neutral-600">{day.blurb}</p>
                {!day.hasDemos && (
                  <div className="mt-3 inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                    Demos coming soon
                  </div>
                )}
                {day.hasDemos && day.demos && (
                  <div className="mt-3 text-xs text-neutral-500">
                    {day.demos.length} demos
                  </div>
                )}
              </Link>
            </li>
          ))}
          <li>
            <div className="block h-full rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-5 text-neutral-500">
              <div className="text-xs font-semibold uppercase tracking-wide">
                More
              </div>
              <div className="mt-1 text-lg font-semibold">More to come</div>
              <p className="mt-2 text-sm">
                Additional days will be added as the workshop is built out.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
}
