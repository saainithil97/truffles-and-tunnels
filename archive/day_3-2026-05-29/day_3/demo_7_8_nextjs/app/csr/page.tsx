"use client";

import { useEffect, useState } from "react";
import RestaurantGrid from "@/components/RestaurantGrid";
import type { Restaurant } from "@/lib/restaurants";

// CSR: Client-Side Rendering. This whole page is a client component. The server
// sends a near-empty HTML shell; the data is fetched IN THE BROWSER after the
// JavaScript loads. View Source shows no restaurant names — only this shell.
export default function CsrPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

  useEffect(() => {
    // This fetch runs in the browser. The BROWSER makes this network call —
    // which is why CSR data calls are subject to CORS (see the README).
    fetch("/api/restaurants")
      .then((res) => res.json())
      .then((data: Restaurant[]) => setRestaurants(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">/csr — Client (rendered in the browser)</h1>
      <p className="mt-1 text-slate-600">
        View Source: <strong>no restaurant names</strong> — just an empty shell. The
        grid below only appears after the JavaScript runs and fetches the data.
      </p>
      <div className="mt-6">
        {restaurants === null ? (
          <div className="flex items-center gap-3 text-slate-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-orange-500" />
            Loading restaurants…
          </div>
        ) : (
          <RestaurantGrid restaurants={restaurants} />
        )}
      </div>
    </div>
  );
}
