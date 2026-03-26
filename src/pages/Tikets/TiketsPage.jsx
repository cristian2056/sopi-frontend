// src/pages/Tikets/TiketsPage.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../stores/authSlice";
import { ticketsApi } from "../../api/tickets.api";
import { usuariosApi } from "../../api/usuarios.api";
import { equiposApi } from "../../api/equipos.api";

import SeccionUsuario          from "./components/SeccionUsuario";
import SeccionTecnico          from "./components/SeccionTecnico";
import SeccionAdmin            from "./components/SeccionAdmin";
import ModalCrearTicket        from "./components/ModalCrearTicket";
import ModalCrearTicketAdmin   from "./components/ModalCrearTicketAdmin";
import ModalAsignarTecnico     from "./components/ModalAsignarTecnico";
import ModalCerrarTicket       from "./components/ModalCerrarTicket";

const getRol = (u) => (u?.tipoUsuario ?? u?.rolNombre ?? "").toLowerCase();

export default function TiketsPage() {
  const usuario    = useSelector(selectUsuario);
  const rol        = getRol(usuario);
  const esAdmin    = rol.includes("admin");
  const esTecnico  = !esAdmin && !rol.includes("usuario");

  // ── Datos usuario ─────────────────────────────────────────────────────────
  const [equipos,        setEquipos]        = useState([]);
  const [misTickets,     setMisTickets]     = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // ── Datos técnico ─────────────────────────────────────────────────────────
  const [pendientes,        setPendientes]        = useState([]);
  const [asignados,         setAsignados]         = useState([]);
  const [loadingPendientes, setLoadingPendientes] = useState(false);
  const [loadingAsignados,  setLoadingAsignados]  = useState(false);

  // ── Datos admin ───────────────────────────────────────────────────────────
  const [todosTickets,   setTodosTickets]   = useState([]);
  const [loadingTodos,   setLoadingTodos]   = useState(false);
  const [todosUsuarios,  setTodosUsuarios]  = useState([]);
  const [todosEquipos,   setTodosEquipos]   = useState([]);

  // ── Modales ───────────────────────────────────────────────────────────────
  const [crearTarget,      setCrearTarget]      = useState(null);
  const [mostrarCrearAdmin, setMostrarCrearAdmin] = useState(false);
  const [asignarTarget,    setAsignarTarget]    = useState(null);
  const [cerrarTarget,     setCerrarTarget]     = useState(null);
  const [crearLoading,     setCrearLoading]     = useState(false);
  const [asignarLoading,   setAsignarLoading]   = useState(false);
  const [cerrarLoading,    setCerrarLoading]    = useState(false);
  const [tomarLoading,     setTomarLoading]     = useState(null);
  const [error,            setError]            = useState("");

  // ── Carga inicial ─────────────────────────────────────────────────────────
  const cargarUsuario = async () => {
    setLoadingEquipos(true); setLoadingTickets(true);
    try {
      const [rE, rT] = await Promise.all([
        ticketsApi.misEquipos().catch(() => ({ datos: [] })),
        ticketsApi.misTickets().catch(() => ({ datos: [] })),
      ]);
      const toArr = v => Array.isArray(v) ? v : v ? [v] : [];
      setEquipos(toArr(rE.datos));
      setMisTickets(toArr(rT.datos));
    } finally {
      setLoadingEquipos(false); setLoadingTickets(false);
    }
  };

  const cargarTecnico = async () => {
    setLoadingPendientes(true); setLoadingAsignados(true);
    try {
      const [rP, rA] = await Promise.all([
        ticketsApi.pendientes().catch(() => ({ datos: [] })),
        ticketsApi.misAsignados().catch(() => ({ datos: [] })),
      ]);
      const toArr = v => Array.isArray(v) ? v : v ? [v] : [];
      setPendientes(toArr(rP.datos));
      setAsignados(toArr(rA.datos));
    } finally {
      setLoadingPendientes(false); setLoadingAsignados(false);
    }
  };

  const cargarAdmin = async () => {
    setLoadingTodos(true);
    try {
      const [rT, rU, rE] = await Promise.all([
        ticketsApi.listar().catch(() => ({ datos: [] })),
        usuariosApi.listar().catch(() => ({ datos: [] })),
        equiposApi.listar().catch(() => ({ datos: [] })),
      ]);
      const toArr = v => Array.isArray(v) ? v : v ? [v] : [];
      setTodosTickets(toArr(rT.datos));
      setTodosUsuarios(toArr(rU.datos));
      setTodosEquipos(toArr(rE.datos));
    } finally {
      setLoadingTodos(false);
    }
  };

  useEffect(() => {
    if (esAdmin)       cargarAdmin();
    else if (esTecnico) cargarTecnico();
    else               cargarUsuario();
  }, [esAdmin, esTecnico]);

  // ── Acciones usuario ──────────────────────────────────────────────────────
  const handleCrear = async (body) => {
    setCrearLoading(true);
    try {
      const res = await ticketsApi.crear(body);
      if (res?.exito === false) throw new Error(res.mensaje || "No se pudo crear el ticket.");
      setCrearTarget(null);
      cargarUsuario();
    } catch (e) {
      setError(e.message);
    } finally {
      setCrearLoading(false);
    }
  };

  // ── Acciones técnico ──────────────────────────────────────────────────────
  const handleTomar = async (ticketId) => {
    setTomarLoading(ticketId);
    try {
      const res = await ticketsApi.tomar(ticketId);
      if (res?.exito === false) throw new Error(res.mensaje || "No se pudo tomar el ticket.");
      cargarTecnico();
    } catch (e) {
      setError(e.message);
    } finally {
      setTomarLoading(null);
    }
  };

  const handleCerrar = async (body) => {
    setCerrarLoading(true);
    try {
      const res = await ticketsApi.cerrar(cerrarTarget.ticketId, body);
      if (res?.exito === false) throw new Error(res.mensaje || "No se pudo cerrar el ticket.");
      setCerrarTarget(null);
      esAdmin ? cargarAdmin() : cargarTecnico();
    } catch (e) {
      setError(e.message);
    } finally {
      setCerrarLoading(false);
    }
  };

  // ── Acciones admin ────────────────────────────────────────────────────────
  const handleCrearAdmin = async (body) => {
    setCrearLoading(true);
    try {
      const res = await ticketsApi.crearAdmin(body);
      if (res?.exito === false) throw new Error(res.mensaje || "No se pudo crear el ticket.");
      setMostrarCrearAdmin(false);
      cargarAdmin();
    } catch (e) {
      setError(e.message);
    } finally {
      setCrearLoading(false);
    }
  };

  const handleAsignarTecnico = async (body) => {
    setAsignarLoading(true);
    try {
      const res = await ticketsApi.asignarTecnico(asignarTarget.ticketId, body);
      if (res?.exito === false) throw new Error(res.mensaje || "No se pudo asignar el técnico.");
      setAsignarTarget(null);
      cargarAdmin();
    } catch (e) {
      setError(e.message);
    } finally {
      setAsignarLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: "100%", maxWidth: esAdmin ? 1200 : 900 }}>

      <div className="page-toolbar">
        <h2 style={{ margin: 0, flex: 1 }}>🎫 Tickets de soporte</h2>
      </div>

      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8,
          padding: "10px 16px", marginBottom: 20, color: "#dc2626", fontSize: "0.9rem",
          display: "flex", justifyContent: "space-between",
        }}>
          <span>⚠️ {error}</span>
          <span role="button" tabIndex={0} onClick={() => setError("")}
            onKeyDown={e => { if (e.key === "Enter") setError(""); }}
            style={{ cursor: "pointer", fontWeight: 700 }}>×</span>
        </div>
      )}

      {esAdmin ? (
        <SeccionAdmin
          todos={todosTickets}
          loading={loadingTodos}
          onCrear={() => setMostrarCrearAdmin(true)}
          onAsignar={setAsignarTarget}
          onCerrar={setCerrarTarget}
        />
      ) : esTecnico ? (
        <SeccionTecnico
          pendientes={pendientes}              asignados={asignados}
          loadingPendientes={loadingPendientes} loadingAsignados={loadingAsignados}
          onTomar={handleTomar}  onCerrar={setCerrarTarget}
          tomarLoading={tomarLoading}
        />
      ) : (
        <SeccionUsuario
          equipos={equipos}             tickets={misTickets}
          loadingEquipos={loadingEquipos} loadingTickets={loadingTickets}
          onCrearTicket={setCrearTarget}
        />
      )}

      {/* Modal crear ticket (usuario) */}
      {crearTarget && (
        <ModalCrearTicket
          equipo={typeof crearTarget === "object" ? crearTarget : null}
          equipos={typeof crearTarget !== "object" ? equipos : []}
          onCrear={handleCrear}
          onCerrar={() => setCrearTarget(null)}
          loading={crearLoading}
        />
      )}

      {/* Modal crear ticket (admin) */}
      {mostrarCrearAdmin && (
        <ModalCrearTicketAdmin
          equipos={todosEquipos}
          usuarios={todosUsuarios}
          onCrear={handleCrearAdmin}
          onCerrar={() => setMostrarCrearAdmin(false)}
          loading={crearLoading}
        />
      )}

      {/* Modal asignar técnico (admin) */}
      {asignarTarget && (
        <ModalAsignarTecnico
          ticket={asignarTarget}
          tecnicos={todosUsuarios}
          onAsignar={handleAsignarTecnico}
          onCerrar={() => setAsignarTarget(null)}
          loading={asignarLoading}
        />
      )}

      {/* Modal cerrar ticket */}
      {cerrarTarget && (
        <ModalCerrarTicket
          ticket={cerrarTarget}
          onConfirmar={handleCerrar}
          onCerrar={() => setCerrarTarget(null)}
          loading={cerrarLoading}
        />
      )}

    </div>
  );
}
