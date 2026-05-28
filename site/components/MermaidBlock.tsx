"use client";

import { useEffect, useId, useRef, useState } from "react";

// Renders a mermaid diagram client-side. mermaid is imported dynamically so it
// doesn't bloat the server bundle.
export function MermaidBlock({ source }: { source: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "_");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
          themeVariables: {
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
  }, [id, source]);

  if (error) {
    return (
      <div className="my-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800">
        <div className="font-semibold">Mermaid render error</div>
        <pre className="mt-2 whitespace-pre-wrap text-[11px]">{error}</pre>
        <pre className="mt-2 whitespace-pre-wrap text-[11px] text-red-900/70">
          {source}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto rounded-md border border-neutral-200 bg-white p-4"
    />
  );
}
