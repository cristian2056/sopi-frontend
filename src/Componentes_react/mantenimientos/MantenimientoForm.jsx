// src/pages/Mantenimientos/MantenimientoForm.jsx
import React, { useEffect, useState } from "react";
import { usuariosApi } from "../../api/usuarios.api";
import { equiposApi } from "../../api/equipos.api";
import { inputStyle, labelStyle } from "../ui/formStyles";

const TIPOS   = ["PREVENTIVO", "CORRECTIVO"];
const ESTADOS = ["ABIERTO", "EN_PROCESO", "CERRADO"];

export default function MantenimientoForm({ initial, onGuardar, onCancelar, loading }) {
  const [form, setForm]         = useState(initial);
  const [usuarios, setUsuarios] = useState([]);
  const [equipos,  setEquipos]  = useState([]);
  const [cargando, setCargando] = useState(true);

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

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.fechaProgramada || !form.equipoId || !form.responsableId) return;
    onGuardar({
      tipoMantenimiento: form.tipoMantenimiento,
      descripcion:       form.descripcion.trim(),
      fechaProgramada:   form.fechaProgramada,
      estado:            form.estado || "ABIERTO",
      responsableId:     parseInt(form.responsableId),
      equipoId:          form.equipoId,
    });
  };

  if (cargando) return <div style={{ color: "#888", padding: "16px 0" }}>Cargando...</div>;

  return (
    <form onSubmit={handleSubmit}>
      {/* Descripción — ancho completo */}
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="mf-desc" style={labelStyle}>Descripción <span style={{ color: "#ef4444" }}>*</span></label>
        <textarea id="mf-desc" value={form.descripcion} onChange={set("descripcion")} required rows={3}
          placeholder="Detalla el mantenimiento a realizar..."
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="mf-tipo" style={labelStyle}>Tipo <span style={{ color: "#ef4444" }}>*</span></label>
          <select id="mf-tipo" value={form.tipoMantenimiento} onChange={set("tipoMantenimiento")} required
            style={{ ...inputStyle, cursor: "pointer" }}>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="mf-estado" style={labelStyle}>Estado</label>
          <select id="mf-estado" value={form.estado} onChange={set("estado")}
            style={{ ...inputStyle, cursor: "pointer" }}>
            {ESTADOS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="mf-fecha" style={labelStyle}>Fecha programada <span style={{ color: "#ef4444" }}>*</span></label>
          <input id="mf-fecha" type="date" value={form.fechaProgramada ?? ""} onChange={set("fechaProgramada")}
            required style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="mf-equipo" style={labelStyle}>Equipo <span style={{ color: "#ef4444" }}>*</span></label>
          <select id="mf-equipo" value={form.equipoId ?? ""} onChange={set("equipoId")}
            required style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">— Seleccionar equipo —</option>
            {equipos.map(e => (
              <option key={e.equipoId} value={e.equipoId}>
                {e.nombre ?? e.codigoPatrimonial ?? `Equipo #${e.equipoId}`}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 14, gridColumn: "1 / -1" }}>
          <label htmlFor="mf-responsable" style={labelStyle}>Responsable / Técnico <span style={{ color: "#ef4444" }}>*</span></label>
          <select id="mf-responsable" value={form.responsableId ?? ""} onChange={set("responsableId")}
            required style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">— Seleccionar responsable —</option>
            {usuarios.map(u => (
              <option key={u.usuarioId} value={u.usuarioId}>
                {u.nombreCompleto ?? u.userName ?? `Usuario #${u.usuarioId}`}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button type="button" onClick={onCancelar}
          style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1.5px solid #d1d5db",
            background: "#fff", fontWeight: 600, cursor: "pointer", color: "#374151" }}>
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
            background: loading ? "#9ca3af" : "#4c7318", color: "#fff",
            fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Guardando..." : "Guardar mantenimiento"}
        </button>
      </div>
    </form>
  );
}
