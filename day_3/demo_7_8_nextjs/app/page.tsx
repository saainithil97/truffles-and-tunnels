import Link from "next/link";

// Plain server component — a signpost for the four Demo 7 + 8 routes, each
// chosen because of WHAT KIND OF PAGE it is, not arbitrarily.
export default function Home() {
  const links: { href: string; strategy: string; label: string; blurb: string }[] = [
    {
      href: "/menu",
      strategy: "SSG",
      label: "Restaurant menu",
      blurb: "Demo 7 · same for everyone, frozen at build, CDN-cached.",
    },
    {
      href: "/feed",
      strategy: "SSR",
      label: '"Near you" feed',
      blurb: "Demo 7 · personalised per request; reload and the top picks change.",
    },
    {
      href: "/cart",
      strategy: "CSR",
      label: "Your cart",
      blurb: "Demo 7 · login-gated, no SEO; empty shell + browser-side fetch.",
    },
    {
      href: "/detail",
      strategy: "Hybrid",
      label: "Restaurant detail",
      blurb: "Demo 8 · server-rendered menu + client islands (search + add).",
    },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold">Day 3 — Demystifying the Frontend</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Four routes, four rendering strategies, each chosen because of{" "}
        <em>what kind of page it is</em>. Open <strong>View Page Source</strong> and the{" "}
        <strong>Network tab</strong> on each route — the HTML (or the lack of it) is the whole
        demo.
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-orange-400"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-orange-600">{l.href}</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                  {l.strategy}
                </span>
              </div>
              <div className="mt-1 text-sm font-medium text-slate-700">{l.label}</div>
              <div className="mt-0.5 text-sm text-slate-500">{l.blurb}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
