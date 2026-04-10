// src/pages/Seguridad/UsuariosPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { personalApi }  from "../../api/personal.api";
import { usuariosApi }  from "../../api/usuarios.api";
import { rolesApi }     from "../../api/roles.api";
import { logoutLocal, selectUsuario } from "../../stores/authSlice";
import { authApi }      from "../../api/auth.api";
import PersonaForm      from "../Personal/PersonaForm";
import UsuarioEditModal from "./UsuarioEditModal";
import ModalDialog      from "../../Componentes_react/ui/ModalDialog";
import DataTable        from "../../Componentes_react/ui/DataTable";
import { usePermiso }   from "../../stores/menuSlice";
import { makeColumnas } from "./usuariosColumnas";

const FILTROS = ["Todos", "Activos", "Inactivos"];

export default function UsuariosPage() {
  const dispatch = useDispatch();
  const usuarioActual = useSelector(selectUsuario);
  const { crear, modificar, eliminar } = usePermiso("Usuarios");

  const [items,       setItems]       = useState([]);
  const [roles,       setRoles]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [busqueda,    setBusqueda]    = useState("");
  const [filtro,      setFiltro]      = useState("Todos");
  const [confirm,     setConfirm]     = useState({ open: false, personaId: null, loading: false, error: "" });
  const [confirmToggle, setConfirmToggle] = useState({ open: false, persona: null, loading: false, error: "" });
  const [form,        setForm]        = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError,   setFormError]   = useState("");
  const [editTarget,  setEditTarget]  = useState(null);

  const cargar = async () => {
    setLoading(true);
    try {
      const [dataPersonas, dataRoles, dataUsuarios] = await Promise.all([
        personalApi.listarPersonas(),
        rolesApi.listar(),
        usuariosApi.listar().catch(() => ({ datos: [] })),
      ]);
      const toArr = (v) => Array.isArray(v) ? v : v ? [v] : [];
      const usuariosMap = {};
      toArr(dataUsuarios.datos).forEach(u => { usuariosMap[u.usuarioId] = u; });
      const personas = toArr(dataPersonas.datos);
      personas.forEach(p => {
        if (!p.usuario?.usuarioId) return;
        const full = usuariosMap[p.usuario.usuarioId];
        if (full) p.usuario = { ...p.usuario, rolId: full.rolId, dependenciaId: full.dependenciaId, activo: full.activo };
      });
      setItems(personas);
      setRoles(toArr(dataRoles.datos));
    } catch (e) {
      setFormError(e.message || "Error al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleToggleActivo = (persona) =>
    setConfirmToggle({ open: true, persona, loading: false, error: "" });

  const confirmarToggle = async () => {
    const { persona } = confirmToggle;
    setConfirmToggle(p => ({ ...p, loading: true, error: "" }));
    try {
      const res = await usuariosApi.toggleActivo(persona.usuario.usuarioId);
      if (res?.exito === false) throw new Error(res.mensaje || "No se pudo cambiar el estado.");
      setConfirmToggle({ open: false, persona: null, loading: false, error: "" });
      // Si se deshabilitó el usuario actual → cerrar sesión
      if (persona.usuario.usuarioId === usuarioActual?.usuarioId && !res.datos) {
        await authApi.logout().catch(() => {});
        dispatch(logoutLocal());
        return;
      }
      cargar();
    } catch (e) {
      setConfirmToggle(p => ({ ...p, loading: false, error: e.message || "Error al cambiar estado." }));
    }
  };

  const handleGuardar = async (valores) => {
    setFormLoading(true);
    try {
      const respPersona = await personalApi.crearPersona({
        tipoDocumento: valores.tipoDocumento, numeroDocumento: valores.numeroDocumento,
        nombres: valores.nombres, apellidosPaterno: valores.apellidosPaterno,
        apellidosMaterno: valores.apellidosMaterno, sexo: valores.sexo,
        email: valores.email, telefono: valores.telefono, direccion: valores.direccion, activo: true,
      });
      if (respPersona?.exito === false) throw new Error(respPersona.mensaje || "No se pudo crear la persona.");
      const personaId = respPersona.datos?.personaId ?? respPersona.datos?.id;
      if (!personaId) throw new Error("No se pudo obtener el ID de la persona creada.");
      try {
        const rolNombre = roles.find(r => r.rolId === Number(valores.rolId))?.nombre ?? "";
        const resU = await personalApi.crearUsuario({
          personaId, dependenciaId: Number(valores.dependenciaId) || null,
          rolId: Number(valores.rolId) || null, rolNombre,
          userName: valores.userName, password: valores.password,
          nombreCompleto: `${valores.nombres} ${valores.apellidosPaterno} ${valores.apellidosMaterno}`.trim(),
          activo: true,
        });
        if (resU?.exito === false) throw new Error(resU.mensaje || "No se pudo crear el usuario.");
      } catch (eUser) {
        await personalApi.eliminarPersona(personaId).catch(() => {});
        throw eUser;
      }
      setFormError(""); setForm(null); cargar();
    } catch (e) {
      setFormError(e.message || "No se pudo guardar.");
    } finally {
      setFormLoading(false);
    }
  };

  const confirmarEliminar = async () => {
    setConfirm(p => ({ ...p, loading: true }));
    try {
      await personalApi.eliminarPersona(confirm.personaId);
      setConfirm({ open: false, personaId: null, loading: false, error: "" });
      cargar();
    } catch (e) {
      setConfirm(p => ({ ...p, loading: false, error: e.message || "No se pudo eliminar." }));
    }
  };

  const filtrados = items.filter(p => {
    const rolNombre = roles.find(r => r.rolId === p.usuario?.rolId)?.nombre ?? "";
    const coincideBusqueda = `${p.nombres ?? ""} ${p.apellidosPaterno ?? ""} ${p.apellidosMaterno ?? ""} ${p.usuario?.userName ?? ""} ${rolNombre}`
      .toLowerCase().includes(busqueda.toLowerCase());
    if (!coincideBusqueda) return false;
    if (filtro === "Activos")   return p.usuario?.activo === true;
    if (filtro === "Inactivos") return p.usuario?.activo === false;
    return true;
  });

  const estaActivo = confirmToggle.persona?.usuario?.activo;

  return (
    <div style={{ width: "100%", maxWidth: 1200 }}>
      <div className="page-toolbar">
        <h2>👥 Usuarios del sistema</h2>
        <input className="search-input" type="text" placeholder="🔍 Buscar por nombre, usuario o rol..."
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        {crear && <button className="btn-primary" onClick={() => setForm({})}>+ Nuevo usuario</button>}
      </div>

      {/* Filtros de estado */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {FILTROS.map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            padding: "6px 18px", borderRadius: 20, border: "1.5px solid",
            fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
            borderColor: filtro === f ? "#4c7318" : "#d1d5db",
            background:  filtro === f ? "#4c7318" : "#fff",
            color:       filtro === f ? "#fff"    : "#374151",
          }}>{f}</button>
        ))}
      </div>

      <DataTable
        columnas={makeColumnas(roles, modificar ? handleToggleActivo : undefined)}
        datos={filtrados}
        loading={loading}
        keyField="personaId"
        mensajeVacio="No hay usuarios registrados."
        onEdit={modificar ? (p) => setEditTarget(p) : undefined}
        onDelete={eliminar ? (p) => setConfirm({ open: true, personaId: p.personaId, loading: false }) : undefined}
      />

      {form !== null && (
        <PersonaForm initialData={form} onSubmit={handleGuardar} loading={formLoading}
          onCancel={() => { setForm(null); setFormError(""); }} modoUsuario error={formError} />
      )}
      {editTarget && (
        <UsuarioEditModal persona={editTarget}
          onGuardado={() => { setEditTarget(null); cargar(); }}
          onCerrar={() => setEditTarget(null)} />
      )}

      {/* Confirm toggle activo */}
      <ModalDialog
        open={confirmToggle.open}
        variant="confirm"
        title={estaActivo ? "Inhabilitar usuario" : "Habilitar usuario"}
        message={confirmToggle.error ||
          (estaActivo
            ? `¿Inhabilitar a ${confirmToggle.persona?.nombres}? No podrá iniciar sesión y su sesión activa se cerrará.`
            : `¿Habilitar a ${confirmToggle.persona?.nombres}? Podrá volver a iniciar sesión.`)
        }
        loading={confirmToggle.loading}
        onConfirm={confirmarToggle}
        onClose={() => setConfirmToggle({ open: false, persona: null, loading: false, error: "" })}
        confirmText={estaActivo ? "Sí, inhabilitar" : "Sí, habilitar"}
        cancelText="Cancelar"
      />

      <ModalDialog
        open={confirm.open} variant="confirm" title="Eliminar usuario"
        message={confirm.error || "¿Seguro que deseas eliminar este usuario? La persona también será eliminada."}
        loading={confirm.loading} onConfirm={confirmarEliminar}
        onClose={() => setConfirm({ open: false, personaId: null, loading: false, error: "" })}
        confirmText="Sí, eliminar" cancelText="Cancelar"
      />
    </div>
  );
}
