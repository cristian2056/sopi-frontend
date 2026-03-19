// src/pages/Tikets/TiketsPage.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../stores/authSlice";
import { ticketsApi } from "../../api/tickets.api";

import SeccionUsuario    from "./components/SeccionUsuario";
import SeccionTecnico    from "./components/SeccionTecnico";
import ModalCrearTicket  from "./components/ModalCrearTicket";
import ModalCerrarTicket from "./components/ModalCerrarTicket";

// Rol "usuario" en cualquier variante de mayúsculas → vista personal
const esRolUsuario = (rolNombre = "") =>
  rolNombre.toLowerCase().includes("usuario");

export default function TiketsPage() {
  const usuario        = useSelector(selectUsuario);
  const esVistaPersonal = esRolUsuario(usuario?.tipoUsuario ?? usuario?.rolNombre ?? "");

  // ── Datos usuario ──────────────────────────────────────────────────────────
  const [equipos,        setEquipos]        = useState([]);
  const [misTickets,     setMisTickets]     = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // ── Datos técnico ──────────────────────────────────────────────────────────
  const [pendientes,        setPendientes]        = useState([]);
  const [asignados,         setAsignados]         = useState([]);
  const [loadingPendientes, setLoadingPendientes] = useState(false);
  const [loadingAsignados,  setLoadingAsignados]  = useState(false);

  // ── Modales ────────────────────────────────────────────────────────────────
  const [crearTarget,   setCrearTarget]   = useState(null);
  const [cerrarTarget,  setCerrarTarget]  = useState(null);
  const [crearLoading,  setCrearLoading]  = useState(false);
  const [cerrarLoading, setCerrarLoading] = useState(false);
  const [tomarLoading,  setTomarLoading]  = useState(null);
  const [error,         setError]         = useState("");

  // ── Carga inicial ──────────────────────────────────────────────────────────
  const cargarUsuario = async () => {
    setLoadingEquipos(true);
    setLoadingTickets(true);
    try {
      const [rE, rT] = await Promise.all([
        ticketsApi.misEquipos().catch(() => ({ datos: [] })),
        ticketsApi.misTickets().catch(() => ({ datos: [] })),
      ]);
      const toArr = v => Array.isArray(v) ? v : v ? [v] : [];
      setEquipos(toArr(rE.datos));
      setMisTickets(toArr(rT.datos));
    } finally {
      setLoadingEquipos(false);
      setLoadingTickets(false);
    }
  };

  const cargarTecnico = async () => {
    setLoadingPendientes(true);
    setLoadingAsignados(true);
    try {
      const [rP, rA] = await Promise.all([
        ticketsApi.pendientes().catch(() => ({ datos: [] })),
        ticketsApi.misAsignados().catch(() => ({ datos: [] })),
      ]);
      const toArr = v => Array.isArray(v) ? v : v ? [v] : [];
      setPendientes(toArr(rP.datos));
      setAsignados(toArr(rA.datos));
    } finally {
      setLoadingPendientes(false);
      setLoadingAsignados(false);
    }
  };

  useEffect(() => {
    if (esVistaPersonal) {
      cargarUsuario();
    } else {
      cargarTecnico();
    }
  }, [esVistaPersonal]);

  // ── Acciones usuario ───────────────────────────────────────────────────────
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

  // ── Acciones técnico ───────────────────────────────────────────────────────
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
      cargarTecnico();
    } catch (e) {
      setError(e.message);
    } finally {
      setCerrarLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: "100%", maxWidth: esVistaPersonal ? 900 : 1200 }}>

      <h2 style={{ margin: "0 0 24px", fontSize: "1.3rem", fontWeight: 800, color: "#232946" }}>
        🎫 Tickets de soporte
      </h2>

      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8,
          padding: "10px 16px", marginBottom: 20, color: "#dc2626", fontSize: "0.9rem",
          display: "flex", justifyContent: "space-between",
        }}>
          <span>⚠️ {error}</span>
          <span role="button" tabIndex={0} onClick={() => setError("")} onKeyDown={e => { if (e.key === "Enter") setError(""); }} style={{ cursor: "pointer", fontWeight: 700 }}>×</span>
        </div>
      )}

      {esVistaPersonal ? (
        <SeccionUsuario
          equipos={equipos}           tickets={misTickets}
          loadingEquipos={loadingEquipos} loadingTickets={loadingTickets}
          onCrearTicket={setCrearTarget}
        />
      ) : (
        <SeccionTecnico
          pendientes={pendientes}             asignados={asignados}
          loadingPendientes={loadingPendientes} loadingAsignados={loadingAsignados}
          onTomar={handleTomar}   onCerrar={setCerrarTarget}
          tomarLoading={tomarLoading}
        />
      )}

      {crearTarget && (
        <ModalCrearTicket
          equipo={typeof crearTarget === "object" ? crearTarget : null}
          equipos={typeof crearTarget !== "object" ? equipos : []}
          onCrear={handleCrear}
          onCerrar={() => setCrearTarget(null)}
          loading={crearLoading}
        />
      )}

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
