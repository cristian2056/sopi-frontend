// src/pages/Equipo/components/EquipoFormCampos.jsx
// Sección de campos del formulario de equipo: grid de datos + activo + observaciones

const inputStyle = {
  width: "100%", padding: "10px 12px",
  borderRadius: 9, border: "1.5px solid #d1d5db",
  fontSize: "0.97rem", boxSizing: "border-box",
  outline: "none", background: "#fff", color: "#111",
};

const labelStyle = {
  display: "block", fontWeight: 600,
  marginBottom: 6, color: "#374151", fontSize: "0.9rem",
};

const ESTADOS = ["ACTIVO", "INACTIVO", "MANTENIMIENTO", "BAJA"];

export default function EquipoFormCampos({ form, set, setForm, marcas, tiposActivo, proveedores }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>

        {/* Cód. Patrimonial */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>
            Cód. Patrimonial <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input type="text" placeholder="Ej: SM-MJ0KNV05"
            value={form.codigoPatrimonial}
            onChange={set("codigoPatrimonial")}
            required style={inputStyle}
          />
        </div>

        {/* Cód. Interno */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Cód. Interno</label>
          <input type="text" placeholder="Opcional"
            value={form.codigoInterno}
            onChange={set("codigoInterno")}
            style={inputStyle}
          />
        </div>

        {/* Nombre */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Nombre</label>
          <input type="text" placeholder="Ej: Computadora de escritorio"
            value={form.nombre}
            onChange={set("nombre")}
            style={inputStyle}
          />
        </div>

        {/* Serial */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Serial</label>
          <input type="text" placeholder="Ej: MJ0KNV05"
            value={form.serial}
            onChange={set("serial")}
            style={inputStyle}
          />
        </div>

        {/* Tipo Activo */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>
            Tipo de Activo <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select value={form.tipoActivoId} onChange={set("tipoActivoId")}
            required style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">-- Seleccionar --</option>
            {tiposActivo.map((t) => (
              <option key={t.tipoActivoId} value={t.tipoActivoId}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>
            Estado <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select value={form.estado} onChange={set("estado")}
            style={{ ...inputStyle, cursor: "pointer" }}>
            {ESTADOS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Marca */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Marca</label>
          <select value={form.marcaId} onChange={set("marcaId")}
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">-- Sin marca --</option>
            {marcas.map((m) => (
              <option key={m.marcaId} value={m.marcaId}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Proveedor */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Proveedor</label>
          <select value={form.proveedorId} onChange={set("proveedorId")}
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">-- Sin proveedor --</option>
            {proveedores.map((p) => (
              <option key={p.proveedorId} value={p.proveedorId}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Nº Factura */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Nº Factura</label>
          <input type="text" placeholder="Ej: F001-00123"
            value={form.numeroFactura}
            onChange={set("numeroFactura")}
            style={inputStyle}
          />
        </div>

        {/* Fecha Garantía */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Fecha Garantía</label>
          <input type="date"
            value={form.fechaGarantia}
            onChange={set("fechaGarantia")}
            style={inputStyle}
          />
        </div>

        {/* Próx. Mantenimiento */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Próx. Mantenimiento</label>
          <input type="date"
            value={form.mantenimientoProximaFecha}
            onChange={set("mantenimientoProximaFecha")}
            style={inputStyle}
          />
        </div>

        {/* Frec. Mantenimiento */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Frec. Mantenimiento (días)</label>
          <input type="number" placeholder="Ej: 180"
            value={form.mantenimientoFrecuenciaDias}
            onChange={set("mantenimientoFrecuenciaDias")}
            min={1} style={inputStyle}
          />
        </div>

      </div>

      {/* Activo */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <input type="checkbox" id="activo"
          checked={form.activo}
          onChange={(e) => setForm((p) => ({ ...p, activo: e.target.checked }))}
          style={{ width: 18, height: 18, cursor: "pointer" }}
        />
        <label htmlFor="activo" style={{ ...labelStyle, margin: 0, cursor: "pointer" }}>
          Equipo activo
        </label>
      </div>

      {/* Observaciones */}
      <div style={{ marginBottom: 28 }}>
        <label style={labelStyle}>Observaciones</label>
        <textarea
          placeholder="Notas adicionales..."
          value={form.observaciones}
          onChange={set("observaciones")}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>
    </>
  );
}
