// src/components/ui/EstadoBadge.jsx
// Badge de color para mostrar estados de equipos y componentes.
// Prop "tipo": "componente" (INSTALADO/RETIRADO/...) o "equipo" (ACTIVO/INACTIVO/...)
import React from "react";

const MAPA_COMPONENTE = {
  INSTALADO:     { bg: "#dcfce7", color: "#16a34a" },
  RETIRADO:      { bg: "#fee2e2", color: "#dc2626" },
  EN_REPARACION: { bg: "#fef9c3", color: "#ca8a04" },
  RESERVA:       { bg: "#e0e7ff", color: "#4338ca" },
};

const MAPA_EQUIPO = {
  ACTIVO:        { bg: "#dcfce7", color: "#16a34a" },
  INACTIVO:      { bg: "#f3f4f6", color: "#6b7280" },
  MANTENIMIENTO: { bg: "#fef9c3", color: "#ca8a04" },
  BAJA:          { bg: "#fee2e2", color: "#dc2626" },
};

const FALLBACK = { bg: "#f3f4f6", color: "#6b7280" };

export default function EstadoBadge({ estado, tipo = "componente" }) {
  const mapa = tipo === "equipo" ? MAPA_EQUIPO : MAPA_COMPONENTE;
  const s = mapa[estado?.toUpperCase()] ?? FALLBACK;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "2px 10px", borderRadius: 20,
      fontSize: "0.78rem", fontWeight: 700,
    }}>
      {estado ?? "—"}
    </span>
  );
}
