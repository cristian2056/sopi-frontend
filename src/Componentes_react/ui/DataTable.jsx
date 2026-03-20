// src/components/ui/DataTable.jsx
// Tabla genérica reutilizable — estilo glassmorphism
import React, { useRef, useState, useCallback } from "react";

// ─── ESTILOS INLINE ────────────────────────────────────────────────────────────
const estilos = {
  wrapper: {
    width: "100%",
    overflowX: "auto",
    borderRadius: 14,
    background: "rgba(255,255,255,0.95)",
    border: "1.5px solid rgba(100,151,25,0.15)",
    boxShadow: "0 4px 20px rgba(15,40,6,0.10)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
    fontSize: "0.93rem",
  },
  th: {
    position: "relative",
    background: "rgba(160, 215, 68, 0.12)",
    borderBottom: "1.5px solid rgba(100,151,25,0.2)",
    padding: "12px 14px",
    textAlign: "left",
    fontWeight: 700,
    color: "#2d5a10",
    userSelect: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    fontSize: "0.85rem",
    letterSpacing: "0.03em",
    textTransform: "uppercase",
  },
  td: {
    padding: "11px 14px",
    borderBottom: "1px solid rgba(160,215,68,0.10)",
    color: "#374151",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  resizeHandle: {
    position: "absolute",
    right: 0, top: 0, bottom: 0,
    width: 5,
    cursor: "col-resize",
    background: "transparent",
    zIndex: 1,
  },
  resizeHandleHover: {
    background: "rgba(76,115,24,0.3)",
  },
  accionBtn: {
    border: "none",
    borderRadius: 8,
    padding: "5px 11px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "background 0.12s, transform 0.1s",
  },
  emptyRow: {
    textAlign: "center",
    padding: "40px 0",
    color: "#6b7280",
    fontSize: "0.93rem",
  },
  loadingRow: {
    textAlign: "center",
    padding: "40px 0",
    color: "#649719",
    fontSize: "0.93rem",
    fontWeight: 600,
  },
};

const EMPTY_ARRAY = [];

export default function DataTable({
  columnas = EMPTY_ARRAY,
  datos = EMPTY_ARRAY,
  loading = false,
  keyField = "id",
  onEdit,
  onDelete,
  accionesExtra = null,
  mostrarAcciones = true,
  mensajeVacio = "No hay datos registrados.",
}) {
  const [anchos, setAnchos] = useState(() =>
    Object.fromEntries(columnas.map((c) => [c.key, c.ancho ?? 150]))
  );
  const [hoveredHandle, setHoveredHandle] = useState(null);
  const [hoveredRow,    setHoveredRow]    = useState(null);
  const dragRef = useRef(null);
  const totalCols = columnas.length + (mostrarAcciones ? 1 : 0);

  const iniciarResize = useCallback((e, colKey) => {
    e.preventDefault();
    dragRef.current = { colKey, startX: e.clientX, startAncho: anchos[colKey] };
    const onMouseMove = (e) => {
      if (!dragRef.current) return;
      const delta = e.clientX - dragRef.current.startX;
      const nuevoAncho = Math.max(60, dragRef.current.startAncho + delta);
      setAnchos((prev) => ({ ...prev, [dragRef.current.colKey]: nuevoAncho }));
    };
    const onMouseUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [anchos]);

  return (
    <div style={estilos.wrapper}>
      <table style={estilos.table}>
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col.key} style={{ ...estilos.th, width: anchos[col.key] }}>
                {col.label}
                <div
                  style={{
                    ...estilos.resizeHandle,
                    ...(hoveredHandle === col.key ? estilos.resizeHandleHover : {}),
                  }}
                  onMouseEnter={() => setHoveredHandle(col.key)}
                  onMouseLeave={() => setHoveredHandle(null)}
                  onMouseDown={(e) => iniciarResize(e, col.key)}
                />
              </th>
            ))}
            {mostrarAcciones && (
              <th style={{ ...estilos.th, width: 110, textAlign: "center" }}>
                Acciones
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={totalCols} style={estilos.loadingRow}>
                ⏳ Cargando...
              </td>
            </tr>
          )}

          {!loading && datos.length === 0 && (
            <tr>
              <td colSpan={totalCols} style={estilos.emptyRow}>
                {mensajeVacio}
              </td>
            </tr>
          )}

          {!loading && datos.map((fila) => (
            <tr
              key={fila[keyField]}
              style={{
                transition: "background 0.15s",
                background: hoveredRow === fila[keyField]
                  ? "rgba(160,215,68,0.08)"
                  : "transparent",
              }}
              onMouseEnter={() => setHoveredRow(fila[keyField])}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {columnas.map((col) => (
                <td key={col.key} style={estilos.td} title={String(fila[col.key] ?? "")}>
                  {col.render ? col.render(fila) : (fila[col.key] ?? "—")}
                </td>
              ))}

              {mostrarAcciones && (
                <td style={{ ...estilos.td, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    {accionesExtra && accionesExtra(fila)}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(fila)}
                        title="Editar"
                        style={{ ...estilos.accionBtn, background: "rgba(37,99,235,0.10)", color: "#2563eb" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(37,99,235,0.18)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(37,99,235,0.10)"}
                      >
                        ✏️
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(fila)}
                        title="Eliminar"
                        style={{ ...estilos.accionBtn, background: "rgba(220,38,38,0.10)", color: "#dc2626" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,0.18)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(220,38,38,0.10)"}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
