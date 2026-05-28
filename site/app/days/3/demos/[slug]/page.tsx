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
import { Markdown } from "@/components/Markdown";
import { DemoFrame } from "@/components/DemoFrame";
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

  const markdown = readMarkdown(item.contentFile);
  const iframeUrl = resolveIframeUrl(item);
  const { prev, next } = neighborSlugs(slug);

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <div className="px-4 sm:px-6 lg:px-8">
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

        <header className="border-b border-border pb-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">
            Day 3 · {item.shortTitle}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {item.title}
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">{item.summary}</p>
        </header>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:px-8">
        {/* Left: live demo */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <DemoPanel item={item} iframeUrl={iframeUrl} />
        </div>

        {/* Right: content */}
        <article className="min-w-0">
          <div className="markdown min-w-0">
            <Markdown source={markdown} />
          </div>
        </article>
      </div>

      {/* Prev / Next footer */}
      <div className="mt-10 border-t border-border px-4 py-4 sm:px-6 lg:px-8">
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
    </div>
  );
}

function readMarkdown(relPath: string): string {
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

function DemoPanel({ item, iframeUrl }: { item: Demo; iframeUrl: string | null }) {
  if (item.kind === "runbook-only") {
    return (
      <Card className="border-dashed">
        <CardContent className="space-y-2">
          <Badge variant="outline" className="uppercase tracking-wide">
            No iframe for this one
          </Badge>
          <p className="text-sm text-muted-foreground">
            {item.runbookHint ??
              "This demo runs in DevTools or against a real site — follow the runbook on the right."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (item.kind === "nextjs-separate" && !iframeUrl) {
    return (
      <Card className="border-dashed">
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
          {item.iframeNote && (
            <p className="text-xs text-muted-foreground">{item.iframeNote}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return <DemoFrame item={item} initialUrl={iframeUrl!} />;
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
