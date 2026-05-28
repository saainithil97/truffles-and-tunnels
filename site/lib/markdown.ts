// Parse a Day 3 README into a leading intro and a list of H2 sections.
//
// Every Day-3 README follows the shape:
//
//   # Demo N — Title
//
//   <hook paragraph(s)>
//
//   ## Setup
//   ...
//   ## Concepts
//   ...
//   ## Diagrams
//   ...
//   ## Takeaways
//   ...
//
// We strip the H1 (the demo title is already in the page header) and split the
// remainder on top-level `## ` headings. Text before the first `## ` becomes
// the `intro`. The order of sections is preserved so the deck can paginate
// through them in the README's own order.

export type Section = {
  /** Unique kebab-case id derived from the heading. */
  id: string;
  /** Original heading text (e.g. "Setup", "Concepts"). */
  heading: string;
  /** Markdown body (everything between this `## ` and the next). */
  body: string;
};

export type ParsedMarkdown = {
  intro: string;
  sections: Section[];
};

export function parseMarkdown(source: string): ParsedMarkdown {
  // 1. Strip the H1 (first `# ...` line at the top of the file).
  const noH1 = source.replace(/^\s*#\s+[^\n]*\n+/, "");

  // 2. Walk the lines and split on `^## ` at the start of a line. We can't just
  //    String.split because we want to keep the heading text and the body
  //    attached together.
  const lines = noH1.split("\n");

  let intro = "";
  const sections: Section[] = [];
  let current: { heading: string; bodyLines: string[] } | null = null;
  const introLines: string[] = [];

  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      // Flush the prior section (or intro).
      if (current) {
        sections.push(finalize(current));
      } else if (introLines.length > 0) {
        intro = introLines.join("\n").trim();
      }
      current = { heading: m[1], bodyLines: [] };
    } else if (current) {
      current.bodyLines.push(line);
    } else {
      introLines.push(line);
    }
  }
  if (current) {
    sections.push(finalize(current));
  } else if (introLines.length > 0) {
    intro = introLines.join("\n").trim();
  }

  return { intro, sections };
}

function finalize(c: { heading: string; bodyLines: string[] }): Section {
  return {
    id: slugify(c.heading),
    heading: c.heading,
    body: c.bodyLines.join("\n").trim(),
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}
