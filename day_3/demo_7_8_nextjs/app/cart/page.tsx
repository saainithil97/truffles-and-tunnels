"use client";

import CartList from "@/components/CartList";

// CSR: this whole page is a client component. The server sends a near-empty
// HTML shell; the cart contents are fetched IN THE BROWSER after the JS
// loads. A user's cart is the canonical CSR case — private, login-gated,
// deeply interactive, no SEO need.
export default function CartPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Your cart</h1>
      <p className="mt-1 text-slate-600">
        View Source: this page ships a near-empty HTML shell. Your cart items aren't there —
        they're fetched in the browser and merged with whatever you added on{" "}
        <code>/detail</code>.
      </p>

      <aside className="my-6 rounded-lg border border-sky-300 bg-sky-50 p-4 text-sm text-sky-900">
        <p className="font-semibold">Why this page is CSR</p>
        <p className="mt-1">
          A cart is private — it's only ever shown to one user, the one logged in. No SEO need
          (crawlers <em>shouldn't</em> see it anyway). And it's deeply interactive. So we ship a
          shell + JS and let the browser do the rest. This is the SPA pattern from Demo 6.5 — in
          its rightful habitat.
        </p>
      </aside>

      <CartList />
    </div>
  );
}
