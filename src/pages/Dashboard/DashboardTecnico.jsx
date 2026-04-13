// src/pages/Dashboard/DashboardTecnico.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketsApi }        from "../../api/tickets.api";
import { mantenimientosApi } from "../../api/mantenimientos.api";
import { onSignalR }         from "../../services/signalrService";
import {
  Spinner, KpiCard, SeccionTitulo, EstadoBadge,
  TablaSimple, WelcomeBanner, CARD_STYLE,
} from "./DashboardWidgets";

export default function DashboardTecnico({ nombre }) {
  const navigate = useNavigate();
  const [pendientes,     setPendientes]     = useState([]);
  const [asignados,      setAsignados]      = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [tomandoId,      setTomandoId]      = useState(null);
  const [msg,            setMsg]            = useState(null);

  const cargar = () => {
    setLoading(true);
    Promise.allSettled([
      ticketsApi.pendientes(),
      ticketsApi.misAsignados(),
      mantenimientosApi.listar(),
    ]).then(([pe, as, mn]) => {
      if (pe.status === "fulfilled") setPendientes(pe.value?.datos ?? []);
      if (as.status === "fulfilled") setAsignados(as.value?.datos ?? []);
      if (mn.status === "fulfilled") {
        const todos = mn.value?.datos ?? [];
        setMantenimientos(todos.filter(m => (m.estado ?? "").toUpperCase() !== "CERRADO").slice(0, 6));
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    cargar();
    const unsub = onSignalR("ticketCambio", cargar);
    return unsub;
  }, []);

  const handleTomar = async (ticketId) => {
    setTomandoId(ticketId);
    try {
      const res = await ticketsApi.tomar(ticketId);
      if (res?.exito === false) throw new Error(res.mensaje);
      setMsg({ ok: true, text: "Ticket tomado correctamente." });
      cargar();
    } catch (e) {
      setMsg({ ok: false, text: e.message || "No se pudo tomar el ticket." });
    } finally {
      setTomandoId(null);
      setTimeout(() => setMsg(null), 3500);
    }
  };

  const misAsignados  = asignados.filter(t => (t.estado ?? "").toUpperCase() === "EN_PROCESO").length;
  const misCerrados   = asignados.filter(t => (t.estado ?? "").toUpperCase() === "CERRADO").length;

  return (
    <div style={{ maxWidth: 1050 }}>
      <WelcomeBanner nombre={nombre} rol="Técnico" icon="🔧"
        color="#d97706" bg="linear-gradient(135deg,rgba(217,119,6,0.1),rgba(76,115,24,0.07))"
        border="rgba(217,119,6,0.2)" />

      {msg && (
        <div style={{
          marginBottom: 16, padding: "12px 18px", borderRadius: 10,
          background: msg.ok ? "#dcfce7" : "#fee2e2",
          color: msg.ok ? "#16a34a" : "#dc2626",
          border: `1px solid ${msg.ok ? "#86efac" : "#fca5a5"}`,
          fontWeight: 600, fontSize: "0.88rem",
        }}>
          {msg.ok ? "✅" : "❌"} {msg.text}
        </div>
      )}

      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 14, marginBottom: 26 }}>
          <KpiCard icon="📬" label="Tickets pendientes" value={pendientes.length}
            sub="Sin asignar" color="#2563eb" bg="rgba(37,99,235,0.07)" border="rgba(37,99,235,0.18)" />
          <KpiCard icon="⚙️" label="Mis tickets activos" value={misAsignados}
            sub="En proceso" color="#d97706" bg="rgba(217,119,6,0.07)" border="rgba(217,119,6,0.18)" />
          <KpiCard icon="✅" label="Tickets cerrados" value={misCerrados}
            sub="Por mí" color="#16a34a" bg="rgba(22,163,74,0.07)" border="rgba(22,163,74,0.18)" />
          <KpiCard icon="🔧" label="Mantenimientos activos" value={mantenimientos.length}
            sub="Abiertos / En proceso" color="#7c3aed"
            bg="rgba(124,58,237,0.07)" border="rgba(124,58,237,0.18)"
            onClick={() => navigate("/mantenimientos")} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Tickets disponibles para tomar */}
        <div style={{ ...CARD_STYLE, border: "1.5px solid rgba(37,99,235,0.18)" }}>
          <SeccionTitulo icon="📬" title="Tickets disponibles" action="Ver todos" onAction={() => navigate("/tickets")} />
          {loading ? <Spinner /> : pendientes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: "#9ca3af", fontSize: "0.87rem" }}>
              No hay tickets pendientes 🎉
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
              {pendientes.slice(0, 8).map(t => (
                <div key={t.ticketId} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.12)",
                  borderRadius: 10, padding: "10px 14px", gap: 10,
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#1e3a5f" }}>
                      #{t.ticketId} — {(t.solicitud ?? "Sin descripción").substring(0, 40)}{(t.solicitud?.length ?? 0) > 40 ? "…" : ""}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>
                      {t.equipoNombre ?? "Equipo no especificado"}
                    </div>
                  </div>
                  <button disabled={tomandoId === t.ticketId} onClick={() => handleTomar(t.ticketId)}
                    style={{
                      background: "#2563eb", color: "#fff", border: "none",
                      borderRadius: 8, padding: "6px 12px", fontWeight: 700,
                      fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap",
                      opacity: tomandoId === t.ticketId ? 0.6 : 1,
                    }}>
                    {tomandoId === t.ticketId ? "…" : "Tomar"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mis tickets asignados */}
        <div style={{ ...CARD_STYLE, border: "1.5px solid rgba(217,119,6,0.18)" }}>
          <SeccionTitulo icon="⚙️" title="Mis tickets asignados" action="Ver todos" onAction={() => navigate("/tickets")} />
          <TablaSimple loading={loading} keyFn={t => t.ticketId} emptyMsg="No tienes tickets asignados."
            cols={[
              { key: "ticketId",  label: "#",          render: t => `#${t.ticketId}` },
              { key: "solicitud", label: "Descripción", render: t => (t.solicitud?.substring(0, 30) ?? "—") + ((t.solicitud?.length ?? 0) > 30 ? "…" : "") },
              { key: "estado",    label: "Estado",      render: t => <EstadoBadge value={t.estado} /> },
            ]}
            rows={asignados.slice(0, 6)} />
        </div>
      </div>

      {/* Mantenimientos activos */}
      <div style={{ ...CARD_STYLE, border: "1.5px solid rgba(124,58,237,0.15)", marginTop: 18 }}>
        <SeccionTitulo icon="🔧" title="Mantenimientos activos" action="Ver todos" onAction={() => navigate("/mantenimientos")} />
        <TablaSimple loading={loading} keyFn={m => m.mantenimientoId} emptyMsg="No hay mantenimientos activos."
          cols={[
            { key: "mantenimientoId",  label: "#",          render: m => `#${m.mantenimientoId}` },
            { key: "tipoMantenimiento", label: "Tipo",       render: m => <EstadoBadge value={m.tipoMantenimiento} /> },
            { key: "descripcion",       label: "Descripción", render: m => (m.descripcion?.substring(0, 45) ?? "—") + ((m.descripcion?.length ?? 0) > 45 ? "…" : "") },
            { key: "estado",            label: "Estado",      render: m => <EstadoBadge value={m.estado} /> },
            { key: "fechaProgramada",   label: "Fecha",       render: m => m.fechaProgramada ?? "—" },
          ]}
          rows={mantenimientos} />
      </div>
    </div>
  );
}
