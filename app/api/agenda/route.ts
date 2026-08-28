import { NextResponse } from "next/server";
import { readAgenda } from "@/lib/agenda-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const events = await readAgenda();
  return NextResponse.json({ events }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
