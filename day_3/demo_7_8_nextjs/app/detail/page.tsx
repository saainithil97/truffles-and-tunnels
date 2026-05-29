import MenuList from "@/components/MenuList";
import MenuSearchIsland from "@/components/MenuSearchIsland";
import { meghanaMenu } from "@/lib/menu";
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

// HYBRID: server-rendered menu (SSG-style content) + small client islands
// for the interactive surfaces (search box, per-item Add buttons). The
// canonical "server trunk, client leaves" Demo-8 example.
export default function DetailPage() {
  const restaurant = restaurants.find((r) => r.id === 1)!; // Meghana Foods

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        <ServerBadge note="This page header is a Server Component — zero JS ships for it." />
      </div>
      <p className="text-slate-600">
        {restaurant.cuisines} · ★ {restaurant.rating} · {restaurant.deliveryTime} min ·
        {" "}₹{restaurant.costForTwo} for two
      </p>

      <aside className="my-6 rounded-lg border border-violet-300 bg-violet-50 p-4 text-sm text-violet-900">
        <p className="font-semibold">Why this page is hybrid</p>
        <p className="mt-1">
          The menu itself is the same SSG-shaped content as <code>/menu</code> — zero JS. But you
          need two interactive surfaces on top: a search-within-menu box, and per-item{" "}
          <strong>Add</strong> buttons. Both are client islands, marked 🔵. Everything else stays
          server, marked 🟢.
        </p>
        <p className="mt-2">
          View Source: every dish is still in the HTML. The 🔵 islands are tiny — most of the page
          ships zero JavaScript.
        </p>
      </aside>

      <MenuSearchIsland />

      <MenuList items={meghanaMenu} withAddToCart />
    </div>
  );
}
