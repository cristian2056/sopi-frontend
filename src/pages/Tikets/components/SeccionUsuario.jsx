// src/pages/Tikets/components/SeccionUsuario.jsx
import { useState } from "react";
import { BadgePrioridad, BadgeEstado } from "./TicketBadges";
import EquipoDetalleEmbed from "../../Equipo/EquipoDetalleEmbed";

// ─── Fila de ticket ───────────────────────────────────────────────────────────
function FilaTicket({ ticket }) {
  return (
    <div style={{
      border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 16px",
      display: "flex", alignItems: "center", gap: 12, background: "#fff",
    }}>
      <div style={{ color: "#6b7280", fontSize: "0.8rem", fontWeight: 700, width: 44, flexShrink: 0 }}>
        #{ticket.ticketId}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.88rem" }}>{ticket.serie}</div>
        {ticket.usuarioTecnicoNombre && (
          <div style={{ color: "#4c7318", fontSize: "0.78rem", marginTop: 2 }}>
            🔧 {ticket.usuarioTecnicoNombre}
          </div>
        )}
        <div style={{ color: "#9ca3af", fontSize: "0.77rem", marginTop: 2 }}>
          {ticket.solicitud?.length > 70 ? `${ticket.solicitud.substring(0, 70)}…` : ticket.solicitud}
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
        <BadgePrioridad value={ticket.prioridad} />
        <BadgeEstado    value={ticket.estado}    />
      </div>
      <div style={{ color: "#9ca3af", fontSize: "0.77rem", flexShrink: 0 }}>
        {ticket.fechaCreacion ? String(ticket.fechaCreacion).substring(0, 10) : "—"}
      </div>
    </div>
  );
}

// ─── Lista de tickets ─────────────────────────────────────────────────────────
function ListaTickets({ tickets, loading, vacio }) {
  if (loading) return <div style={{ color: "#9ca3af", padding: "12px 0" }}>Cargando...</div>;
  if (!tickets.length) return (
    <div style={{ color: "#9ca3af", fontSize: "0.88rem", padding: "16px 0", textAlign: "center" }}>
      {vacio}
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {tickets.map(t => <FilaTicket key={t.ticketId} ticket={t} />)}
    </div>
  );
}

// ─── Vista principal del usuario ──────────────────────────────────────────────
export default function SeccionUsuario({ equipos, tickets, loadingEquipos, loadingTickets, onCrearTicket }) {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  const equipoActual = equipoSeleccionado ?? equipos[0] ?? null;
  const activos      = tickets.filter(t => t.estado !== "CERRADO");
  const cerrados     = tickets.filter(t => t.estado === "CERRADO");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* ── Botón crear ticket (siempre visible) ── */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => onCrearTicket(equipoActual ?? true)}
          disabled={loadingEquipos}
          style={{
            padding: "9px 22px", borderRadius: 8, border: "none", fontWeight: 700,
            fontSize: "0.92rem", cursor: loadingEquipos ? "not-allowed" : "pointer",
            background: "#4c7318", color: "#fff",
          }}
        >
          ➕ Nuevo ticket
        </button>
      </div>

      {/* ── Equipo(s) ── */}
      {loadingEquipos ? (
        <div style={{ color: "#9ca3af" }}>Cargando equipos...</div>
      ) : !equipos.length ? (
        <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
          No tienes equipos asignados. Contactá al administrador.
        </div>
      ) : (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>

          {/* Selector si tiene más de uno */}
          {equipos.length > 1 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {equipos.map(e => (
                <button key={e.equipoId} onClick={() => setEquipoSeleccionado(e)} style={{
                  padding: "6px 14px", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem",
                  border: `2px solid ${equipoActual?.equipoId === e.equipoId ? "#4c7318" : "#e5e7eb"}`,
                  background: equipoActual?.equipoId === e.equipoId ? "#f0fdf4" : "#fff",
                  color: equipoActual?.equipoId === e.equipoId ? "#4c7318" : "#374151",
                  cursor: "pointer",
                }}>
                  🖥️ {e.nombre ?? e.codigoPatrimonial}
                </button>
              ))}
            </div>
          )}

          {equipoActual && (
            <>
              <h3 style={{ margin: "0 0 16px", fontWeight: 800, fontSize: "1rem", color: "#111827" }}>
                🖥️ {equipos.length === 1 ? "Mi equipo" : equipoActual.nombre ?? equipoActual.codigoPatrimonial}
              </h3>
              <EquipoDetalleEmbed equipoId={equipoActual.equipoId} />
            </>
          )}
        </div>
      )}

      {/* ── Mis tickets ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <h3 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "1rem", color: "#111827" }}>
            🎫 Tickets activos
          </h3>
          <ListaTickets tickets={activos} loading={loadingTickets} vacio="No tienes tickets activos." />
        </div>
        <div>
          <h3 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "1rem", color: "#111827" }}>
            ✅ Resueltos
          </h3>
          <ListaTickets tickets={cerrados} loading={loadingTickets} vacio="No tienes tickets resueltos." />
        </div>
      </div>

    </div>
  );
}
