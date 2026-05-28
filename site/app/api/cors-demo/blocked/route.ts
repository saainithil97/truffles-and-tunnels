// Day 3, Demo 10 — CORS demo: the "blocked" endpoint.
//
// Returns JSON but sets NO Access-Control-Allow-Origin header. Same-origin
// fetches (from this site) work fine. Cross-origin fetches (e.g. from a
// console opened on https://example.com) will have their *response* withheld
// from JS by the browser, producing the classic red CORS error.
//
// Pair with /api/cors-demo/allowed to show the difference.
//
// We deliberately do NOT use `force-static` here — Vercel's static-asset CDN
// adds Access-Control-Allow-Origin: * to static responses by default, which
// would defeat the whole demo. By keeping this dynamic, only the headers we
// explicitly set make it onto the wire.
export const dynamic = "force-dynamic";

export function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      message:
        "If you can read this in cross-origin JS, something is wrong — this endpoint sets no Access-Control-Allow-Origin header.",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Intentionally no Access-Control-Allow-Origin header.
      },
    },
  );
}
