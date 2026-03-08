// src/pages/Equipo/EquipoForm.jsx
import React, { useState, useEffect } from "react";
import { http } from "../../services/http";

const COLOR = {
  primary:      "#4c7318",
  primaryHover: "#3e5b19",
  disabled:     "#9ca3af",
};

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

export default function EquipoForm({ initialData = {}, onSubmit, loading, onCancel }) {
  const [form, setForm] = useState({
    codigoPatrimonial:           initialData.codigoPatrimonial           ?? "",
    codigoInterno:               initialData.codigoInterno               ?? "",
    serial:                      initialData.serial                      ?? "",
    nombre:                      initialData.nombre                      ?? "",
    tipoActivoId:                initialData.tipoActivoId                ?? "",
    marcaId:                     initialData.marcaId                     ?? "",
    proveedorId:                 initialData.proveedorId                 ?? "",
    estado:                      initialData.estado                      ?? "ACTIVO",
    fechaGarantia:               initialData.fechaGarantia               ?? "",
    numeroFactura:               initialData.numeroFactura               ?? "",
    mantenimientoProximaFecha:   initialData.mantenimientoProximaFecha   ?? "",
    mantenimientoFrecuenciaDias: initialData.mantenimientoFrecuenciaDias ?? "",
    observaciones:               initialData.observaciones               ?? "",
    activo:                      initialData.activo                      ?? true,
    fotoId:                      initialData.fotoId                      ?? 1,
  });

  // Listas para los selects
  const [marcas,      setMarcas]      = useState([]);
  const [tiposActivo, setTiposActivo] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loadingListas, setLoadingListas] = useState(true);

  // Carga las listas al abrir el form
  useEffect(() => {
    const cargarListas = async () => {
      try {
        const [rMarcas, rTipos, rProveedores] = await Promise.all([
          http("/api/Marcas"),
          http("/api/TiposActivos"),
          http("/api/Proveedores"),
        ]);
        setMarcas(rMarcas.datos      ?? []);
        setTiposActivo(rTipos.datos  ?? []);
        setProveedores(rProveedores.datos ?? []);
      } catch (e) {
        console.error("Error cargando listas:", e);
      } finally {
        setLoadingListas(false);
      }
    };
    cargarListas();
  }, []);

  const set = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      tipoActivoId:                parseInt(form.tipoActivoId)                || 0,
      marcaId:                     form.marcaId     ? parseInt(form.marcaId)  : null,
      proveedorId:                 form.proveedorId ? parseInt(form.proveedorId) : null,
      mantenimientoFrecuenciaDias: form.mantenimientoFrecuenciaDias ? parseInt(form.mantenimientoFrecuenciaDias) : null,
      fechaGarantia:               form.fechaGarantia            || null,
      mantenimientoProximaFecha:   form.mantenimientoProximaFecha || null,
      observaciones:               form.observaciones.trim()      || null,
      codigoInterno:               form.codigoInterno.trim()      || null,
      serial:                      form.serial.trim()             || null,
      nombre:                      form.nombre.trim()             || null,
      numeroFactura:               form.numeroFactura.trim()      || null,
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 3000, overflowY: "auto", padding: "24px 0",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        padding: "36px 40px", width: "100%", maxWidth: 640,
        boxShadow: "0 12px 48px rgba(0,0,0,0.22)",
        border: "2px solid #e5e7eb", margin: "auto",
      }}>

        <h3 style={{ margin: "0 0 24px", fontSize: "1.2rem", fontWeight: 800, color: "#232946", textAlign: "center" }}>
          {initialData.equipoId ? "✏️ Editar equipo" : "➕ Nuevo equipo"}
        </h3>

        {loadingListas ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
            Cargando datos...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

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

              {/* Tipo Activo — select con nombres */}
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

              {/* Marca — select con nombres */}
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

              {/* Proveedor — select con nombres */}
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

            {/* Botones */}
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={onCancel}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 9,
                  border: "1.5px solid #d1d5db", background: "#fff",
                  fontWeight: 600, fontSize: "0.97rem", cursor: "pointer", color: "#374151",
                }}>
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 9, border: "none",
                  background: loading ? COLOR.disabled : COLOR.primary,
                  color: "#fff", fontWeight: 700, fontSize: "0.97rem",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = COLOR.primaryHover; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = COLOR.primary; }}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}