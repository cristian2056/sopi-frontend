// src/pages/Seguridad/UsuarioEditModal.jsx
// Orquesta estado, lógica y layout. Los sub-componentes viven en ./components/
import { useState, useEffect } from "react";
import { dependenciasApi } from "../../api/administracion.api";
import { personalApi } from "../../api/personal.api";
import { rolesApi } from "../../api/roles.api";
import { usuariosApi } from "../../api/usuarios.api";
import TabPersonaEdit from "./components/TabPersonaEdit";
import TabCuentaEdit  from "./components/TabCuentaEdit";

// ─── Estilos de layout del modal ─────────────────────────────────────────────
const S = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200,
  },
  box: {
    background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560,
    maxHeight: "92vh", display: "flex", flexDirection: "column",
    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
  },
  header:    { padding: "20px 28px 0", borderBottom: "1px solid #e5e7eb", flexShrink: 0 },
  body:      { padding: "22px 28px", flex: 1, overflowY: "auto" },
  footer:    { padding: "16px 28px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 },
  error:     { marginTop: 14, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: "0.88rem" },
  btnCancel: { padding: "9px 22px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 600 },
  btnSave:   { padding: "9px 24px", borderRadius: 8, border: "none", background: "#4c7318", color: "#fff", fontWeight: 700, cursor: "pointer" },
  tab: (active) => ({
    padding: "9px 20px", border: "none", background: "none", cursor: "pointer",
    fontWeight: 700, fontSize: "0.88rem",
    borderBottom: active ? "2.5px solid #4c7318" : "2.5px solid transparent",
    color: active ? "#4c7318" : "#6b7280",
  }),
};

export default function UsuarioEditModal({ persona, onGuardado, onCerrar }) {
  const modoEditar = !!persona.usuario?.usuarioId;
  const usuario    = persona.usuario;

  // ── Estado ────────────────────────────────────────────────────────────────
  const [tab, setTab] = useState(modoEditar ? "persona" : "cuenta");

  const [datosPersona, setDatosPersona] = useState({
    tipoDocumento:    persona.tipoDocumento    ?? "DNI",
    numeroDocumento:  persona.numeroDocumento  ?? "",
    nombres:          persona.nombres          ?? "",
    apellidosPaterno: persona.apellidosPaterno ?? "",
    apellidosMaterno: persona.apellidosMaterno ?? "",
    sexo:             persona.sexo             ?? "",
    email:            persona.email            ?? "",
    telefono:         persona.telefono         ?? "",
    direccion:        persona.direccion        ?? "",
  });

  const [datosCuenta, setDatosCuenta] = useState({
    userName:        usuario?.userName      ?? "",
    dependenciaId:   usuario?.dependenciaId ?? "",
    rolId:           usuario?.rolId         ?? "",
    activo:          usuario?.activo        ?? true,
    password:        "",
    confirmPassword: "",
  });

  const [dependencias, setDependencias] = useState([]);
  const [roles,        setRoles]        = useState([]);
  const [loadingCat,   setLoadingCat]   = useState(true);
  const [guardando,    setGuardando]    = useState(false);
  const [error,        setError]        = useState("");
  const [exito,        setExito]        = useState(false);

  useEffect(() => {
    Promise.all([
      dependenciasApi.listar().catch(() => ({ datos: [] })),
      rolesApi.listar().catch(() => ({ datos: [] })),
    ]).then(([rD, rR]) => {
      const toArr = (v) => Array.isArray(v) ? v : v ? [v] : [];
      setDependencias(toArr(rD.datos));
      setRoles(toArr(rR.datos));
    }).finally(() => setLoadingCat(false));
  }, []);

  const setP = (k, v) => setDatosPersona(p => ({ ...p, [k]: v }));
  const setC = (k, v) => setDatosCuenta(p => ({ ...p, [k]: v }));

  // ── Validación y guardado ─────────────────────────────────────────────────
  const handleGuardar = async () => {
    setError("");

    if (!datosCuenta.userName.trim()) {
      setError("El nombre de usuario es obligatorio."); return;
    }
    if (!modoEditar) {
      if (!datosCuenta.password)           { setError("La contraseña es obligatoria."); return; }
      if (datosCuenta.password.length < 6) { setError("Mínimo 6 caracteres."); return; }
    } else if (datosCuenta.password) {
      if (datosCuenta.password.length < 6) { setError("Mínimo 6 caracteres."); return; }
      if (datosCuenta.password !== datosCuenta.confirmPassword) { setError("Las contraseñas no coinciden."); return; }
    }

    setGuardando(true);
    try {
      if (modoEditar) {
        const resP = await personalApi.actualizarPersona(persona.personaId, datosPersona);
        if (resP?.exito === false) throw new Error(resP.mensaje || "No se pudo actualizar la persona.");

        const bodyU = {
          userName:      datosCuenta.userName,
          dependenciaId: Number(datosCuenta.dependenciaId) || 0,
          rolId:         Number(datosCuenta.rolId) || 0,
          activo:        datosCuenta.activo,
        };
        if (datosCuenta.password) bodyU.password = datosCuenta.password;

        const resU = await usuariosApi.editar(usuario.usuarioId, bodyU);
        if (resU?.exito === false) throw new Error(resU.mensaje || "No se pudo actualizar la cuenta.");

      } else {
        const rolNombre = roles.find(r => r.rolId === Number(datosCuenta.rolId))?.nombre ?? "";
        const resU = await personalApi.crearUsuario({
          personaId:      persona.personaId,
          userName:       datosCuenta.userName,
          password:       datosCuenta.password,
          dependenciaId:  Number(datosCuenta.dependenciaId) || null,
          rolId:          Number(datosCuenta.rolId) || null,
          rolNombre,
          nombreCompleto: `${persona.nombres} ${persona.apellidosPaterno} ${persona.apellidosMaterno}`.trim(),
          activo:         true,
        });
        if (resU?.exito === false) throw new Error(resU.mensaje || "No se pudo crear el usuario.");
      }

      setExito(true);
      setTimeout(() => onGuardado(), 1400);
    } catch (e) {
      setError(e.message || "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const tabs = modoEditar
    ? [["persona", "👤 Datos personales"], ["cuenta", "🔐 Cuenta"]]
    : [["cuenta", "🔐 Crear usuario"]];

  return (
    <div style={S.overlay}>
      <div style={S.box}>

        {/* Header */}
        <div style={S.header}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>
                {modoEditar ? "✏️ Editar usuario" : "🔐 Crear acceso al sistema"}
              </h3>
              <p style={{ margin: "3px 0 0", color: "#6b7280", fontSize: "0.84rem" }}>
                {persona.nombres} {persona.apellidosPaterno} {persona.apellidosMaterno}
                {modoEditar && <> · <span style={{ color: "#4338ca", fontWeight: 700 }}>@{usuario.userName}</span></>}
              </p>
            </div>
            <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#9ca3af", padding: 4 }}>
              ×
            </button>
          </div>
          <div style={{ display: "flex" }}>
            {tabs.map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)} style={S.tab(tab === k)}>{label}</button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div style={S.body}>
          {exito ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>✅</div>
              <div style={{ fontWeight: 700, color: "#15803d", fontSize: "1.05rem" }}>
                {modoEditar ? "Usuario actualizado correctamente." : "Usuario creado correctamente."}
              </div>
            </div>
          ) : (
            <>
              {tab === "persona" && <TabPersonaEdit datos={datosPersona} set={setP} />}
              {tab === "cuenta"  && (
                <TabCuentaEdit
                  datos={datosCuenta} set={setC}
                  modoEditar={modoEditar}
                  roles={roles} dependencias={dependencias}
                  loadingCat={loadingCat}
                />
              )}
              {error && <div style={S.error}>⚠️ {error}</div>}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={S.footer}>
          <button onClick={onCerrar} disabled={guardando} style={S.btnCancel}>Cancelar</button>
          <button onClick={handleGuardar} disabled={guardando || loadingCat || exito} style={S.btnSave}>
            {guardando ? "Guardando..." : modoEditar ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>

      </div>
    </div>
  );
}
