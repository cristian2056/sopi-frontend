// src/pages/Dashboard.jsx
import React from "react";
import { useSelector } from "react-redux";
import { selectUsuario } from "../stores/authSlice";

const MODULOS = [
  { label: "Equipos",          icon: "💻", color: "#4c7318", bg: "rgba(76,115,24,0.10)",   border: "rgba(76,115,24,0.20)"   },
  { label: "Tickets abiertos", icon: "🎫", color: "#2563eb", bg: "rgba(37,99,235,0.08)",   border: "rgba(37,99,235,0.18)"   },
  { label: "Mantenimientos",   icon: "🔧", color: "#d97706", bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.18)"   },
  { label: "Personal",         icon: "👥", color: "#7c3aed", bg: "rgba(124,58,237,0.08)",  border: "rgba(124,58,237,0.18)"  },
];

export default function Dashboard() {
  const usuario = useSelector(selectUsuario);
  const nombre  = usuario?.nombreCompleto ?? "Usuario";

  return (
    <div>
      {/* Bienvenida */}
      <div style={{
        display: "flex", alignItems: "center", gap: 18,
        padding: "20px 24px",
        background: "linear-gradient(135deg, rgba(160,215,68,0.18), rgba(76,115,24,0.12))",
        border: "1.5px solid rgba(100,151,25,0.22)",
        borderRadius: 16,
        marginBottom: 22,
        boxShadow: "0 2px 12px rgba(15,40,6,0.06)",
      }}>
        <div style={{
          width: 54, height: 54, borderRadius: 15, flexShrink: 0,
          background: "linear-gradient(135deg, #a0d744, #3e5b19)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem",
          boxShadow: "0 4px 16px rgba(76,115,24,0.35)",
        }}>
          🖥️
        </div>
        <div>
          <h2 style={{ margin: "0 0 4px", fontWeight: 800, fontSize: "1.35rem", color: "#1a3a0a" }}>
            Bienvenido, {nombre}
          </h2>
          <p style={{ margin: 0, color: "#4c7318", fontSize: "0.92rem", fontWeight: 600 }}>
            Sistema de Gestión de Parque Informático
          </p>
        </div>
      </div>

      {/* Cards de módulos */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))",
        gap: 14,
        marginBottom: 22,
      }}>
        {MODULOS.map(m => (
          <div key={m.label} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center", gap: 10, padding: "20px 14px",
            background: m.bg,
            border: `1.5px solid ${m.border}`,
            borderRadius: 14,
            boxShadow: "0 2px 10px rgba(15,40,6,0.06)",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 13,
              background: m.bg,
              border: `1px solid ${m.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.4rem",
            }}>
              {m.icon}
            </div>
            <span style={{ fontWeight: 700, color: m.color, fontSize: "0.91rem" }}>
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* Info */}
      <div style={{
        padding: "18px 22px",
        background: "rgba(255,255,255,0.6)",
        border: "1px solid rgba(100,151,25,0.15)",
        borderRadius: 14,
        color: "#374151",
      }}>
        <h3 style={{ margin: "0 0 10px", fontWeight: 800, color: "#1a3a0a", fontSize: "0.96rem" }}>
          ℹ️ Información del sistema
        </h3>
        <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.65 }}>
          Usa el menú lateral para navegar entre los módulos del sistema.
          Desde aquí podrás gestionar equipos, tickets de soporte, mantenimientos,
          personal, proveedores y más.
        </p>
      </div>
    </div>
  );
}
