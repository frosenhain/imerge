"use client";

import type { CSSProperties } from "react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AgendaEvent, DEFAULT_EVENTS } from "@/lib/agenda";

const spaces = [
  ["Sala Inmersiva", "/images/hero.jpg", "Hasta 300 personas", "Pantalla envolvente, arquitectura de luz y una llegada que cambia la energía del evento."],
  ["Salón Corporativo", "/images/lobby.jpg", "Hasta 180 personas", "La escala y la claridad que necesitan conferencias, asambleas y presentaciones decisivas."],
  ["Aulas Flex", "/images/screen.jpg", "Hasta 120 personas", "Configuraciones ágiles para aprendizaje, workshops y equipos que construyen juntos."],
];
const heroImages = ["/images/hero.jpg", "/images/hero-02.jpg", "/images/hero-03.jpg", "/images/hero-04.jpg", "/images/hero-05.jpg", "/images/hero-06.jpg"];
const whatsappNumber = "50200000000"; // Reemplazar por el WhatsApp comercial real.
const contactEmail = "eventos@imerge.gt"; // Reemplazar por el correo comercial real.
const dateText = (date: string, weekday = false) => new Intl.DateTimeFormat("es-GT", { day: "numeric", month: "short", ...(weekday ? { weekday: "short" } : {}) }).format(new Date(`${date}T12:00:00`));

export default function Home() {
  const [events, setEvents] = useState<AgendaEvent[]>(DEFAULT_EVENTS);
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState<AgendaEvent>(DEFAULT_EVENTS[0]);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroFading, setHeroFading] = useState(false);
  const formats = useMemo(() => ["Todos", ...new Set(events.map(({ format }) => format))], []);
  const listed = filter === "Todos" ? events : events.filter(({ format }) => format === filter);
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".space");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); });
    }, { threshold: 0.16 });
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const loadAgenda = () => fetch("/api/agenda", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body) => {
        if (!Array.isArray(body.events)) return;
        setEvents(body.events);
        setSelected((current) => body.events.find((item: AgendaEvent) => item.id === current.id) || body.events[0] || DEFAULT_EVENTS[0]);
      })
      .catch(() => undefined);
    loadAgenda();
    window.addEventListener("focus", loadAgenda);
    return () => window.removeEventListener("focus", loadAgenda);
  }, []);
  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroFading(true);
      window.setTimeout(() => {
        setHeroIndex((current) => (current + 1) % heroImages.length);
        setHeroFading(false);
      }, 800);
    }, 6000);
    return () => window.clearInterval(interval);
  }, []);
  const inquire = (event?: AgendaEvent) => { if (event) setSelected(event); setMessage(""); setModal(true); };
  const sendInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim(), date = String(data.get("date") || ""), type = String(data.get("type") || ""), guests = String(data.get("guests") || ""), notes = String(data.get("notes") || "").trim();
    if (!name || !date || !type || !guests) return setMessage("Completá nombre, fecha, tipo de evento y asistentes para continuar.");
    const text = `Hola, soy ${name}. Quisiera consultar disponibilidad en Imerge Corporate Center. Fecha: ${date}. Tipo: ${type}. Asistentes: ${guests}. Evento de referencia: ${selected.name}.${notes ? ` Comentarios: ${notes}` : ""}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent("Consulta de disponibilidad · Imerge")}&body=${encodeURIComponent(text)}`;
    setMessage("Abrimos WhatsApp y preparamos tu correo con los detalles.");
  };
  return <main>
    <nav><a className="brand" href="#inicio"><span>i</span>MERGE <small>CORPORATE CENTER</small></a><div className="links"><a href="#espacios">Espacios</a><a href="#tecnologia">Tecnología</a><a href="#agenda">Agenda</a></div><button className="nav-button" onClick={() => inquire()}>Consultar fecha ↗</button></nav>
    <section className="hero" id="inicio"><div className={`hero-image ${heroFading ? "is-fading" : ""}`} aria-hidden="true" key={heroIndex} style={{ "--hero-photo": `url(${heroImages[heroIndex]})` } as CSSProperties} /><div className="hero-copy"><p className="eyebrow">GUATEMALA · EVENTOS SIN LÍMITES</p><h1>El lugar donde<br/><em>todo converge.</em></h1><p>Espacios que se transforman, tecnología que envuelve y una ejecución pensada para que cada momento deje una marca.</p><div className="actions"><button className="button lime" onClick={() => inquire()}>Consultar disponibilidad <b>→</b></button><a href="#espacios">Descubrir Imerge ↓</a></div></div><div className="hero-foot"><span>IMERGE · {String(heroIndex + 1).padStart(2, "0")}</span><span>Corporate events · Experiences · Ideas</span></div></section>
    <section className="intro section"><p className="eyebrow">UN NUEVO ESTÁNDAR PARA REUNIRSE</p><div><h2>Cuando el evento importa,<br/><em>el espacio también habla.</em></h2><p>En Imerge, cada ambiente combina hospitalidad, diseño y tecnología para darle a tu audiencia una experiencia que no se parece a ninguna otra.</p></div></section>
    <section className="section" id="espacios"><div className="heading"><div><p className="eyebrow">ESPACIOS QUE SE ADAPTAN A TU IDEA</p><h2>Una misma dirección.<br/><em>Infinitas posibilidades.</em></h2></div><p>Desde sesiones íntimas hasta experiencias de gran escala, encontramos la configuración justa para tu objetivo.</p></div><div className="space-grid">{spaces.map(([name, image, capacity, description], index) => <article className={`space s${index + 1}`} key={name}><div className="space-image" style={{ backgroundImage: `url(${image})` }} /><div className="space-content"><span>0{index + 1}</span><h3>{name}</h3><p>{description}</p><div><b>{capacity}</b><button onClick={() => inquire()} aria-label={`Consultar ${name}`}>↗</button></div></div></article>)}</div></section>
    <section className="virtual-tour section" id="tour"><div className="heading"><div><p className="eyebrow">RECORRÉ IMERGE</p><h2>Antes de llegar,<br/><em>ya podés estar acá.</em></h2></div><p>Explorá cada ambiente en 360° y encontrá el espacio ideal para tu próximo evento.</p></div><div className="tour-frame"><iframe src="https://360.lifeonmars.work/es/embed/E857Y33jL8" title="Tour virtual 360 grados de Imerge Corporate Center" loading="lazy" allowFullScreen /><div className="tour-caption"><span>TOUR VIRTUAL · 360°</span><a href="https://360.lifeonmars.work/es/embed/E857Y33jL8" target="_blank" rel="noreferrer">Abrir pantalla completa ↗</a></div></div></section>
    <section className="technology" id="tecnologia"><div><p className="eyebrow">TECNOLOGÍA COMO PARTE DE LA EXPERIENCIA</p><h2>No es solo<br/><em>una pantalla.</em></h2><p>Es un entorno listo para amplificar ideas: visuales de alto impacto, audio profesional, conectividad y soporte de producción cuando cada detalle cuenta.</p><button className="plain" onClick={() => inquire()}>Diseñemos tu montaje →</button></div><div className="tech-list">{["Visuales inmersivos", "Producción integral", "Configuración flexible", "Conectividad de alto nivel"].map((item, index) => <article key={item}><b>0{index + 1}</b><span>{item}</span></article>)}</div></section>
    <section className="events section" id="eventos"><div className="heading"><div><p className="eyebrow">NUESTROS EVENTOS</p><h2>Ideas que<br/><em>llenan la sala.</em></h2></div><p>Momentos reales que muestran cómo una audiencia, una idea y la tecnología pueden convertirse en experiencia.</p></div><div className="events-video"><iframe src="https://www.youtube-nocookie.com/embed/zKVV0ou7nwU" title="Nuestros eventos en Imerge Corporate Center" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><div className="event-gallery">{["event-01.jpg", "event-02.jpg", "event-03.jpg", "event-04.jpg"].map((image, index) => <figure key={image}><img src={`/images/${image}`} alt={`Momento de evento en Imerge ${index + 1}`} /><figcaption>0{index + 1} · En acción</figcaption></figure>)}</div></section>
    <section className="agenda section" id="agenda"><div className="heading"><div><p className="eyebrow">PRÓXIMAMENTE EN IMERGE</p><h2>La agenda<br/><em>se mueve aquí.</em></h2></div><button className="button dark" onClick={() => inquire()}>Proponer mi evento →</button></div><div className="agenda-grid"><div><div className="filters">{formats.map((format) => <button className={filter === format ? "selected" : ""} onClick={() => setFilter(format)} key={format}>{format}</button>)}</div><div className="event-list">{listed.map((item) => <button className={`event ${selected.id === item.id ? "active" : ""}`} onClick={() => setSelected(item)} key={item.id}><time><b>{new Date(`${item.date}T12:00:00`).getDate()}</b><span>{dateText(item.date).split(" ")[1]}</span></time><span><strong>{item.name}</strong><small>{item.time} · {item.space}</small></span><i className={item.status === "Últimos cupos" ? "limited" : ""}>{item.status}</i><b>↗</b></button>)}{!listed.length && <p className="empty">No hay eventos para este filtro aún.</p>}</div><p className="note">Agenda actualizada por el equipo de Imerge.</p></div><aside><p className="eyebrow">EVENTO DESTACADO</p><span>{dateText(selected.date, true)} · {selected.time}</span><h3>{selected.name}</h3><dl><div><dt>Formato</dt><dd>{selected.format}</dd></div><div><dt>Espacio</dt><dd>{selected.space}</dd></div></dl><button className="button lime" onClick={() => inquire(selected)}>Consultar fecha →</button></aside></div></section>
    <section className="contact section"><p className="eyebrow">TU PRÓXIMO EVENTO EMPIEZA CON UNA CONVERSACIÓN</p><h2>Hagamos que<br/><em>pase algo grande.</em></h2><button className="button lime" onClick={() => inquire()}>Consultar disponibilidad →</button><p>Respuesta personalizada por WhatsApp o correo.</p></section>
    <footer><a className="brand" href="#inicio"><span>i</span>MERGE <small>CORPORATE CENTER</small></a><p>Guatemala · Eventos corporativos y experiencias</p><a href="#inicio">Volver arriba ↑</a></footer>
    {modal && <div className="backdrop" onMouseDown={() => setModal(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={() => setModal(false)} aria-label="Cerrar">×</button><p className="eyebrow">DISPONIBILIDAD</p><h2 id="modal-title">Imaginemos<br/><em>tu evento.</em></h2><p>Contanos lo esencial. Prepararemos el mensaje para WhatsApp y correo.</p><form onSubmit={sendInquiry}><label>Tu nombre<input name="name" placeholder="Nombre y apellido" /></label><div className="row"><label>Fecha tentativa<input name="date" type="date" /></label><label>Asistentes<input name="guests" type="number" min="1" placeholder="Ej. 80" /></label></div><label>Tipo de evento<select name="type" defaultValue=""><option value="" disabled>Seleccionar</option><option>Conferencia</option><option>Capacitación</option><option>Networking</option><option>Lanzamiento</option><option>Otro</option></select></label><label>Comentarios <small>(opcional)</small><textarea name="notes" rows={3} placeholder="Contanos un poco más" /></label>{message && <p className="message">{message}</p>}<button className="button lime">Continuar por WhatsApp y correo →</button></form></section></div>}
  </main>;
}
