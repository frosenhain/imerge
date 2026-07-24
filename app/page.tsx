"use client";

import { useEffect, useMemo, useState } from "react";

type Dimension = { id: string; name: string; color: string; questions: string[] };
type Person = { id: number; industry: string; role: string; experience: string; scores: Record<string, number>; open: string };

const dimensions: Dimension[] = [
  { id: "strategy", name: "Estrategia y visión", color: "#7357ff", questions: ["La IA está incluida en prioridades estratégicas", "La dirección comunica una visión clara", "Se definen casos de uso prioritarios", "Se mide el valor esperado"] },
  { id: "leadership", name: "Liderazgo y recursos", color: "#ff8d4b", questions: ["Los líderes patrocinan iniciativas", "Existen responsables definidos", "Hay presupuesto disponible", "Se eliminan bloqueos"] },
  { id: "culture", name: "Cultura y cambio", color: "#19a78a", questions: ["Es seguro experimentar", "Las personas confían en la IA", "Se acompaña el cambio", "Se comparten aprendizajes"] },
  { id: "talent", name: "Talento y habilidades", color: "#3b82f6", questions: ["Hay habilidades aplicadas", "Se ofrece capacitación", "Se entiende el uso responsable", "Los equipos son interdisciplinarios"] },
  { id: "data", name: "Datos e infraestructura", color: "#e5528d", questions: ["Los datos son accesibles", "La calidad de datos es suficiente", "La infraestructura escala", "Se integran herramientas"] },
  { id: "governance", name: "Gobierno y riesgo", color: "#cf9a19", questions: ["Hay políticas de IA", "Se evalúan riesgos", "Se protege información sensible", "Se revisan resultados"] },
  { id: "experimentation", name: "Experimentación", color: "#00a6c7", questions: ["Se prueban nuevos usos", "Los pilotos tienen aprendizaje", "Se itera con usuarios", "Se comparten prototipos"] },
  { id: "adoption", name: "Adopción y escalamiento", color: "#a76bdf", questions: ["Las soluciones se usan", "Se rediseñan procesos", "Se mide adopción", "Los pilotos escalan"] }
];

const industries = ["Servicios profesionales", "Tecnología", "Finanzas", "Industria", "Sector público"];
const roles = ["Dirección", "Gerencia", "Especialista", "Consultoría"];
const experiences = ["Alta", "Media", "Inicial"];
const openResponses = [
  "Tenemos muchas ideas, pero todavía no acordamos cómo priorizarlas.",
  "El interés es real; el desafío es llevar los pilotos al proceso cotidiano.",
  "Necesitamos más práctica y reglas simples para usar datos con confianza.",
  "La tecnología está disponible, pero los equipos necesitan tiempo para aprender.",
  "Vemos potencial, aunque todavía no está claro quién toma las decisiones de riesgo."
];

function seeded(n: number) { return ((n * 9301 + 49297) % 233280) / 233280; }
const people: Person[] = Array.from({ length: 64 }, (_, index) => {
  const experience = experiences[index % 3];
  const scores: Record<string, number> = {};
  dimensions.forEach((d, i) => {
    const baseline: Record<string, number> = { strategy: 3.7, leadership: 3.1, culture: 3.3, talent: 2.6, data: 3.0, governance: 2.4, experimentation: 3.8, adoption: 2.7 };
    const exp = experience === "Alta" ? 0.35 : experience === "Inicial" ? -0.22 : 0;
    const variation = (seeded((index + 1) * (i + 7)) - 0.5) * 1.8;
    scores[d.id] = Math.max(1, Math.min(5, Number((baseline[d.id] + exp + variation).toFixed(1))));
  });
  return { id: index + 1, industry: industries[index % industries.length], role: roles[(index * 3) % roles.length], experience, scores, open: openResponses[index % openResponses.length] };
});

const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;
const std = (values: number[]) => Math.sqrt(mean(values.map((v) => (v - mean(values)) ** 2)));
const pct = (score: number) => score * 20;
const stage = (score: number) => score < 2 ? "Exploración" : score < 3 ? "Experimentación" : score < 3.8 ? "Estructuración" : score < 4.4 ? "Escalamiento" : "Transformación";

function Radar({ scores }: { scores: { dimension: Dimension; value: number }[] }) {
  const points = scores.map(({ value }, i) => { const a = (Math.PI * 2 * i) / scores.length - Math.PI / 2; const r = 37 * (value / 5); return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`; }).join(" ");
  return <svg className="radar" viewBox="0 0 100 100" role="img" aria-label="Radar de madurez">{[20, 35, 50].map((r) => <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="currentColor" opacity=".13" />)}<polygon points={points} fill="rgba(115,87,255,.28)" stroke="#7357ff" strokeWidth="1.5" />{scores.map(({ dimension }, i) => { const a = (Math.PI * 2 * i) / scores.length - Math.PI / 2; return <text key={dimension.id} x={50 + 47 * Math.cos(a)} y={50 + 47 * Math.sin(a)} textAnchor="middle" className="radar-label">{dimension.name.split(" ")[0]}</text>; })}</svg>;
}

export default function Home() {
  const [tab, setTab] = useState("pulso");
  const [mode, setMode] = useState<"explore" | "class">("explore");
  const [filter, setFilter] = useState("Todos");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [story, setStory] = useState<string[]>([]);
  const [reveal, setReveal] = useState(false);
  const [activePeople, setActivePeople] = useState(people);
  const [source, setSource] = useState<"demo" | "real">("demo");
  const [showImport, setShowImport] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => { setSheetUrl(window.localStorage.getItem("maturity-sheet-url") ?? ""); }, []);

  const filtered = useMemo(() => filter === "Todos" ? activePeople : activePeople.filter((p) => p.experience === filter), [filter, activePeople]);
  const scores = useMemo(() => dimensions.map((dimension) => ({ dimension, value: mean(filtered.map((p) => p.scores[dimension.id])) })), [filtered]);
  const overall = mean(scores.map((x) => x.value));
  const strongest = [...scores].sort((a, b) => b.value - a.value)[0];
  const opportunity = [...scores].sort((a, b) => a.value - b.value)[0];
  const disagreement = [...scores].sort((a, b) => std(filtered.map((p) => p.scores[b.dimension.id])) - std(filtered.map((p) => p.scores[a.dimension.id])))[0];
  const ask = () => {
    const q = question.toLowerCase();
    const focus = q.includes("barrera") || q.includes("riesgo") ? opportunity : q.includes("desacuerdo") ? disagreement : strongest;
    setAnswer(`La evidencia disponible señala ${focus.dimension.name} como ${focus === opportunity ? "la principal oportunidad" : focus === disagreement ? "la dimensión con mayor desacuerdo" : "una fortaleza relativa"}: ${pct(focus.value).toFixed(0)}/100, con ${filtered.length} respuestas. Esto describe percepciones del grupo, no prueba causalidad. Podés abrir “Brechas” para revisar las preguntas y la dispersión que sustentan esta lectura.`);
  };
  const importSheet = async () => {
    setIsImporting(true); setImportMessage("");
    try {
      const response = await fetch("/api/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: sheetUrl }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No se pudieron actualizar los datos.");
      setActivePeople(result.participants); setSource("real"); setFilter("Todos");
      window.localStorage.setItem("maturity-sheet-url", sheetUrl);
      setImportMessage(`Actualizado: ${result.summary.rows} respuestas y ${result.summary.detectedDimensions.length} dimensiones detectadas.`);
    } catch (error) { setImportMessage(error instanceof Error ? error.message : "No se pudieron actualizar los datos."); }
    finally { setIsImporting(false); }
  };
  const nav = [{ id: "pulso", label: "Pulso" }, { id: "dimensiones", label: "Dimensiones" }, { id: "preguntas", label: "Preguntas" }, { id: "brechas", label: "Brechas" }, { id: "comparar", label: "Comparar" }, { id: "conversar", label: "Conversar" }];
  const addFinding = (text: string) => setStory((items) => items.includes(text) ? items : [...items, text]);

  return <main>
    <aside className="sidebar"><div className="brand"><span className="spark">✦</span><div>AI maturity<small>Di Tella · {source === "real" ? "planilla real" : "demo"}</small></div></div><div className="mode-switch"><button className={mode === "explore" ? "active" : ""} onClick={() => setMode("explore")}>Explorar</button><button className={mode === "class" ? "active" : ""} onClick={() => setMode("class")}>Modo clase</button></div><nav>{nav.map((item) => <button key={item.id} className={tab === item.id ? "nav-active" : ""} onClick={() => { setTab(item.id); setMode("explore"); }}>{item.label}</button>)}</nav><div className="source"><span>●</span> {source === "real" ? "Planilla real" : "Datos de demostración"}<br/><small>{activePeople.length} respuestas anónimas</small></div></aside>
    <section className="content"><header><div><p className="eyebrow">MADUREZ Y ADOPCIÓN DE AI</p><h1>{mode === "class" ? "Un recorrido para conversar con el grupo" : "¿Qué nos dicen las respuestas?"}</h1><p className="sub">Una exploración interactiva basada en respuestas de la clase.</p></div><div className="header-actions"><select aria-label="Filtrar por experiencia" value={filter} onChange={(e) => setFilter(e.target.value)}><option>Todos</option>{experiences.map((x) => <option key={x}>{x}</option>)}</select><button className="outline" onClick={() => setFilter("Todos")}>Reiniciar</button></div></header>
      {showImport && <section className="import-panel card"><div><p className="eyebrow">FUENTE DE DATOS</p><h2>Actualizar desde Google Sheets</h2><p>Pegá el enlace público de edición de la planilla. Solo se leerán datos agregados; no se guardan credenciales.</p></div><div className="prompt"><input value={sheetUrl} onChange={(event) => setSheetUrl(event.target.value)} placeholder="https://docs.google.com/spreadsheets/d/.../edit?gid=0" /><button onClick={importSheet} disabled={isImporting}>{isImporting ? "Actualizando…" : "Actualizar datos"}</button></div>{importMessage && <p className={source === "real" ? "import-success" : "import-error"}>{importMessage}</p>}<button className="text-button" onClick={() => setShowImport(false)}>Cerrar</button></section>}
      {mode === "class" ? <ClassMode overall={overall} strongest={strongest.dimension.name} opportunity={opportunity.dimension.name} reveal={reveal} setReveal={setReveal} story={story} addFinding={addFinding} /> : <>
        {tab === "pulso" && <Pulse overall={overall} strongest={strongest.dimension.name} opportunity={opportunity.dimension.name} disagreement={disagreement.dimension.name} count={filtered.length} scores={scores} addFinding={addFinding} />}
        {tab === "dimensiones" && <Dimensions scores={scores} people={filtered} />}
        {tab === "preguntas" && <Questions scores={scores} count={filtered.length} />}
        {tab === "brechas" && <Gaps strategy={scores.find((x) => x.dimension.id === "strategy")!.value} execution={mean([scores.find((x) => x.dimension.id === "adoption")!.value, scores.find((x) => x.dimension.id === "governance")!.value])} count={filtered.length} addFinding={addFinding} />}
        {tab === "comparar" && <Compare people={activePeople} />}
        {tab === "conversar" && <section className="chat card"><p className="eyebrow">ASISTENTE CON EVIDENCIA</p><h2>Conversar con los datos</h2><p>Preguntá por barreras, desacuerdos, dimensiones o comparaciones. La respuesta usa métricas reales de esta demo.</p><div className="prompt"><input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Ej.: ¿Dónde existe mayor desacuerdo?" /><button onClick={ask}>Analizar</button></div>{answer && <div className="answer"><strong>Respuesta directa</strong><p>{answer}</p><div className="evidence">Evidencia · {filtered.length} respuestas · Filtro: {filter} · Confianza interpretativa: moderada</div><button className="text-button" onClick={() => addFinding(answer)}>+ Agregar al relato</button></div>}</section>}
      </>}
      {story.length > 0 && <footer className="story"><strong>Relato de clase · {story.length} hallazgo{story.length > 1 ? "s" : ""}</strong><button onClick={() => setStory([])}>Limpiar</button></footer>}<button className="refresh" onClick={() => setShowImport(true)}>↻ Actualizar datos</button>
    </section>
  </main>;
}

function Pulse({ overall, strongest, opportunity, disagreement, count, scores, addFinding }: { overall: number; strongest: string; opportunity: string; disagreement: string; count: number; scores: { dimension: Dimension; value: number }[]; addFinding: (s: string) => void }) {
  const finding = `El grupo se ubica en ${stage(overall)} (${pct(overall).toFixed(0)}/100). ${strongest} es fortaleza relativa; ${opportunity} es oportunidad prioritaria.`;
  return <><div className="notice">El índice resume percepciones del grupo. No representa una auditoría objetiva de una organización.</div><section className="hero-grid"><article className="score-card"><p>ÍNDICE GENERAL</p><strong>{pct(overall).toFixed(0)}</strong><span>/100</span><div className="stage">{stage(overall)}</div><small>Escala configurada · 1 a 5 normalizada</small></article><article className="card radar-card"><div><p className="eyebrow">PERFIL DEL GRUPO</p><h2>Balance de dimensiones</h2><p>Promedio por dimensión.</p></div><Radar scores={scores} /></article></section><section className="metrics"><Metric label="Fortaleza relativa" value={strongest} tone="mint" /><Metric label="Mayor oportunidad" value={opportunity} tone="amber" /><Metric label="Mayor desacuerdo" value={disagreement} tone="violet" /><Metric label="Respuestas analizadas" value={`${count} · 91% completas`} tone="blue" /></section><section className="card insight"><div><p className="eyebrow">LECTURA PARA ABRIR EL DEBATE</p><h2>Interés y experimentación no garantizan adopción sostenida.</h2><p>{finding}</p></div><button onClick={() => addFinding(finding)}>Agregar al relato</button></section></>;
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) { return <article className={`metric ${tone}`}><p>{label}</p><strong>{value}</strong><span>Ver evidencia →</span></article>; }

function Dimensions({ scores, people }: { scores: { dimension: Dimension; value: number }[]; people: Person[] }) { return <section className="card"><p className="eyebrow">RANKING DE DIMENSIONES</p><h2>De la mayor madurez a la mayor oportunidad</h2><div className="bars">{[...scores].sort((a, b) => b.value - a.value).map(({ dimension, value }) => <div className="bar-row" key={dimension.id}><span>{dimension.name}</span><div className="bar"><i style={{ width: `${pct(value)}%`, background: dimension.color }} /></div><b>{pct(value).toFixed(0)}</b><small>σ {std(people.map((p) => p.scores[dimension.id])).toFixed(1)}</small></div>)}</div><p className="footnote">La barra muestra promedio normalizado; σ indica dispersión. La distribución debe revisarse antes de concluir.</p></section>; }

function Questions({ scores, count }: { scores: { dimension: Dimension; value: number }[]; count: number }) { const [selected, setSelected] = useState(scores[0].dimension.id); const dimension = dimensions.find((d) => d.id === selected)!; const value = scores.find((s) => s.dimension.id === selected)!.value; return <section className="card"><p className="eyebrow">EXPLORADOR DE PREGUNTAS</p><h2>Distribución y evidencia</h2><div className="chips">{dimensions.map((d) => <button className={selected === d.id ? "selected" : ""} key={d.id} onClick={() => setSelected(d.id)}>{d.name}</button>)}</div>{dimension.questions.map((question, i) => { const a = Math.max(8, Math.round(12 + value * 4 + i * 2)); const b = 100 - a - 23; return <article className="question" key={question}><div><b>{question}</b><small>{dimension.name} · {count} respuestas · 2 omitidas</small></div><div className="distribution"><i style={{ width: `${a}%` }} /><i style={{ width: "23%" }} /><i style={{ width: `${b}%` }} /></div><span>{(value + (i - 1) * .15).toFixed(1)} / 5</span></article>; })}</section>; }

function Gaps({ strategy, execution, count, addFinding }: { strategy: number; execution: number; count: number; addFinding: (s: string) => void }) { const gap = pct(strategy - execution); const text = `Estrategia y visión supera la capacidad de ejecución en ${gap.toFixed(0)} puntos.`; return <section><div className="section-title"><div><p className="eyebrow">BRECHAS Y CONTRADICCIONES</p><h2>Patrones para discutir, no conclusiones automáticas</h2></div></div><article className="tension card"><span className="tag">TENSIÓN DETECTADA</span><h2>{text}</h2><div className="tension-grid"><div><b>Dato observado</b><p>Estrategia: {pct(strategy).toFixed(0)}/100 · Adopción y gobierno: {pct(execution).toFixed(0)}/100.</p></div><div><b>Hipótesis para debatir</b><p>La intención puede avanzar más rápido que las capacidades, roles y controles necesarios para escalar.</p></div><div><b>Precaución</b><p>Se trata de percepciones agregadas de {count} respuestas; no demuestra una relación causal.</p></div></div><button onClick={() => addFinding(text)}>Agregar al relato</button></article><article className="tension card"><span className="tag pale">PREGUNTA SUGERIDA</span><h2>¿Qué tendría que cambiar para que los experimentos pasen a formar parte del trabajo cotidiano?</h2></article></section>; }

function Compare({ people }: { people: Person[] }) { const groups = [...new Set(people.map((person) => person.experience))].filter((experience) => people.filter((person) => person.experience === experience).length >= 5).map((experience) => { const group = people.filter((p) => p.experience === experience); return { experience, score: mean(group.flatMap((p) => Object.values(p.scores))) }; }); return <section className="card"><p className="eyebrow">COMPARADOR DE GRUPOS</p><h2>Experiencia previa con AI</h2><p>Solo se muestran grupos con cinco o más respuestas.</p><div className="compare">{groups.map((g) => <div key={g.experience}><span>{g.experience}</span><strong>{pct(g.score).toFixed(0)}</strong><div><i style={{ width: `${pct(g.score)}%` }} /></div><small>{people.filter((p) => p.experience === g.experience).length} respuestas</small></div>)}</div><div className="notice">La diferencia describe a estos grupos. No permite inferir que la experiencia previa cause el resultado.</div></section>; }

function ClassMode({ overall, strongest, opportunity, reveal, setReveal, story, addFinding }: { overall: number; strongest: string; opportunity: string; reveal: boolean; setReveal: (v: boolean) => void; story: string[]; addFinding: (s: string) => void }) { const scene = !reveal ? "Predicción inicial" : "Revelación del resultado"; const finding = `Resultado revelado: ${stage(overall)} (${pct(overall).toFixed(0)}/100).`; return <><section className="class-hero"><p className="eyebrow">ESCENA 2 DE 6 · {scene.toUpperCase()}</p><h1>{!reveal ? "Antes de mirar los datos… ¿dónde creen que está la mayor barrera?" : finding}</h1><p>{!reveal ? "Invitá al grupo a votar una hipótesis. Después revelá la evidencia." : `${strongest} aparece como fortaleza relativa y ${opportunity} como oportunidad.`}</p><button onClick={() => setReveal(!reveal)}>{reveal ? "Volver a ocultar" : "Revelar resultado"}</button>{reveal && <button className="outline" onClick={() => addFinding(finding)}>Guardar hallazgo</button>}</section><section className="activities"><article className="card"><p className="eyebrow">ACTIVIDAD</p><h2>Votación de hipótesis</h2><p>¿Qué explica mejor la brecha entre interés y adopción?</p><div className="vote"><button>Habilidades insuficientes <span>42%</span></button><button>Falta de gobierno <span>31%</span></button><button>Sin tiempo para cambiar <span>27%</span></button></div></article><article className="card"><p className="eyebrow">RELATO</p><h2>{story.length} hallazgos guardados</h2><p>Guardá evidencia y preguntas para construir el cierre de la clase.</p><button className="outline">Ver relato</button></article></section></>;
}
