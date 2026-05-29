import RestaurantGrid from "@/components/RestaurantGrid";
import { restaurants } from "@/lib/restaurants";

// SSR: rendered fresh on the server for EVERY request. A personalised home
// feed is the canonical SSR case — depends on who is asking, can't be baked.
export const dynamic = "force-dynamic";

export default function FeedPage() {
  const renderedAt = new Date().toISOString();
  // Personalisation proxy: rotate the top-3 picks every few seconds, using
  // the server clock as a stand-in for "user-specific recommendation lookup."
  // In production this would be a cookie / session / recommendation engine
  // — same shape, more compute.
  const offset = Math.floor(Date.now() / 4000) % restaurants.length;
  const rotated = [...restaurants.slice(offset), ...restaurants.slice(0, offset)];
  const topPicks = rotated.slice(0, 3);
  const rest = rotated.slice(3);

  return (
    <div>
      <h1 className="text-2xl font-bold">Restaurants near you in Indiranagar</h1>
      <p className="mt-1 text-slate-600">
        This list is built fresh on the server for every request — reload and the top picks
        change. View Source: full HTML, just like SSG, but rendered <em>now</em>.
      </p>

      <aside className="my-6 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold">Why this page is SSR</p>
        <p className="mt-1">
          A personalised feed depends on <em>who's asking</em> — location, login, time of day. Can't
          bake that at build time. So we render fresh server HTML per request: still SEO-friendly,
          still complete on first paint, but not cacheable the way <code>/menu</code> is.
        </p>
        <p className="mt-3 inline-block rounded bg-slate-900 px-3 py-1 font-mono text-xs text-emerald-300">
          rendered on server at: {renderedAt}
        </p>
      </aside>

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
        Top picks for you
      </h2>
      <RestaurantGrid restaurants={topPicks} />

      <h2 className="mt-10 mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
        Also worth a try
      </h2>
      <RestaurantGrid restaurants={rest} />
    </div>
  );
}
