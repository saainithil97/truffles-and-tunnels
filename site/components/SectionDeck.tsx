"use client";

import { useCallback, useEffect, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Section } from "@/lib/markdown";
import { cn } from "@/lib/utils";

// Renders a section-at-a-time deck of the demo content.
//
//  - Tabs at the top pick a section.
//  - Only the active section's markdown is mounted (presenter-friendly).
//  - Prev/Next buttons at the bottom.
//  - Keyboard: ←/→ to step, 1..9 to jump.
//  - URL hash (`#setup`, `#concepts`, ...) syncs with the active section.
//  - A vertical mini-TOC of dots is pinned to the right edge.
export function SectionDeck({ sections }: { sections: Section[] }) {
  const [activeIdx, setActiveIdx] = useState<number>(() =>
    initialIndex(sections),
  );

  // Reflect the active section in the URL hash so the back/forward buttons
  // navigate sections, and so a #hash deep-link lands on the right slide.
  useEffect(() => {
    const id = sections[activeIdx]?.id;
    if (!id) return;
    const newHash = `#${id}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, "", newHash);
    }
    // Scroll the deck top into view (gentle — only if it's off-screen above).
    const top = document.getElementById("deck-top");
    if (top) {
      const rect = top.getBoundingClientRect();
      if (rect.top < 0) {
        top.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }
  }, [activeIdx, sections]);

  // Listen for hash changes (back/forward) and re-sync.
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace(/^#/, "");
      const idx = sections.findIndex((s) => s.id === h);
      if (idx !== -1 && idx !== activeIdx) setActiveIdx(idx);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [sections, activeIdx]);

  const jump = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= sections.length) return;
      setActiveIdx(idx);
    },
    [sections.length],
  );

  const prev = useCallback(() => {
    setActiveIdx((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setActiveIdx((i) => Math.min(sections.length - 1, i + 1));
  }, [sections.length]);

  // Keyboard nav: ←/→ pages; 1..9 jumps.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      // Ignore when typing into an input / contenteditable.
      const target = e.target as HTMLElement | null;
      if (target && isTypingTarget(target)) return;
      // Ignore modifier-combos (Cmd-R reload etc.).
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < sections.length) {
          e.preventDefault();
          jump(idx);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump, prev, next, sections.length]);

  if (sections.length === 0) return null;

  const active = sections[activeIdx];

  return (
    <div id="deck-top" className="relative">
      {/* Tab strip */}
      <div className="sticky top-14 z-20 -mx-4 mb-6 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <Tabs value={String(activeIdx)} onValueChange={(v) => jump(Number(v))}>
          <TabsList className="h-auto bg-transparent p-0">
            {sections.map((s, i) => (
              <TabsTrigger
                key={s.id}
                value={String(i)}
                className={cn(
                  "relative gap-2 rounded-none border-b-2 border-transparent bg-transparent px-3 py-3 text-sm font-medium text-muted-foreground transition",
                  "data-active:border-primary data-active:bg-transparent data-active:text-foreground data-active:shadow-none",
                  "hover:text-foreground",
                )}
              >
                <span className="font-mono text-[10px] opacity-60">
                  {i + 1}
                </span>
                <span>{s.heading}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Active section */}
      <div className="markdown">
        <h2 className="!mt-0 !border-b-0 !pb-0">{active.heading}</h2>
        <Markdown source={active.body} />
      </div>

      {/* Deck footer — prev / next + keyboard hint */}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={prev}
          disabled={activeIdx === 0}
        >
          <span aria-hidden>←</span>
          <span className="ml-1.5">
            {activeIdx > 0 ? sections[activeIdx - 1].heading : "Start"}
          </span>
        </Button>
        <div className="hidden text-xs text-muted-foreground sm:block">
          <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">
            ←
          </kbd>{" "}
          <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">
            →
          </kbd>{" "}
          to step,{" "}
          <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">
            1
          </kbd>
          –
          <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">
            {sections.length}
          </kbd>{" "}
          to jump
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={next}
          disabled={activeIdx === sections.length - 1}
        >
          <span className="mr-1.5">
            {activeIdx < sections.length - 1
              ? sections[activeIdx + 1].heading
              : "End"}
          </span>
          <span aria-hidden>→</span>
        </Button>
      </div>

      {/* Right-edge mini-TOC dots */}
      <MiniToc
        sections={sections}
        activeIdx={activeIdx}
        onJump={jump}
      />
    </div>
  );
}

function MiniToc({
  sections,
  activeIdx,
  onJump,
}: {
  sections: Section[];
  activeIdx: number;
  onJump: (i: number) => void;
}) {
  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-none fixed right-2 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ul className="pointer-events-auto flex flex-col gap-3 rounded-full border border-border bg-background/80 px-1.5 py-2 shadow-sm backdrop-blur">
        {sections.map((s, i) => (
          <li key={s.id}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => onJump(i)}
                    aria-label={`Jump to ${s.heading}`}
                    aria-current={i === activeIdx ? "true" : undefined}
                    className={cn(
                      "block size-2.5 rounded-full transition",
                      i === activeIdx
                        ? "scale-125 bg-primary"
                        : "bg-muted-foreground/40 hover:bg-muted-foreground",
                    )}
                  />
                }
              />
              <TooltipContent side="left">
                <span className="font-mono text-[10px] opacity-60">
                  {i + 1}
                </span>{" "}
                {s.heading}
              </TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function initialIndex(sections: Section[]): number {
  if (typeof window === "undefined") return 0;
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return 0;
  const idx = sections.findIndex((s) => s.id === hash);
  return idx === -1 ? 0 : idx;
}

function isTypingTarget(el: HTMLElement): boolean {
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}
