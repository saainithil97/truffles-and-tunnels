"use client";

import { useState } from "react";
import type { MenuItem } from "@/lib/menu";

const CART_STORAGE_KEY = "swiggy-demo-cart";

type StoredCartEntry = {
  menuItemId: string;
  name: string;
  price: number;
  emoji: string;
  qty: number;
};

// CLIENT island. The smallest unit of interactivity on the /detail page —
// one of these renders per menu item; the rest of the menu is server-only.
//
// Persists a tiny cart in localStorage. The /cart page (CSR) reads it back.
export default function AddToCartButton({ item }: { item: MenuItem }) {
  const [justAdded, setJustAdded] = useState(false);

  function onClick() {
    if (typeof window === "undefined") return;
    let cart: StoredCartEntry[] = [];
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) cart = JSON.parse(raw) as StoredCartEntry[];
    } catch {
      cart = [];
    }
    const existing = cart.find((c) => c.menuItemId === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        emoji: item.emoji,
        qty: 1,
      });
    }
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
        justAdded
          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
          : "border-orange-500 bg-orange-500 text-white hover:bg-orange-600"
      }`}
    >
      {justAdded ? "Added ✓" : "Add"}
    </button>
  );
}

export { CART_STORAGE_KEY };
export type { StoredCartEntry };
