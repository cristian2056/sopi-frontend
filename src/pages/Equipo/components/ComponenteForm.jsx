// src/pages/Equipo/components/ComponenteForm.jsx
// Formulario para agregar/editar un componente físico en un equipo
import React, { useEffect, useState } from "react";
import { marcasApi } from "../../../api/marcas.api";
import FormBotones from "../../../Componentes_react/ui/FormBotones";
import { inputStyle, labelStyle } from "../../../Componentes_react/ui/formStyles";

const ESTADOS = ["INSTALADO", "RETIRADO", "EN_REPARACION", "RESERVA"];

export const FORM_VACIO_COMPONENTE = {
  nombre: "", marcaId: "", codigo: "", numeroSerie: "",
  especificaciones: "", estado: "INSTALADO",
  fechaInstalacion: "", fechaRetiro: "", motivoRetiro: "",
};

export default function ComponenteForm({ initial = FORM_VACIO_COMPONENTE, onGuardar, onCancelar, loading }) {
  const [form, setForm] = useState(initial);
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    marcasApi.listar().then(r => setMarcas(r.datos ?? [])).catch(() => {});
  }, []);

  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.nombre.trim().length < 3) return;
    onGuardar({ ...form, marcaId: form.marcaId ? parseInt(form.marcaId) : null });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>

        <div style={{ marginBottom: 14, gridColumn: "1 / -1" }}>
          <label htmlFor="cf-nombre" style={labelStyle}>Componente <span style={{ color: "#ef4444" }}>*</span></label>
          <input id="cf-nombre" type="text" value={form.nombre} onChange={set("nombre")} required minLength={3}
            placeholder="Ej: Procesador Intel Core i7, RAM 8GB DDR4..."
            style={inputStyle} />
          {form.nombre.trim().length > 0 && form.nombre.trim().length < 3 && (
            <div style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: 4 }}>Mínimo 3 caracteres</div>
          )}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="cf-marca" style={labelStyle}>Marca</label>
          <select id="cf-marca" value={form.marcaId} onChange={set("marcaId")} style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">-- Sin marca --</option>
            {marcas.map(m => <option key={m.marcaId} value={m.marcaId}>{m.nombre}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="cf-estado" style={labelStyle}>Estado <span style={{ color: "#ef4444" }}>*</span></label>
          <select id="cf-estado" value={form.estado} onChange={set("estado")} style={{ ...inputStyle, cursor: "pointer" }}>
            {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="cf-codigo" style={labelStyle}>Código</label>
          <input id="cf-codigo" type="text" placeholder="Ej: CPU-001" value={form.codigo} onChange={set("codigo")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="cf-serie" style={labelStyle}>Nº de Serie</label>
          <input id="cf-serie" type="text" placeholder="Ej: SN123456" value={form.numeroSerie} onChange={set("numeroSerie")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="cf-fInstall" style={labelStyle}>Fecha Instalación</label>
          <input id="cf-fInstall" type="date" value={form.fechaInstalacion} onChange={set("fechaInstalacion")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="cf-fRetiro" style={labelStyle}>Fecha Retiro</label>
          <input id="cf-fRetiro" type="date" value={form.fechaRetiro} onChange={set("fechaRetiro")} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label htmlFor="cf-spec" style={labelStyle}>Especificaciones</label>
        <textarea id="cf-spec" placeholder="Ej: Intel Core i7 10ma gen, 3.8GHz..."
          value={form.especificaciones} onChange={set("especificaciones")}
          rows={2} style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      {form.estado !== "INSTALADO" && (
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="cf-motivo" style={labelStyle}>Motivo de Retiro</label>
          <input id="cf-motivo" type="text" placeholder="Opcional" value={form.motivoRetiro} onChange={set("motivoRetiro")} style={inputStyle} />
        </div>
      )}

      <FormBotones onCancelar={onCancelar} loading={loading} textoGuardar="Guardar componente" />
    </form>
  );
}
