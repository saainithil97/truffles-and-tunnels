import Link from "next/link";

// Plain server component — a signpost for the three Demo 7 routes plus the
// Demo 8 hybrid page.
export default function Home() {
  const links: { href: string; label: string; blurb: string }[] = [
    { href: "/ssg", label: "/ssg — Static (build time)", blurb: "Demo 7 · frozen at build; timestamp never changes." },
    { href: "/ssr", label: "/ssr — Server (per request)", blurb: "Demo 7 · rendered now; timestamp changes every reload." },
    { href: "/csr", label: "/csr — Client (in the browser)", blurb: "Demo 7 · empty shell in View Source; JS fills it in." },
    { href: "/hybrid", label: "/hybrid — Server + Client", blurb: "Demo 8 & 8.5 · server grid + client search; click a card to navigate." },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold">Day 3 — Demystifying the Frontend</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        One Swiggy restaurant grid, rendered four ways. Open{" "}
        <strong>View Page Source</strong> and the <strong>Network tab</strong> on each route —
        the HTML (or the lack of it) is the whole demo.
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-orange-400"
            >
              <span className="font-semibold text-orange-600">{l.label}</span>
              <span className="mt-1 block text-sm text-slate-500">{l.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
