import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "highlight.js/styles/github.css";

export const metadata: Metadata = {
  title: "Truffles & Tunnels — a multi-day workshop on shipping software",
  description:
    "A multi-day workshop on shipping software — from how the web works, to Git and Vercel, to demystifying the frontend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <header className="border-b border-neutral-200 bg-white">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-neutral-900 hover:text-[#fc8019]"
            >
              Truffles &amp; Tunnels
            </Link>
            <ul className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
              <li>
                <Link href="/days/1" className="hover:text-[#fc8019]">
                  Day 1
                </Link>
              </li>
              <li>
                <Link href="/days/2" className="hover:text-[#fc8019]">
                  Day 2
                </Link>
              </li>
              <li>
                <Link href="/days/3" className="hover:text-[#fc8019]">
                  Day 3
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
          {children}
        </main>
        <footer className="border-t border-neutral-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-neutral-500 sm:px-6">
            Truffles &amp; Tunnels — a workshop on shipping software.
          </div>
        </footer>
      </body>
    </html>
  );
}
