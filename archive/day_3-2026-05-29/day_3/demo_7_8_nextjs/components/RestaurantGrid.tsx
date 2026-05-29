import RestaurantCard from "@/components/RestaurantCard";
import type { Restaurant } from "@/lib/restaurants";

// SERVER component. The whole grid is rendered to HTML on the server (or at
// build time) — the names, ratings, and emoji are all in the page source.
export default function RestaurantGrid({ restaurants }: { restaurants: Restaurant[] }) {
  if (restaurants.length === 0) {
    return <p className="text-slate-500">No restaurants match your search.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </div>
  );
}
