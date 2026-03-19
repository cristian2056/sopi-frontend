// src/pages/Seguridad/usuariosColumnas.jsx
// Column definitions and badge helpers for UsuariosPage
import React from "react";

export const makeColumnas = (roles) => [
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
    key: "activo", label: "Estado", ancho: 110,
    render: (p) => p.usuario
      ? <span style={{
          background: p.usuario.activo ? "#dcfce7" : "#fee2e2",
          color: p.usuario.activo ? "#16a34a" : "#dc2626",
          borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.82rem",
        }}>
          {p.usuario.activo ? "Activo" : "Inactivo"}
        </span>
      : <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.82rem" }}>
          ⚠️ Sin usuario
        </span>,
  },
];
