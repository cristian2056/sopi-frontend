// src/pages/Equipo/wizard/PasoIndicador.jsx
import React from "react";
import { COLOR, PASOS } from "./wizardConstants";

export default function PasoIndicador({ pasoActual, pasoCompletado }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 0, padding: "0 8px", overflowX: "auto",
    }}>
      {PASOS.map((paso, i) => {
        const completado = paso.num < pasoActual || paso.num <= pasoCompletado;
        const activo     = paso.num === pasoActual;
        return (
          <React.Fragment key={paso.num}>
            {i > 0 && (
              <div style={{
                flex: 1, height: 2, minWidth: 16,
                background: completado ? COLOR.primary : "#e5e7eb",
                transition: "background 0.3s",
              }} />
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.78rem",
                background: activo ? COLOR.primary : completado ? "#dcfce7" : "#f3f4f6",
                color: activo ? "#fff" : completado ? COLOR.primary : "#9ca3af",
                border: activo ? `2px solid ${COLOR.primary}` : completado ? `2px solid ${COLOR.primary}` : "2px solid #e5e7eb",
                transition: "background 0.3s, border-color 0.3s, color 0.3s", flexShrink: 0,
              }}>
                {completado && !activo ? "✓" : paso.icon}
              </div>
              <span style={{
                fontSize: "0.65rem", fontWeight: activo ? 700 : 500,
                color: activo ? COLOR.primary : completado ? "#374151" : "#9ca3af",
                whiteSpace: "nowrap",
              }}>
                {paso.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
