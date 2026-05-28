import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { verbalSegments } from "@/lib/curriculum";
import { parseMarkdown } from "@/lib/markdown";
import { Markdown } from "@/components/Markdown";
import { SectionDeck } from "@/components/SectionDeck";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function VerbalSegmentsPage() {
  const abs = path.join(process.cwd(), "content", verbalSegments.contentFile);
  let markdown = "";
  try {
    markdown = fs.readFileSync(abs, "utf8");
  } catch {
    markdown = `# Content unavailable\n\nCould not read \`content/${verbalSegments.contentFile}\`. Did the prebuild script run?`;
  }

  const { intro, sections } = parseMarkdown(markdown);

  return (
    <div className="mx-auto max-w-4xl">
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
            <BreadcrumbPage>Verbal segments</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="border-b border-border pb-5">
        <div className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
          Day 3 · Verbal segments
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {verbalSegments.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {verbalSegments.summary}
        </p>
      </header>

      {intro && (
        <section className="mt-6">
          <div className="markdown text-base">
            <Markdown source={intro} />
          </div>
        </section>
      )}

      {sections.length > 0 ? (
        <div className="mt-8">
          <SectionDeck sections={sections} />
        </div>
      ) : (
        <div className="markdown mt-8">
          <Markdown source={markdown} />
        </div>
      )}

      <div className="mt-12 border-t border-border pt-4">
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link href="/days/3">
              <span aria-hidden>←</span>
              <span className="ml-1.5">Back to Day 3</span>
            </Link>
          }
        />
      </div>
    </div>
  );
}
