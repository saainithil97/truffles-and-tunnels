"use client";

import { useState } from "react";

// A CLIENT component: it has interactive state, so it needs JavaScript in the
// browser. Its 'use client' boundary keeps interactivity local — the cards and
// grid around it stay server components and ship no JS.
export default function FavouriteButton({ name }: { name: string }) {
  const [faved, setFaved] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFaved((v) => !v)}
      aria-pressed={faved}
      className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:border-orange-400"
    >
      {faved ? "❤️ Favourited" : "🤍 Add to favourites"}
    </button>
  );
}
