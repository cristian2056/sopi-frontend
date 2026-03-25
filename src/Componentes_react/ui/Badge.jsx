// ui/Badge.jsx — Badges unificados para estados y prioridades

const PRIORIDAD_MAP = {
  urgente: { bg: "#fee2e2", color: "#7f1d1d" },
  alta:    { bg: "#fed7aa", color: "#9a3412" },
  media:   { bg: "#fef9c3", color: "#a16207" },
  baja:    { bg: "#dcfce7", color: "#15803d" },
};

const ESTADO_TICKET_MAP = {
  abierto:    { bg: "#dbeafe", color: "#1d4ed8" },
  en_proceso: { bg: "#fef9c3", color: "#a16207" },
  cerrado:    { bg: "#f3f4f6", color: "#6b7280" },
};

const ESTADO_COMPONENTE_MAP = {
  INSTALADO:     { bg: "#dcfce7", color: "#16a34a" },
  RETIRADO:      { bg: "#fee2e2", color: "#dc2626" },
  EN_REPARACION: { bg: "#fef9c3", color: "#ca8a04" },
  RESERVA:       { bg: "#e0e7ff", color: "#4338ca" },
};

const ESTADO_EQUIPO_MAP = {
  ACTIVO:        { bg: "#dcfce7", color: "#16a34a" },
  INACTIVO:      { bg: "#f3f4f6", color: "#6b7280" },
  MANTENIMIENTO: { bg: "#fef9c3", color: "#ca8a04" },
  BAJA:          { bg: "#fee2e2", color: "#dc2626" },
};

const FALLBACK = { bg: "#f3f4f6", color: "#6b7280" };
const base = { borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.8rem" };

export function BadgePrioridad({ value }) {
  const s = PRIORIDAD_MAP[value?.toLowerCase()] ?? FALLBACK;
  return <span style={{ ...base, background: s.bg, color: s.color }}>{value ?? "—"}</span>;
}

export function BadgeEstadoTicket({ value }) {
  const s = ESTADO_TICKET_MAP[value?.toLowerCase()] ?? FALLBACK;
  return <span style={{ ...base, background: s.bg, color: s.color }}>{value?.replace("_", " ") ?? "—"}</span>;
}

// Mantiene nombre BadgeEstado para compatibilidad con imports existentes de TicketBadges
export { BadgeEstadoTicket as BadgeEstado };

export default function EstadoBadge({ estado, tipo = "componente" }) {
  const mapa = tipo === "equipo" ? ESTADO_EQUIPO_MAP : ESTADO_COMPONENTE_MAP;
  const s = mapa[estado?.toUpperCase()] ?? FALLBACK;
  return (
    <span style={{ ...base, background: s.bg, color: s.color, fontSize: "0.78rem" }}>
      {estado ?? "—"}
    </span>
  );
}
