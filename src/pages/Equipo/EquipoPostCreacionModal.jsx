// src/pages/Equipo/EquipoPostCreacionModal.jsx
// Modal que aparece después de crear un equipo nuevo.
// Tiene tabs: Componentes | Software | Red | Fotos | Asignación

import React, { useState } from "react";
import TabComponentes from "./tabs/TabComponentes";
import TabSoftware    from "./tabs/TabSoftware";
import TabRed         from "./tabs/TabRed";
import TabFotos       from "./tabs/TabFotos.jsx";
import TabAsignacion  from "./tabs/TabAsignacion";

const TABS = [
  { key: "componentes", label: "🔧 Componentes" },
  { key: "software",    label: "💿 Software"    },
  { key: "red",         label: "🌐 Red"         },
  { key: "fotos",       label: "📷 Fotos"       },
  { key: "asignacion",  label: "👤 Asignación"  },
];

const COLOR = { primary: "#4c7318", primaryHover: "#3e5b19" };

export default function EquipoPostCreacionModal({ equipo, onCerrar }) {
  const [tabActiva, setTabActiva] = useState("componentes");

  if (!equipo) return null;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 4000, padding: "24px 16px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        width: "100%", maxWidth: 780,
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 16px 56px rgba(0,0,0,0.25)",
        border: "2px solid #e5e7eb",
      }}>

        {/* Header */}
        <div style={{
          padding: "20px 28px 0",
          borderBottom: "1px solid #e5e7eb",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "1.15rem", fontWeight: 800, color: "#232946" }}>
                ✅ Equipo creado correctamente
              </h3>
              <p style={{ margin: "0 0 14px", color: "#6b7280", fontSize: "0.88rem" }}>
                Ahora puedes agregar información adicional al equipo{" "}
                <strong style={{ color: "#4c7318" }}>
                  {equipo.nombre ?? equipo.codigoPatrimonial}
                </strong>
                . Todo esto es opcional — puedes hacerlo después desde el detalle.
              </p>
            </div>
            <button
              onClick={onCerrar}
              title="Cerrar"
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "1.4rem", color: "#9ca3af", lineHeight: 1,
                marginLeft: 12, padding: 0, flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => setTabActiva(tab.key)}
                style={{
                  padding: "10px 16px", border: "none", background: "none",
                  cursor: "pointer", whiteSpace: "nowrap",
                  borderBottom: tabActiva === tab.key ? "3px solid #4c7318" : "3px solid transparent",
                  fontWeight: tabActiva === tab.key ? 700 : 500,
                  color: tabActiva === tab.key ? "#4c7318" : "#6b7280",
                  fontSize: "0.9rem", marginBottom: -1,
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido tab */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
          {tabActiva === "componentes" && <TabComponentes equipoId={equipo.equipoId} modoModal />}
          {tabActiva === "software"    && <TabSoftware    equipoId={equipo.equipoId} modoModal />}
          {tabActiva === "red"         && <TabRed         equipoId={equipo.equipoId} modoModal />}
          {tabActiva === "fotos"       && <TabFotos       equipoId={equipo.equipoId} modoModal />}
          {tabActiva === "asignacion"  && <TabAsignacion  equipoId={equipo.equipoId} modoModal />}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 28px", borderTop: "1px solid #e5e7eb",
          display: "flex", justifyContent: "flex-end",
        }}>
          <button onClick={onCerrar}
            style={{
              padding: "9px 28px", borderRadius: 9, border: "none",
              background: COLOR.primary, color: "#fff",
              fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
            }}
            onMouseEnter={e => e.currentTarget.style.background = COLOR.primaryHover}
            onMouseLeave={e => e.currentTarget.style.background = COLOR.primary}
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}