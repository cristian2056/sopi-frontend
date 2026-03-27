// src/Componentes_react/ui/HistorialAuditoria.jsx
// Componente reutilizable: modal de timeline de cambios para cualquier registro.
// Uso:
//   <HistorialAuditoria tabla="equipo" registroId="123" open={open} onClose={() => setOpen(false)} />
import React, { useEffect, useState } from "react";
import { auditoriaApi } from "../../api/auditoria.api";

const OP_STYLE = {
  ADDED:    { bg: "#dcfce7", color: "#16a34a", label: "AÑADIDO"  },
  MODIFIED: { bg: "#dbeafe", color: "#1d4ed8", label: "EDITADO"  },
  DELETED:  { bg: "#fee2e2", color: "#dc2626", label: "ELIMINADO" },
};

function formatFecha(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-PE", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function HistorialAuditoria({ tabla, registroId, open, onClose }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!open || !tabla || !registroId) return;
    setLoading(true);
    setError(null);
    auditoriaApi.listar({ tabla, registroId: String(registroId), limite: 200 })
      .then(data => {
        const lista = Array.isArray(data) ? data : (data?.datos ?? []);
        setItems([...lista].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      })
      .catch(e => setError(e.message || "No se pudo cargar el historial."))
      .finally(() => setLoading(false));
  }, [open, tabla, registroId]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 620, maxHeight: "88vh",
          background: "rgba(255,255,255,0.97)",
          borderRadius: 18, boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "18px 22px", borderBottom: "1.5px solid rgba(0,0,0,0.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(135deg, rgba(76,115,24,0.06), rgba(37,99,235,0.04))",
        }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: "1.05rem", color: "#1a3a0a" }}>
              📜 Historial de cambios
            </h3>
            <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 3 }}>
              Tabla: <strong>{tabla}</strong> · ID: <strong>#{registroId}</strong>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "1.3rem", color: "#6b7280", lineHeight: 1,
            padding: "4px 8px", borderRadius: 8,
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
                width: 32, height: 32, margin: "0 auto 12px",
                borderRadius: "50%", border: "3px solid rgba(76,115,24,0.15)",
                borderTopColor: "#4c7318", animation: "spin 0.7s linear infinite",
              }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ color: "#6b7280", fontSize: "0.87rem" }}>Cargando historial…</div>
            </div>
          )}

          {error && (
            <div style={{
              padding: "14px 18px", borderRadius: 10,
              background: "#fee2e2", color: "#dc2626",
              border: "1px solid #fca5a5", fontSize: "0.88rem",
            }}>
              ❌ {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: "0.9rem" }}>
              No hay registros de auditoría para este elemento.
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div style={{ position: "relative" }}>
              {/* Línea vertical */}
              <div style={{
                position: "absolute", left: 19, top: 0, bottom: 0,
                width: 2, background: "rgba(0,0,0,0.07)", borderRadius: 2,
              }} />

              {items.map((item, i) => {
                const op = OP_STYLE[item.accion?.toUpperCase()] ?? { bg: "#f3f4f6", color: "#6b7280", label: item.accion };
                return (
                  <div key={item.auditoriaId ?? i} style={{
                    display: "flex", gap: 16, marginBottom: 18, position: "relative",
                  }}>
                    {/* Badge operación */}
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                      background: op.bg, color: op.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.02em",
                      border: `2px solid ${op.color}33`,
                      zIndex: 1,
                    }}>
                      {op.label.substring(0, 3)}
                    </div>

                    {/* Contenido */}
                    <div style={{
                      flex: 1, background: "#f9fafb",
                      border: "1px solid rgba(0,0,0,0.07)",
                      borderLeft: `3px solid ${op.color}`,
                      borderRadius: "0 10px 10px 0",
                      padding: "10px 14px",
                    }}>
                      {/* Fila superior */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1f2937" }}>
                          {item.usuarioNombre || "Sistema"}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                          {formatFecha(item.fecha)}
                        </span>
                      </div>

                      {/* Cambios: parsear valoresAnteriores / valoresNuevos */}
                      {(() => {
                        const parseJ = s => { try { return s ? JSON.parse(s) : {}; } catch { return {}; } };
                        const antes   = parseJ(item.valoresAnteriores);
                        const despues = parseJ(item.valoresNuevos);
                        const keys = [...new Set([...Object.keys(antes), ...Object.keys(despues)])];
                        if (keys.length === 0) return null;
                        return (
                          <div style={{ marginTop: 8 }}>
                            {keys.map(k => (
                              <div key={k} style={{ marginBottom: 6, padding: "7px 10px", background: "#fff", borderRadius: 6, border: "1px solid #e5e7eb" }}>
                                <div style={{ fontSize: "0.74rem", color: "#6b7280", marginBottom: 4, fontWeight: 600 }}>
                                  Campo: <span style={{ color: "#374151" }}>{k}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                  {antes[k] != null && (
                                    <span style={{ padding: "2px 8px", borderRadius: 5, background: "#ffebee", color: "#c62828", fontFamily: "monospace", fontSize: "0.81rem", textDecoration: despues[k] != null ? "line-through" : "none" }}>
                                      {String(antes[k]) || "(vacío)"}
                                    </span>
                                  )}
                                  {antes[k] != null && despues[k] != null && (
                                    <span style={{ color: "#9ca3af", fontSize: "1rem" }}>→</span>
                                  )}
                                  {despues[k] != null && (
                                    <span style={{ padding: "2px 8px", borderRadius: 5, background: "#e8f5e9", color: "#2e7d32", fontFamily: "monospace", fontSize: "0.81rem", fontWeight: 700 }}>
                                      {String(despues[k]) || "(vacío)"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Detalles */}
                      {item.detalles && (
                        <div style={{
                          marginTop: 7, fontSize: "0.8rem", color: "#6b7280",
                          fontStyle: "italic", padding: "6px 8px",
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
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 22px",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            {items.length} registro{items.length !== 1 ? "s" : ""}
          </span>
          <button onClick={onClose} style={{
            background: "rgba(76,115,24,0.1)", color: "#4c7318",
            border: "1.5px solid rgba(76,115,24,0.25)",
            borderRadius: 9, padding: "7px 20px",
            fontWeight: 700, fontSize: "0.86rem", cursor: "pointer",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(76,115,24,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(76,115,24,0.1)"}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
