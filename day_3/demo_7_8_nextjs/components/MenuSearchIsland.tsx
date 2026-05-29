"use client";

import { useEffect, useRef, useState } from "react";

// CLIENT island for searching within a server-rendered menu.
//
// Why this exists as a tiny separate island: the menu items themselves stay
// SERVER-rendered (no JS). Filtering happens by toggling .hidden on the
// data-menu-item DOM nodes the server already painted — so we get instant
// client-side search without re-rendering the list or pulling the items
// into the client bundle.
export default function MenuSearchIsland() {
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    // Walk the same document the server painted. No React data dependency
    // on the items list at all.
    const items = document.querySelectorAll<HTMLLIElement>("[data-menu-item]");
    items.forEach((el) => {
      const name = el.getAttribute("data-menu-name") ?? "";
      el.style.display = !q || name.includes(q) ? "" : "none";
    });
    // Hide section headers whose items are all filtered out, for cleanliness.
    const sections = document.querySelectorAll<HTMLElement>("[data-menu-section]");
    sections.forEach((sec) => {
      const visible = sec.querySelectorAll<HTMLLIElement>(
        "[data-menu-item]:not([style*='display: none'])"
      );
      sec.style.display = visible.length === 0 ? "none" : "";
    });
  }, [query]);

  return (
    <div ref={rootRef} className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        <span
          title="This search box is a Client Component — it ships its tiny JS to your browser so it can hold the query and react to keystrokes."
          className="inline-flex items-center gap-1 rounded-md border border-sky-300 bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-900"
        >
          🔵 Client island
        </span>
        <span className="text-xs text-slate-500">
          'use client' — filters the server-rendered menu via DOM toggle
        </span>
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the menu…"
        className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-orange-400"
      />
    </div>
  );
}
