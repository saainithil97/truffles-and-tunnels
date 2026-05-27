"use client";

import { useState } from "react";
import RestaurantGrid from "@/components/RestaurantGrid";
import type { Restaurant } from "@/lib/restaurants";

// A CLIENT component nested inside a server page. The full list is passed in as
// a prop — it was already rendered to HTML by the server, so View Source shows
// every card AND this input. After hydration, typing filters the list.
export default function RestaurantSearch({ restaurants }: { restaurants: Restaurant[] }) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = q
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(q) || r.cuisines.toLowerCase().includes(q),
      )
    : restaurants;

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search restaurants or cuisines…"
        className="mb-6 w-full max-w-md rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-orange-400"
      />
      <RestaurantGrid restaurants={filtered} />
    </div>
  );
}
