// src/pages/Equipo/tabs/TabComponentes.jsx
import React, { useEffect, useState } from "react";
import { componentesApi, composicionesApi } from "../../../api/componentes.api";
import { http } from "../../../services/http";

const ESTADOS_COMP = ["INSTALADO", "RETIRADO", "EN_REPARACION", "RESERVA"];

const inputStyle = {
  width: "100%", padding: "9px 11px", borderRadius: 8,
  border: "1.5px solid #d1d5db", fontSize: "0.93rem",
  boxSizing: "border-box", background: "#fff", color: "#111", outline: "none",
};
const labelStyle = {
  display: "block", fontWeight: 600, marginBottom: 5,
  color: "#374151", fontSize: "0.87rem",
};

const FORM_VACIO = {
  componenteId: "", marcaId: "", codigo: "", numeroSerie: "",
  especificaciones: "", estado: "INSTALADO",
  fechaInstalacion: "", fechaRetiro: "", motivoRetiro: "", fotoId: 1,
};

// ─── Formulario agregar / editar ───────────────────────────────────────────────
function FormComposicion({ equipoId, initial = FORM_VACIO, onGuardar, onCancelar, loading }) {
  const [form, setForm]               = useState(initial);
  const [componentes, setComponentes] = useState([]);
  const [marcas, setMarcas]           = useState([]);
  const [cargando, setCargando]       = useState(true);

  useEffect(() => {
    Promise.all([
      componentesApi.listar(),
      http("/api/Marcas"),
    ]).then(([rComp, rMarcas]) => {
      setComponentes(rComp.datos ?? []);
      setMarcas(rMarcas.datos   ?? []);
    }).catch(console.error)
      .finally(() => setCargando(false));
  }, []);

  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({
      equipoId:         parseInt(equipoId),
      componenteId:     parseInt(form.componenteId) || 0,
      marcaId:          form.marcaId ? parseInt(form.marcaId) : null,
      fotoId:           parseInt(form.fotoId) || 1,
      codigo:           form.codigo.trim()            || null,
      numeroSerie:      form.numeroSerie.trim()       || null,
      especificaciones: form.especificaciones.trim()  || null,
      estado:           form.estado,
      fechaInstalacion: form.fechaInstalacion || null,
      fechaRetiro:      form.fechaRetiro      || null,
      motivoRetiro:     form.motivoRetiro.trim() || null,
    });
  };

  if (cargando) return <div style={{ color: "#888", padding: "16px 0" }}>Cargando listas...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Componente <span style={{ color: "#ef4444" }}>*</span></label>
          <select value={form.componenteId} onChange={set("componenteId")} required
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">-- Seleccionar --</option>
            {componentes.map(c => (
              <option key={c.componenteId} value={c.componenteId}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Marca</label>
          <select value={form.marcaId} onChange={set("marcaId")}
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">-- Sin marca --</option>
            {marcas.map(m => (
              <option key={m.marcaId} value={m.marcaId}>{m.nombre}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Código</label>
          <input type="text" placeholder="Ej: CPU-001" value={form.codigo}
            onChange={set("codigo")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Nº de Serie</label>
          <input type="text" placeholder="Ej: SN123456" value={form.numeroSerie}
            onChange={set("numeroSerie")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Estado <span style={{ color: "#ef4444" }}>*</span></label>
          <select value={form.estado} onChange={set("estado")}
            style={{ ...inputStyle, cursor: "pointer" }}>
            {ESTADOS_COMP.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Fecha Instalación</label>
          <input type="date" value={form.fechaInstalacion}
            onChange={set("fechaInstalacion")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Fecha Retiro</label>
          <input type="date" value={form.fechaRetiro}
            onChange={set("fechaRetiro")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Motivo de Retiro</label>
          <input type="text" placeholder="Opcional" value={form.motivoRetiro}
            onChange={set("motivoRetiro")} style={inputStyle} />
        </div>

      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Especificaciones</label>
        <textarea placeholder="Ej: Intel Core i7 10ma gen, 3.8GHz..."
          value={form.especificaciones} onChange={set("especificaciones")}
          rows={2} style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" onClick={onCancelar}
          style={{
            flex: 1, padding: "9px 0", borderRadius: 8,
            border: "1.5px solid #d1d5db", background: "#fff",
            fontWeight: 600, fontSize: "0.93rem", cursor: "pointer", color: "#374151",
          }}>
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          style={{
            flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
            background: loading ? "#9ca3af" : "#4c7318",
            color: "#fff", fontWeight: 700, fontSize: "0.93rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}>
          {loading ? "Guardando..." : "Guardar componente"}
        </button>
      </div>
    </form>
  );
}

// ─── Badge estado ──────────────────────────────────────────────────────────────
function EstadoBadge({ estado }) {
  const map = {
    INSTALADO:     { bg: "#dcfce7", color: "#16a34a" },
    RETIRADO:      { bg: "#fee2e2", color: "#dc2626" },
    EN_REPARACION: { bg: "#fef9c3", color: "#ca8a04" },
    RESERVA:       { bg: "#e0e7ff", color: "#4338ca" },
  };
  const s = map[estado] ?? { bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "2px 10px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 700,
    }}>
      {estado ?? "—"}
    </span>
  );
}

// ─── Tab principal ─────────────────────────────────────────────────────────────
export default function TabComponentes({ equipoId }) {
  const [lista,       setLista]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando,    setEditando]    = useState(null);
  const [guardando,   setGuardando]   = useState(false);
  const [confirmElim, setConfirmElim] = useState(null);

  const cargar = async () => {
    setLoading(true); setError("");
    try {
      // Usa el endpoint filtrado — backend devuelve componenteNombre y marcaNombre
      const data = await composicionesApi.listarPorEquipo(equipoId);
      setLista(Array.isArray(data.datos) ? data.datos : []);
    } catch (e) {
      setError(e.message || "Error al cargar componentes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [equipoId]);

  const handleGuardar = async (valores) => {
    setGuardando(true);
    try {
      if (editando) {
        await composicionesApi.actualizar(editando.composicionId, valores);
      } else {
        await composicionesApi.crear(valores);
      }
      setMostrarForm(false);
      setEditando(null);
      cargar();
    } catch (e) {
      setError(e.message || "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await composicionesApi.eliminar(id);
      setConfirmElim(null);
      cargar();
    } catch (e) {
      setError(e.message || "No se pudo eliminar.");
    }
  };

  const cerrarForm = () => { setMostrarForm(false); setEditando(null); };

  return (
    <div>

      {error && (
        <div style={{ color: "#dc2626", background: "#fee2e2", padding: "8px 14px", borderRadius: 8, marginBottom: 14, fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      {!mostrarForm && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setMostrarForm(true)}
            style={{
              padding: "8px 18px", borderRadius: 8, border: "none",
              background: "#4c7318", color: "#fff",
              fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
            }}>
            + Agregar componente
          </button>
        </div>
      )}

      {mostrarForm && (
        <div style={{
          background: "#f9fafb", border: "1.5px solid #e5e7eb",
          borderRadius: 12, padding: "20px 22px", marginBottom: 20,
        }}>
          <h4 style={{ margin: "0 0 16px", fontSize: "0.97rem", fontWeight: 700, color: "#232946" }}>
            {editando ? "✏️ Editar componente" : "➕ Nuevo componente"}
          </h4>
          <FormComposicion
            equipoId={equipoId}
            initial={editando ? {
              componenteId:     editando.componenteId     ?? "",
              marcaId:          editando.marcaId          ?? "",
              codigo:           editando.codigo           ?? "",
              numeroSerie:      editando.numeroSerie      ?? "",
              especificaciones: editando.especificaciones ?? "",
              estado:           editando.estado           ?? "INSTALADO",
              fechaInstalacion: editando.fechaInstalacion ?? "",
              fechaRetiro:      editando.fechaRetiro      ?? "",
              motivoRetiro:     editando.motivoRetiro     ?? "",
              fotoId:           editando.fotoId           ?? 1,
            } : FORM_VACIO}
            onGuardar={handleGuardar}
            onCancelar={cerrarForm}
            loading={guardando}
          />
        </div>
      )}

      {loading ? (
        <div style={{ color: "#888", padding: "16px 0" }}>Cargando componentes...</div>
      ) : lista.length === 0 ? (
        <div style={{ color: "#9ca3af", padding: "24px 0", textAlign: "center", fontSize: "0.93rem" }}>
          🔧 No hay componentes registrados para este equipo.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {lista.map((comp) => (
            <div key={comp.composicionId} style={{
              background: "#fff", border: "1.5px solid #e5e7eb",
              borderRadius: 10, padding: "14px 18px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.97rem", color: "#232946" }}>
                  {comp.componenteNombre ?? `Componente #${comp.componenteId}`}
                  {comp.marcaNombre
                    ? <span style={{ color: "#6b7280", fontWeight: 400 }}> · {comp.marcaNombre}</span>
                    : ""}
                </div>
                <div style={{ fontSize: "0.83rem", color: "#6b7280", marginTop: 3, display: "flex", flexWrap: "wrap", gap: "0 12px" }}>
                  {comp.especificaciones && <span>{comp.especificaciones}</span>}
                  {comp.numeroSerie      && <span>S/N: {comp.numeroSerie}</span>}
                  {comp.codigo          && <span>Cód: {comp.codigo}</span>}
                  {comp.fechaInstalacion && <span>Instalado: {comp.fechaInstalacion}</span>}
                </div>
              </div>

              <EstadoBadge estado={comp.estado} />

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => { setEditando(comp); setMostrarForm(true); }} title="Editar"
                  style={{
                    padding: "5px 12px", borderRadius: 7, border: "1.5px solid #d1d5db",
                    background: "#fff", cursor: "pointer", fontSize: "0.85rem",
                  }}>✏️</button>

                {confirmElim === comp.composicionId ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "#dc2626" }}>¿Eliminar?</span>
                    <button onClick={() => handleEliminar(comp.composicionId)}
                      style={{ padding: "4px 10px", borderRadius: 7, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem" }}>Sí</button>
                    <button onClick={() => setConfirmElim(null)}
                      style={{ padding: "4px 10px", borderRadius: 7, border: "1.5px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "0.82rem" }}>No</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmElim(comp.composicionId)} title="Eliminar"
                    style={{
                      padding: "5px 12px", borderRadius: 7, border: "1.5px solid #fca5a5",
                      background: "#fff", cursor: "pointer", color: "#dc2626", fontSize: "0.85rem",
                    }}>🗑️</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}