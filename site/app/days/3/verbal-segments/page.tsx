import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { verbalSegments } from "@/lib/curriculum";
import { Markdown } from "@/components/Markdown";

export default function VerbalSegmentsPage() {
  const abs = path.join(process.cwd(), "content", verbalSegments.contentFile);
  let markdown = "";
  try {
    markdown = fs.readFileSync(abs, "utf8");
  } catch {
    markdown = `# Content unavailable\n\nCould not read \`content/${verbalSegments.contentFile}\`. Did the prebuild script run?`;
  }

  return (
    <article>
      <div className="mb-4 text-sm">
        <Link href="/days/3" className="text-neutral-500 hover:text-[#fc8019]">
          ← Back to Day 3
        </Link>
      </div>

      <header className="border-b border-neutral-200 pb-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-[#fc8019]">
          Day 3 · Verbal segments
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {verbalSegments.title}
        </h1>
        <p className="mt-3 text-neutral-700">{verbalSegments.summary}</p>
      </header>

      <div className="mt-8">
        <Markdown source={markdown} />
      </div>
    </article>
  );
}
