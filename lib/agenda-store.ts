import { get, put } from "@vercel/blob";
import { AgendaEvent, DEFAULT_EVENTS, normalizeAgenda } from "@/lib/agenda";

const pathname = "imerge/agenda.json";
// Los Blob creados desde el panel de Vercel usan BLOB_STORE_ID y autenticación
// OIDC administrada por la plataforma. Los proyectos antiguos pueden usar el token.
const configured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

export async function readAgenda(): Promise<AgendaEvent[]> {
  if (!configured()) return DEFAULT_EVENTS;
  try {
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result?.stream) return DEFAULT_EVENTS;
    const content = await new Response(result.stream).json();
    return normalizeAgenda(content) ?? DEFAULT_EVENTS;
  } catch {
    return DEFAULT_EVENTS;
  }
}

export async function writeAgenda(events: AgendaEvent[]) {
  if (!configured()) throw new Error("El almacenamiento de agenda todavía no está vinculado a Vercel.");
  await put(pathname, JSON.stringify(events), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}
