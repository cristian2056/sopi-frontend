// src/pages/Equipo/components/FormAsignacion.jsx
// Formulario para asignar un equipo a un usuario responsable y dependencia
import React, { useEffect, useState } from "react";
import { usuariosApi } from "../../../api/usuarios.api";
import { dependenciasApi } from "../../../api/administracion.api";
import FormBotones from "../../../Componentes_react/ui/FormBotones";
import { inputStyle, labelStyle } from "../../../Componentes_react/ui/formStyles";

export const FORM_VACIO_ASIGNACION = {
  usuarioResponsableId: "", fechaAsignacion: "",
  fechaDevolucion: "", observaciones: "", dependeciaId: "",
};

export default function FormAsignacion({ equipoId, initial = FORM_VACIO_ASIGNACION, onGuardar, onCancelar, loading }) {
  const [form, setForm]           = useState(initial);
  const [usuarios,     setUsuarios]     = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [cargando,     setCargando]     = useState(true);

  useEffect(() => {
    Promise.all([usuariosApi.listar(), dependenciasApi.listar()])
      .then(([rU, rD]) => {
        setUsuarios(rU.datos     ?? []);
        setDependencias(rD.datos ?? []);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({
      equipoId:             parseInt(equipoId),
      usuarioResponsableId: parseInt(form.usuarioResponsableId) || 0,
      dependeciaId:         parseInt(form.dependeciaId)         || 0,
      fechaAsignacion:      form.fechaAsignacion,
      fechaDevolucion:      form.fechaDevolucion || null,
      observaciones:        form.observaciones.trim() || null,
    });
  };

  if (cargando) return <div style={{ color: "#888" }}>Cargando...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Usuario Responsable <span style={{ color: "#ef4444" }}>*</span></label>
          <select value={form.usuarioResponsableId} onChange={set("usuarioResponsableId")} required
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">-- Seleccionar --</option>
            {usuarios.map(u => {
              const nombre = u.nombreCompleto ?? u.userName ?? `Usuario #${u.usuarioId}`;
              const tipo   = u.tipoUsuario ? ` [${u.tipoUsuario}]` : "";
              return <option key={u.usuarioId} value={u.usuarioId}>{nombre}{tipo}</option>;
            })}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Dependencia <span style={{ color: "#ef4444" }}>*</span></label>
          <select value={form.dependeciaId} onChange={set("dependeciaId")} required
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">-- Seleccionar --</option>
            {dependencias.map(d => (
              <option key={d.dependeciaId ?? d.dependenciaId} value={d.dependeciaId ?? d.dependenciaId}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Fecha de Asignación <span style={{ color: "#ef4444" }}>*</span></label>
          <input type="date" value={form.fechaAsignacion}
            onChange={set("fechaAsignacion")} required style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Fecha de Devolución</label>
          <input type="date" value={form.fechaDevolucion}
            onChange={set("fechaDevolucion")} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Observaciones</label>
        <textarea placeholder="Notas sobre la asignación..."
          value={form.observaciones} onChange={set("observaciones")}
          rows={2} style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      <FormBotones onCancelar={onCancelar} loading={loading} textoGuardar="Guardar asignación" />
    </form>
  );
}
