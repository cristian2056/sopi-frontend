// src/pages/Tikets/TiketsPage.jsx
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectEsAdmin, selectEsTecnico } from "../../stores/authSlice";
import { ticketsApi } from "../../api/tickets.api";
import { usuariosApi } from "../../api/usuarios.api";
import { equiposApi } from "../../api/equipos.api";
import { useTicketAcciones } from "./hooks/useTicketAcciones";
import { onSignalR } from "../../services/signalrService";

import SeccionUsuario          from "./components/SeccionUsuario";
import SeccionTecnico          from "./components/SeccionTecnico";
import SeccionAdmin            from "./components/SeccionAdmin";
import ModalCrearTicket        from "./components/ModalCrearTicket";
import ModalCrearTicketAdmin   from "./components/ModalCrearTicketAdmin";
import ModalAsignarTecnico     from "./components/ModalAsignarTecnico";
import ModalCerrarTicket       from "./components/ModalCerrarTicket";
import ModalConfirmarTicket    from "./components/ModalConfirmarTicket";

const toArr = v => Array.isArray(v) ? v : v ? [v] : [];

export default function TiketsPage() {
  const esAdmin   = useSelector(selectEsAdmin);
  const esTecnico = useSelector(selectEsTecnico);

  // ── Datos ─────────────────────────────────────────────────────────────────
  const [equipos,   setEquipos]   = useState([]);
  const [misTickets, setMisTickets] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [asignados,  setAsignados]  = useState([]);
  const [todosTickets, setTodosTickets] = useState([]);
  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [todosEquipos,  setTodosEquipos]  = useState([]);

  const [loadingEquipos,   setLoadingEquipos]   = useState(true);
  const [loadingTickets,   setLoadingTickets]   = useState(true);
  const [loadingPendientes,setLoadingPendientes] = useState(false);
  const [loadingAsignados, setLoadingAsignados]  = useState(false);
  const [loadingTodos,     setLoadingTodos]      = useState(false);

  // ── Cargas ────────────────────────────────────────────────────────────────
  const cargarUsuario = async () => {
    setLoadingEquipos(true); setLoadingTickets(true);
    try {
      const [rE, rT] = await Promise.all([
        ticketsApi.misEquipos().catch(() => ({ datos: [] })),
        ticketsApi.misTickets().catch(() => ({ datos: [] })),
      ]);
      setEquipos(toArr(rE.datos));
      setMisTickets(toArr(rT.datos));
    } finally { setLoadingEquipos(false); setLoadingTickets(false); }
  };

  const cargarTecnico = async () => {
    setLoadingPendientes(true); setLoadingAsignados(true);
    try {
      const [rP, rA] = await Promise.all([
        ticketsApi.pendientes().catch(() => ({ datos: [] })),
        ticketsApi.misAsignados().catch(() => ({ datos: [] })),
      ]);
      setPendientes(toArr(rP.datos));
      setAsignados(toArr(rA.datos));
    } finally { setLoadingPendientes(false); setLoadingAsignados(false); }
  };

  const cargarAdmin = async () => {
    setLoadingTodos(true);
    try {
      const [rT, rU, rE] = await Promise.all([
        ticketsApi.listar().catch(() => ({ datos: [] })),
        usuariosApi.listar().catch(() => ({ datos: [] })),
        equiposApi.listar().catch(() => ({ datos: [] })),
      ]);
      setTodosTickets(toArr(rT.datos));
      setTodosUsuarios(toArr(rU.datos));
      setTodosEquipos(toArr(rE.datos));
    } finally { setLoadingTodos(false); }
  };

  // Recarga al montar
  useEffect(() => {
    if (esAdmin)       cargarAdmin();
    else if (esTecnico) cargarTecnico();
    else               cargarUsuario();
  }, [esAdmin, esTecnico]);

  // SignalR: recargar cuando cambia cualquier ticket (sin F5)
  useEffect(() => {
    return onSignalR("ticketCambio", () => {
      if (esAdmin)        cargarAdmin();
      else if (esTecnico) cargarTecnico();
      else                cargarUsuario();
    });
  }, [esAdmin, esTecnico]);

  // ── Acciones (hook) ───────────────────────────────────────────────────────
  const A = useTicketAcciones({ cargarUsuario, cargarTecnico, cargarAdmin, esAdmin });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: "100%", maxWidth: esAdmin ? 1200 : 900 }}>
      <div className="page-toolbar">
        <h2 style={{ margin: 0, flex: 1 }}>🎫 Tickets de soporte</h2>
      </div>

      {A.error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 16px", marginBottom: 20, color: "#dc2626", fontSize: "0.9rem", display: "flex", justifyContent: "space-between" }}>
          <span>⚠️ {A.error}</span>
          <span role="button" tabIndex={0} onClick={() => A.setError("")} onKeyDown={e => { if (e.key === "Enter") A.setError(""); }} style={{ cursor: "pointer", fontWeight: 700 }}>×</span>
        </div>
      )}

      {esAdmin ? (
        <SeccionAdmin todos={todosTickets} loading={loadingTodos}
          onCrear={() => A.setMostrarCrearAdmin(true)}
          onAsignar={A.setAsignarTarget}
          onCerrar={A.setCerrarTarget} />
      ) : esTecnico ? (
        <SeccionTecnico
          pendientes={pendientes} asignados={asignados}
          loadingPendientes={loadingPendientes} loadingAsignados={loadingAsignados}
          onTomar={A.handleTomar} onCerrar={A.setCerrarTarget}
          tomarLoading={A.tomarLoading} />
      ) : (
        <SeccionUsuario
          equipos={equipos} tickets={misTickets}
          loadingEquipos={loadingEquipos} loadingTickets={loadingTickets}
          onCrearTicket={A.setCrearTarget}
          onConfirmarTicket={A.setConfirmarTarget} />
      )}

      {A.crearTarget && (
        <ModalCrearTicket
          equipo={typeof A.crearTarget === "object" ? A.crearTarget : null}
          equipos={typeof A.crearTarget !== "object" ? equipos : []}
          onCrear={A.handleCrear} onCerrar={() => A.setCrearTarget(null)}
          loading={A.crearLoading} />
      )}
      {A.mostrarCrearAdmin && (
        <ModalCrearTicketAdmin
          equipos={todosEquipos} usuarios={todosUsuarios}
          onCrear={A.handleCrearAdmin} onCerrar={() => A.setMostrarCrearAdmin(false)}
          loading={A.crearLoading} />
      )}
      {A.asignarTarget && (
        <ModalAsignarTecnico
          ticket={A.asignarTarget} tecnicos={todosUsuarios}
          onAsignar={A.handleAsignarTecnico} onCerrar={() => A.setAsignarTarget(null)}
          loading={A.asignarLoading} />
      )}
      {A.cerrarTarget && (
        <ModalCerrarTicket
          ticket={A.cerrarTarget}
          onConfirmar={A.handleCerrar} onCerrar={() => A.setCerrarTarget(null)}
          loading={A.cerrarLoading} />
      )}
      {A.confirmarTarget && (
        <ModalConfirmarTicket
          ticket={A.confirmarTarget}
          onCerrar={() => A.setConfirmarTarget(null)}
          onConfirmar={A.handleConfirmar}
          onReclamar={A.handleReclamar}
          loading={A.confirmarLoading} />
      )}
    </div>
  );
}
