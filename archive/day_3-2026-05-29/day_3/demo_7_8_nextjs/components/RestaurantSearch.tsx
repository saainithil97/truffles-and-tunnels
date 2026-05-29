"use client";

import { useState } from "react";
import RestaurantGrid from "@/components/RestaurantGrid";
import type { Restaurant } from "@/lib/restaurants";

function ClientBadge({ note }: { note?: string }) {
  return (
    <span
      title={note}
      className="inline-flex items-center gap-1 rounded-md border border-sky-300 bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-900"
    >
      🔵 Client (~3 KB)
    </span>
  );
}

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
      <div className="mb-2 flex items-center gap-2">
        <ClientBadge note="This search box is a Client Component — it ships JS to your browser so it can have state (the query) and an event handler (onChange)." />
        <span className="text-xs text-slate-500">
          'use client' — has state + onChange
        </span>
      </div>
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
