"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Demo } from "@/lib/curriculum";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// A draggable, resizable, floating browser-window over the live demo.
//
// Layout (top→bottom):
//   1. Chrome bar       — pulsing "live" indicator, then reload / open / close
//   2. Address bar      — URL pill (and tabs strip when the demo has > 1 entry)
//   3. Iframe body      — the actual demo, fills remaining space
//   4. iframeNote       — optional tip strip
//
// - Drag the chrome bar to move.
// - Drag the SE corner to resize.
// - Hide button collapses to a small "Show demo" pill at bottom-right.
// - Position, size and visibility persist to localStorage per origin.

type Box = { x: number; y: number; w: number; h: number };

const MIN_W = 320;
const MIN_H = 240;
const DEFAULT_W = 480;
const DEFAULT_H = 380;
const MARGIN = 16;

const STORAGE_KEY = "tnt:pip-frame:v1";

type Persisted = { box: Box; hidden: boolean };

export function PipFrame({
  item,
  initialUrl,
  entries: entriesProp,
}: {
  item: Demo;
  initialUrl: string;
  entries?: { label: string; path: string }[] | null;
}) {
  // When the page resolves entries to absolute URLs (e.g. nextjs-separate
  // demos with iframePathSuffix), it passes them via entriesProp. Otherwise
  // fall back to the raw item.iframeEntries (embedded demos with relative
  // paths under /live-demos/).
  const entries =
    entriesProp ?? item.iframeEntries ?? [{ label: "Live demo", path: initialUrl }];
  const [activePath, setActivePath] = useState<string>(initialUrl);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const [mounted, setMounted] = useState(false);
  const [box, setBox] = useState<Box>(() => ({
    x: 0,
    y: 0,
    w: DEFAULT_W,
    h: DEFAULT_H,
  }));
  const [hidden, setHidden] = useState(false);

  // Mount + initial position (bottom-right corner) + load persisted state.
  useEffect(() => {
    setMounted(true);
    const saved = readPersisted();
    if (saved) {
      setBox(clampToViewport(saved.box));
      setHidden(saved.hidden);
    } else {
      setBox(defaultBox());
    }
    const onResize = () => {
      setBox((b) => clampToViewport(b));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    writePersisted({ box, hidden });
  }, [box, hidden, mounted]);

  // Drag handlers — single source of truth for both move and resize.
  const dragRef = useRef<{
    mode: "move" | "resize";
    startMouse: { x: number; y: number };
    startBox: Box;
  } | null>(null);

  const onPointerMove = useCallback((e: PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    e.preventDefault();
    const dx = e.clientX - d.startMouse.x;
    const dy = e.clientY - d.startMouse.y;
    if (d.mode === "move") {
      setBox(
        clampToViewport({
          ...d.startBox,
          x: d.startBox.x + dx,
          y: d.startBox.y + dy,
        }),
      );
    } else {
      const nextW = Math.max(MIN_W, d.startBox.w + dx);
      const nextH = Math.max(MIN_H, d.startBox.h + dy);
      setBox(
        clampToViewport({
          ...d.startBox,
          w: nextW,
          h: nextH,
        }),
      );
    }
  }, []);

  const stopDrag = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", stopDrag);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, [onPointerMove]);

  const startDrag = (mode: "move" | "resize") =>
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = {
        mode,
        startMouse: { x: e.clientX, y: e.clientY },
        startBox: { ...box },
      };
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", stopDrag);
      document.body.style.userSelect = "none";
      document.body.style.cursor = mode === "move" ? "grabbing" : "nwse-resize";
    };

  if (!mounted) return null;

  if (hidden) {
    return (
      <Button
        type="button"
        variant="default"
        size="sm"
        onClick={() => setHidden(false)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <span aria-hidden className="mr-1.5">
          ◰
        </span>
        Show live demo
      </Button>
    );
  }

  const reloadIframe = () => setReloadKey((k) => k + 1);

  return (
    <div
      role="dialog"
      aria-label={`Live demo · ${item.shortTitle}`}
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-2xl ring-1 ring-black/10",
      )}
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
      }}
    >
      {/* 1. Chrome bar — drag handle */}
      <div
        onPointerDown={startDrag("move")}
        className="flex h-9 shrink-0 cursor-grab select-none items-center gap-2.5 border-b border-border bg-muted/60 px-2.5 active:cursor-grabbing"
      >
        <div
          className="flex shrink-0 items-center gap-1.5"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span aria-hidden className="pip-live-dot" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/80">
            Live
          </span>
        </div>

        <div
          className="ml-auto flex shrink-0 items-center gap-0.5"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <ChromeButton
            label="Reload demo"
            onClick={reloadIframe}
          >
            <ReloadIcon />
          </ChromeButton>
          <ChromeButton
            label="Open in new tab"
            href={activePath}
          >
            <ExternalLinkIcon />
          </ChromeButton>
          <ChromeButton
            label="Hide live demo"
            onClick={() => setHidden(true)}
          >
            <CloseIcon />
          </ChromeButton>
        </div>
      </div>

      {/* 2. Address bar (URL pill + tabs strip when multi-entry) */}
      <div className="flex shrink-0 flex-col gap-1.5 border-b border-border bg-muted/30 px-2.5 py-1.5">
        <div className="flex h-6 items-center gap-1.5 truncate rounded-md border border-border bg-background px-2 font-mono text-[11px] text-muted-foreground">
          <LockIcon />
          <span className="truncate">{formatUrl(activePath)}</span>
        </div>
        {entries.length > 1 && (
          <Tabs
            value={activePath}
            onValueChange={(v) => {
              if (typeof v === "string") {
                setActivePath(v);
                reloadIframe();
              }
            }}
          >
            <TabsList className="h-7">
              {entries.map((e) => (
                <TabsTrigger key={e.path} value={e.path} className="text-xs">
                  {e.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      {/* 3. Iframe body */}
      <div className="relative flex min-h-0 flex-1">
        <iframe
          key={`${activePath}::${reloadKey}`}
          src={activePath}
          className="block h-full w-full flex-1 bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          title={item.title}
        />

        <div
          onPointerDown={startDrag("resize")}
          className="absolute bottom-0 right-0 size-4 cursor-nwse-resize"
          aria-hidden
        >
          <ResizeIcon />
        </div>
      </div>

      {/* 4. Optional note strip */}
      {item.iframeNote && (
        <div className="shrink-0 border-t border-border bg-muted px-3 py-1.5 text-[11px] text-muted-foreground">
          💡 {item.iframeNote}
        </div>
      )}
    </div>
  );
}

function ChromeButton({
  label,
  onClick,
  href,
  children,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
}) {
  const cls =
    "inline-flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground";
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={label}
        title={label}
        className={cls}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cls}
    >
      {children}
    </button>
  );
}

function LockIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
      className="shrink-0 opacity-70"
    >
      <rect x="3.5" y="7" width="9" height="6" rx="1.2" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" strokeLinecap="round" />
    </svg>
  );
}

function ReloadIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
    </svg>
  );
}

function ResizeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M14 6 6 14M14 10l-4 4" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function formatUrl(input: string): string {
  // Resolve relative paths against the current origin so the pill reads like
  // a real omnibox: "localhost:3000/live-demos/demo_1/index.html".
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const resolved = input.startsWith("/") ? `${origin}${input}` : input;
  try {
    const u = new URL(resolved);
    return `${u.host}${u.pathname}${u.search}`;
  } catch {
    return input;
  }
}

// ---- helpers ------------------------------------------------------------

function defaultBox(): Box {
  const w = DEFAULT_W;
  const h = DEFAULT_H;
  if (typeof window === "undefined") return { x: 0, y: 0, w, h };
  return {
    x: Math.max(MARGIN, window.innerWidth - w - MARGIN),
    y: Math.max(MARGIN, window.innerHeight - h - MARGIN),
    w,
    h,
  };
}

function clampToViewport(b: Box): Box {
  if (typeof window === "undefined") return b;
  const w = Math.min(b.w, window.innerWidth - 2 * MARGIN);
  const h = Math.min(b.h, window.innerHeight - 2 * MARGIN);
  const x = Math.min(Math.max(MARGIN, b.x), window.innerWidth - w - MARGIN);
  const y = Math.min(Math.max(MARGIN, b.y), window.innerHeight - h - MARGIN);
  return { x, y, w, h };
}

function readPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      "box" in parsed &&
      "hidden" in parsed
    ) {
      return parsed as Persisted;
    }
  } catch {
    /* corrupt JSON — ignore */
  }
  return null;
}

function writePersisted(p: Persisted) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* quota — ignore */
  }
}
