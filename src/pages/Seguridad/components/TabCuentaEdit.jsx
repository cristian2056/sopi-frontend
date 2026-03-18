import { useState } from "react";
import { Field, Inp, Sel } from "./ModalFormUI";
import ToggleActivo from "./ToggleActivo";

export default function TabCuentaEdit({ datos, set, modoEditar, roles, dependencias, loadingCat }) {
  const [mostrarPass, setMostrarPass] = useState(false);

  const togglePass = () => {
    setMostrarPass(v => !v);
    set("password", "");
    set("confirmPassword", "");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {modoEditar && (
        <ToggleActivo activo={datos.activo} onChange={() => set("activo", !datos.activo)} />
      )}

      <Field label="Nombre de usuario *">
        <Inp value={datos.userName} onChange={e => set("userName", e.target.value)} placeholder="jperez" />
      </Field>

      <Field label="Rol">
        {loadingCat
          ? <span style={{ color: "#9ca3af", fontSize: "0.88rem" }}>Cargando...</span>
          : <Sel value={datos.rolId} onChange={e => set("rolId", e.target.value)}>
              <option value="">Sin rol</option>
              {roles.map(r => <option key={r.rolId} value={r.rolId}>{r.nombre}</option>)}
            </Sel>
        }
      </Field>

      <Field label="Dependencia">
        {loadingCat
          ? <span style={{ color: "#9ca3af", fontSize: "0.88rem" }}>Cargando...</span>
          : <Sel value={datos.dependenciaId} onChange={e => set("dependenciaId", e.target.value)}>
              <option value="">Sin dependencia</option>
              {dependencias.map(d => <option key={d.dependenciaId} value={d.dependenciaId}>{d.nombre}</option>)}
            </Sel>
        }
      </Field>

      {modoEditar ? (
        <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
          <button onClick={togglePass} style={{
            width: "100%", padding: "11px 16px",
            background: mostrarPass ? "#f9fafb" : "#fff",
            border: "none", textAlign: "left", cursor: "pointer",
            fontWeight: 700, fontSize: "0.88rem", color: "#374151",
            display: "flex", justifyContent: "space-between",
          }}>
            <span>🔑 Cambiar contraseña</span>
            <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
              {mostrarPass ? "▲ Cancelar" : "▼ Cambiar"}
            </span>
          </button>
          {mostrarPass && (
            <div style={{ padding: "14px 16px", borderTop: "1px solid #e5e7eb", display: "flex", flexDirection: "column", gap: 12, background: "#fafafa" }}>
              <Field label="Nueva contraseña *">
                <Inp type="password" value={datos.password} onChange={e => set("password", e.target.value)} placeholder="Mínimo 6 caracteres" />
              </Field>
              <Field label="Confirmar contraseña *">
                <Inp type="password" value={datos.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} />
              </Field>
            </div>
          )}
        </div>
      ) : (
        <Field label="Contraseña *">
          <Inp type="password" value={datos.password} onChange={e => set("password", e.target.value)} placeholder="Mínimo 6 caracteres" />
        </Field>
      )}

    </div>
  );
}
