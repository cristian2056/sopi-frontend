// src/pages/Personal/personalColumnas.jsx
// Column definitions for PersonalPage table
import React from "react";

export const columnas = [
  { key: "personaId",  label: "ID",        ancho: 70,  render: (p) => `#${p.personaId}` },
  { key: "nombre",     label: "Nombre",    ancho: 220, render: (p) => `${p.nombres} ${p.apellidosPaterno} ${p.apellidosMaterno}` },
  { key: "documento",  label: "Documento", ancho: 140, render: (p) => `${p.tipoDocumento}: ${p.numeroDocumento}` },
  { key: "email",      label: "Email",     ancho: 200 },
  { key: "usuario",    label: "Usuario",   ancho: 120,
    render: (p) => p.usuario
      ? <span style={{ background: "#dcfce7", color: "#16a34a", borderRadius: 20,
          padding: "2px 10px", fontWeight: 600, fontSize: "0.82rem" }}>
          {p.usuario.userName}
        </span>
      : <span style={{ color: "#9ca3af", fontSize: "0.82rem" }}>Sin usuario</span>
  },
];
