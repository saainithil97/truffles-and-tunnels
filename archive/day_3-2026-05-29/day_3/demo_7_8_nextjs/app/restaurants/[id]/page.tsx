import Link from "next/link";
import { notFound } from "next/navigation";
import FavouriteButton from "@/components/FavouriteButton";
import { getRestaurant, restaurants } from "@/lib/restaurants";

// Pre-render one static page per restaurant at build time. This means each
// detail URL works as a FULL page load (direct URL / open-in-new-tab), proving
// SSR/SSG matters even inside an SPA — every page's first load must work
// without relying on the client router.
export function generateStaticParams() {
  return restaurants.map((r) => ({ id: String(r.id) }));
}

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // In Next.js 16, `params` is a Promise and must be awaited.
  const { id } = await params;
  const restaurant = getRestaurant(Number(id));

  if (!restaurant) {
    notFound();
  }

  return (
    <div>
      <Link href="/hybrid" className="text-sm text-orange-600 hover:underline">
        ← Back to restaurants
      </Link>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-200 text-7xl">
          {restaurant.emoji}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="mt-1 text-slate-500">{restaurant.cuisines}</p>
          <div className="mt-4">
            <FavouriteButton name={restaurant.name} />
          </div>
        </div>
      </div>

      <dl className="mt-8 grid max-w-md grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Rating</dt>
          <dd className="text-xl font-semibold">★ {restaurant.rating}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Delivery</dt>
          <dd className="text-xl font-semibold">{restaurant.deliveryTime} min</dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Cost for two</dt>
          <dd className="text-xl font-semibold">₹{restaurant.costForTwo}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <dt className="text-xs uppercase tracking-wide text-slate-400">ID</dt>
          <dd className="text-xl font-semibold">#{restaurant.id}</dd>
        </div>
      </dl>
    </div>
  );
}
