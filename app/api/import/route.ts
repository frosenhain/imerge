import { NextResponse } from "next/server";

const dimensionMatchers: Record<string, string[]> = {
  strategy: ["estrateg", "vision", "prioridad"],
  leadership: ["lider", "recurso", "presupuesto"],
  culture: ["cultura", "cambio", "confianza"],
  talent: ["talento", "habilidad", "capacit"],
  data: ["dato", "infraestructura", "tecnolog"],
  governance: ["gobierno", "riesgo", "etica", "seguridad"],
  experimentation: ["experiment", "piloto", "innovacion"],
  adoption: ["adopcion", "escal", "proceso"]
};

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const parseCsv = (text: string) => {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i], next = text[i + 1];
    if (char === '"' && quoted && next === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
  return rows;
};

function toCsvUrl(value: string) {
  const url = new URL(value);
  if (url.hostname !== "docs.google.com") throw new Error("La URL debe pertenecer a docs.google.com.");
  const match = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/);
  if (!match) throw new Error("No parece una URL de Google Sheets válida.");
  const gid = url.searchParams.get("gid") ?? (match[1] === "1MLQnBJlVXNlruoZtRG5OE5gG_GwxqESEgplv5wS0APQ" ? "546202448" : "0");
  return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=${gid}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { url?: string };
    if (!body.url) return NextResponse.json({ error: "Ingresá una URL pública de Google Sheets." }, { status: 400 });
    const response = await fetch(toCsvUrl(body.url), { cache: "no-store" });
    if (!response.ok) return NextResponse.json({ error: "No se pudo leer la planilla. Confirmá que esté publicada para cualquier persona con el enlace." }, { status: 422 });
    const rows = parseCsv(await response.text());
    const [headers = [], ...data] = rows;
    if (headers.length < 2 || data.length === 0) return NextResponse.json({ error: "La planilla no contiene encabezados y respuestas utilizables." }, { status: 422 });
    const columns = headers.flatMap((header, index) => {
      const heading = normalize(header);
      if (heading.includes("talento") && heading.includes("cultura")) return ["talent", "culture"].map((dimension) => ({ dimension, index, header }));
      return Object.entries(dimensionMatchers).filter(([, terms]) => terms.some((term) => heading.includes(term))).map(([dimension]) => ({ dimension, index, header }));
    });
    const foundDimensions = [...new Set(columns.map((column) => column.dimension))];
    if (foundDimensions.length < 2) return NextResponse.json({ error: "No pude asociar al menos dos columnas a dimensiones. El próximo paso será mapear los encabezados reales manualmente.", headers, detectedDimensions: foundDimensions }, { status: 422 });
    const segment = (row: string[], terms: string[], fallback: string) => {
      const index = headers.findIndex((header) => terms.some((term) => normalize(header).includes(term)));
      return index >= 0 && row[index] ? row[index] : fallback;
    };
    const participants = data.map((row, index) => {
      const scores: Record<string, number[]> = {};
      columns.forEach(({ dimension, index: columnIndex }) => {
        const raw = Number(row[columnIndex]?.replace(",", "."));
        const normalized = normalize(columns.find((column) => column.index === columnIndex && column.dimension === dimension)?.header ?? "").includes("/ 20") ? raw / 4 : raw;
        if (Number.isFinite(normalized) && normalized >= 1 && normalized <= 5) (scores[dimension] ??= []).push(normalized);
      });
      return {
        id: index + 1,
        industry: segment(row, ["industria", "sector"], "Sin clasificar"),
        role: segment(row, ["rol", "cargo", "area"], "Sin clasificar"),
        experience: segment(row, ["experiencia", "conocimiento"], "No informado"),
        scores: Object.fromEntries(Object.entries(scores).map(([key, values]) => [key, values.reduce((a, b) => a + b, 0) / values.length])),
        open: ""
      };
    }).filter((participant) => Object.keys(participant.scores).length > 0);
    return NextResponse.json({ participants, summary: { rows: participants.length, headers, detectedDimensions: foundDimensions, sourceUrl: toCsvUrl(body.url) } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo procesar la planilla." }, { status: 400 });
  }
}
