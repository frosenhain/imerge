import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { normalizeAgenda } from "@/lib/agenda";
import { readAgenda, writeAgenda } from "@/lib/agenda-store";
import { sessionCookie, validSession } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

async function authorized() {
  return validSession((await cookies()).get(sessionCookie)?.value);
}

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ error: "Sesión vencida." }, { status: 401 });
  return NextResponse.json({ events: await readAgenda() }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: "Sesión vencida." }, { status: 401 });
  const agenda = normalizeAgenda((await request.json().catch(() => null))?.events);
  if (!agenda) return NextResponse.json({ error: "Revisá los datos obligatorios de los eventos." }, { status: 400 });
  try {
    await writeAgenda(agenda);
    return NextResponse.json({ events: agenda });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar la agenda." }, { status: 503 });
  }
}
