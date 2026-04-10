// src/pages/Seguridad/usuariosColumnas.jsx
import React from "react";

export const makeColumnas = (roles, onToggle) => [
  {
    key: "nombre", label: "Nombre completo", ancho: 220,
    render: (p) => `${p.nombres} ${p.apellidosPaterno} ${p.apellidosMaterno}`,
  },
  {
    key: "documento", label: "Documento", ancho: 140,
    render: (p) => `${p.tipoDocumento}: ${p.numeroDocumento}`,
  },
  {
    key: "userName", label: "Usuario", ancho: 130,
    render: (p) => p.usuario
      ? <span style={{ background: "#e0e7ff", color: "#4338ca", borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.82rem" }}>
          @{p.usuario.userName}
        </span>
      : <span style={{ color: "#d1d5db", fontSize: "0.82rem" }}>Sin usuario</span>,
  },
  {
    key: "rol", label: "Rol", ancho: 150,
    render: (p) => {
      const rolNombre = roles.find(r => r.rolId === p.usuario?.rolId)?.nombre;
      return rolNombre
        ? <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.82rem" }}>
            {rolNombre}
          </span>
        : <span style={{ color: "#d1d5db", fontSize: "0.82rem" }}>Sin rol</span>;
    },
  },
  {
    key: "activo", label: "Estado", ancho: 160,
    render: (p) => {
      if (!p.usuario) return (
        <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.82rem" }}>
          ⚠️ Sin usuario
        </span>
      );
      const activo = p.usuario.activo;
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            background: activo ? "#dcfce7" : "#fee2e2",
            color: activo ? "#16a34a" : "#dc2626",
            borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.82rem",
          }}>
            {activo ? "Activo" : "Inactivo"}
          </span>
          {onToggle && (
            <button
              title={activo ? "Inhabilitar usuario" : "Habilitar usuario"}
              onClick={() => onToggle(p)}
              style={{
                border: "none", background: "none", cursor: "pointer",
                fontSize: "1rem", padding: "2px 4px", borderRadius: 6,
                color: activo ? "#dc2626" : "#16a34a",
              }}
            >
              {activo ? "🚫" : "✅"}
            </button>
          )}
        </div>
      );
    },
  },
];
