// src/components/ui/DataTable.jsx
// Tabla genérica reutilizable para todas las páginas del sistema.
// Soporta: columnas configurables, redimensionado con mouse, búsqueda, loading, acciones.

import React, { useRef, useState, useCallback } from "react";

// ─── ESTILOS INLINE ────────────────────────────────────────────────────────────
const estilos = {
  wrapper: {
    width: "100%",
    overflowX: "auto",        // scroll horizontal si la tabla es muy ancha
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",     // necesario para que funcione el redimensionado
    fontSize: "0.95rem",
  },
  th: {
    position: "relative",     // para el handle de redimensionado
    background: "#f9fafb",
    borderBottom: "2px solid #e5e7eb",
    padding: "11px 14px",
    textAlign: "left",
    fontWeight: 700,
    color: "#374151",
    userSelect: "none",       // evita selección de texto al arrastrar
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  td: {
    padding: "10px 14px",
    borderBottom: "1px solid #f3f3f3",
    color: "#374151",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  // El "handle" es la línea vertical al borde derecho de cada columna
  // que el usuario arrastra para cambiar el ancho
  resizeHandle: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 5,
    cursor: "col-resize",
    background: "transparent",
    zIndex: 1,
  },
  resizeHandleHover: {
    background: "rgba(76,115,24,0.3)",  // lima-700 con transparencia
  },
  accionBtn: {
    border: "none",
    borderRadius: 7,
    padding: "6px 11px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  emptyRow: {
    textAlign: "center",
    padding: "32px 0",
    color: "#9ca3af",
  },
  loadingRow: {
    textAlign: "center",
    padding: "32px 0",
    color: "#6b7280",
  },
};

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
/**
 * DataTable — tabla genérica reutilizable
 *
 * Props:
 * @param {Array} columnas  - Definición de columnas. Cada columna puede tener:
 *                            { key, label, ancho?, render? }
 *                            - key: nombre del campo en el objeto de datos
 *                            - label: texto del encabezado
 *                            - ancho: ancho inicial en px (default 150)
 *                            - render: función opcional (fila) => JSX para celdas custom
 * @param {Array} datos     - Array de objetos a mostrar
 * @param {boolean} loading - true mientras carga los datos
 * @param {string} keyField - nombre del campo que actúa como ID único (default "id")
 * @param {Function} onEdit   - callback al clickear editar (recibe la fila)
 * @param {Function} onDelete - callback al clickear eliminar (recibe la fila)
 * @param {boolean} mostrarAcciones - si mostrar columna de acciones (default true)
 * @param {string} mensajeVacio - texto cuando no hay datos
 */
export default function DataTable({
  columnas = [],
  datos = [],
  loading = false,
  keyField = "id",
  onEdit,
  onDelete,
  accionesExtra = null,   // ← agregar esta línea
  mostrarAcciones = true,
  mensajeVacio = "No hay datos registrados.",
}) {
  // Estado: ancho de cada columna (inicializado con el ancho definido o 150px)
  const [anchos, setAnchos] = useState(() =>
    Object.fromEntries(columnas.map((c) => [c.key, c.ancho ?? 150]))
  );

  // Estado: qué handle está siendo hovereado
  const [hoveredHandle, setHoveredHandle] = useState(null);

  // Ref para guardar datos del drag activo
  const dragRef = useRef(null);

  // Total de columnas (para el colspan del loading/empty)
  const totalCols = columnas.length + (mostrarAcciones ? 1 : 0);

  // ── Lógica de redimensionado ──────────────────────────────────────────────
  // Cuando el usuario aprieta el mouse en el handle, guardamos la posición inicial
  // y el ancho actual. Después calculamos el delta en mousemove.
  const iniciarResize = useCallback((e, colKey) => {
    e.preventDefault();
    dragRef.current = {
      colKey,
      startX: e.clientX,
      startAncho: anchos[colKey],
    };

    const onMouseMove = (e) => {
      if (!dragRef.current) return;
      const delta = e.clientX - dragRef.current.startX;
      const nuevoAncho = Math.max(60, dragRef.current.startAncho + delta); // mínimo 60px
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={estilos.wrapper}>
      <table style={estilos.table}>

        {/* Cabecera */}
        <thead>
          <tr>
            {columnas.map((col) => (
              <th
                key={col.key}
                style={{ ...estilos.th, width: anchos[col.key] }}
              >
                {col.label}

                {/* Handle de redimensionado */}
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

            {/* Columna de acciones */}
            {mostrarAcciones && (
              <th style={{ ...estilos.th, width: 110, textAlign: "center" }}>
                Acciones
              </th>
            )}
          </tr>
        </thead>

        {/* Cuerpo */}
        <tbody>

          {/* Estado: cargando */}
          {loading && (
            <tr>
              <td colSpan={totalCols} style={estilos.loadingRow}>
                Cargando...
              </td>
            </tr>
          )}

          {/* Estado: sin datos */}
          {!loading && datos.length === 0 && (
            <tr>
              <td colSpan={totalCols} style={estilos.emptyRow}>
                {mensajeVacio}
              </td>
            </tr>
          )}

          {/* Filas de datos */}
          {!loading && datos.map((fila) => (
            <tr
              key={fila[keyField]}
              style={{ transition: "background 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
              onMouseLeave={(e) => e.currentTarget.style.background = ""}
            >
              {columnas.map((col) => (
                <td key={col.key} style={estilos.td} title={String(fila[col.key] ?? "")}>
                  {/* Si la columna tiene render custom lo usa, sino muestra el valor */}
                  {col.render ? col.render(fila) : (fila[col.key] ?? "—")}
                </td>
              ))}

              {/* Botones editar / eliminar */}
              {mostrarAcciones && (
                <td style={{ ...estilos.td, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    {accionesExtra && accionesExtra(fila)}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(fila)}
                        title="Editar"
                        style={{ ...estilos.accionBtn, background: "#eff6ff", color: "#2563eb" }}
                      >
                        ✏️
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(fila)}
                        title="Eliminar"
                        style={{ ...estilos.accionBtn, background: "#fff1f2", color: "#dc2626" }}
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