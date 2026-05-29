import RestaurantGrid from "@/components/RestaurantGrid";
import { restaurants } from "@/lib/restaurants";

// SSR: Server-Side Rendering. This page is rendered fresh on the server for
// EVERY request. The HTML is complete (good for SEO) but built on the fly.
export const dynamic = "force-dynamic";

export default function SsrPage() {
  // Evaluated on the server, on every request. Reload and it changes — proof
  // this HTML was rendered just now, not at build time.
  const renderedAt = new Date().toISOString();

  return (
    <div>
      <h1 className="text-2xl font-bold">/ssr — Server (rendered per request)</h1>
      <p className="mt-1 text-slate-600">
        View Source: every restaurant is in the HTML, just like SSG. But reload and
        the timestamp below changes — this HTML was rendered on the server <em>now</em>.
      </p>
      <p className="mt-3 inline-block rounded bg-slate-900 px-3 py-1 font-mono text-sm text-emerald-300">
        rendered on server at: {renderedAt}
      </p>
      <div className="mt-6">
        <RestaurantGrid restaurants={restaurants} />
      </div>
    </div>
  );
}
