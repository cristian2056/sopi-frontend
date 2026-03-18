const PRIORIDAD_MAP = {
  urgente: { bg: "#fee2e2", color: "#7f1d1d" },
  alta:    { bg: "#fed7aa", color: "#9a3412" },
  media:   { bg: "#fef9c3", color: "#a16207" },
  baja:    { bg: "#dcfce7", color: "#15803d" },
};

const ESTADO_MAP = {
  abierto:    { bg: "#dbeafe", color: "#1d4ed8" },
  en_proceso: { bg: "#fef9c3", color: "#a16207" },
  cerrado:    { bg: "#f3f4f6", color: "#6b7280" },
};

const S = { borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.8rem" };

export function BadgePrioridad({ value }) {
  const s = PRIORIDAD_MAP[value?.toLowerCase()] ?? { bg: "#f3f4f6", color: "#6b7280" };
  return <span style={{ ...S, background: s.bg, color: s.color }}>{value ?? "—"}</span>;
}

export function BadgeEstado({ value }) {
  const s = ESTADO_MAP[value?.toLowerCase()] ?? { bg: "#f3f4f6", color: "#6b7280" };
  return <span style={{ ...S, background: s.bg, color: s.color }}>{value?.replace("_", " ") ?? "—"}</span>;
}
