import { BadgePrioridad, BadgeEstado } from "./TicketBadges";

// ─── Tarjeta de equipo ────────────────────────────────────────────────────────
function TarjetaEquipo({ equipo, onCrear }) {
  const bloqueado = equipo.tieneTicketAbierto;
  return (
    <div style={{
      border: `1.5px solid ${bloqueado ? "#fca5a5" : "#e5e7eb"}`,
      borderRadius: 10, padding: "14px 16px",
      background: bloqueado ? "#fff5f5" : "#fff",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{ fontSize: "1.8rem" }}>🖥️</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, color: "#111827", fontSize: "0.95rem" }}>{equipo.nombre}</div>
        <div style={{ color: "#6b7280", fontSize: "0.82rem" }}>
          {equipo.codigoPatrimonial} · {equipo.marca}
        </div>
        {bloqueado && (
          <div style={{ color: "#dc2626", fontSize: "0.78rem", fontWeight: 600, marginTop: 2 }}>
            ⚠️ Ya tiene un ticket abierto
          </div>
        )}
      </div>
      <button
        disabled={bloqueado}
        onClick={() => onCrear(equipo)}
        style={{
          padding: "7px 16px", borderRadius: 8, border: "none", fontWeight: 700,
          fontSize: "0.85rem", cursor: bloqueado ? "not-allowed" : "pointer",
          background: bloqueado ? "#d1d5db" : "#4c7318",
          color: bloqueado ? "#9ca3af" : "#fff",
        }}
      >
        Crear ticket
      </button>
    </div>
  );
}

// ─── Tabla de mis tickets ─────────────────────────────────────────────────────
function TablaTickets({ tickets, loading }) {
  if (loading) return <div style={{ color: "#9ca3af", padding: "16px 0" }}>Cargando...</div>;
  if (!tickets.length) return (
    <div style={{ color: "#9ca3af", padding: "24px 0", textAlign: "center", fontSize: "0.9rem" }}>
      No tienes tickets creados.
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {tickets.map(t => (
        <div key={t.ticketId} style={{
          border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 12, background: "#fff",
        }}>
          <div style={{ color: "#6b7280", fontSize: "0.82rem", fontWeight: 700, width: 50 }}>
            #{t.ticketId}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem" }}>{t.serie}</div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: 2 }}>
              {t.solicitud?.length > 80 ? `${t.solicitud.substring(0, 80)}…` : t.solicitud}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
            <BadgePrioridad value={t.prioridad} />
            <BadgeEstado    value={t.estado} />
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.78rem", flexShrink: 0 }}>
            {t.fechaCreacion ? String(t.fechaCreacion).substring(0, 10) : "—"}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Sección completa del usuario ─────────────────────────────────────────────
export default function SeccionUsuario({ equipos, tickets, loadingEquipos, loadingTickets, onCrearTicket }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Mis equipos */}
      <div>
        <h3 style={{ margin: "0 0 12px", fontWeight: 800, color: "#111827", fontSize: "1rem" }}>
          🖥️ Mis equipos
        </h3>
        {loadingEquipos ? (
          <div style={{ color: "#9ca3af" }}>Cargando equipos...</div>
        ) : !equipos.length ? (
          <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>No tienes equipos asignados.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {equipos.map(e => (
              <TarjetaEquipo key={e.equipoId} equipo={e} onCrear={onCrearTicket} />
            ))}
          </div>
        )}
      </div>

      {/* Mis tickets */}
      <div>
        <h3 style={{ margin: "0 0 12px", fontWeight: 800, color: "#111827", fontSize: "1rem" }}>
          🎫 Mis tickets
        </h3>
        <TablaTickets tickets={tickets} loading={loadingTickets} />
      </div>

    </div>
  );
}
