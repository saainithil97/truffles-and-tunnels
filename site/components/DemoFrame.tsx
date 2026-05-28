"use client";

import { useState } from "react";
import type { Demo } from "@/lib/curriculum";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Small inline-SVG icon helpers. Kept here to avoid pulling in lucide-react.
function ReloadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-3.5", className)}
    >
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-3.5", className)}
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

// Renders the live demo as an iframe with:
//   - shadcn Tabs (when the demo has multiple entry HTMLs)
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
    <Card className="gap-0 overflow-hidden py-0">
      {/* Toolbar */}
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1">
          {entries.length > 1 ? (
            <Tabs
              value={activePath}
              onValueChange={(v) => {
                if (typeof v === "string") {
                  setActivePath(v);
                  setReloadKey((k) => k + 1);
                }
              }}
            >
              <TabsList>
                {entries.map((e) => (
                  <TabsTrigger key={e.path} value={e.path}>
                    {e.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          ) : (
            <Badge variant="outline" className="uppercase tracking-wide">
              Live demo
            </Badge>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            aria-label="Reload the demo iframe"
            title="Reload the demo iframe"
          >
            <ReloadIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            render={
              <a
                href={activePath}
                target="_blank"
                rel="noreferrer noopener"
                title="Open in a new tab"
              >
                <ExternalLinkIcon />
                Open
              </a>
            }
          />
        </div>
      </CardHeader>

      {/* The frame itself — flush to the card edges. */}
      <iframe
        key={`${activePath}::${reloadKey}`}
        src={activePath}
        className="block h-[70vh] w-full bg-white lg:h-[78vh]"
        // Allow scripts + same-origin so JSX-vs-compiled (Babel), React, etc. all work.
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        title={item.title}
      />

      {item.iframeNote && (
        <div className="border-t border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
          💡 {item.iframeNote}
        </div>
      )}
    </Card>
  );
}
