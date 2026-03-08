// src/pages/Personal/RolesModal.jsx
import React, { useEffect, useState } from "react";
import { personalApi } from "../../api/personal.api";

export default function RolesModal({ persona, onClose }) {
  // persona  → { personaId, nombres, usuario: { usuarioId, roles: [...] } }
  const [todosLosRoles, setTodosLosRoles] = useState([]);
  const [rolesActivos,  setRolesActivos]  = useState(
    new Set((persona.usuario?.roles ?? []).map(r => r.rolId))
  );
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState("");

  useEffect(() => {
    personalApi.listarRoles()
      .then(r => setTodosLosRoles(Array.isArray(r.datos) ? r.datos : []))
      .catch(() => setMsg("No se pudieron cargar los roles."));
  }, []);

  const toggleRol = async (rolId) => {
    const usuarioId = persona.usuario.usuarioId;
    setLoading(true);
    setMsg("");
    try {
      if (rolesActivos.has(rolId)) {
        await personalApi.quitarRol(usuarioId, rolId);
        setRolesActivos(p => { const s = new Set(p); s.delete(rolId); return s; });
      } else {
        await personalApi.asignarRol({ usuarioId, rolId });
        setRolesActivos(p => new Set([...p, rolId]));
      }
    } catch (e) {
      setMsg(e.message || "Error al actualizar roles.");
    } finally {
      setLoading(false);
    }
  };

  // ── Estilos ──────────────────────────────────────────────
  const overlay = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100,
  };
  const box = {
    background: "#fff", borderRadius: 14, padding: "28px 32px",
    width: "100%", maxWidth: 460, boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
  };

  return (
    <div style={overlay}>
      <div style={box}>
        <h3 style={{ margin: "0 0 6px", color: "#111827" }}>🔐 Asignar roles</h3>
        <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: "0.9rem" }}>
          {persona.nombres} — usuario: <strong>{persona.usuario?.userName}</strong>
        </p>

        {todosLosRoles.length === 0 && !msg && (
          <p style={{ color: "#9ca3af" }}>Cargando roles...</p>
        )}

        {todosLosRoles.map(rol => {
          const activo = rolesActivos.has(rol.rolId);
          return (
            <label key={rol.rolId}
              style={{ display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 8, marginBottom: 8,
                background: activo ? "#f0fdf4" : "#f9fafb",
                border: `1px solid ${activo ? "#86efac" : "#e5e7eb"}`,
                cursor: loading ? "not-allowed" : "pointer", userSelect: "none",
              }}>
              <input
                type="checkbox"
                checked={activo}
                disabled={loading}
                onChange={() => toggleRol(rol.rolId)}
                style={{ width: 18, height: 18, cursor: "pointer" }}
              />
              <div>
                <div style={{ fontWeight: 600, color: "#111827" }}>{rol.nombre}</div>
                {rol.descripcion && (
                  <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{rol.descripcion}</div>
                )}
              </div>
              {activo && <span style={{ marginLeft: "auto", color: "#16a34a", fontWeight: 700 }}>✓</span>}
            </label>
          );
        })}

        {msg && <p style={{ color: "#dc2626", fontSize: "0.88rem", marginTop: 8 }}>{msg}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={onClose}
            style={{ padding: "9px 24px", borderRadius: 8, border: "none",
              background: "#4c7318", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}