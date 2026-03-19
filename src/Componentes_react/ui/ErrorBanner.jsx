// src/components/ui/ErrorBanner.jsx
// Banner rojo para mostrar mensajes de error. No renderiza nada si no hay mensaje.
import React from "react";

export default function ErrorBanner({ mensaje }) {
  if (!mensaje) return null;
  return (
    <div style={{
      color: "#dc2626", background: "#fee2e2",
      padding: "8px 14px", borderRadius: 8,
      marginBottom: 14, fontSize: "0.9rem",
    }}>
      {mensaje}
    </div>
  );
}
