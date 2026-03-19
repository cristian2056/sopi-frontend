// src/components/ui/FormBotones.jsx
// Botones Cancelar / Guardar estándar para todos los formularios.
// Props:
//   onCancelar  → función al hacer clic en Cancelar
//   loading     → deshabilita el botón guardar y muestra "Guardando..."
//   textoGuardar → texto del botón guardar (default: "Guardar")
import React from "react";
import { PRIMARY, PRIMARY_DISABLED } from "./formStyles";

export default function FormBotones({ onCancelar, loading, textoGuardar = "Guardar" }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button
        type="button"
        onClick={onCancelar}
        style={{
          flex: 1, padding: "9px 0", borderRadius: 8,
          border: "1.5px solid #d1d5db", background: "#fff",
          fontWeight: 600, fontSize: "0.93rem", cursor: "pointer", color: "#374151",
        }}
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={loading}
        style={{
          flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
          background: loading ? PRIMARY_DISABLED : PRIMARY,
          color: "#fff", fontWeight: 700, fontSize: "0.93rem",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Guardando..." : textoGuardar}
      </button>
    </div>
  );
}
