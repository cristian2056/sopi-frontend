// src/pages/Dashboard/DashboardAdmin.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { equiposApi }        from "../../api/equipos.api";
import { ticketsApi }        from "../../api/tickets.api";
import { mantenimientosApi } from "../../api/mantenimientos.api";
import { personalApi }       from "../../api/personal.api";
import { onSignalR }         from "../../services/signalrService";
import {
  Spinner, KpiCard, SeccionTitulo, EstadoBadge,
  TablaSimple, WelcomeBanner, AccesoBtn, CARD_STYLE,
} from "./DashboardWidgets";

const ACCESOS = [
  { icon: "💻", label: "Equipos",       path: "/equipos",        color: "#4c7318", bg: "rgba(76,115,24,0.08)",  border: "rgba(76,115,24,0.18)"  },
  { icon: "🎫", label: "Tickets",        path: "/tickets",        color: "#2563eb", bg: "rgba(37,99,235,0.08)",  border: "rgba(37,99,235,0.18)"  },
  { icon: "🔧", label: "Mantenimientos", path: "/mantenimientos", color: "#d97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.18)"  },
  { icon: "👥", label: "Personal",       path: "/personal",       color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.18)" },
  { icon: "🏢", label: "Dependencias",   path: "/dependencias",   color: "#0891b2", bg: "rgba(8,145,178,0.08)",  border: "rgba(8,145,178,0.18)"  },
  { icon: "🔑", label: "Usuarios",       path: "/usuarios",       color: "#be185d", bg: "rgba(190,24,93,0.08)",  border: "rgba(190,24,93,0.18)"  },
];

export default function DashboardAdmin({ nombre }) {
  const navigate = useNavigate();
  const [equipos,        setEquipos]        = useState([]);
  const [tickets,        setTickets]        = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [personas,       setPersonas]       = useState([]);
  const [loading,        setLoading]        = useState(true);

  const cargar = () => {
    Promise.allSettled([
      equiposApi.listar(),
      ticketsApi.listar(),
      mantenimientosApi.listar(),
      personalApi.listarPersonas(),
    ]).then(([eq, tk, mn, ps]) => {
      if (eq.status === "fulfilled") setEquipos(eq.value?.datos ?? []);
      if (tk.status === "fulfilled") setTickets(tk.value?.datos ?? []);
      if (mn.status === "fulfilled") setMantenimientos(mn.value?.datos ?? []);
      if (ps.status === "fulfilled") setPersonas(ps.value?.datos ?? []);
      setLoading(false);
    });
  };

  useEffect(() => {
    cargar();
    // Actualiza en tiempo real cuando cambia cualquier ticket
    const unsub = onSignalR("ticketCambio", cargar);
    return unsub;
  }, []);

  const equiposActivos   = equipos.filter(e => (e.estado ?? "").toUpperCase() === "ACTIVO").length;
  const ticketsAbiertos  = tickets.filter(t => (t.estado ?? "").toUpperCase() === "ABIERTO").length;
  const ticketsEnProceso = tickets.filter(t => (t.estado ?? "").toUpperCase() === "EN_PROCESO").length;
  const mantEnProceso    = mantenimientos.filter(m => (m.estado ?? "").toUpperCase() === "EN_PROCESO").length;
  const mantAbiertos     = mantenimientos.filter(m => (m.estado ?? "").toUpperCase() === "ABIERTO").length;

  const ticketsRecientes = [...tickets].sort((a, b) => (b.ticketId ?? 0) - (a.ticketId ?? 0)).slice(0, 6);
  const mantRecientes    = [...mantenimientos].sort((a, b) => (b.mantenimientoId ?? 0) - (a.mantenimientoId ?? 0)).slice(0, 5);

  return (
    <div style={{ maxWidth: 1100 }}>
      <WelcomeBanner nombre={nombre} rol="Administrador" icon="🛡️"
        color="#1d4ed8" bg="linear-gradient(135deg,rgba(37,99,235,0.1),rgba(76,115,24,0.08))"
        border="rgba(37,99,235,0.2)" />

      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
          <KpiCard icon="💻" label="Equipos totales" value={equipos.length}
            sub={`${equiposActivos} activos`} color="#4c7318"
            bg="rgba(76,115,24,0.07)" border="rgba(76,115,24,0.18)" onClick={() => navigate("/equipos")} />
          <KpiCard icon="🎫" label="Tickets abiertos" value={ticketsAbiertos}
            sub={`${ticketsEnProceso} en proceso`} color="#2563eb"
            bg="rgba(37,99,235,0.07)" border="rgba(37,99,235,0.18)" onClick={() => navigate("/tickets")} />
          <KpiCard icon="🔧" label="Mantenimientos" value={mantAbiertos + mantEnProceso}
            sub={`${mantEnProceso} en proceso`} color="#d97706"
            bg="rgba(217,119,6,0.07)" border="rgba(217,119,6,0.18)" onClick={() => navigate("/mantenimientos")} />
          <KpiCard icon="👥" label="Personal registrado" value={personas.length}
            color="#7c3aed" bg="rgba(124,58,237,0.07)" border="rgba(124,58,237,0.18)" onClick={() => navigate("/personal")} />
        </div>
      )}

      {/* Accesos rápidos */}
      <div style={{ ...CARD_STYLE, marginBottom: 24 }}>
        <SeccionTitulo icon="⚡" title="Acceso rápido" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {ACCESOS.map(a => (
            <AccesoBtn key={a.path} {...a} onClick={() => navigate(a.path)} />
          ))}
        </div>
      </div>

      {/* Tablas recientes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ ...CARD_STYLE, border: "1.5px solid rgba(37,99,235,0.14)" }}>
          <SeccionTitulo icon="🎫" title="Tickets recientes" action="Ver todos" onAction={() => navigate("/tickets")} />
          <TablaSimple loading={loading} keyFn={t => t.ticketId} emptyMsg="No hay tickets."
            cols={[
              { key: "ticketId",    label: "#",          render: t => `#${t.ticketId}` },
              { key: "solicitud",   label: "Descripción", render: t => (t.solicitud?.substring(0, 35) ?? "—") + ((t.solicitud?.length ?? 0) > 35 ? "…" : "") },
              { key: "estado",      label: "Estado",      render: t => <EstadoBadge value={t.estado} /> },
            ]}
            rows={ticketsRecientes} />
        </div>
        <div style={{ ...CARD_STYLE, border: "1.5px solid rgba(217,119,6,0.18)" }}>
          <SeccionTitulo icon="🔧" title="Mantenimientos recientes" action="Ver todos" onAction={() => navigate("/mantenimientos")} />
          <TablaSimple loading={loading} keyFn={m => m.mantenimientoId} emptyMsg="No hay mantenimientos."
            cols={[
              { key: "mantenimientoId",  label: "#",     render: m => `#${m.mantenimientoId}` },
              { key: "tipoMantenimiento", label: "Tipo", render: m => <EstadoBadge value={m.tipoMantenimiento} /> },
              { key: "estado",            label: "Est.", render: m => <EstadoBadge value={m.estado} /> },
            ]}
            rows={mantRecientes} />
        </div>
      </div>
    </div>
  );
}
