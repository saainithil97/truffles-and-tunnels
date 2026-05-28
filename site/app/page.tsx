import Link from "next/link";
import { days } from "@/lib/curriculum";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* 1. Hero */}
      <section className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          The Workshop
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight lg:text-5xl">
          Truffles &amp; Tunnels
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          A multi-day workshop on shipping software — how the web works, the
          tools developers live in, and what&apos;s actually happening when a
          page lands in your browser.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/days/3"
            className={cn(buttonVariants({ variant: "default", size: "lg" }))}
          >
            Start with Day 3 →
          </Link>
          <Link
            href="/days/1"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            How the web works
          </Link>
        </div>

        <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">Swiggy</Badge>
          <span>Running example: the Swiggy restaurant card.</span>
        </p>
      </section>

      {/* 2. Day grid */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Days
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {days.map((day) => (
            <Link
              key={day.num}
              href={`/days/${day.num}`}
              className="group block focus:outline-none"
            >
              <Card className="h-full transition hover:border-primary/60 hover:shadow-md">
                <CardHeader>
                  <p className="font-mono text-xs text-muted-foreground">
                    DAY {String(day.num).padStart(2, "0")}
                  </p>
                  <CardTitle className="mt-1 text-lg">{day.title}</CardTitle>
                  <CardDescription className="line-clamp-4">
                    {day.blurb}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex items-center justify-between">
                  {day.hasDemos && day.demos ? (
                    <>
                      <Badge variant="default">{day.demos.length} demos</Badge>
                      <span
                        aria-hidden
                        className="text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary"
                      >
                        →
                      </span>
                    </>
                  ) : (
                    <Badge variant="outline">Demos coming soon</Badge>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))}

          {/* Placeholder card — not a link */}
          <Card className="h-full border border-dashed border-border bg-muted/20 text-muted-foreground ring-0">
            <CardHeader>
              <p className="font-mono text-xs">DAY ··</p>
              <CardTitle className="mt-1 text-lg">More to come</CardTitle>
              <CardDescription>
                More days will be added as the workshop is built out.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 3. What you'll learn */}
      <section className="rounded-xl bg-muted/30 p-6">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          What you&apos;ll learn
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card size="sm">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                Day 1
              </Badge>
              <CardTitle className="mt-2">How the web works</CardTitle>
              <CardDescription>
                The lifecycle of a request, from your phone to a server and
                back.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                Day 2
              </Badge>
              <CardTitle className="mt-2">Git &amp; Vercel workflow</CardTitle>
              <CardDescription>
                Source control, pull requests, and shipping a real site to the
                internet.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                Day 3
              </Badge>
              <CardTitle className="mt-2">Demystifying the frontend</CardTitle>
              <CardDescription>
                What the browser actually does, why frameworks exist, and what
                React and Next.js do underneath.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
