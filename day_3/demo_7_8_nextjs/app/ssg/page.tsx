import RestaurantGrid from "@/components/RestaurantGrid";
import { restaurants } from "@/lib/restaurants";

// SSG: Static Site Generation. This page is rendered ONCE, at `next build`,
// and the resulting HTML is frozen and served to every visitor.
export const dynamic = "force-static";

export default function SsgPage() {
  // Evaluated at build time. It is baked into the HTML and never changes until
  // the next build — proof that this page is frozen.
  const builtAt = new Date().toISOString();

  return (
    <div>
      <h1 className="text-2xl font-bold">/ssg — Static (built at build time)</h1>
      <p className="mt-1 text-slate-600">
        View Source: every restaurant is in the HTML. Reload all day — the timestamp
        below never changes, because it was frozen at <code>next build</code>.
      </p>
      <p className="mt-3 inline-block rounded bg-slate-900 px-3 py-1 font-mono text-sm text-amber-300">
        generated at build: {builtAt}
      </p>
      <div className="mt-6">
        <RestaurantGrid restaurants={restaurants} />
      </div>
    </div>
  );
}
