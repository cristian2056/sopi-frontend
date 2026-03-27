// src/pages/Auditoria/AuditoriaPage.jsx
import React, { useState, useCallback } from "react";
import { auditoriaApi }      from "../../api/auditoria.api";
import DataTable             from "../../Componentes_react/ui/DataTable";
import ErrorBanner           from "../../Componentes_react/ui/ErrorBanner";
import HistorialAuditoria    from "../../Componentes_react/ui/HistorialAuditoria";

const OPERACIONES    = ["MODIFIED", "ADDED", "DELETED"];
const TABLAS_COMUNES = [
  "equipo", "marca", "proveedor", "dependencia", "componente",
  "software", "usuario", "persona", "ticket", "mantenimiento",
];


const OP_STYLE = {
  ADDED:    { bg: "#dcfce7", color: "#16a34a" },
  MODIFIED: { bg: "#dbeafe", color: "#1d4ed8" },
  DELETED:  { bg: "#fee2e2", color: "#dc2626" },
};

function OpBadge({ accion }) {
  const s = OP_STYLE[accion?.toUpperCase()] ?? { bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>
      {accion ?? "—"}
    </span>
  );
}

function formatFecha(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-PE", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function countCambios(row) {
  const parse = s => { try { return s ? JSON.parse(s) : {}; } catch { return {}; } };
  return new Set([...Object.keys(parse(row.valoresAnteriores)), ...Object.keys(parse(row.valoresNuevos))]).size;
}

const INPUT_ST = { padding: "8px 12px", borderRadius: 9, fontSize: "0.88rem", border: "1.5px solid #d1d5db", background: "#fff", outline: "none", width: "100%", boxSizing: "border-box" };

function FiltroField({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const COLUMNAS = [
  { key: "fecha",         label: "Fecha/Hora", ancho: 155, render: r => formatFecha(r.fecha) },
  { key: "usuarioNombre", label: "Usuario",     ancho: 130, render: r => r.usuarioNombre || "Sistema" },
  { key: "tabla",         label: "Tabla",       ancho: 110, render: r => (
    <span style={{ background: "rgba(76,115,24,0.08)", color: "#4c7318", borderRadius: 6, padding: "2px 8px", fontWeight: 700, fontSize: "0.78rem" }}>
      {r.tabla ?? "—"}
    </span>
  )},
  { key: "registroId", label: "ID Reg.", ancho: 80,  render: r => <span style={{ fontFamily: "monospace", color: "#6b7280" }}>#{r.registroId}</span> },
  { key: "accion",     label: "Acción",  ancho: 110, render: r => <OpBadge accion={r.accion} /> },
  { key: "cambios",    label: "Campos",  ancho: 90,  render: r => {
    const n = countCambios(r);
    return n > 0
      ? <span style={{ color: "#4c7318", fontWeight: 700 }}>{n} campo{n !== 1 ? "s" : ""}</span>
      : <span style={{ color: "#9ca3af" }}>—</span>;
  }},
];

export default function AuditoriaPage() {
  const [filtro,     setFiltro]     = useState({ limite: 100 });
  const [resultados, setResultados] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [buscado,    setBuscado]    = useState(false);
  const [error,      setError]      = useState(null);
  const [historial,  setHistorial]  = useState(null); // { tabla, registroId }

  const set = (key, val) => setFiltro(p => ({ ...p, [key]: val || undefined }));

  const buscar = useCallback(async () => {
    setLoading(true); setError(null); setBuscado(false);
    try {
      const payload = Object.fromEntries(
        Object.entries(filtro).filter(([, v]) => v !== "" && v !== undefined)
      );
      const data = await auditoriaApi.listar(payload);
      setResultados(Array.isArray(data) ? data : (data?.datos ?? []));
      setBuscado(true);
    } catch (e) {
      setError(e.message || "Error al buscar auditorías.");
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  const limpiar = () => {
    setFiltro({ limite: 100 }); setResultados([]); setBuscado(false); setError(null);
  };

  return (
    <div style={{ width: "100%", maxWidth: 1200 }}>
      <div className="page-toolbar"><h2>📋 Auditoría del Sistema</h2></div>

      {/* Panel de filtros */}
      <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(76,115,24,0.15)", borderRadius: 16, padding: "20px 22px", marginBottom: 22, boxShadow: "0 2px 10px rgba(15,40,6,0.05)" }}>
        <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#1a3a0a", marginBottom: 16 }}>🔍 Filtros de búsqueda</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12, marginBottom: 16 }}>
          <FiltroField label="Tabla afectada">
            <input list="tablas-list" value={filtro.tabla ?? ""} onChange={e => set("tabla", e.target.value)} placeholder="ej: equipo, marca…" style={INPUT_ST} />
            <datalist id="tablas-list">{TABLAS_COMUNES.map(t => <option key={t} value={t} />)}</datalist>
          </FiltroField>

          <FiltroField label="ID del registro">
            <input type="text" value={filtro.registroId ?? ""} onChange={e => set("registroId", e.target.value)} placeholder="ej: 123" style={INPUT_ST} />
          </FiltroField>

          <FiltroField label="Acción">
            <select value={filtro.accion ?? ""} onChange={e => set("accion", e.target.value)} style={{ ...INPUT_ST, cursor: "pointer" }}>
              <option value="">Todas</option>
              {OPERACIONES.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
          </FiltroField>

          <FiltroField label="ID de usuario">
            <input type="number" min="1" value={filtro.usuarioId ?? ""} onChange={e => set("usuarioId", e.target.value ? Number(e.target.value) : undefined)} placeholder="ej: 5" style={INPUT_ST} />
          </FiltroField>

          <FiltroField label="Desde">
            <input type="date" value={filtro.fechaDesde?.split("T")[0] ?? ""} onChange={e => set("fechaDesde", e.target.value ? `${e.target.value}T00:00:00Z` : undefined)} style={INPUT_ST} />
          </FiltroField>

          <FiltroField label="Hasta">
            <input type="date" value={filtro.fechaHasta?.split("T")[0] ?? ""} onChange={e => set("fechaHasta", e.target.value ? `${e.target.value}T23:59:59Z` : undefined)} style={INPUT_ST} />
          </FiltroField>

          <FiltroField label="Límite de resultados">
            <select value={filtro.limite ?? 100} onChange={e => set("limite", Number(e.target.value))} style={{ ...INPUT_ST, cursor: "pointer" }}>
              {[25, 50, 100, 200, 500].map(n => <option key={n} value={n}>{n} registros</option>)}
            </select>
          </FiltroField>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={buscar} disabled={loading} className="btn-primary">
            {loading ? "🔍 Buscando…" : "🔍 Buscar"}
          </button>
          <button
            onClick={limpiar}
            disabled={loading}
            style={{ background: "rgba(0,0,0,0.05)", color: "#6b7280", border: "1.5px solid #d1d5db", borderRadius: 10, padding: "9px 20px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
          >
            Limpiar
          </button>
        </div>
      </div>

      <ErrorBanner mensaje={error} />

      {buscado && (
        <DataTable
          columnas={COLUMNAS}
          datos={resultados}
          keyField="auditoriaId"
          loading={loading}
          mostrarAcciones
          mensajeVacio="No se encontraron registros con los filtros aplicados."
          accionesExtra={row => (
            <button
              onClick={() => setHistorial({ tabla: row.tabla, registroId: row.registroId })}
              style={{ background: "rgba(76,115,24,0.1)", color: "#4c7318", border: "none", borderRadius: 7, padding: "4px 10px", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem" }}
            >
              Ver
            </button>
          )}
        />
      )}

      <HistorialAuditoria
        open={!!historial}
        tabla={historial?.tabla}
        registroId={historial?.registroId}
        onClose={() => setHistorial(null)}
      />
    </div>
  );
}
