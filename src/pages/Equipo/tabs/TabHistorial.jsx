// src/pages/Equipo/tabs/TabHistorial.jsx
import React, { useEffect, useState } from "react";
import { auditoriaApi } from "../../../api/auditoria.api";

const OP_STYLE = {
  ADDED:    { bg: "#dcfce7", color: "#16a34a", label: "AÑADIDO"   },
  MODIFIED: { bg: "#dbeafe", color: "#1d4ed8", label: "EDITADO"   },
  DELETED:  { bg: "#fee2e2", color: "#dc2626", label: "ELIMINADO" },
};

function formatFecha(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-PE", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function parseJson(str) {
  try { return str ? JSON.parse(str) : {}; } catch { return {}; }
}

function CambiosDetalle({ valoresAnteriores, valoresNuevos }) {
  const antes   = parseJson(valoresAnteriores);
  const despues = parseJson(valoresNuevos);
  const keys = [...new Set([...Object.keys(antes), ...Object.keys(despues)])];
  if (keys.length === 0) return null;

  return (
    <div style={{ marginTop: 8 }}>
      {keys.map(k => (
        <div key={k} style={{
          marginBottom: 6, padding: "7px 10px",
          background: "#fff", borderRadius: 6, border: "1px solid #e5e7eb",
        }}>
          <div style={{ fontSize: "0.74rem", color: "#6b7280", marginBottom: 4, fontWeight: 600 }}>
            Campo: <span style={{ color: "#374151" }}>{k}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {antes[k] != null && (
              <span style={{
                padding: "2px 8px", borderRadius: 5,
                background: "#ffebee", color: "#c62828",
                fontFamily: "monospace", fontSize: "0.81rem",
                textDecoration: despues[k] != null ? "line-through" : "none",
              }}>
                {String(antes[k]) || "(vacío)"}
              </span>
            )}
            {antes[k] != null && despues[k] != null && (
              <span style={{ color: "#9ca3af", fontSize: "1rem" }}>→</span>
            )}
            {despues[k] != null && (
              <span style={{
                padding: "2px 8px", borderRadius: 5,
                background: "#e8f5e9", color: "#2e7d32",
                fontFamily: "monospace", fontSize: "0.81rem", fontWeight: 700,
              }}>
                {String(despues[k]) || "(vacío)"}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TabHistorial({ equipoId }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    auditoriaApi.listar({ tabla: "equipo", registroId: String(equipoId), limite: 200 })
      .then(data => setItems(Array.isArray(data) ? data : (data?.datos ?? [])))
      .catch(e => setError(e.message || "No se pudo cargar el historial."))
      .finally(() => setLoading(false));
  }, [equipoId]);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0" }}>
      <div style={{
        width: 32, height: 32,
        borderRadius: "50%",
        border: "3px solid rgba(76,115,24,0.15)",
        borderTopColor: "#4c7318",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ marginTop: 12, color: "#6b7280", fontSize: "0.87rem" }}>Cargando historial…</div>
    </div>
  );

  if (error) return (
    <div style={{ padding: "14px 18px", borderRadius: 10, background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", fontSize: "0.88rem" }}>
      ❌ {error}
    </div>
  );

  if (items.length === 0) return (
    <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: "0.9rem" }}>
      No hay registros de auditoría para este equipo.
    </div>
  );

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#1a3a0a", marginBottom: 20 }}>
        📜 Historial de cambios · {items.length} registro{items.length !== 1 ? "s" : ""}
      </div>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* Línea vertical */}
        <div style={{
          position: "absolute", left: 19, top: 0, bottom: 0,
          width: 2, background: "rgba(0,0,0,0.07)", borderRadius: 2,
        }} />

        {items.map((item, i) => {
          const op = OP_STYLE[item.accion?.toUpperCase()] ?? { bg: "#f3f4f6", color: "#6b7280", label: item.accion };
          return (
            <div key={item.auditoriaId ?? i} style={{ display: "flex", gap: 16, marginBottom: 20, position: "relative" }}>

              {/* Círculo de operación */}
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: op.bg, color: op.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.02em",
                border: `2px solid ${op.color}33`,
                zIndex: 1,
              }}>
                {op.label.substring(0, 3)}
              </div>

              {/* Contenido */}
              <div style={{
                flex: 1,
                background: "#f9fafb",
                border: "1px solid rgba(0,0,0,0.07)",
                borderLeft: `3px solid ${op.color}`,
                borderRadius: "0 10px 10px 0",
                padding: "10px 14px",
              }}>
                {/* Cabecera */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1f2937" }}>
                    {item.usuarioNombre || "Sistema"}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    {formatFecha(item.fecha)}
                  </span>
                </div>

                {/* Cambios */}
                <CambiosDetalle
                  valoresAnteriores={item.valoresAnteriores}
                  valoresNuevos={item.valoresNuevos}
                />

                {/* Detalles */}
                {item.detalles && (
                  <div style={{
                    marginTop: 7, fontSize: "0.8rem", color: "#6b7280",
                    fontStyle: "italic", padding: "5px 8px",
                    background: "#fffbeb", borderLeft: "3px solid #fbbf24",
                    borderRadius: "0 4px 4px 0",
                  }}>
                    {item.detalles}
                  </div>
                )}

                {/* IP */}
                {item.direccionIp && (
                  <div style={{ marginTop: 5, fontSize: "0.72rem", color: "#9ca3af" }}>
                    IP: {item.direccionIp}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
