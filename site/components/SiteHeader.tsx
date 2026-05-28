import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span aria-hidden className="inline-block size-5 rounded-md bg-primary" />
          Truffles &amp; Tunnels
        </Link>

        <nav className="ml-4 hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
          <Link
            href="/days/1"
            className="rounded-md px-2 py-1 transition hover:bg-accent hover:text-foreground"
          >
            Day 1
          </Link>
          <Link
            href="/days/2"
            className="rounded-md px-2 py-1 transition hover:bg-accent hover:text-foreground"
          >
            Day 2
          </Link>
          <Link
            href="/days/3"
            className="rounded-md px-2 py-1 transition hover:bg-accent hover:text-foreground"
          >
            Day 3
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
