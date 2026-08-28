import { NextResponse } from "next/server";
import { createSession, credentialsAreConfigured, sessionCookie, validCredentials } from "@/lib/admin-session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!credentialsAreConfigured()) return NextResponse.json({ error: "Falta configurar el acceso del panel en Vercel." }, { status: 503 });
  if (!validCredentials(body?.user, body?.password)) return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  const session = createSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookie, session.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: session.maxAge, path: "/" });
  return response;
}
