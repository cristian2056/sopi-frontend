// src/pages/Personal/AccesoSistema.jsx
// Sección de creación de acceso al sistema dentro del formulario de persona
import React from "react";

export default function AccesoSistema({ datos, set, dependencias, roles, modoUsuario, input, select, label, row, col }) {
  return (
    <>
      {/* Checkbox solo si NO es modoUsuario */}
      {!modoUsuario && (
        <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, cursor: "pointer" }}>
          <input type="checkbox" checked={datos.crearUsuario}
            onChange={e => set("crearUsuario", e.target.checked)} />
          <span style={{ fontWeight: 600, color: "#374151" }}>
            Crear usuario para esta persona
          </span>
        </label>
      )}

      {(modoUsuario || datos.crearUsuario) && (
        <>
          <div style={row}>
            <div style={col()}>
              <span style={label}>Nombre de usuario *</span>
              <input style={input} value={datos.userName}
                onChange={e => set("userName", e.target.value)} placeholder="jperez" />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <span style={label}>Contraseña *</span>
            <input style={{ ...input, width: "100%", boxSizing: "border-box", marginTop: 4 }}
              type="password" value={datos.password}
              onChange={e => set("password", e.target.value)} placeholder="Minimo 8 caracteres" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <span style={label}>Dependencia *</span>
            <select
              style={{ ...select, width: "100%", boxSizing: "border-box", marginTop: 4 }}
              value={datos.dependenciaId}
              onChange={e => set("dependenciaId", e.target.value)}
            >
              <option value="">Seleccione una dependencia</option>
              {dependencias.map(d => (
                <option key={d.dependenciaId} value={d.dependenciaId}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <span style={label}>Rol *</span>
            <select
              style={{ ...select, width: "100%", boxSizing: "border-box", marginTop: 4 }}
              value={datos.rolId}
              onChange={e => set("rolId", e.target.value)}
            >
              <option value="">Seleccione un rol</option>
              {roles.map(r => (
                <option key={r.rolId} value={r.rolId}>{r.nombre}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </>
  );
}
