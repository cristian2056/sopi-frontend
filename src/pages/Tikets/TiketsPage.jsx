// src/pages/Tikets/TiketsPage.jsx
import { useEffect, useState } from "react";
import { ticketsApi } from "../../api/tickets.api";

import SeccionUsuario   from "./components/SeccionUsuario";
import SeccionTecnico   from "./components/SeccionTecnico";
import ModalCrearTicket from "./components/ModalCrearTicket";
import ModalCerrarTicket from "./components/ModalCerrarTicket";

export default function TiketsPage() {
  // esTecnico: lo determina el backend — si /pendientes responde sin 403 = es técnico
  const [esTecnico, setEsTecnico] = useState(false);

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

  // ── Modales ───────────────────────────────────────────────────────────────
  const [crearTarget,  setCrearTarget]  = useState(null);  // equipo seleccionado
  const [cerrarTarget, setCerrarTarget] = useState(null);  // ticket a cerrar
  const [crearLoading, setCrearLoading] = useState(false);
  const [cerrarLoading, setCerrarLoading] = useState(false);
  const [tomarLoading,  setTomarLoading]  = useState(null); // ticketId en proceso
  const [error, setError] = useState("");

  // ── Carga inicial ─────────────────────────────────────────────────────────
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
        ticketsApi.pendientes(),
        ticketsApi.misAsignados().catch(() => ({ datos: [] })),
      ]);
      const toArr = v => Array.isArray(v) ? v : v ? [v] : [];
      setEsTecnico(true);
      setPendientes(toArr(rP.datos));
      setAsignados(toArr(rA.datos));
    } catch {
      setEsTecnico(false);
    } finally {
      setLoadingPendientes(false);
      setLoadingAsignados(false);
    }
  };

  useEffect(() => {
    cargarUsuario();
    cargarTecnico();
  }, []);

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
      cargarTecnico();
    } catch (e) {
      setError(e.message);
    } finally {
      setCerrarLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: "100%", maxWidth: 900 }}>

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
          <span onClick={() => setError("")} style={{ cursor: "pointer", fontWeight: 700 }}>×</span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

        <SeccionUsuario
          equipos={equipos}        tickets={misTickets}
          loadingEquipos={loadingEquipos} loadingTickets={loadingTickets}
          onCrearTicket={setCrearTarget}
        />

        {esTecnico && (
          <>
            <hr style={{ border: "none", borderTop: "2px dashed #e5e7eb" }} />
            <SeccionTecnico
              pendientes={pendientes}             asignados={asignados}
              loadingPendientes={loadingPendientes} loadingAsignados={loadingAsignados}
              onTomar={handleTomar}  onCerrar={setCerrarTarget}
              tomarLoading={tomarLoading}
            />
          </>
        )}

      </div>

      {crearTarget && (
        <ModalCrearTicket
          equipo={crearTarget}
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
