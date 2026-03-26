// src/pages/Equipo/wizard/PasoEquipo.jsx
// Paso 1 del wizard: formulario de datos principales del equipo.
import { useState, useEffect } from "react";
import { equiposApi } from "../../../api/equipos.api";
import { marcasApi } from "../../../api/marcas.api";
import { tiposActivosApi, proveedoresApi } from "../../../api/administracion.api";
import { inputStyle, labelStyle } from "../../../Componentes_react/ui/formStyles";
import { COLOR, ESTADOS } from "./wizardConstants";

const FORM_VACIO = {
  codigoPatrimonial: "", codigoInterno: "", serial: "", nombre: "",
  tipoActivoId: "", marcaId: "", proveedorId: "", estado: "ACTIVO",
  fechaGarantia: "", numeroFactura: "", mantenimientoProximaFecha: "",
  mantenimientoFrecuenciaDias: "", observaciones: "", activo: true, fotoId: 1,
};

export default function PasoEquipo({ onCreado, onCancelar }) {
  const [form, setForm]               = useState(FORM_VACIO);
  const [marcas, setMarcas]           = useState([]);
  const [tiposActivo, setTiposActivo] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loadingListas, setLoadingListas] = useState(true);
  const [guardando, setGuardando]     = useState(false);
  const [error, setError]             = useState("");

  useEffect(() => {
    Promise.all([
      marcasApi.listar(),
      tiposActivosApi.listar(),
      proveedoresApi.listar(),
    ]).then(([rMarcas, rTipos, rProveedores]) => {
      setMarcas(rMarcas.datos       ?? []);
      setTiposActivo(rTipos.datos   ?? []);
      setProveedores(rProveedores.datos ?? []);
    }).catch(console.error)
      .finally(() => setLoadingListas(false));
  }, []);

  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true); setError("");
    try {
      const payload = {
        ...form,
        tipoActivoId:                parseInt(form.tipoActivoId) || 0,
        marcaId:                     form.marcaId     ? parseInt(form.marcaId)     : null,
        proveedorId:                 form.proveedorId ? parseInt(form.proveedorId) : null,
        mantenimientoFrecuenciaDias: form.mantenimientoFrecuenciaDias ? parseInt(form.mantenimientoFrecuenciaDias) : null,
        fechaGarantia:               form.fechaGarantia            || null,
        mantenimientoProximaFecha:   form.mantenimientoProximaFecha || null,
        observaciones:               form.observaciones.trim()      || null,
        codigoInterno:               form.codigoInterno.trim()      || null,
        serial:                      form.serial.trim()             || null,
        nombre:                      form.nombre.trim()             || null,
        numeroFactura:               form.numeroFactura.trim()      || null,
      };
      const resultado = await equiposApi.crear(payload);
      if (!resultado.exito) throw new Error(resultado.mensaje || "No se pudo crear el equipo.");
      onCreado(resultado.datos);
    } catch (e) {
      setError(e.message || "Error al crear el equipo.");
    } finally {
      setGuardando(false);
    }
  };

  if (loadingListas) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>Cargando datos...</div>
  );

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ color: "#dc2626", background: "#fee2e2", padding: "8px 14px", borderRadius: 8, marginBottom: 16, fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Cód. Patrimonial <span style={{ color: "#ef4444" }}>*</span></label>
          <input type="text" placeholder="Ej: SM-MJ0KNV05"
            value={form.codigoPatrimonial} onChange={set("codigoPatrimonial")}
            required style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Cód. Interno</label>
          <input type="text" placeholder="Opcional"
            value={form.codigoInterno} onChange={set("codigoInterno")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Nombre</label>
          <input type="text" placeholder="Ej: Computadora de escritorio"
            value={form.nombre} onChange={set("nombre")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Serial</label>
          <input type="text" placeholder="Ej: MJ0KNV05"
            value={form.serial} onChange={set("serial")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Tipo de Activo <span style={{ color: "#ef4444" }}>*</span></label>
          <select value={form.tipoActivoId} onChange={set("tipoActivoId")} required
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">-- Seleccionar --</option>
            {tiposActivo.map(t => <option key={t.tipoActivoId} value={t.tipoActivoId}>{t.nombre}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Marca</label>
          <select value={form.marcaId} onChange={set("marcaId")}
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">-- Sin marca --</option>
            {marcas.map(m => <option key={m.marcaId} value={m.marcaId}>{m.nombre}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Proveedor</label>
          <select value={form.proveedorId} onChange={set("proveedorId")}
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">-- Sin proveedor --</option>
            {proveedores.map(p => <option key={p.proveedorId} value={p.proveedorId}>{p.nombre}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Nº Factura</label>
          <input type="text" placeholder="Ej: F001-00123"
            value={form.numeroFactura} onChange={set("numeroFactura")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Cierre de Garantía</label>
          <input type="date" value={form.fechaGarantia}
            onChange={set("fechaGarantia")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Próx. Mantenimiento</label>
          <input type="date" value={form.mantenimientoProximaFecha}
            onChange={set("mantenimientoProximaFecha")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Frec. Mantenimiento (días)</label>
          <input type="number" placeholder="Ej: 180"
            value={form.mantenimientoFrecuenciaDias}
            onChange={set("mantenimientoFrecuenciaDias")} min={1} style={inputStyle} />
        </div>

      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Observaciones</label>
        <textarea placeholder="Notas adicionales..."
          value={form.observaciones} onChange={set("observaciones")}
          rows={3} style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" onClick={onCancelar}
          style={{
            flex: 1, padding: "10px 0", borderRadius: 9,
            border: "1.5px solid #d1d5db", background: "#fff",
            fontWeight: 600, fontSize: "0.97rem", cursor: "pointer", color: "#374151",
          }}>
          Cancelar
        </button>
        <button type="submit" disabled={guardando}
          style={{
            flex: 2, padding: "10px 0", borderRadius: 9, border: "none",
            background: guardando ? COLOR.disabled : COLOR.primary,
            color: "#fff", fontWeight: 700, fontSize: "0.97rem",
            cursor: guardando ? "not-allowed" : "pointer",
          }}
          onMouseEnter={e => { if (!guardando) e.currentTarget.style.background = COLOR.primaryHover; }}
          onMouseLeave={e => { if (!guardando) e.currentTarget.style.background = COLOR.primary; }}
        >
          {guardando ? "Creando equipo..." : "Crear equipo y continuar →"}
        </button>
      </div>
    </form>
  );
}
