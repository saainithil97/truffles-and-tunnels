import MenuList from "@/components/MenuList";
import { meghanaMenu } from "@/lib/menu";
import { restaurants } from "@/lib/restaurants";

// SSG: rendered ONCE, at `next build`, and the resulting HTML is frozen and
// served from a CDN to every visitor. A restaurant menu is the canonical
// SSG case — same dishes, same prices for everyone, perfect cache target.
export const dynamic = "force-static";

export default function MenuPage() {
  const restaurant = restaurants.find((r) => r.id === 1)!; // Meghana Foods
  const builtAt = new Date().toISOString();

  return (
    <div>
      <h1 className="text-2xl font-bold">{restaurant.name} — Menu</h1>
      <p className="mt-1 text-slate-600">
        {restaurant.cuisines} · ★ {restaurant.rating} · {restaurant.deliveryTime} min ·
        {" "}₹{restaurant.costForTwo} for two
      </p>

      <aside className="my-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Why this page is SSG</p>
        <p className="mt-1">
          A menu doesn't change per visitor. Same dishes, same prices, same emoji. So we build the
          HTML once at <code>next build</code>, ship it to a CDN, and every visitor gets the same
          byte-identical file in &lt;100ms. View Source — every dish below is in the HTML.
        </p>
        <p className="mt-2">
          In production we'd call <code>generateStaticParams</code> to build one of these per
          restaurant ID at build time, hundreds at once.
        </p>
        <p className="mt-3 inline-block rounded bg-slate-900 px-3 py-1 font-mono text-xs text-amber-300">
          generated at build: {builtAt}
        </p>
      </aside>

      <MenuList items={meghanaMenu} />
    </div>
  );
}
