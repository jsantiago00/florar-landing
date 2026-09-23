"use client";

import { useEffect, useState } from "react";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { ok: bool, msg: string }

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem("florar-admin-pw") : null;
    if (saved) {
      setPassword(saved);
      tryLogin(saved, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function tryLogin(pw, silent) {
    setLoadingLogin(true);
    setLoginError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw })
      });
      if (!res.ok) {
        if (!silent) setLoginError("Contraseña incorrecta.");
        sessionStorage.removeItem("florar-admin-pw");
        setLoadingLogin(false);
        return;
      }
      sessionStorage.setItem("florar-admin-pw", pw);
      setAuthed(true);
      const linksRes = await fetch("/api/links", { cache: "no-store" });
      const linksData = await linksRes.json();
      setData(linksData);
    } catch (err) {
      if (!silent) setLoginError("Error de conexión. Probá de nuevo.");
    }
    setLoadingLogin(false);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    tryLogin(password, false);
  }

  function updateProfile(field, value) {
    setData((d) => ({ ...d, profile: { ...d.profile, [field]: value } }));
  }

  function updateItem(id, field, value) {
    setData((d) => ({
      ...d,
      items: d.items.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    }));
  }

  function moveItem(id, dir) {
    setData((d) => {
      const items = [...d.items];
      const idx = items.findIndex((it) => it.id === id);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= items.length) return d;
      const [moved] = items.splice(idx, 1);
      items.splice(newIdx, 0, moved);
      return { ...d, items };
    });
  }

  function removeItem(id) {
    if (!confirm("¿Eliminar este elemento?")) return;
    setData((d) => ({ ...d, items: d.items.filter((it) => it.id !== id) }));
  }

  function addItem(type) {
    setData((d) => ({
      ...d,
      items: [
        ...d.items,
        type === "header"
          ? { type: "header", id: uid(), label: "NUEVA SECCIÓN" }
          : { type: "link", id: uid(), label: "Nuevo link", url: "https://" }
      ]
    }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/links", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Error al guardar");
      }
      setStatus({ ok: true, msg: "Guardado. La landing ya está actualizada." });
    } catch (err) {
      setStatus({ ok: false, msg: err.message || "Error al guardar" });
    }
    setSaving(false);
    setTimeout(() => setStatus(null), 4000);
  }

  function logout() {
    sessionStorage.removeItem("florar-admin-pw");
    setAuthed(false);
    setPassword("");
    setData(null);
  }

  if (!authed) {
    return (
      <div className="login-wrap">
        <form className="login-card" onSubmit={handleLoginSubmit}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="login-logo" src="/logo.png" alt="Florar" />
          <h1>Florar Admin</h1>
          <p>Ingresá la contraseña para editar la landing.</p>
          <div className="field">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          {loginError && (
            <p style={{ color: "#b3261e", fontSize: 13, marginTop: -6 }}>{loginError}</p>
          )}
          <button className="btn-primary" type="submit" disabled={loadingLogin} style={{ width: "100%" }}>
            {loadingLogin ? "Ingresando…" : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  if (!data) {
    return <div className="wrap">Cargando…</div>;
  }

  return (
    <div className="wrap">
      <div className="topbar-admin">
        <div className="topbar-admin-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Florar" />
          <h1>Editar Florar</h1>
        </div>
        <button className="btn-secondary" onClick={logout}>
          Salir
        </button>
      </div>

      <div className="card">
        <h2>Perfil</h2>
        <div className="field">
          <label>Título</label>
          <input
            type="text"
            value={data.profile.title || ""}
            onChange={(e) => updateProfile("title", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Subtítulo</label>
          <textarea
            rows={3}
            value={data.profile.subtitle || ""}
            onChange={(e) => updateProfile("subtitle", e.target.value)}
          />
        </div>
        <div className="field">
          <label>URL del logo (opcional, si está vacío se muestra el texto)</label>
          <input
            type="url"
            placeholder="https://..."
            value={data.profile.logoUrl || ""}
            onChange={(e) => updateProfile("logoUrl", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Texto del logo (si no hay imagen)</label>
          <input
            type="text"
            value={data.profile.logoText || ""}
            onChange={(e) => updateProfile("logoText", e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <h2>Botones y secciones</h2>
        {data.items.map((item, idx) => (
          <div className="item-row" key={item.id}>
            <div className="item-top">
              <span className="item-type-badge">
                {item.type === "header" ? "Título de sección" : "Link"}
              </span>
              <div className="item-actions">
                <button onClick={() => moveItem(item.id, -1)} disabled={idx === 0} title="Subir">
                  ↑
                </button>
                <button
                  onClick={() => moveItem(item.id, 1)}
                  disabled={idx === data.items.length - 1}
                  title="Bajar"
                >
                  ↓
                </button>
                <button className="btn-danger" onClick={() => removeItem(item.id)}>
                  Eliminar
                </button>
              </div>
            </div>
            <div className="field" style={{ marginBottom: item.type === "header" ? 0 : 8 }}>
              <label>Texto</label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(item.id, "label", e.target.value)}
              />
            </div>
            {item.type === "link" && (
              <div className="field" style={{ marginBottom: 0 }}>
                <label>URL</label>
                <input
                  type="url"
                  value={item.url}
                  onChange={(e) => updateItem(item.id, "url", e.target.value)}
                />
              </div>
            )}
          </div>
        ))}

        <div className="add-row">
          <button className="btn-secondary" onClick={() => addItem("link")}>
            + Agregar link
          </button>
          <button className="btn-secondary" onClick={() => addItem("header")}>
            + Agregar título de sección
          </button>
        </div>
      </div>

      <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ width: "100%" }}>
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>

      {status && (
        <div className={"status-msg " + (status.ok ? "status-ok" : "status-err")}>
          {status.msg}
        </div>
      )}
    </div>
  );
}
