"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";

// Renders a mermaid diagram client-side. mermaid is imported dynamically so it
// doesn't bloat the server bundle. The diagram is re-rendered when the resolved
// theme flips so it reads well on both light and dark cards.
export function MermaidBlock({ source }: { source: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "_");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    const isDark = resolvedTheme === "dark";
    (async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
          themeVariables: isDark
            ? {
                // Dark palette — readable on a dark card.
                primaryColor: "#3a1d05",
                primaryTextColor: "#fed7aa",
                primaryBorderColor: "#fc8019",
                lineColor: "#737373",
                secondaryColor: "#262626",
                tertiaryColor: "#171717",
                background: "transparent",
                mainBkg: "#3a1d05",
                textColor: "#e5e5e5",
              }
            : {
                primaryColor: "#fff7ed",
                primaryTextColor: "#7a3a0a",
                primaryBorderColor: "#fc8019",
                lineColor: "#a3a3a3",
                secondaryColor: "#f5f5f5",
                tertiaryColor: "#fafafa",
              },
        });
        const { svg } = await mermaid.render(`mermaid-${id}`, source);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (e: unknown) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : String(e);
          setError(msg);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, source, resolvedTheme]);

  if (error) {
    return (
      <div className="my-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
        <div className="font-semibold">Mermaid render error</div>
        <pre className="mt-2 whitespace-pre-wrap text-[11px]">{error}</pre>
        <pre className="mt-2 whitespace-pre-wrap text-[11px] opacity-80">
          {source}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto rounded-md border border-border bg-card p-4 text-card-foreground"
    />
  );
}
