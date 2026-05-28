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

const markdownDemos = [
  "demo_1",
  "demo_2",
  "demo_2_5",
  "demo_3",
  "demo_4",
  "demo_5",
  "demo_6",
  "demo_7_8_nextjs",
  "demo_9",
  "demo_10",
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
  for (const id of markdownDemos) {
    const src = path.join(day3Src, id, "README.md");
    const dest = path.join(contentDir, `${id}.md`);
    try {
      await copyFile(src, dest);
      console.log(`[copy-content] copied ${id}/README.md -> content/day_3/${id}.md`);
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

  // 3. Recursively copy demo_5 and demo_6 into public/live-demos/, excluding
  //    README.md and __pycache__ etc.
  const staticDemos = ["demo_5", "demo_6"];
  const skipNames = new Set(["README.md", "__pycache__", ".DS_Store"]);
  for (const id of staticDemos) {
    const src = path.join(day3Src, id);
    const dest = path.join(liveDemosDir, id);
    // Clean dest first to avoid stale files lingering between runs.
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
