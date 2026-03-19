// src/components/ui/ConfirmInline.jsx
// Confirmación de eliminación inline, se usa en todos los tabs y listas.
// Muestra "¿Eliminar? Sí / No" al lado del item.
import React from "react";

export default function ConfirmInline({ onConfirmar, onCancelar }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <span style={{ fontSize: "0.8rem", color: "#dc2626" }}>¿Eliminar?</span>
      <button
        onClick={onConfirmar}
        style={{
          padding: "4px 10px", borderRadius: 7, border: "none",
          background: "#dc2626", color: "#fff",
          cursor: "pointer", fontWeight: 700, fontSize: "0.82rem",
        }}
      >Sí</button>
      <button
        onClick={onCancelar}
        style={{
          padding: "4px 10px", borderRadius: 7,
          border: "1.5px solid #d1d5db", background: "#fff",
          cursor: "pointer", fontSize: "0.82rem",
        }}
      >No</button>
    </div>
  );
}
