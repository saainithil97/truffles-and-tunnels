"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// A draggable, resizable, floating frame around the live demo. Lives above the
// page content so the presenter can park it wherever DevTools isn't.
//
// - Drag the title bar to move.
// - Drag the SE corner to resize.
// - 4-corner snap buttons (TL/TR/BL/BR).
// - Hide button collapses to a small "Show demo" pill at bottom-right.
// - Position, size and visibility persist to localStorage per origin.

type Box = { x: number; y: number; w: number; h: number };

const MIN_W = 280;
const MIN_H = 200;
const DEFAULT_W = 480;
const DEFAULT_H = 360;
const MARGIN = 16;

const STORAGE_KEY = "tnt:pip-frame:v1";

type Persisted = { box: Box; hidden: boolean };

export function PipFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
      // Clamp the saved box back inside the current viewport in case it shrank.
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

  // Persist on changes (after mount).
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
      // resize: grow/shrink from SE corner
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
      // Only respond to the primary button.
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

  const snapToCorner = (corner: "tl" | "tr" | "bl" | "br") => {
    setBox((b) => snap(b, corner));
  };

  if (!mounted) {
    // Avoid SSR/CSR mismatch (we use window in defaults).
    return null;
  }

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

  return (
    <div
      role="dialog"
      aria-label={title}
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
      {/* Title bar — drag handle */}
      <div
        onPointerDown={startDrag("move")}
        className="flex h-8 shrink-0 cursor-grab select-none items-center gap-2 border-b border-border bg-muted/60 px-2 active:cursor-grabbing"
      >
        <span aria-hidden className="text-muted-foreground">
          <GripIcon />
        </span>
        <span className="truncate text-xs font-medium text-muted-foreground">
          {title}
        </span>

        {/* Snap buttons */}
        <div className="ml-auto flex items-center gap-0.5 text-muted-foreground">
          <CornerButton corner="tl" onClick={() => snapToCorner("tl")} />
          <CornerButton corner="tr" onClick={() => snapToCorner("tr")} />
          <CornerButton corner="bl" onClick={() => snapToCorner("bl")} />
          <CornerButton corner="br" onClick={() => snapToCorner("br")} />
          <button
            type="button"
            onClick={() => setHidden(true)}
            aria-label="Hide live demo"
            title="Hide"
            className="ml-1 inline-flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Frame body — the DemoFrame slot. min-h-0 so it can shrink. */}
      <div className="relative flex min-h-0 flex-1">
        {/* Wrap children in a layer that fills the available space. The
            DemoFrame itself sets its own iframe height; we override it via
            a flexbox so it stretches to the PIP body. */}
        <div className="flex flex-1 flex-col [&>*]:flex-1 [&_iframe]:h-full">
          {children}
        </div>

        {/* Resize handle, SE corner */}
        <div
          onPointerDown={startDrag("resize")}
          className="absolute bottom-0 right-0 size-4 cursor-nwse-resize"
          aria-hidden
        >
          <ResizeIcon />
        </div>
      </div>
    </div>
  );
}

function CornerButton({
  corner,
  onClick,
}: {
  corner: "tl" | "tr" | "bl" | "br";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Snap to ${cornerLabel(corner)} corner`}
      title={`Snap ${cornerLabel(corner)}`}
      className="inline-flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <CornerGlyph corner={corner} />
    </button>
  );
}

function cornerLabel(c: "tl" | "tr" | "bl" | "br") {
  return c === "tl" ? "top-left" : c === "tr" ? "top-right" : c === "bl" ? "bottom-left" : "bottom-right";
}

function CornerGlyph({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const cx = corner.includes("l") ? 4 : 12;
  const cy = corner.startsWith("t") ? 4 : 12;
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <rect x={cx - 2} y={cy - 2} width="4" height="4" fill="currentColor" rx="1" />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="5" cy="4" r="1" />
      <circle cx="11" cy="4" r="1" />
      <circle cx="5" cy="8" r="1" />
      <circle cx="11" cy="8" r="1" />
      <circle cx="5" cy="12" r="1" />
      <circle cx="11" cy="12" r="1" />
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

function snap(b: Box, corner: "tl" | "tr" | "bl" | "br"): Box {
  if (typeof window === "undefined") return b;
  const right = corner.endsWith("r");
  const bottom = corner.startsWith("b");
  return {
    w: b.w,
    h: b.h,
    x: right ? Math.max(MARGIN, window.innerWidth - b.w - MARGIN) : MARGIN,
    y: bottom ? Math.max(MARGIN, window.innerHeight - b.h - MARGIN) : MARGIN,
  };
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
