// src/pages/Dashboard/DashboardUsuario.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketsApi } from "../../api/tickets.api";
import { onSignalR }  from "../../services/signalrService";
import {
  Spinner, KpiCard, SeccionTitulo, EstadoBadge,
  TablaSimple, WelcomeBanner, CARD_STYLE,
} from "./DashboardWidgets";

export default function DashboardUsuario({ nombre }) {
  const navigate = useNavigate();
  const [misEquipos, setMisEquipos] = useState([]);
  const [misTickets, setMisTickets] = useState([]);
  const [loading,    setLoading]    = useState(true);

  const cargar = () => {
    Promise.allSettled([
      ticketsApi.misEquipos(),
      ticketsApi.misTickets(),
    ]).then(([eq, tk]) => {
      if (eq.status === "fulfilled") setMisEquipos(eq.value?.datos ?? []);
      if (tk.status === "fulfilled") setMisTickets(tk.value?.datos ?? []);
      setLoading(false);
    });
  };

  useEffect(() => {
    cargar();
    const unsub = onSignalR("ticketCambio", cargar);
    return unsub;
  }, []);

  const ticketsAbiertos  = misTickets.filter(t => (t.estado ?? "").toUpperCase() === "ABIERTO").length;
  const ticketsEnProceso = misTickets.filter(t => (t.estado ?? "").toUpperCase() === "EN_PROCESO").length;
  const ticketsCerrados  = misTickets.filter(t => (t.estado ?? "").toUpperCase() === "CERRADO").length;
  const ticketsRecientes = [...misTickets].sort((a, b) => (b.ticketId ?? 0) - (a.ticketId ?? 0)).slice(0, 5);

  return (
    <div style={{ maxWidth: 900 }}>
      <WelcomeBanner nombre={nombre} rol="Usuario" icon="🖥️" />

      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: 14, marginBottom: 26 }}>
          <KpiCard icon="🖥️" label="Mis equipos" value={misEquipos.length}
            color="#4c7318" bg="rgba(76,115,24,0.07)" border="rgba(76,115,24,0.18)" onClick={() => navigate("/mis-equipos")} />
          <KpiCard icon="🎫" label="Tickets abiertos" value={ticketsAbiertos}
            color="#2563eb" bg="rgba(37,99,235,0.07)" border="rgba(37,99,235,0.18)" onClick={() => navigate("/tickets")} />
          <KpiCard icon="⚙️" label="Tickets en proceso" value={ticketsEnProceso}
            color="#d97706" bg="rgba(217,119,6,0.07)" border="rgba(217,119,6,0.18)" onClick={() => navigate("/tickets")} />
          <KpiCard icon="✅" label="Tickets cerrados" value={ticketsCerrados}
            color="#16a34a" bg="rgba(22,163,74,0.07)" border="rgba(22,163,74,0.18)" onClick={() => navigate("/tickets")} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Mis equipos */}
        <div style={{ ...CARD_STYLE, border: "1.5px solid rgba(76,115,24,0.18)" }}>
          <SeccionTitulo icon="🖥️" title="Mis equipos" action="Ver todos" onAction={() => navigate("/mis-equipos")} />
          {loading ? <Spinner /> : misEquipos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: "#9ca3af", fontSize: "0.87rem" }}>
              No tienes equipos asignados.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
              {misEquipos.map(eq => (
                <div key={eq.equipoId} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "rgba(76,115,24,0.04)", border: "1px solid rgba(76,115,24,0.12)",
                  borderRadius: 10, padding: "10px 14px",
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1a3a0a" }}>
                      {eq.nombre ?? `Equipo #${eq.equipoId}`}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 1 }}>
                      {eq.tipoActivo ?? ""}{eq.marca ? ` · ${eq.marca}` : ""}
                    </div>
                  </div>
                  <EstadoBadge value={eq.estado ?? "ACTIVO"} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mis tickets recientes */}
        <div style={{ ...CARD_STYLE, border: "1.5px solid rgba(37,99,235,0.18)" }}>
          <SeccionTitulo icon="🎫" title="Mis tickets recientes" action="Ver todos" onAction={() => navigate("/tickets")} />
          <TablaSimple loading={loading} keyFn={t => t.ticketId} emptyMsg="No has creado tickets aún."
            cols={[
              { key: "ticketId",  label: "#",      render: t => `#${t.ticketId}` },
              { key: "solicitud", label: "Motivo", render: t => (t.solicitud?.substring(0, 28) ?? "—") + ((t.solicitud?.length ?? 0) > 28 ? "…" : "") },
              { key: "estado",    label: "Estado", render: t => <EstadoBadge value={t.estado} /> },
            ]}
            rows={ticketsRecientes} />
        </div>
      </div>

      {/* CTA crear ticket */}
      <div style={{
        marginTop: 20, padding: "18px 22px",
        background: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(100,151,25,0.15)",
        borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1a3a0a", marginBottom: 3 }}>
            ¿Tienes un problema con tu equipo?
          </div>
          <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
            Abre un ticket de soporte y un técnico se encargará.
          </div>
        </div>
        <button onClick={() => navigate("/tickets")} style={{
          background: "linear-gradient(135deg, #4c7318, #3e5b19)",
          color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px",
          fontWeight: 800, fontSize: "0.9rem", cursor: "pointer",
          boxShadow: "0 4px 14px rgba(76,115,24,0.3)", transition: "transform 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "none"}
        >
          🎫 Abrir ticket
        </button>
      </div>
    </div>
  );
}
