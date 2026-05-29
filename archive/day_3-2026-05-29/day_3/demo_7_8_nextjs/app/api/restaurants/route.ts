import { NextResponse } from "next/server";
import { restaurants } from "@/lib/restaurants";

// A tiny JSON API the CSR page calls FROM THE BROWSER. In the Network tab
// you'll see this request fire only after the page's JavaScript has run.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(restaurants);
}
