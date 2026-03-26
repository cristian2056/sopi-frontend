// src/pages/Tikets/components/SeccionUsuario.jsx
import { useState } from "react";
import { BadgePrioridad, BadgeEstado } from "./TicketBadges";

// ─── Fila de ticket ───────────────────────────────────────────────────────────
function FilaTicket({ ticket, onClick }) {
  return (
    <div
      role="button" tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === "Enter") onClick(); }}
      style={{
        border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12, background: "#fff",
        cursor: "pointer", transition: "box-shadow 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ color: "#6b7280", fontSize: "0.8rem", fontWeight: 700, width: 44, flexShrink: 0 }}>
        #{ticket.ticketId}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.88rem" }}>{ticket.serie}</div>
        <div style={{ color: "#6b7280", fontSize: "0.78rem", marginTop: 2 }}>
          {ticket.equipoNombre ?? "Sin equipo"}
        </div>
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

// ─── Vista detalle de 1 ticket ────────────────────────────────────────────────
function VistaDetalle({ ticket, onVolver }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, background: "#fff" }}>
      <button onClick={onVolver} style={{
        padding: "6px 14px", borderRadius: 7, border: "1px solid #e5e7eb",
        background: "none", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
        color: "#374151", marginBottom: 16,
      }}>
        ← Volver
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontWeight: 800, fontSize: "1rem", color: "#111827" }}>{ticket.serie}</span>
        <BadgePrioridad value={ticket.prioridad} />
        <BadgeEstado    value={ticket.estado}    />
      </div>
      <Campo label="Equipo"   valor={ticket.equipoNombre ?? "—"} />
      <Campo label="Fecha"    valor={ticket.fechaCreacion ? String(ticket.fechaCreacion).substring(0, 10) : "—"} />
      {ticket.usuarioTecnicoNombre && (
        <Campo label="Técnico asignado" valor={`🔧 ${ticket.usuarioTecnicoNombre}`} />
      )}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 4 }}>Solicitud</div>
        <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px", fontSize: "0.88rem", lineHeight: 1.5 }}>
          {ticket.solicitud}
        </div>
      </div>
      {ticket.descargoTecnico && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 4 }}>Respuesta del técnico</div>
          <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "10px 12px", fontSize: "0.88rem", lineHeight: 1.5, color: "#15803d" }}>
            {ticket.descargoTecnico}
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({ label, valor }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#111827" }}>{valor}</div>
    </div>
  );
}

// ─── Tarjeta de equipo ────────────────────────────────────────────────────────
function TarjetaEquipo({ equipo, onCrear }) {
  const bloqueado = equipo.tieneTicketAbierto;
  return (
    <div style={{
      border: `1.5px solid ${bloqueado ? "#fca5a5" : "#e5e7eb"}`,
      borderRadius: 10, padding: "14px 16px", background: "#fff",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 9, flexShrink: 0,
        background: bloqueado ? "#fee2e2" : "#f0fdf4",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.2rem",
      }}>
        🖥️
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>
          {equipo.nombre ?? equipo.codigoPatrimonial}
        </div>
        <div style={{ fontSize: "0.77rem", color: "#6b7280", marginTop: 2 }}>
          {equipo.codigoPatrimonial}
          {bloqueado && <span style={{ color: "#dc2626", marginLeft: 6 }}>· Ticket abierto</span>}
        </div>
      </div>
      <button
        onClick={() => onCrear(equipo)}
        disabled={bloqueado}
        title={bloqueado ? "Ya tiene un ticket abierto" : "Crear ticket para este equipo"}
        style={{
          padding: "7px 14px", borderRadius: 7, border: "none",
          fontWeight: 700, fontSize: "0.82rem",
          background: bloqueado ? "#f3f4f6" : "#4c7318",
          color: bloqueado ? "#9ca3af" : "#fff",
          cursor: bloqueado ? "not-allowed" : "pointer",
          flexShrink: 0,
        }}
      >
        {bloqueado ? "No disponible" : "➕ Ticket"}
      </button>
    </div>
  );
}

// ─── Sección principal del usuario ───────────────────────────────────────────
export default function SeccionUsuario({ equipos, tickets, loadingEquipos, loadingTickets, onCrearTicket }) {
  const [detalle, setDetalle] = useState(null);

  const activos  = tickets.filter(t => t.estado !== "CERRADO");
  const cerrados = tickets.filter(t => t.estado === "CERRADO");

  if (detalle) {
    return <VistaDetalle ticket={detalle} onVolver={() => setDetalle(null)} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Mis equipos */}
      <div>
        <h3 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "1rem", color: "#111827" }}>
          🖥️ Mis equipos
        </h3>
        {loadingEquipos ? (
          <div style={{ color: "#9ca3af" }}>Cargando equipos...</div>
        ) : !equipos.length ? (
          <div style={{ color: "#9ca3af", fontSize: "0.88rem" }}>
            No tienes equipos asignados. Contactá al administrador.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {equipos.map(e => (
              <TarjetaEquipo key={e.equipoId} equipo={e} onCrear={onCrearTicket} />
            ))}
          </div>
        )}
      </div>

      {/* Mis tickets */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <h3 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "1rem", color: "#111827" }}>
            🎫 Tickets activos
          </h3>
          {loadingTickets ? (
            <div style={{ color: "#9ca3af" }}>Cargando...</div>
          ) : !activos.length ? (
            <div style={{ color: "#9ca3af", fontSize: "0.88rem", textAlign: "center", padding: "20px 0" }}>
              No tienes tickets activos.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activos.map(t => <FilaTicket key={t.ticketId} ticket={t} onClick={() => setDetalle(t)} />)}
            </div>
          )}
        </div>
        <div>
          <h3 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "1rem", color: "#111827" }}>
            ✅ Resueltos
          </h3>
          {loadingTickets ? (
            <div style={{ color: "#9ca3af" }}>Cargando...</div>
          ) : !cerrados.length ? (
            <div style={{ color: "#9ca3af", fontSize: "0.88rem", textAlign: "center", padding: "20px 0" }}>
              No tienes tickets resueltos.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cerrados.map(t => <FilaTicket key={t.ticketId} ticket={t} onClick={() => setDetalle(t)} />)}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
