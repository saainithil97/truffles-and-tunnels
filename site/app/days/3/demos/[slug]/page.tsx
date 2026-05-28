import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  day3Demos,
  day3Parts,
  findDay3Item,
  type Demo,
} from "@/lib/curriculum";
import { parseMarkdown } from "@/lib/markdown";
import { Markdown } from "@/components/Markdown";
import { DemoFrame } from "@/components/DemoFrame";
import { PipFrame } from "@/components/PipFrame";
import { SectionDeck } from "@/components/SectionDeck";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function generateStaticParams() {
  return day3Demos.map((d) => ({ slug: d.slug }));
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findDay3Item(slug);
  if (!item || slug === "verbal-segments") notFound();

  const markdown = readMarkdownSource(item.contentFile);
  const { intro, sections } = parseMarkdown(markdown);
  const iframeUrl = resolveIframeUrl(item);
  const { prev, next } = neighborSlugs(slug);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/days/3" />}>Day 3</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{item.shortTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title block */}
      <header className="border-b border-border pb-5">
        <div className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
          Day 3 · {item.shortTitle}
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base text-muted-foreground">
          {item.summary}
        </p>
      </header>

      {/* Intro paragraph(s) — always visible above the deck */}
      {intro && (
        <section className="mt-6">
          <div className="markdown text-base">
            <Markdown source={intro} />
          </div>
        </section>
      )}

      {/* Inline "demo status" callout for runbook-only and not-yet-deployed
          demos. The PipFrame overlay only shows when there's something to
          actually iframe. */}
      <DemoStatusCallout item={item} iframeUrl={iframeUrl} />

      {/* Section deck — paginates Setup / Concepts / Diagrams / Takeaways. */}
      {sections.length > 0 && (
        <div className="mt-8">
          <SectionDeck sections={sections} />
        </div>
      )}

      {/* If the README has no H2 sections (unlikely after the rewrite, but
          robust), fall back to rendering it as one long page. */}
      {sections.length === 0 && (
        <div className="markdown mt-8">
          <Markdown source={markdown} />
        </div>
      )}

      {/* Prev / Next footer */}
      <div className="mt-12 border-t border-border pt-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {prev ? (
              <Button
                variant="ghost"
                size="sm"
                render={
                  <Link href={`/days/3/demos/${prev.slug}`}>
                    <ArrowLeftIcon />
                    <span className="truncate">
                      Previous: {prev.shortTitle}
                    </span>
                  </Link>
                }
              />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                render={
                  <Link href="/days/3">
                    <ArrowLeftIcon />
                    <span>Back to Day 3</span>
                  </Link>
                }
              />
            )}
          </div>
          <div className="min-w-0 sm:text-right">
            {next ? (
              <Button
                variant="ghost"
                size="sm"
                render={
                  <Link href={`/days/3/demos/${next.slug}`}>
                    <span className="truncate">Next: {next.shortTitle}</span>
                    <ArrowRightIcon />
                  </Link>
                }
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Floating PIP iframe overlay. Only rendered when there's a real iframe
          to show; runbook-only and undeployed demos get the inline callout. */}
      {iframeUrl && (
        <PipFrame title={`Live demo · ${item.shortTitle}`}>
          <DemoFrame item={item} initialUrl={iframeUrl} />
        </PipFrame>
      )}
    </div>
  );
}

function readMarkdownSource(relPath: string): string {
  const abs = path.join(process.cwd(), "content", relPath);
  try {
    return fs.readFileSync(abs, "utf8");
  } catch {
    return `# Content unavailable\n\nCould not read \`content/${relPath}\`. Did the prebuild script run?`;
  }
}

function resolveIframeUrl(item: Demo): string | null {
  if (item.kind === "embedded") return item.iframePath ?? null;
  if (item.kind === "nextjs-separate" && item.iframeUrlEnvVar) {
    return process.env[item.iframeUrlEnvVar] ?? null;
  }
  return null;
}

function DemoStatusCallout({
  item,
  iframeUrl,
}: {
  item: Demo;
  iframeUrl: string | null;
}) {
  if (item.kind === "runbook-only") {
    return (
      <Card className="mt-6 border-dashed">
        <CardContent className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="uppercase tracking-wide">
            No iframe for this one
          </Badge>
          <p className="min-w-0 text-sm text-muted-foreground">
            {item.runbookHint ??
              "This demo runs in DevTools or against a real site — follow the runbook below."}
          </p>
        </CardContent>
      </Card>
    );
  }
  if (item.kind === "nextjs-separate" && !iframeUrl) {
    return (
      <Card className="mt-6 border-dashed">
        <CardContent className="space-y-2">
          <Badge variant="outline" className="uppercase tracking-wide">
            Demo not yet deployed
          </Badge>
          <p className="text-sm text-muted-foreground">
            This demo is a separate Next.js app at{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              day_3/demo_7_8_nextjs/
            </code>
            . Deploy it as its own Vercel project and set{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              {item.iframeUrlEnvVar}
            </code>{" "}
            on this site to embed it here.
          </p>
        </CardContent>
      </Card>
    );
  }
  // Embedded demo with a working iframe URL — surface a tiny hint about the
  // floating PIP window.
  return (
    <Card className="mt-6 border-primary/30 bg-primary/5">
      <CardContent className="flex flex-wrap items-center gap-3">
        <Badge className="uppercase tracking-wide">Live demo open</Badge>
        <p className="min-w-0 text-sm text-foreground/80">
          The Swiggy demo is floating in a movable picture-in-picture window —
          drag it by the title bar, resize from the bottom-right corner, or
          snap it to any corner with the buttons in its header.{" "}
          {item.iframeNote && (
            <span className="text-muted-foreground">💡 {item.iframeNote}</span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

// Flatten day3Parts -> ordered slug list, skipping verbal-segments (no detail page).
function orderedDemoSlugs(): string[] {
  const out: string[] = [];
  for (const part of day3Parts) {
    for (const s of part.demoSlugs) {
      if (s === "verbal-segments") continue;
      out.push(s);
    }
  }
  return out;
}

function neighborSlugs(currentSlug: string): {
  prev: Demo | null;
  next: Demo | null;
} {
  const order = orderedDemoSlugs();
  const idx = order.indexOf(currentSlug);
  if (idx === -1) return { prev: null, next: null };
  const prevSlug = idx > 0 ? order[idx - 1] : null;
  const nextSlug = idx < order.length - 1 ? order[idx + 1] : null;
  const find = (s: string | null): Demo | null =>
    s ? day3Demos.find((d) => d.slug === s) ?? null : null;
  return { prev: find(prevSlug), next: find(nextSlug) };
}

function ArrowLeftIcon() {
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
      className="size-3.5"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRightIcon() {
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
      className="size-3.5"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
