#!/usr/bin/env node
// Copies markdown content and static live-demo assets from ../day_3 into the
// site/ tree so the Next.js build is self-contained.
//
// Runs as `predev` and `prebuild`. Idempotent — safe to re-run.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// site/ root = scripts/.. ; repo root = site/..
const siteRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(siteRoot, "..");

const day3Src = path.join(repoRoot, "day_3");
const contentDir = path.join(siteRoot, "content", "day_3");
const liveDemosDir = path.join(siteRoot, "public", "live-demos");

// Each entry maps a source markdown file (relative to ../day_3) to its
// destination filename under site/content/day_3/. Most demos use the
// pattern <id>/README.md -> <id>.md; demo_7_8_nextjs is the exception —
// one source directory feeds three site content files (demo_7, 8, 8.5).
const markdownDemos = [
  { src: "demo_1/README.md", dest: "demo_1.md" },
  { src: "demo_2/README.md", dest: "demo_2.md" },
  { src: "demo_2_5/README.md", dest: "demo_2_5.md" },
  { src: "demo_3/README.md", dest: "demo_3.md" },
  { src: "demo_4/README.md", dest: "demo_4.md" },
  { src: "demo_5/README.md", dest: "demo_5.md" },
  { src: "demo_6/README.md", dest: "demo_6.md" },
  { src: "demo_6_5/README.md", dest: "demo_6_5.md" },
  { src: "demo_9/README.md", dest: "demo_9.md" },
  { src: "demo_10/README.md", dest: "demo_10.md" },
  { src: "wrap/README.md", dest: "wrap.md" },
];

async function copyFile(src, dest) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

async function copyDirRecursive(srcDir, destDir, { skip = () => false } = {}) {
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const relName = entry.name;
    if (skip(relName, entry)) continue;
    const destPath = path.join(destDir, relName);
    if (entry.isDirectory()) {
      await copyDirRecursive(srcPath, destPath, { skip });
    } else if (entry.isFile()) {
      await copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  console.log("[copy-content] siteRoot =", siteRoot);
  console.log("[copy-content] repoRoot =", repoRoot);

  // 1. Copy each demo's README.md to site/content/day_3/<id>.md
  await fs.mkdir(contentDir, { recursive: true });
  for (const { src: srcRel, dest: destName } of markdownDemos) {
    const src = path.join(day3Src, srcRel);
    const dest = path.join(contentDir, destName);
    try {
      await copyFile(src, dest);
      console.log(`[copy-content] copied ${srcRel} -> content/day_3/${destName}`);
    } catch (err) {
      console.warn(`[copy-content] WARN could not copy ${src}: ${err.message}`);
    }
  }

  // 2. Copy verbal-segments.md
  try {
    await copyFile(
      path.join(day3Src, "verbal-segments.md"),
      path.join(contentDir, "verbal-segments.md")
    );
    console.log("[copy-content] copied verbal-segments.md");
  } catch (err) {
    console.warn(`[copy-content] WARN verbal-segments.md: ${err.message}`);
  }

  // 3. Stage per-demo source files (including Python servers) into
  //    site/content/day_3/<id>/code/ so the demo pages can read them at build
  //    time and render a "Source" section. Same Vercel caveat as below: when
  //    source is missing, leave the committed snapshot in place.
  const demoSourceFiles = {
    demo_1: [
      { name: "index.html", language: "html" },
      { name: "style.css", language: "css" },
      { name: "app.js", language: "javascript" },
      { name: "server.py", language: "python" },
    ],
    demo_6_5: [
      { name: "index-spa.html", language: "html" },
      { name: "app.js", language: "javascript" },
      { name: "style.css", language: "css" },
    ],
  };
  for (const [id, files] of Object.entries(demoSourceFiles)) {
    const src = path.join(day3Src, id);
    const dest = path.join(contentDir, id, "code");
    try {
      await fs.access(src);
    } catch {
      console.log(
        `[copy-content] ${id}/code: source missing — leaving committed snapshot in place`
      );
      continue;
    }
    await fs.rm(dest, { recursive: true, force: true });
    await fs.mkdir(dest, { recursive: true });
    for (const { name } of files) {
      const srcFile = path.join(src, name);
      const destFile = path.join(dest, name);
      try {
        await copyFile(srcFile, destFile);
        console.log(`[copy-content] copied ${id}/${name} -> content/day_3/${id}/code/${name}`);
      } catch (err) {
        console.warn(`[copy-content] WARN ${id}/${name}: ${err.message}`);
      }
    }
  }

  // 4. Recursively copy demo_5 and demo_6 into public/live-demos/, excluding
  //    README.md and __pycache__ etc.
  //
  //    IMPORTANT: only delete-and-replace the destination if the source exists.
  //    On Vercel CLI deploys the upload context is just site/, so ../day_3 isn't
  //    on the build machine — if we deleted dest first we'd wipe the committed
  //    snapshot and serve empty 404s. When source is missing, leave the
  //    committed copy in place.
  // Every demo that has browser-runnable assets in day_3/<id>/ — i.e. an
  // index.html plus any HTML/CSS/JS/image siblings. The prebuild also explicitly
  // strips Python files (server.py, test_server.py, requirements.txt) and venv
  // dirs since those don't belong on the static CDN.
  const staticDemos = [
    "demo_1",
    "demo_2_5",
    "demo_3",
    "demo_4",
    "demo_5",
    "demo_6",
    "demo_6_5",
    "demo_10",
    "wrap",
  ];
  const skipNames = new Set([
    "README.md",
    "__pycache__",
    ".pytest_cache",
    ".venv",
    ".DS_Store",
    "requirements.txt",
    "server.py",
    "test_server.py",
  ]);
  for (const id of staticDemos) {
    const src = path.join(day3Src, id);
    const dest = path.join(liveDemosDir, id);
    try {
      await fs.access(src);
    } catch {
      console.log(
        `[copy-content] ${id}: source missing (../day_3/${id}) — leaving committed snapshot in place`
      );
      continue;
    }
    // Source exists — regenerate from it.
    await fs.rm(dest, { recursive: true, force: true });
    try {
      await copyDirRecursive(src, dest, {
        skip: (name) => skipNames.has(name),
      });
      console.log(`[copy-content] copied ${id}/ -> public/live-demos/${id}/`);
    } catch (err) {
      console.warn(`[copy-content] WARN ${id}: ${err.message}`);
    }
  }

  console.log("[copy-content] done");
}

main().catch((err) => {
  console.error("[copy-content] FAILED", err);
  process.exit(1);
});
