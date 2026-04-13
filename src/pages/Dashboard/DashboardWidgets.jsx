// src/pages/Dashboard/DashboardWidgets.jsx
// Componentes reutilizables del Dashboard — Spinner, KpiCard, tabla, badge, etc.
import { useState } from "react";

export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "3px solid rgba(76,115,24,0.15)",
        borderTopColor: "#4c7318",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function KpiCard({ icon, label, value, color, bg, border, sub, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: bg ?? "rgba(255,255,255,0.7)",
        border: `1.5px solid ${border ?? "rgba(100,151,25,0.18)"}`,
        borderRadius: 16, padding: "20px 22px",
        display: "flex", alignItems: "center", gap: 16,
        boxShadow: hover ? "0 8px 28px rgba(15,40,6,0.13)" : "0 2px 10px rgba(15,40,6,0.06)",
        transform: hover && onClick ? "translateY(-2px)" : "none",
        transition: "box-shadow 0.18s, transform 0.18s",
        cursor: onClick ? "pointer" : "default", minWidth: 0,
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        background: bg ?? "rgba(76,115,24,0.1)",
        border: `1px solid ${border ?? "rgba(76,115,24,0.18)"}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: "1.75rem", color: color ?? "#1a3a0a", lineHeight: 1 }}>
          {value ?? <span style={{ fontSize: "1rem", opacity: 0.5 }}>—</span>}
        </div>
        <div style={{ fontWeight: 600, fontSize: "0.82rem", color: color ?? "#4c7318", opacity: 0.85, marginTop: 3 }}>
          {label}
        </div>
        {sub && <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export function SeccionTitulo({ icon, title, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <h3 style={{ margin: 0, fontWeight: 800, fontSize: "0.97rem", color: "#1a3a0a", display: "flex", alignItems: "center", gap: 7 }}>
        {icon} {title}
      </h3>
      {action && (
        <button onClick={onAction} style={{
          background: "none", border: "none", color: "#4c7318", fontWeight: 700,
          fontSize: "0.8rem", cursor: "pointer", padding: "3px 8px", borderRadius: 6,
          transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(76,115,24,0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          {action} →
        </button>
      )}
    </div>
  );
}

const ESTADO_MAP = {
  ABIERTO:    { bg: "#dcfce7", color: "#16a34a" },
  EN_PROCESO: { bg: "#fef9c3", color: "#a16207" },
  CERRADO:    { bg: "#f3f4f6", color: "#6b7280" },
  PENDIENTE:  { bg: "#dbeafe", color: "#1d4ed8" },
  PREVENTIVO: { bg: "#dbeafe", color: "#1d4ed8" },
  CORRECTIVO: { bg: "#fee2e2", color: "#dc2626" },
  ACTIVO:     { bg: "#dcfce7", color: "#16a34a" },
  BAJA:       { bg: "#fee2e2", color: "#dc2626" },
};

export function EstadoBadge({ value }) {
  const s = ESTADO_MAP[(value ?? "").toUpperCase()] ?? { bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span style={{
      background: s.bg, color: s.color, borderRadius: 20,
      padding: "2px 9px", fontWeight: 700, fontSize: "0.74rem", whiteSpace: "nowrap",
    }}>
      {(value ?? "—").replace("_", " ")}
    </span>
  );
}

export function TablaSimple({ cols, rows, keyFn, emptyMsg, loading }) {
  if (loading) return <Spinner />;
  if (!rows?.length) return (
    <div style={{ textAlign: "center", padding: "24px 0", color: "#9ca3af", fontSize: "0.87rem" }}>
      {emptyMsg ?? "Sin registros."}
    </div>
  );
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
        <thead>
          <tr style={{ background: "rgba(76,115,24,0.07)", borderBottom: "1.5px solid rgba(76,115,24,0.12)" }}>
            {cols.map(c => (
              <th key={c.key} style={{ padding: "8px 14px", textAlign: "left", fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={keyFn ? keyFn(row) : i}
              style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", background: i % 2 === 0 ? "rgba(255,255,255,0.8)" : "rgba(248,250,248,0.8)" }}>
              {cols.map(c => (
                <td key={c.key} style={{ padding: "9px 14px", color: "#374151" }}>
                  {c.render ? c.render(row) : (row[c.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WelcomeBanner({ nombre, rol, color, bg, border, icon }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 18, padding: "20px 26px",
      background: bg ?? "linear-gradient(135deg, rgba(160,215,68,0.18), rgba(76,115,24,0.12))",
      border: `1.5px solid ${border ?? "rgba(100,151,25,0.22)"}`,
      borderRadius: 18, marginBottom: 24,
      boxShadow: "0 2px 14px rgba(15,40,6,0.07)",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 15, flexShrink: 0,
        background: "linear-gradient(135deg, #a0d744, #3e5b19)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem",
        boxShadow: "0 4px 16px rgba(76,115,24,0.3)",
      }}>
        {icon ?? "🖥️"}
      </div>
      <div>
        <h2 style={{ margin: "0 0 4px", fontWeight: 800, fontSize: "1.3rem", color: "#1a3a0a" }}>
          Bienvenido, {nombre}
        </h2>
        <p style={{ margin: 0, color: color ?? "#4c7318", fontSize: "0.9rem", fontWeight: 600 }}>
          {rol} · Sistema de Gestión de Parque Informático
        </p>
      </div>
    </div>
  );
}

// Botón de acceso rápido con hover propio
export function AccesoBtn({ icon, label, path, color, bg, border, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        padding: "16px 10px", borderRadius: 12,
        background: hover ? bg : "rgba(255,255,255,0.5)",
        border: `1.5px solid ${hover ? border : "rgba(0,0,0,0.07)"}`,
        cursor: "pointer", transition: "all 0.15s",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? `0 4px 16px ${bg}` : "none",
      }}>
      <span style={{ fontSize: "1.4rem" }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: "0.8rem", color: hover ? color : "#374151" }}>{label}</span>
    </button>
  );
}

export const CARD_STYLE = {
  background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)",
  border: "1.5px solid rgba(100,151,25,0.14)", borderRadius: 16,
  padding: "18px 20px", boxShadow: "0 2px 10px rgba(15,40,6,0.05)",
};
