import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Day 3 — Rendering Strategies (Swiggy)",
  description: "SSG vs SSR vs CSR, hydration, and client-side routing — a teaching app.",
};

// The root layout is a SERVER component (no 'use client'). Its JS is never
// shipped to the browser — it only produces HTML.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4 text-sm font-medium">
            <Link href="/" className="text-orange-600 font-bold">
              🍽️ Swiggy Demo
            </Link>
            <Link href="/ssg" className="text-slate-600 hover:text-orange-600">
              /ssg
            </Link>
            <Link href="/ssr" className="text-slate-600 hover:text-orange-600">
              /ssr
            </Link>
            <Link href="/csr" className="text-slate-600 hover:text-orange-600">
              /csr
            </Link>
            <Link href="/hybrid" className="text-slate-600 hover:text-orange-600">
              /hybrid
            </Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">{children}</main>
      </body>
    </html>
  );
}
