// src/pages/Personal/PersonaForm.jsx
import { useState, useEffect } from "react";
import { dependenciasApi } from "../../api/administracion.api";
import { personalApi } from "../../api/personal.api";
import { rolesApi } from "../../api/roles.api";
import AccesoSistema from "./AccesoSistema";

const TIPOS_DOC = ["DNI", "CE", "PASAPORTE"];
const SEXOS     = ["M", "F"];

// modoUsuario=true → los campos de usuario son obligatorios (sin checkbox)
export default function PersonaForm({ initialData = {}, onSubmit, loading, onCancel, modoUsuario = false, error = "" }) {
  const esEdicion = !!initialData.personaId;

  const [datos, setDatos] = useState({
    tipoDocumento:     initialData.tipoDocumento     ?? "DNI",
    numeroDocumento:   initialData.numeroDocumento   ?? "",
    nombres:           initialData.nombres           ?? "",
    apellidosPaterno:  initialData.apellidosPaterno  ?? "",
    apellidosMaterno:  initialData.apellidosMaterno  ?? "",
    sexo:              initialData.sexo              ?? "",
    email:             initialData.email             ?? "",
    telefono:          initialData.telefono          ?? "",
    direccion:         initialData.direccion         ?? "",
    crearUsuario:      modoUsuario ? true : false,
    userName:          "",
    password:          "",
    dependenciaId:     initialData.dependenciaId     ?? "",
    rolId:             initialData.rolId             ?? "",
  });

  const [dependencias, setDependencias] = useState([]);
  const [roles,        setRoles]        = useState([]);

  useEffect(() => {
    dependenciasApi.listar()
      .then(r => setDependencias(r?.datos ?? []))
      .catch(() => {});
    rolesApi.listar()
      .then(r => setRoles(Array.isArray(r.datos) ? r.datos : []))
      .catch(() => {});
  }, []);

  const set = (campo, valor) => setDatos(p => ({ ...p, [campo]: valor }));

  const handleSubmit = () => {
    if (!datos.nombres.trim() || !datos.numeroDocumento.trim()) return;
    if (datos.crearUsuario && (!datos.userName.trim() || !datos.password.trim() || !datos.dependenciaId || !datos.rolId)) return;
    onSubmit(datos);
  };

  // ── Estilos compartidos ───────────────────────────────────
  const card = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
  };
  const box = {
    background: "#fff", borderRadius: 14, padding: "32px 36px",
    width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto",
    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
  };
  const row = { display: "flex", gap: 14, marginBottom: 14 };
  const col = (flex = 1) => ({ display: "flex", flexDirection: "column", flex, gap: 4 });
  const labelStyle = { fontSize: "0.82rem", fontWeight: 600, color: "#374151" };
  const inputStyle = {
    padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db",
    fontSize: "0.95rem", outline: "none",
  };
  const selectStyle = { ...inputStyle, background: "#fff" };
  const section = {
    fontWeight: 700, fontSize: "0.8rem", color: "#6b7280",
    textTransform: "uppercase", letterSpacing: 1,
    margin: "18px 0 10px", borderBottom: "1px solid #e5e7eb", paddingBottom: 6,
  };

  return (
    <div style={card}>
      <div style={box}>
        <h3 style={{ margin: "0 0 20px", color: "#111827" }}>
          {esEdicion ? "✏️ Editar persona" : "➕ Nueva persona"}
        </h3>

        {/* ── Datos personales ── */}
        <div style={section}>Datos personales</div>

        <div style={row}>
          <div style={col(0.4)}>
            <span style={labelStyle}>Tipo doc.</span>
            <select style={selectStyle} value={datos.tipoDocumento}
              onChange={e => set("tipoDocumento", e.target.value)}>
              {TIPOS_DOC.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={col()}>
            <span style={labelStyle}>Nº documento *</span>
            <input style={inputStyle} value={datos.numeroDocumento}
              onChange={e => set("numeroDocumento", e.target.value)} placeholder="12345678" />
          </div>
          <div style={col(0.4)}>
            <span style={labelStyle}>Sexo</span>
            <select style={selectStyle} value={datos.sexo}
              onChange={e => set("sexo", e.target.value)}>
              <option value="">-</option>
              {SEXOS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={row}>
          <div style={col()}>
            <span style={labelStyle}>Nombres *</span>
            <input style={inputStyle} value={datos.nombres}
              onChange={e => set("nombres", e.target.value)} placeholder="Juan Carlos" />
          </div>
        </div>

        <div style={row}>
          <div style={col()}>
            <span style={labelStyle}>Apellido paterno *</span>
            <input style={inputStyle} value={datos.apellidosPaterno}
              onChange={e => set("apellidosPaterno", e.target.value)} />
          </div>
          <div style={col()}>
            <span style={labelStyle}>Apellido materno *</span>
            <input style={inputStyle} value={datos.apellidosMaterno}
              onChange={e => set("apellidosMaterno", e.target.value)} />
          </div>
        </div>

        <div style={row}>
          <div style={col()}>
            <span style={labelStyle}>Email</span>
            <input style={inputStyle} type="email" value={datos.email}
              onChange={e => set("email", e.target.value)} placeholder="correo@ejemplo.com" />
          </div>
          <div style={col()}>
            <span style={labelStyle}>Teléfono</span>
            <input style={inputStyle} value={datos.telefono}
              onChange={e => set("telefono", e.target.value)} placeholder="987654321" />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <span style={labelStyle}>Dirección</span>
          <input style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginTop: 4 }}
            value={datos.direccion}
            onChange={e => set("direccion", e.target.value)} placeholder="Av. Principal 123" />
        </div>

        {/* ── Acceso al sistema (solo en modo creación) ── */}
        {!esEdicion && (
          <>
            <div style={section}>Acceso al sistema</div>
            <AccesoSistema
              datos={datos}
              set={set}
              dependencias={dependencias}
              roles={roles}
              modoUsuario={modoUsuario}
              input={inputStyle}
              select={selectStyle}
              label={labelStyle}
              row={row}
              col={col}
            />
          </>
        )}

        {error && (
          <div style={{ marginTop: 14, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: "0.88rem" }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Botones ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          <button onClick={onCancel} disabled={loading}
            style={{ padding: "9px 22px", borderRadius: 8, border: "1px solid #d1d5db",
              background: "#fff", cursor: "pointer", fontWeight: 600 }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading}
            style={{ padding: "9px 22px", borderRadius: 8, border: "none",
              background: "#4c7318", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
            {loading ? "Guardando..." : esEdicion ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
