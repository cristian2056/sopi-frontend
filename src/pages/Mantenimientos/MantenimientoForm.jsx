// src/pages/Mantenimientos/MantenimientoForm.jsx
import React, { useEffect, useState } from "react";
import { usuariosApi } from "../../api/usuarios.api";
import { equiposApi } from "../../api/equipos.api";
import { inputStyle, labelStyle } from "../../Componentes_react/ui/formStyles";

const TIPOS   = ["PREVENTIVO", "CORRECTIVO"];
const ESTADOS = ["ABIERTO", "EN_PROCESO", "CERRADO"];

const scrollBoxStyle = {
  border: "1px solid #d1d5db",
  borderRadius: 8,
  maxHeight: 150,
  overflowY: "auto",
  padding: "6px 8px",
  background: "#fafafa",
};

const checkRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "5px 4px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: "0.88rem",
  color: "#374151",
};

export default function MantenimientoForm({ initial, onGuardar, onCancelar, loading }) {
  const esEdicion = !!initial?.mantenimientoId;

  const [form, setForm] = useState({
    tipoMantenimiento: initial?.tipoMantenimiento ?? "PREVENTIVO",
    descripcion:       initial?.descripcion ?? "",
    fechaProgramada:   initial?.fechaProgramada ?? "",
    estado:            initial?.estado ?? "ABIERTO",
    // arrays (solo relevantes al crear)
    equipoIds:         initial?.equipoIds  ?? [],
    tecnicoIds:        initial?.tecnicoIds ?? [],
  });

  const [usuarios, setUsuarios] = useState([]);
  const [equipos,  setEquipos]  = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqEquipo,  setBusqEquipo]  = useState("");
  const [busqTecnico, setBusqTecnico] = useState("");

  useEffect(() => {
    Promise.all([usuariosApi.listar(), equiposApi.listar()])
      .then(([rU, rE]) => {
        setUsuarios(Array.isArray(rU.datos) ? rU.datos : rU.datos ? [rU.datos] : []);
        setEquipos(Array.isArray(rE.datos) ? rE.datos : rE.datos ? [rE.datos] : []);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const toggleEquipo = (id) =>
    setForm(p => ({
      ...p,
      equipoIds: p.equipoIds.includes(id)
        ? p.equipoIds.filter(x => x !== id)
        : [...p.equipoIds, id],
    }));

  const toggleTecnico = (id) =>
    setForm(p => ({
      ...p,
      tecnicoIds: p.tecnicoIds.includes(id)
        ? p.tecnicoIds.filter(x => x !== id)
        : [...p.tecnicoIds, id],
    }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!esEdicion && form.equipoIds.length === 0) {
      alert("Selecciona al menos un equipo.");
      return;
    }
    onGuardar({
      tipoMantenimiento: form.tipoMantenimiento,
      descripcion:       form.descripcion.trim(),
      fechaProgramada:   form.fechaProgramada || null,
      estado:            form.estado || "ABIERTO",
      equipoIds:         form.equipoIds,
      tecnicoIds:        form.tecnicoIds,
    });
  };

  if (cargando) return <div style={{ color: "#888", padding: "16px 0" }}>Cargando...</div>;

  const equiposFiltrados  = equipos.filter(e =>
    (e.nombre ?? e.codigoPatrimonial ?? "").toLowerCase().includes(busqEquipo.toLowerCase())
  );
  const tecnicosFiltrados = usuarios.filter(u =>
    (u.nombreCompleto ?? u.userName ?? "").toLowerCase().includes(busqTecnico.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit}>

      {/* Descripción */}
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="mf-desc" style={labelStyle}>
          Descripción <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <textarea
          id="mf-desc"
          value={form.descripcion}
          onChange={set("descripcion")}
          required
          rows={3}
          placeholder="Detalla el mantenimiento a realizar..."
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>

        {/* Tipo */}
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="mf-tipo" style={labelStyle}>
            Tipo <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select
            id="mf-tipo"
            value={form.tipoMantenimiento}
            onChange={set("tipoMantenimiento")}
            required
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Estado — solo visible al editar, el sistema lo gestiona automáticamente */}
        {esEdicion && (
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="mf-estado" style={labelStyle}>Estado</label>
            <select
              id="mf-estado"
              value={form.estado}
              onChange={set("estado")}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {ESTADOS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
        )}

        {/* Fecha */}
        <div style={{ marginBottom: 14, gridColumn: "1 / -1" }}>
          <label htmlFor="mf-fecha" style={labelStyle}>Fecha programada (opcional)</label>
          <input
            id="mf-fecha"
            type="date"
            value={form.fechaProgramada ?? ""}
            onChange={set("fechaProgramada")}
            style={inputStyle}
          />
        </div>

      </div>

      {/* Equipos — solo al crear */}
      {!esEdicion && (
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>
            Equipos a incluir <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="🔍 Buscar equipo..."
            value={busqEquipo}
            onChange={e => setBusqEquipo(e.target.value)}
            style={{ ...inputStyle, marginBottom: 6, padding: "6px 10px", fontSize: "0.85rem" }}
          />
          <div style={scrollBoxStyle}>
            {equiposFiltrados.length === 0 ? (
              <p style={{ color: "#9ca3af", textAlign: "center", padding: "10px 0", fontSize: "0.85rem" }}>
                Sin equipos disponibles
              </p>
            ) : equiposFiltrados.map(eq => (
              <label
                key={eq.equipoId}
                style={{
                  ...checkRowStyle,
                  background: form.equipoIds.includes(eq.equipoId) ? "#f0fdf4" : "transparent",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.equipoIds.includes(eq.equipoId)}
                  onChange={() => toggleEquipo(eq.equipoId)}
                  style={{ accentColor: "#4c7318" }}
                />
                <span style={{ fontWeight: form.equipoIds.includes(eq.equipoId) ? 600 : 400 }}>
                  {eq.nombre ?? eq.codigoPatrimonial ?? `Equipo #${eq.equipoId}`}
                </span>
                {eq.codigoPatrimonial && eq.nombre && (
                  <span style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
                    ({eq.codigoPatrimonial})
                  </span>
                )}
              </label>
            ))}
          </div>
          {form.equipoIds.length > 0 && (
            <p style={{ color: "#16a34a", fontSize: "0.8rem", marginTop: 4 }}>
              ✓ {form.equipoIds.length} equipo(s) seleccionado(s)
            </p>
          )}
        </div>
      )}

      {/* Técnicos — solo al crear */}
      {!esEdicion && (
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Técnicos asignados (opcional)</label>
          <input
            type="text"
            placeholder="🔍 Buscar técnico..."
            value={busqTecnico}
            onChange={e => setBusqTecnico(e.target.value)}
            style={{ ...inputStyle, marginBottom: 6, padding: "6px 10px", fontSize: "0.85rem" }}
          />
          <div style={scrollBoxStyle}>
            {tecnicosFiltrados.length === 0 ? (
              <p style={{ color: "#9ca3af", textAlign: "center", padding: "10px 0", fontSize: "0.85rem" }}>
                Sin usuarios disponibles
              </p>
            ) : tecnicosFiltrados.map(u => (
              <label
                key={u.usuarioId}
                style={{
                  ...checkRowStyle,
                  background: form.tecnicoIds.includes(u.usuarioId) ? "#eff6ff" : "transparent",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.tecnicoIds.includes(u.usuarioId)}
                  onChange={() => toggleTecnico(u.usuarioId)}
                  style={{ accentColor: "#1d4ed8" }}
                />
                <span style={{ fontWeight: form.tecnicoIds.includes(u.usuarioId) ? 600 : 400 }}>
                  {u.nombreCompleto ?? u.userName ?? `Usuario #${u.usuarioId}`}
                </span>
              </label>
            ))}
          </div>
          {form.tecnicoIds.length > 0 && (
            <p style={{ color: "#1d4ed8", fontSize: "0.8rem", marginTop: 4 }}>
              ✓ {form.tecnicoIds.length} técnico(s) asignado(s)
            </p>
          )}
        </div>
      )}

      {/* Botones */}
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button
          type="button"
          onClick={onCancelar}
          style={{
            flex: 1, padding: "10px 0", borderRadius: 8,
            border: "1.5px solid #d1d5db", background: "#fff",
            fontWeight: 600, cursor: "pointer", color: "#374151",
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
            background: loading ? "#9ca3af" : "#4c7318",
            color: "#fff", fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Guardando..." : "Guardar mantenimiento"}
        </button>
      </div>
    </form>
  );
}
