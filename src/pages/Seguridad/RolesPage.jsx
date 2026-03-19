// src/pages/Seguridad/RolesPage.jsx
import { useEffect, useState, useCallback } from "react";
import { C, btnSt } from "./constants";
import { rolesApi, objetosApi, menuApi, rolObjetosApi, rolMenuApi, rolUsuariosApi } from "../../api/roles.api";
import { usePermiso } from "../../stores/menuSlice";

import Spinner             from "../../Componentes_react/ui/Spinner";
import ModalDialog         from "../../Componentes_react/ui/ModalDialog";
import RolLista            from "./components/RolLista";
import TabObjetos          from "./components/TabObjetos";
import TabMenus            from "./components/TabMenus";
import TabUsuarios         from "./components/TabUsuarios";
import ModalRol            from "./components/ModalRol";
import ModalAgregarUsuario from "./components/ModalAgregarUsuario";
import PanelVacioRoles     from "./components/PanelVacioRoles";
import PanelRolDetalle     from "./components/PanelRolDetalle";

// Convierte estructura anidada { menuId, subMenus:[] } en lista plana con menuPadreId
function aplanarMenus(items, padreId = null) {
  const result = [];
  for (const m of items) {
    result.push({ menuId: m.menuId, nombre: m.nombre, url: m.url, orden: m.orden, menuPadreId: padreId });
    if (m.subMenus?.length) result.push(...aplanarMenus(m.subMenus, m.menuId));
  }
  return result;
}

export default function RolesPage() {
  const { crear, modificar, eliminar } = usePermiso("Roles");

  // ── Datos globales ────────────────────────────────────────────────────────
  const [roles,   setRoles]   = useState([]);
  const [objetos, setObjetos] = useState([]);
  const [menus,   setMenus]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // ── Datos del rol seleccionado ────────────────────────────────────────────
  const [rolId,       setRolId]       = useState(null);
  const [rolObjetos,  setRolObjetos]  = useState([]);
  const [rolMenus,    setRolMenus]    = useState([]);
  const [rolUsuarios, setRolUsuarios] = useState([]);
  const [loadingRol,  setLoadingRol]  = useState(false);

  // ── UI ────────────────────────────────────────────────────────────────────
  const [tab,       setTab]       = useState("objetos");
  const [modalRol,  setModalRol]  = useState(null);
  const [modalUsu,  setModalUsu]  = useState(false);
  const [confirmEl, setConfirmEl] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // ── Carga inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      rolesApi.listar(),
      objetosApi.listar(),
      menuApi.listar().catch(() => ({ datos: { menus: [] } })),
    ]).then(([rR, rO, rM]) => {
      const toArr = (v) => Array.isArray(v) ? v : [];
      setRoles(toArr(rR.datos));
      setObjetos(toArr(rO.datos));
      setMenus(aplanarMenus(toArr(rM.datos?.menus)));
    }).catch(e => setError(e.message || "Error al cargar."))
      .finally(() => setLoading(false));
  }, []);

  // ── Carga del rol seleccionado ────────────────────────────────────────────
  const cargarRol = useCallback(async (id) => {
    setLoadingRol(true);
    try {
      const [rObj, rM, rTodos] = await Promise.all([
        rolObjetosApi.listarPorRol(id),
        rolMenuApi.listarPorRol(id).catch(() => ({ datos: [] })),
        rolUsuariosApi.listarTodos().catch(() => ({ datos: [] })),
      ]);
      setRolObjetos(rObj.datos ?? []);
      setRolMenus(rM.datos ?? []);
      setRolUsuarios((rTodos.datos ?? []).filter(u => u.rolId === id));
    } catch (e) {
      setError(e.message || "Error al cargar rol.");
    } finally {
      setLoadingRol(false);
    }
  }, []);

  const handleSelRol = (id) => {
    if (id === rolId) { setRolId(null); return; }
    setRolId(id);
    setTab("objetos");
    cargarRol(id);
  };

  // ── Helpers de permisos ───────────────────────────────────────────────────
  const getRO = (objetoId) => rolObjetos.find(ro => ro.objetoId === objetoId) ?? null;

  const handleTogglePerm = async (objetoId, accion) => {
    const ro = getRO(objetoId);
    try {
      if (!ro) {
        const body = { rolId, objetoId, leer: false, crear: false, modificar: false, eliminar: false, [accion]: true };
        const res  = await rolObjetosApi.asignar(body);
        setRolObjetos(prev => [...prev, res.datos ?? { ...body, rolObjetoId: Date.now() }]);
      } else {
        const nuevo = !ro[accion];
        const body  = { ...ro, [accion]: nuevo };
        const todosEnFalse = !body.leer && !body.crear && !body.modificar && !body.eliminar;
        if (todosEnFalse) {
          await rolObjetosApi.quitar(ro.rolObjetoId);
          setRolObjetos(prev => prev.filter(x => x.rolObjetoId !== ro.rolObjetoId));
        } else {
          await rolObjetosApi.actualizar(ro.rolObjetoId, body);
          setRolObjetos(prev => prev.map(x => x.rolObjetoId === ro.rolObjetoId ? { ...x, [accion]: nuevo } : x));
        }
      }
    } catch (e) { setError(e.message); }
  };

  const handleToggleFila = async (objetoId) => {
    const ro = getRO(objetoId);
    const tieneAcceso = ro && (ro.leer || ro.crear || ro.modificar || ro.eliminar);
    try {
      if (tieneAcceso) {
        await rolObjetosApi.quitar(ro.rolObjetoId);
        setRolObjetos(prev => prev.filter(x => x.rolObjetoId !== ro.rolObjetoId));
      } else if (!ro) {
        const body = { rolId, objetoId, leer: true, crear: true, modificar: true, eliminar: true };
        const res  = await rolObjetosApi.asignar(body);
        setRolObjetos(prev => [...prev, res.datos ?? { ...body, rolObjetoId: Date.now() }]);
      } else {
        const body = { ...ro, leer: true, crear: true, modificar: true, eliminar: true };
        await rolObjetosApi.actualizar(ro.rolObjetoId, body);
        setRolObjetos(prev => prev.map(x => x.rolObjetoId === ro.rolObjetoId ? body : x));
      }
    } catch (e) { setError(e.message); }
  };

  // ── Helpers de menús ──────────────────────────────────────────────────────
  const menuAcceso = (menuId) => rolMenus.some(rm => rm.menuId === menuId);

  const handleToggleMenu = async (menuId) => {
    const rm = rolMenus.find(x => x.menuId === menuId);
    try {
      if (rm) {
        await rolMenuApi.quitar(rm.rolMenuId);
        setRolMenus(prev => prev.filter(x => x.menuId !== menuId));
      } else {
        const body = { rolId, menuId, acceso: true };
        const res  = await rolMenuApi.asignar(body);
        setRolMenus(prev => [...prev, res.datos ?? { ...body, rolMenuId: Date.now() }]);
      }
    } catch (e) { setError(e.message); }
  };

  // ── Helpers de usuarios ───────────────────────────────────────────────────
  const handleAgregarUsuario = async (usuario) => {
    try {
      await rolUsuariosApi.cambiarRol(usuario.usuarioId, {
        userName:      usuario.userName,
        dependenciaId: usuario.dependenciaId,
        activo:        usuario.activo ?? true,
        rolId,
      });
      const r = await rolUsuariosApi.listarTodos();
      setRolUsuarios((r.datos ?? []).filter(u => u.rolId === rolId));
      setModalUsu(false);
    } catch (e) { setError(e.message); }
  };

  // ── CRUD roles ────────────────────────────────────────────────────────────
  const handleGuardarRol = async (datos) => {
    setGuardando(true);
    try {
      if (datos.rolId) {
        await rolesApi.actualizar(datos.rolId, datos);
        setRoles(prev => prev.map(r => r.rolId === datos.rolId ? { ...r, ...datos } : r));
      } else {
        const res = await rolesApi.crear(datos);
        setRoles(prev => [...prev, res.datos]);
      }
      setModalRol(null);
    } catch (e) { setError(e.message); }
    finally { setGuardando(false); }
  };

  const handleEliminarRol = async () => {
    try {
      await rolesApi.eliminar(confirmEl);
      setRoles(prev => prev.filter(r => r.rolId !== confirmEl));
      if (rolId === confirmEl) setRolId(null);
      setConfirmEl(null);
    } catch (e) { setError(e.message); }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) return <Spinner />;

  const rolActivo = roles.find(r => r.rolId === rolId) ?? null;

  return (
    <div style={{ width: "100%", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {error && (
        <div style={{
          background: C.dangerLight, border: "1px solid #fecaca", borderRadius: 8,
          padding: "10px 16px", marginBottom: 16, color: C.danger, fontSize: "0.9rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>⚠️ {error}</span>
          <span onClick={() => setError("")} style={{ cursor: "pointer", fontWeight: 700, fontSize: "1.1rem" }}>×</span>
        </div>
      )}

      {/* Encabezado */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: C.gray900 }}>🎭 Gestión de Roles</h2>
          <p style={{ margin: "4px 0 0", color: C.gray400, fontSize: "0.87rem" }}>
            Creá roles, asigná usuarios y configurá permisos por objeto
          </p>
        </div>
        {crear && (
          <button
            onClick={() => setModalRol("nuevo")}
            style={btnSt({ background: C.primary, color: C.white, padding: "10px 20px" })}
            onMouseEnter={e => e.currentTarget.style.background = C.primaryHover}
            onMouseLeave={e => e.currentTarget.style.background = C.primary}
          >
            ＋ Nuevo rol
          </button>
        )}
      </div>

      {/* Layout principal */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <RolLista
          roles={roles} rolId={rolId}
          onSelect={handleSelRol}
          onEditar={modificar ? rol => setModalRol(rol) : undefined}
          onEliminar={eliminar ? id => setConfirmEl(id) : undefined}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          {!rolActivo ? (
            <PanelVacioRoles />
          ) : (
            <PanelRolDetalle rolActivo={rolActivo} tab={tab} onTabChange={setTab} loadingRol={loadingRol}>
              {tab === "objetos"  && <TabObjetos objetos={objetos} getRO={getRO} onTogglePerm={handleTogglePerm} onToggleFila={handleToggleFila} />}
              {tab === "menus"    && <TabMenus menus={menus} menuAcceso={menuAcceso} onToggle={handleToggleMenu} />}
              {tab === "usuarios" && <TabUsuarios usuarios={rolUsuarios} onAbrirModal={() => setModalUsu(true)} />}
            </PanelRolDetalle>
          )}
        </div>
      </div>

      {/* Modales */}
      {modalRol !== null && (
        <ModalRol
          rol={modalRol === "nuevo" ? null : modalRol}
          onGuardar={handleGuardarRol} onCerrar={() => setModalRol(null)} loading={guardando}
        />
      )}
      {modalUsu && rolId && (
        <ModalAgregarUsuario
          usuariosActuales={rolUsuarios}
          onAgregar={handleAgregarUsuario} onCerrar={() => setModalUsu(false)}
        />
      )}
      <ModalDialog
        open={confirmEl !== null}
        variant="confirm"
        title="Eliminar rol"
        message={`¿Eliminar el rol "${roles.find(r => r.rolId === confirmEl)?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleEliminarRol}
        onClose={() => setConfirmEl(null)}
      />
    </div>
  );
}
