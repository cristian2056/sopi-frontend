// src/pages/Equipo/components/FormSoftware.jsx
// Formulario para agregar/editar software instalado en un equipo
import React, { useState } from "react";
import FormBotones from "../ui/FormBotones";
import { inputStyle, labelStyle } from "../ui/formStyles";

export const FORM_VACIO_SOFTWARE = { nombre: "", version: "", codigoLicencia: "", fechaExpiracion: "" };

export default function FormSoftware({ initial = FORM_VACIO_SOFTWARE, onGuardar, onCancelar, loading }) {
  const [form, setForm] = useState(initial);
  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    onGuardar(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>

        <div style={{ marginBottom: 14, gridColumn: "1 / -1" }}>
          <label htmlFor="fs-nombre" style={labelStyle}>Software <span style={{ color: "#ef4444" }}>*</span></label>
          <input id="fs-nombre" type="text" value={form.nombre} onChange={set("nombre")} required
            placeholder="Ej: Microsoft Office, Antivirus ESET, Windows 11..."
            style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="fs-version" style={labelStyle}>Versión</label>
          <input id="fs-version" type="text" placeholder="Ej: 2021, 365, v4.2..."
            value={form.version} onChange={set("version")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="fs-licencia" style={labelStyle}>Código de Licencia</label>
          <input id="fs-licencia" type="text" placeholder="Ej: XXXX-XXXX-XXXX"
            value={form.codigoLicencia} onChange={set("codigoLicencia")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="fs-expiracion" style={labelStyle}>Fecha de Expiración</label>
          <input id="fs-expiracion" type="date" value={form.fechaExpiracion} onChange={set("fechaExpiracion")} style={inputStyle} />
        </div>
      </div>

      <FormBotones onCancelar={onCancelar} loading={loading} textoGuardar="Guardar software" />
    </form>
  );
}
