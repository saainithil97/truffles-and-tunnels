import { NextResponse } from "next/server";

// A mocked "authed user's cart" endpoint. The /cart page calls this from the
// browser — in the Network tab you'll see this request fire only after the
// page's JavaScript has run.
//
// In production this would identify the user from a cookie and look up their
// cart in a database. Here it's a hardcoded seed cart so the demo always has
// something to render. The AddToCartButton islands on /detail merge their
// localStorage additions on top of this.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json([
    {
      menuItemId: "m-b1",
      name: "Special Chicken Biryani",
      price: 325,
      emoji: "🍛",
      qty: 1,
    },
    {
      menuItemId: "m-s1",
      name: "Chicken 65",
      price: 285,
      emoji: "🍗",
      qty: 2,
    },
  ]);
}
