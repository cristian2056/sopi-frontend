// src/pages/Personal/PersonaForm.jsx
import { useState, useEffect } from "react";
import { dependenciasApi } from "../../api/administracion.api";
import { rolesApi }        from "../../api/roles.api";
import AccesoSistema       from "./AccesoSistema";
import ModalDialog         from "../../Componentes_react/ui/ModalDialog";

const TIPOS_DOC = ["DNI", "CE", "PASAPORTE"];
const SEXOS     = ["M", "F"];
const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// modoUsuario=true → campos de cuenta obligatorios (sin checkbox)
export default function PersonaForm({ initialData = {}, onSubmit, loading, onCancel, modoUsuario = false, error = "" }) {
  const esEdicion = !!initialData.personaId;

  const [datos, setDatos] = useState({
    tipoDocumento:    initialData.tipoDocumento    ?? "DNI",
    numeroDocumento:  initialData.numeroDocumento  ?? "",
    nombres:          initialData.nombres          ?? "",
    apellidosPaterno: initialData.apellidosPaterno ?? "",
    apellidosMaterno: initialData.apellidosMaterno ?? "",
    sexo:             initialData.sexo             ?? "",
    email:            initialData.email            ?? "",
    telefono:         initialData.telefono         ?? "",
    direccion:        initialData.direccion        ?? "",
    crearUsuario:     modoUsuario,
    userName:         "",
    password:         "",
    dependenciaId:    initialData.dependenciaId    ?? "",
    rolId:            initialData.rolId            ?? "",
  });

  const [dependencias,  setDependencias]  = useState([]);
  const [roles,         setRoles]         = useState([]);
  const [dialogError,   setDialogError]   = useState(""); // error de validación por campo
  const [depError,      setDepError]      = useState(""); // error al cargar dependencias

  useEffect(() => {
    dependenciasApi.listar()
      .then(r => {
        const lista = r?.datos ?? [];
        // Si la lista viene vacía avisa al usuario para que revise las dependencias
        if (lista.length === 0) setDepError("No hay dependencias activas. Creá una en el módulo Dependencias.");
        setDependencias(lista);
      })
      .catch(() => setDepError("No se pudieron cargar las dependencias. Recargá la página."));
    rolesApi.listar()
      .then(r => setRoles(Array.isArray(r.datos) ? r.datos : []))
      .catch(() => {});
  }, []);

  const set = (campo, valor) => setDatos(p => ({ ...p, [campo]: valor }));

  // ── Validaciones por campo ────────────────────────────────────────
  // Cada regla es independiente: se puede ajustar o agregar una sin
  // afectar las demás. Devuelve el primer error encontrado o "".
  const validar = () => {
    const d = datos;
    if (!d.nombres.trim())                        return "El nombre es obligatorio.";
    if (d.nombres.trim().length < 2)              return "El nombre debe tener al menos 2 caracteres.";
    if (!d.apellidosPaterno.trim())               return "El apellido paterno es obligatorio.";
    if (!d.numeroDocumento.trim())                return "El número de documento es obligatorio.";
    if (d.tipoDocumento === "DNI" && !/^\d{8}$/.test(d.numeroDocumento))
      return "El DNI debe tener exactamente 8 dígitos numéricos.";
    if (d.tipoDocumento !== "DNI" && d.numeroDocumento.length > 12)
      return "El documento no puede superar 12 caracteres.";
    if (d.email    && !EMAIL_RE.test(d.email))    return "El formato del correo no es válido.";
    if (d.telefono && !/^\d{9}$/.test(d.telefono)) return "El teléfono debe tener exactamente 9 dígitos.";
    if (d.crearUsuario || modoUsuario) {
      if (!d.userName.trim())                     return "El nombre de usuario es obligatorio.";
      if (d.userName.trim().length < 4)           return "El usuario debe tener mínimo 4 caracteres.";
      if (d.userName.trim().length > 50)          return "El usuario no puede superar 50 caracteres.";
      if (!d.password)                            return "La contraseña es obligatoria.";
      if (d.password.length < 6)                  return "La contraseña debe tener mínimo 6 caracteres.";
      if (!d.dependenciaId)                       return "Debe seleccionar una dependencia.";
      if (!d.rolId)                               return "Debe seleccionar un rol.";
    }
    return "";
  };

  const handleSubmit = () => {
    const err = validar();
    if (err) { setDialogError(err); return; }
    onSubmit(datos);
  };

  // ── Estilos ───────────────────────────────────────────────────────
  const card   = { position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 };
  const box    = { background:"#fff", borderRadius:14, padding:"32px 36px", width:"100%", maxWidth:600, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 8px 40px rgba(0,0,0,0.18)" };
  const row    = { display:"flex", gap:14, marginBottom:14 };
  const col    = (flex=1) => ({ display:"flex", flexDirection:"column", flex, gap:4 });
  const lbl    = { fontSize:"0.82rem", fontWeight:600, color:"#374151" };
  const inp    = { padding:"8px 12px", borderRadius:8, border:"1px solid #d1d5db", fontSize:"0.95rem", outline:"none" };
  const sel    = { ...inp, background:"#fff" };
  const sec    = { fontWeight:700, fontSize:"0.8rem", color:"#6b7280", textTransform:"uppercase", letterSpacing:1, margin:"18px 0 10px", borderBottom:"1px solid #e5e7eb", paddingBottom:6 };

  return (
    <div style={card}>
      <div style={box}>
        <h3 style={{ margin:"0 0 20px", color:"#111827" }}>
          {esEdicion ? "✏️ Editar persona" : "➕ Nueva persona"}
        </h3>

        <div style={sec}>Datos personales</div>

        <div style={row}>
          <div style={col(0.4)}>
            <span style={lbl}>Tipo doc.</span>
            <select style={sel} value={datos.tipoDocumento} onChange={e => set("tipoDocumento", e.target.value)}>
              {TIPOS_DOC.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={col()}>
            <span style={lbl}>Nº documento *</span>
            <input style={inp} value={datos.numeroDocumento}
              onChange={e => set("numeroDocumento", e.target.value)} placeholder="12345678" />
          </div>
          <div style={col(0.4)}>
            <span style={lbl}>Sexo</span>
            <select style={sel} value={datos.sexo} onChange={e => set("sexo", e.target.value)}>
              <option value="">-</option>
              {SEXOS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={row}>
          <div style={col()}>
            <span style={lbl}>Nombres *</span>
            <input style={inp} value={datos.nombres} onChange={e => set("nombres", e.target.value)} placeholder="Juan Carlos" />
          </div>
        </div>

        <div style={row}>
          <div style={col()}>
            <span style={lbl}>Apellido paterno *</span>
            <input style={inp} value={datos.apellidosPaterno} onChange={e => set("apellidosPaterno", e.target.value)} />
          </div>
          <div style={col()}>
            <span style={lbl}>Apellido materno</span>
            <input style={inp} value={datos.apellidosMaterno} onChange={e => set("apellidosMaterno", e.target.value)} />
          </div>
        </div>

        <div style={row}>
          <div style={col()}>
            <span style={lbl}>Email</span>
            <input style={inp} type="email" value={datos.email}
              onChange={e => set("email", e.target.value)} placeholder="correo@ejemplo.com" />
          </div>
          <div style={col()}>
            <span style={lbl}>Teléfono</span>
            <input style={inp} value={datos.telefono}
              onChange={e => set("telefono", e.target.value)} placeholder="987654321" />
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <span style={lbl}>Dirección</span>
          <input style={{ ...inp, width:"100%", boxSizing:"border-box", marginTop:4 }}
            value={datos.direccion} onChange={e => set("direccion", e.target.value)} placeholder="Av. Principal 123" />
        </div>

        {!esEdicion && (
          <>
            <div style={sec}>Acceso al sistema</div>
            {depError && (
              <div style={{ marginBottom:10, background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:8, padding:"8px 12px", color:"#92400e", fontSize:"0.83rem" }}>
                ⚠️ {depError}
              </div>
            )}
            <AccesoSistema datos={datos} set={set} dependencias={dependencias}
              roles={roles} modoUsuario={modoUsuario}
              input={inp} select={sel} label={lbl} row={row} col={col} />
          </>
        )}

        {error && (
          <div style={{ marginTop:14, background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, padding:"10px 14px", color:"#dc2626", fontSize:"0.88rem" }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:8 }}>
          <button onClick={onCancel} disabled={loading}
            style={{ padding:"9px 22px", borderRadius:8, border:"1px solid #d1d5db", background:"#fff", cursor:"pointer", fontWeight:600 }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading}
            style={{ padding:"9px 22px", borderRadius:8, border:"none", background:"#4c7318", color:"#fff", cursor:"pointer", fontWeight:700 }}>
            {loading ? "Guardando..." : esEdicion ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>

      {/* Diálogo de validación — muestra el campo con error para que el usuario lo corrija */}
      <ModalDialog
        open={!!dialogError}
        variant="error"
        title="Dato incorrecto"
        message={dialogError}
        onClose={() => setDialogError("")}
        confirmText="Entendido"
      />
    </div>
  );
}
