export type AgendaStatus = "Confirmado" | "Últimos cupos" | "Próximamente";

export type AgendaEvent = {
  id: string;
  date: string;
  time: string;
  name: string;
  format: string;
  space: string;
  status: AgendaStatus;
  description?: string;
};

export const AGENDA_STATUSES: AgendaStatus[] = ["Confirmado", "Últimos cupos", "Próximamente"];

export const DEFAULT_EVENTS: AgendaEvent[] = [
  { id: "demo-1", date: "2026-09-04", time: "08:30", name: "Cumbre de innovación corporativa", format: "Conferencia", space: "Sala Inmersiva", status: "Confirmado" },
  { id: "demo-2", date: "2026-09-10", time: "18:00", name: "Noche de networking ejecutivo", format: "Networking", space: "Terrace Lounge", status: "Últimos cupos" },
  { id: "demo-3", date: "2026-09-17", time: "09:00", name: "Academia de liderazgo", format: "Capacitación", space: "Aulas Flex", status: "Confirmado" },
  { id: "demo-4", date: "2026-09-24", time: "19:00", name: "Lanzamiento de marca", format: "Experiencia", space: "Sala Inmersiva", status: "Confirmado" },
];

const isDate = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
const isTime = (value: unknown): value is string => typeof value === "string" && /^\d{2}:\d{2}$/.test(value);
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export function normalizeEvent(value: unknown): AgendaEvent | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const date = item.date;
  const time = item.time;
  const name = clean(item.name, 120);
  const format = clean(item.format, 60);
  const space = clean(item.space, 80);
  const status = item.status;
  if (!isDate(date) || !isTime(time) || !name || !format || !space || !AGENDA_STATUSES.includes(status as AgendaStatus)) return null;
  const description = clean(item.description, 500);
  return {
    id: clean(item.id, 80) || crypto.randomUUID(),
    date,
    time,
    name,
    format,
    space,
    status: status as AgendaStatus,
    ...(description ? { description } : {}),
  };
}

export function normalizeAgenda(value: unknown): AgendaEvent[] | null {
  if (!Array.isArray(value) || value.length > 100) return null;
  const events = value.map(normalizeEvent);
  if (events.some((event) => !event)) return null;
  return (events as AgendaEvent[]).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}
