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

  return (
    <article>
      <div className="mb-4 text-sm">
        <Link href="/days/3" className="text-neutral-500 hover:text-[#fc8019]">
          ← Back to Day 3
        </Link>
      </div>

      <header className="border-b border-neutral-200 pb-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-[#fc8019]">
          Day 3 · Demo
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {item.title}
        </h1>
        <p className="mt-3 text-neutral-700">{item.summary}</p>
      </header>

      <DemoAction item={item} />

      <div className="mt-8">
        <Markdown source={markdown} />
      </div>
    </article>
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

function DemoAction({ item }: { item: Demo }) {
  if (item.kind === "static-html" && item.htmlEntries && item.liveDemoBase) {
    return (
      <div className="mt-6 rounded-md border border-[#fc8019]/40 bg-[#fff7ed] p-4">
        <div className="text-sm font-semibold text-[#7a3a0a]">
          Live demo (open in this browser)
        </div>
        <p className="mt-1 text-xs text-[#7a3a0a]/80">
          Each entry is a self-contained HTML file with React vendored locally —
          no server required.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.htmlEntries.map((html) => (
            <a
              key={html}
              href={`${item.liveDemoBase}/${html}`}
              className="inline-flex items-center rounded-md bg-[#fc8019] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#e0721a]"
            >
              Open {html} →
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (item.kind === "nextjs-separate") {
    const url = process.env.NEXT_PUBLIC_DEMO_7_URL;
    return (
      <div className="mt-6 rounded-md border border-[#fc8019]/40 bg-[#fff7ed] p-4">
        <div className="text-sm font-semibold text-[#7a3a0a]">
          Separate Next.js app
        </div>
        <p className="mt-1 text-sm text-[#7a3a0a]/90">
          This demo is a standalone Next.js application — deploy it as its own
          Vercel project from{" "}
          <code className="rounded bg-white/70 px-1 py-0.5 text-xs">
            day_3/demo_7_8_nextjs/
          </code>
          . The frozen-SSG reveal requires a production build, not{" "}
          <code className="rounded bg-white/70 px-1 py-0.5 text-xs">
            next dev
          </code>
          .
        </p>
        {url && (
          <a
            href={url}
            className="mt-3 inline-flex items-center rounded-md bg-[#fc8019] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#e0721a]"
            target="_blank"
            rel="noreferrer noopener"
          >
            Open the deployed demo →
          </a>
        )}
      </div>
    );
  }

  // python-server or runbook-only: show a "Run locally" code block.
  return <RunLocally item={item} />;
}

function RunLocally({ item }: { item: Demo }) {
  if (item.kind === "runbook-only") {
    return (
      <div className="mt-6 rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
        <div className="font-semibold text-neutral-900">Runbook-only demo</div>
        <p className="mt-1">
          No code to run — this demo is performed against a real site or in the
          browser console. See the runbook below.
        </p>
      </div>
    );
  }

  // python-server
  const folder = item.id; // demo_1, demo_2_5, etc.
  return (
    <div className="mt-6 rounded-md border border-neutral-200 bg-neutral-50 p-4">
      <div className="text-sm font-semibold text-neutral-900">Run locally</div>
      <p className="mt-1 text-xs text-neutral-600">
        From the repo root, in <code>day_3/{folder}/</code>:
      </p>
      <pre className="mt-3 overflow-x-auto rounded bg-[#0b1020] p-3 text-xs leading-relaxed text-neutral-100">
        <code>{`cd day_3/${folder}
python3 -m venv .venv && source .venv/bin/activate   # first time only
pip install -r requirements.txt                      # first time only
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
# then open http://localhost:8000/`}</code>
      </pre>
    </div>
  );
}
