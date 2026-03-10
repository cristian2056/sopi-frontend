// src/components/ui/CampoLectura.jsx
// Campo de solo lectura con etiqueta y valor.
// Se usa en vistas de detalle (TabInfoGeneral, PersonaDetalle, etc.)
// Si valor es null/undefined muestra "—".
import React from "react";

export default function CampoLectura({ label, valor }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 600, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{
        padding: "9px 12px",
        background: "#f9fafb",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        fontSize: "0.95rem",
        color: valor ? "#111827" : "#9ca3af",
      }}>
        {valor ?? "—"}
      </div>
    </div>
  );
}
