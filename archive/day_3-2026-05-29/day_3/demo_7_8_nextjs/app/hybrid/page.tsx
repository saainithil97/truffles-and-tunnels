import RestaurantSearch from "@/components/RestaurantSearch";
import { restaurants } from "@/lib/restaurants";

function ServerBadge({ note }: { note?: string }) {
  return (
    <span
      title={note}
      className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-900"
    >
      🟢 Server (0 KB JS)
    </span>
  );
}

// SERVER component (the page shell). It renders the heading and passes the full
// restaurant list to a CLIENT search component. The server does the HTML; the
// client adds interactivity only where it's needed.
export default function HybridPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">/hybrid — Server grid + client search</h1>
        <ServerBadge note="This whole page (the shell, the heading, the restaurant cards) is a Server Component. Zero JS ships for it." />
      </div>
      <p className="mt-1 max-w-2xl text-slate-600">
        View Source: the search box <em>and</em> every restaurant card are in the HTML —
        all server-rendered. Typing filters the list (that needs JavaScript). Click any
        card to navigate without a full page reload (Demo 8.5).
      </p>
      <div className="mt-6">
        <RestaurantSearch restaurants={restaurants} />
      </div>
    </div>
  );
}
