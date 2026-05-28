import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  day3Demos,
  findDay3Item,
  type Demo,
} from "@/lib/curriculum";
import { Markdown } from "@/components/Markdown";
import { DemoFrame } from "@/components/DemoFrame";

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

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-4 text-sm">
          <Link href="/days/3" className="text-neutral-500 hover:text-[#fc8019]">
            ← Back to Day 3
          </Link>
        </div>

        <header className="border-b border-neutral-200 pb-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-[#fc8019]">
            Day 3 · {item.shortTitle}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {item.title}
          </h1>
          <p className="mt-3 max-w-3xl text-neutral-700">{item.summary}</p>
        </header>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:px-8">
        {/* Left: live demo */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <DemoPanel item={item} iframeUrl={iframeUrl} />
        </div>

        {/* Right: content */}
        <article className="min-w-0">
          <div className="markdown">
            <Markdown source={markdown} />
          </div>
        </article>
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
      <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          No iframe for this one
        </div>
        <p className="mt-2 text-sm text-neutral-700">
          {item.runbookHint ??
            "This demo runs in DevTools or against a real site — follow the runbook on the right."}
        </p>
      </div>
    );
  }

  if (item.kind === "nextjs-separate" && !iframeUrl) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Demo not yet deployed
        </div>
        <p className="mt-2 text-sm text-neutral-700">
          This demo is a separate Next.js app at{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs">
            day_3/demo_7_8_nextjs/
          </code>
          . Deploy it as its own Vercel project and set{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs">
            {item.iframeUrlEnvVar}
          </code>{" "}
          on this site to embed it here.
        </p>
        {item.iframeNote && (
          <p className="mt-2 text-xs text-neutral-500">{item.iframeNote}</p>
        )}
      </div>
    );
  }

  return <DemoFrame item={item} initialUrl={iframeUrl!} />;
}
