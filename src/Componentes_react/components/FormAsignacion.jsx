// src/pages/Equipo/components/FormAsignacion.jsx
// Formulario para asignar un equipo a un usuario responsable y dependencia
import React, { useEffect, useState } from "react";
import { usuariosApi } from "../../api/usuarios.api";
import FormBotones from "../ui/FormBotones";
import { inputStyle, labelStyle } from "../ui/formStyles";

export const FORM_VACIO_ASIGNACION = {
  usuarioResponsableId: "", observaciones: "", dependeciaId: "",
};

export default function FormAsignacion({ equipoId, initial = FORM_VACIO_ASIGNACION, onGuardar, onCancelar, loading }) {
  const [form,     setForm]     = useState(initial);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    usuariosApi.listar()
      .then(r => setUsuarios(r.datos ?? []))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  // Al cambiar el usuario, auto-rellena la dependencia desde sus datos
  const handleUsuarioChange = (e) => {
    const id = e.target.value;
    const usuario = usuarios.find(u => String(u.usuarioId) === String(id));
    const depId = usuario ? (usuario.dependeciaId ?? usuario.dependenciaId ?? "") : "";
    setForm(p => ({ ...p, usuarioResponsableId: id, dependeciaId: depId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({
      equipoId:             parseInt(equipoId),
      usuarioResponsableId: parseInt(form.usuarioResponsableId) || 0,
      dependeciaId:         parseInt(form.dependeciaId)         || 0,
      fechaAsignacion:      new Date().toISOString().split("T")[0],
      observaciones:        form.observaciones.trim() || null,
    });
  };

  if (cargando) return <div style={{ color: "#888" }}>Cargando...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="fa-responsable" style={labelStyle}>Usuario Responsable <span style={{ color: "#ef4444" }}>*</span></label>
        <select id="fa-responsable" value={form.usuarioResponsableId} onChange={handleUsuarioChange} required
          style={{ ...inputStyle, cursor: "pointer" }}>
          <option value="">-- Seleccionar --</option>
          {usuarios.map(u => {
            const nombre = u.nombreCompleto ?? u.userName ?? `Usuario #${u.usuarioId}`;
            const tipo   = u.tipoUsuario ? ` [${u.tipoUsuario}]` : "";
            return <option key={u.usuarioId} value={u.usuarioId}>{nombre}{tipo}</option>;
          })}
        </select>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label htmlFor="fa-obs" style={labelStyle}>Observaciones</label>
        <textarea id="fa-obs" placeholder="Notas sobre la asignación..."
          value={form.observaciones} onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))}
          rows={2} style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      <FormBotones onCancelar={onCancelar} loading={loading} textoGuardar="Guardar asignación" />
    </form>
  );
}
