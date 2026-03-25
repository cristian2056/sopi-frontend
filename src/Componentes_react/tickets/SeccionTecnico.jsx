// src/pages/Tikets/components/SeccionTecnico.jsx
import { useState } from "react";
import { BadgePrioridad, BadgeEstado } from "../ui/Badge";
import EquipoDetalleEmbed from "../equipo/EquipoDetalleEmbed";

const btnBase = {
  padding: "6px 14px", borderRadius: 7, border: "none",
  fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
};

// ─── Fila de ticket en la lista ───────────────────────────────────────────────
function FilaTicket({ ticket, accion, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClick(e); }}
      style={{
        border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12, background: "#fff",
        cursor: "pointer", transition: "box-shadow 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ color: "#6b7280", fontSize: "0.82rem", fontWeight: 700, width: 50, flexShrink: 0 }}>
        #{ticket.ticketId}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem" }}>{ticket.serie}</div>
        <div style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: 2 }}>
          {ticket.usuarioSolicitanteNombre ?? "—"} · {ticket.equipoNombre ?? "Sin equipo"}
        </div>
        <div style={{ color: "#9ca3af", fontSize: "0.78rem", marginTop: 2 }}>
          {ticket.solicitud?.length > 70 ? `${ticket.solicitud.substring(0, 70)}…` : ticket.solicitud}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
        <BadgePrioridad value={ticket.prioridad} />
        <BadgeEstado    value={ticket.estado}    />
      </div>
      <div onClick={e => e.stopPropagation()}>{accion}</div>
    </div>
  );
}

// ─── Vista de detalle: ticket + equipo ────────────────────────────────────────
function VistaDetalle({ ticket, onVolver, onTomar, onCerrar, tomarLoading }) {
  const puedeTomarTicket = ticket.estado === "ABIERTO";
  const puedesCerrar     = ticket.estado === "EN_PROCESO";

  return (
    <div>
      {/* Barra superior */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onVolver} style={{
          ...btnBase, background: "none", border: "1px solid #e5e7eb",
          color: "#374151", padding: "6px 12px",
        }}>
          ← Volver
        </button>
        <span style={{ fontWeight: 700, color: "#111827", fontSize: "1rem" }}>{ticket.serie}</span>
        <BadgePrioridad value={ticket.prioridad} />
        <BadgeEstado    value={ticket.estado}    />
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {puedeTomarTicket && (
            <button
              onClick={() => onTomar(ticket.ticketId)}
              disabled={tomarLoading === ticket.ticketId}
              style={{ ...btnBase, background: "#4c7318", color: "#fff" }}
            >
              {tomarLoading === ticket.ticketId ? "..." : "✋ Tomar ticket"}
            </button>
          )}
          {puedesCerrar && (
            <button
              onClick={() => onCerrar(ticket)}
              style={{ ...btnBase, background: "#dc2626", color: "#fff" }}
            >
              ✅ Cerrar ticket
            </button>
          )}
        </div>
      </div>

      {/* Contenido dividido */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, alignItems: "start" }}>

        {/* Izquierda: Detalle del ticket */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
          <h4 style={{ margin: "0 0 16px", fontWeight: 800, fontSize: "0.95rem", color: "#111827" }}>
            🎫 Detalle del ticket
          </h4>
          <Campo label="Solicitante"  valor={ticket.usuarioSolicitanteNombre ?? "—"} />
          <Campo label="Equipo"       valor={ticket.equipoNombre ?? "—"} />
          <Campo label="Categoría"    valor={ticket.categoriaNombre ?? "Sin categoría"} />
          <Campo label="Fecha"        valor={ticket.fechaCreacion ? String(ticket.fechaCreacion).substring(0, 10) : "—"} />
          {ticket.fechaAsignacionTecnico && (
            <Campo label="Asignado"   valor={String(ticket.fechaAsignacionTecnico).substring(0, 10)} />
          )}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 4 }}>Solicitud</div>
            <div style={{
              background: "#f9fafb", borderRadius: 8, padding: "10px 12px",
              fontSize: "0.88rem", color: "#111827", lineHeight: 1.5,
            }}>
              {ticket.solicitud}
            </div>
          </div>
          {ticket.descargoTecnico && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 4 }}>Descargo técnico</div>
              <div style={{
                background: "#f0fdf4", borderRadius: 8, padding: "10px 12px",
                fontSize: "0.88rem", color: "#111827", lineHeight: 1.5,
              }}>
                {ticket.descargoTecnico}
              </div>
            </div>
          )}
        </div>

        {/* Derecha: Detalle del equipo */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
          <h4 style={{ margin: "0 0 16px", fontWeight: 800, fontSize: "0.95rem", color: "#111827" }}>
            🖥️ Equipo reportado
          </h4>
          {ticket.equipoId
            ? <EquipoDetalleEmbed equipoId={ticket.equipoId} />
            : <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Sin equipo asociado.</div>
          }
        </div>

      </div>
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

// ─── Sección principal del técnico ───────────────────────────────────────────
export default function SeccionTecnico({
  pendientes, asignados,
  loadingPendientes, loadingAsignados,
  onTomar, onCerrar, tomarLoading,
}) {
  const [ticketAbierto, setTicketAbierto] = useState(null);

  // Vista de detalle al hacer clic
  if (ticketAbierto) {
    return (
      <VistaDetalle
        ticket={ticketAbierto}
        onVolver={() => setTicketAbierto(null)}
        onTomar={(id) => { onTomar(id); setTicketAbierto(null); }}
        onCerrar={onCerrar}
        tomarLoading={tomarLoading}
      />
    );
  }

  // Vista de lista
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Tickets pendientes */}
      <div>
        <h3 style={{ margin: "0 0 12px", fontWeight: 800, color: "#111827", fontSize: "1rem" }}>
          📥 Tickets pendientes
        </h3>
        {loadingPendientes ? (
          <div style={{ color: "#9ca3af" }}>Cargando...</div>
        ) : !pendientes.length ? (
          <div style={{ color: "#9ca3af", fontSize: "0.9rem", textAlign: "center", padding: "20px 0" }}>
            No hay tickets pendientes.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pendientes.map(t => (
              <FilaTicket key={t.ticketId} ticket={t}
                onClick={() => setTicketAbierto(t)}
                accion={
                  <button
                    onClick={() => onTomar(t.ticketId)}
                    disabled={tomarLoading === t.ticketId}
                    style={{ ...btnBase, background: "#4c7318", color: "#fff" }}
                  >
                    {tomarLoading === t.ticketId ? "..." : "Tomar"}
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Mis asignados */}
      <div>
        <h3 style={{ margin: "0 0 12px", fontWeight: 800, color: "#111827", fontSize: "1rem" }}>
          🔧 Mis tickets asignados
        </h3>
        {loadingAsignados ? (
          <div style={{ color: "#9ca3af" }}>Cargando...</div>
        ) : !asignados.length ? (
          <div style={{ color: "#9ca3af", fontSize: "0.9rem", textAlign: "center", padding: "20px 0" }}>
            No tienes tickets asignados.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {asignados.map(t => (
              <FilaTicket key={t.ticketId} ticket={t}
                onClick={() => setTicketAbierto(t)}
                accion={
                  <button
                    onClick={() => onCerrar(t)}
                    style={{ ...btnBase, background: "#dc2626", color: "#fff" }}
                  >
                    Cerrar
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
