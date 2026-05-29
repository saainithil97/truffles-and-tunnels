"use client";

import { useEffect, useState } from "react";
import {
  CART_STORAGE_KEY,
  type StoredCartEntry,
} from "@/components/AddToCartButton";

type CartItem = StoredCartEntry;

// CLIENT page body for /cart. The entire view is built in the browser:
// fetch from /api/cart (a mocked authed-cart endpoint) THEN merge in
// whatever this device has in localStorage (the AddToCartButton islands
// on /detail write to it).
//
// View Source on /cart is intentionally empty of cart data — the server
// ships a shell, the browser fills it in.
export default function CartList() {
  const [items, setItems] = useState<CartItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const remote = await fetch("/api/cart")
        .then((r) => r.json())
        .catch(() => [] as CartItem[]);
      let local: CartItem[] = [];
      try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        if (raw) local = JSON.parse(raw) as CartItem[];
      } catch {
        local = [];
      }
      const merged = mergeCarts(remote, local);
      if (!cancelled) setItems(merged);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (items === null) {
    return (
      <div className="flex items-center gap-3 text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-orange-500" />
        Loading your cart…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
        Your cart is empty. Open <code>/detail</code> and tap <strong>Add</strong> on a
        few items — they show up here.
      </div>
    );
  }

  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);

  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it.menuItemId}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-200 text-2xl">
              {it.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900">{it.name}</h3>
              <p className="text-sm text-slate-500">
                ₹{it.price} × {it.qty}
              </p>
            </div>
            <p className="shrink-0 font-mono text-sm text-slate-900">
              ₹{it.price * it.qty}
            </p>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
        <p className="text-sm text-slate-600">Subtotal</p>
        <p className="font-mono text-base font-semibold text-slate-900">
          ₹{subtotal}
        </p>
      </div>
    </div>
  );
}

function mergeCarts(remote: CartItem[], local: CartItem[]): CartItem[] {
  const byId = new Map<string, CartItem>();
  for (const it of remote) byId.set(it.menuItemId, { ...it });
  for (const it of local) {
    const existing = byId.get(it.menuItemId);
    if (existing) existing.qty += it.qty;
    else byId.set(it.menuItemId, { ...it });
  }
  return [...byId.values()];
}
