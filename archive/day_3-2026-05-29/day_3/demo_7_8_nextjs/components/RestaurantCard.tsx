import Link from "next/link";
import type { Restaurant } from "@/lib/restaurants";

// A plain SERVER component: no 'use client', no interactivity. It renders to
// HTML and ships zero JavaScript of its own.
export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-200 text-5xl">
        {restaurant.emoji}
      </div>
      <h3 className="font-semibold text-slate-900">{restaurant.name}</h3>
      <p className="text-sm text-slate-500">{restaurant.cuisines}</p>
      <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
        <span className="rounded bg-green-600 px-1.5 py-0.5 text-xs font-bold text-white">
          ★ {restaurant.rating}
        </span>
        <span>·</span>
        <span>{restaurant.deliveryTime} min</span>
        <span>·</span>
        <span>₹{restaurant.costForTwo} for two</span>
      </div>
    </Link>
  );
}
