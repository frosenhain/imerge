"use client";

import { FormEvent, useState } from "react";

export default function AdminLogin() {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user: data.get("user"), password: data.get("password") }) });
    if (response.ok) { window.location.href = "/admin/agenda"; return; }
    setMessage((await response.json().catch(() => ({}))).error || "No se pudo iniciar sesión."); setSaving(false);
  }
  return <main className="admin-shell"><a className="admin-brand" href="/"><span>i</span>MERGE <small>CORPORATE CENTER</small></a><section className="admin-login"><p className="eyebrow">ACCESO PRIVADO</p><h1>Administrar<br/><em>la agenda.</em></h1><p>Ingresá con tus credenciales para editar los próximos eventos.</p><form onSubmit={login}><label>Usuario<input name="user" autoComplete="username" required /></label><label>Contraseña<input name="password" type="password" autoComplete="current-password" required /></label>{message && <p className="admin-message">{message}</p>}<button className="button lime" disabled={saving}>{saving ? "Ingresando…" : "Ingresar al panel →"}</button></form></section></main>;
}
