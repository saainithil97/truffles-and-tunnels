// Day 3, Demo 10 — CORS demo: the "allowed" endpoint.
//
// Same JSON shape as /api/cors-demo/blocked, but this one sends
// Access-Control-Allow-Origin: *. The browser will hand the response body
// to cross-origin JavaScript. This is the server *opting in* to cross-origin
// reads — CORS lives on the server's response headers, not on the network.

export const dynamic = "force-static";

export function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      message:
        "You can read this from any origin because the server set Access-Control-Allow-Origin: *.",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
