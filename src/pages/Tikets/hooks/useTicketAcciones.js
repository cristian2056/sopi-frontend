// src/pages/Tikets/hooks/useTicketAcciones.js
import { useState } from "react";
import { ticketsApi } from "../../../api/tickets.api";

/**
 * Centraliza todos los handlers de acción de TiketsPage.
 * Devuelve el estado de loading/error y las funciones para
 * crear, tomar, cerrar, confirmar, reclamar y asignar tickets.
 */
export function useTicketAcciones({ cargarUsuario, cargarTecnico, cargarAdmin, esAdmin }) {
  const [error,            setError]            = useState("");
  const [crearLoading,     setCrearLoading]     = useState(false);
  const [tomarLoading,     setTomarLoading]     = useState(null);
  const [cerrarLoading,    setCerrarLoading]    = useState(false);
  const [asignarLoading,   setAsignarLoading]   = useState(false);
  const [confirmarLoading, setConfirmarLoading] = useState(false);

  // Targets (qué ticket está activo en cada modal)
  const [crearTarget,       setCrearTarget]       = useState(null);
  const [mostrarCrearAdmin, setMostrarCrearAdmin] = useState(false);
  const [asignarTarget,     setAsignarTarget]     = useState(null);
  const [cerrarTarget,      setCerrarTarget]      = useState(null);
  const [confirmarTarget,   setConfirmarTarget]   = useState(null);

  const call = async (fn, onOk, setLoading, loaderId) => {
    if (setLoading) setLoading(loaderId ?? true);
    try {
      const res = await fn();
      if (res?.exito === false) throw new Error(res.mensaje || "Error en la operación.");
      onOk();
    } catch (e) {
      setError(e.message);
    } finally {
      if (setLoading) setLoading(loaderId ? null : false);
    }
  };

  const handleCrear         = body => call(() => ticketsApi.crear(body),                         () => { setCrearTarget(null);       cargarUsuario(); }, setCrearLoading);
  const handleTomar         = id   => call(() => ticketsApi.tomar(id),                           () => cargarTecnico(),               setTomarLoading, id);
  const handleCerrar        = body => call(() => ticketsApi.cerrar(cerrarTarget.ticketId, body), () => { setCerrarTarget(null);       esAdmin ? cargarAdmin() : cargarTecnico(); }, setCerrarLoading);
  const handleConfirmar     = ()   => call(() => ticketsApi.confirmar(confirmarTarget.ticketId), () => { setConfirmarTarget(null);    cargarUsuario(); }, setConfirmarLoading);
  const handleReclamar      = body => call(() => ticketsApi.reclamar(confirmarTarget.ticketId, body), () => { setConfirmarTarget(null); cargarUsuario(); }, setConfirmarLoading);
  const handleCrearAdmin    = body => call(() => ticketsApi.crearAdmin(body),                    () => { setMostrarCrearAdmin(false); cargarAdmin(); }, setCrearLoading);
  const handleAsignarTecnico= body => call(() => ticketsApi.asignarTecnico(asignarTarget.ticketId, body), () => { setAsignarTarget(null); cargarAdmin(); }, setAsignarLoading);

  return {
    error, setError,
    crearLoading, tomarLoading, cerrarLoading, asignarLoading, confirmarLoading,
    crearTarget,       setCrearTarget,
    mostrarCrearAdmin, setMostrarCrearAdmin,
    asignarTarget,     setAsignarTarget,
    cerrarTarget,      setCerrarTarget,
    confirmarTarget,   setConfirmarTarget,
    handleCrear, handleTomar, handleCerrar,
    handleConfirmar, handleReclamar,
    handleCrearAdmin, handleAsignarTecnico,
  };
}
