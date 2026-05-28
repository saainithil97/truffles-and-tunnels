"use client";

import { useState } from "react";
import type { Demo } from "@/lib/curriculum";

// Renders the live demo as an iframe with:
//   - tabs (when the demo has multiple entry HTMLs)
//   - an "open in new tab" link (so you can pop it out into its own window)
//   - a small reload button (because Cmd-R refreshes this whole page, not the frame)
export function DemoFrame({
  item,
  initialUrl,
}: {
  item: Demo;
  initialUrl: string;
}) {
  const entries = item.iframeEntries ?? [{ label: "Live demo", path: initialUrl }];
  const [activePath, setActivePath] = useState<string>(initialUrl);
  const [reloadKey, setReloadKey] = useState<number>(0);

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50 px-3 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1">
          {entries.length > 1 ? (
            entries.map((e) => {
              const isActive = e.path === activePath;
              return (
                <button
                  key={e.path}
                  type="button"
                  onClick={() => {
                    setActivePath(e.path);
                    setReloadKey((k) => k + 1);
                  }}
                  className={
                    "rounded-md px-2.5 py-1 text-xs font-medium transition " +
                    (isActive
                      ? "bg-[#fc8019] text-white"
                      : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200")
                  }
                >
                  {e.label}
                </button>
              );
            })
          ) : (
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Live demo
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-100"
            aria-label="Reload the demo iframe"
            title="Reload the demo iframe"
          >
            ↻
          </button>
          <a
            href={activePath}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-100"
            title="Open in a new tab"
          >
            ↗ Open
          </a>
        </div>
      </div>

      {/* The frame itself */}
      <iframe
        key={`${activePath}::${reloadKey}`}
        src={activePath}
        className="block h-[70vh] w-full bg-white lg:h-[78vh]"
        // Allow scripts + same-origin so JSX-vs-compiled (Babel), React, etc. all work.
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        title={item.title}
      />

      {item.iframeNote && (
        <div className="border-t border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
          💡 {item.iframeNote}
        </div>
      )}
    </div>
  );
}
