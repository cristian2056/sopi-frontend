// src/pages/Tikets/components/SeccionAdmin.jsx
import { useState } from "react";
import { BadgePrioridad, BadgeEstado } from "./TicketBadges";
import EquipoDetalleEmbed from "../../Equipo/EquipoDetalleEmbed";

const btnBase = {
  padding: "6px 12px", borderRadius: 7, border: "none",
  fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
};

// ─── Vista detalle ticket ─────────────────────────────────────────────────────
function VistaDetalle({ ticket, tecnicos, onVolver, onAsignar, onCerrar }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onVolver} style={{ ...btnBase, background: "none", border: "1px solid #e5e7eb", color: "#374151" }}>
          ← Volver
        </button>
        <span style={{ fontWeight: 700, color: "#111827", fontSize: "1rem" }}>{ticket.serie}</span>
        <BadgePrioridad value={ticket.prioridad} />
        <BadgeEstado    value={ticket.estado}    />
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {(ticket.estado === "ABIERTO") && (
            <button onClick={() => onAsignar(ticket)}
              style={{ ...btnBase, background: "#4338ca", color: "#fff" }}>
              👷 Asignar técnico
            </button>
          )}
          {ticket.estado === "EN_PROCESO" && (
            <button onClick={() => onCerrar(ticket)}
              style={{ ...btnBase, background: "#dc2626", color: "#fff" }}>
              ✅ Cerrar ticket
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, alignItems: "start" }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
          <h4 style={{ margin: "0 0 16px", fontWeight: 800, fontSize: "0.95rem", color: "#111827" }}>🎫 Detalle</h4>
          <Campo label="Solicitante" valor={ticket.usuarioSolicitanteNombre ?? "—"} />
          <Campo label="Equipo"      valor={ticket.equipoNombre ?? "—"} />
          <Campo label="Técnico"     valor={ticket.usuarioTecnicoNombre ?? "Sin asignar"} />
          <Campo label="Fecha"       valor={ticket.fechaCreacion ? String(ticket.fechaCreacion).substring(0, 10) : "—"} />
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 4 }}>Solicitud</div>
            <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px", fontSize: "0.88rem", color: "#111827", lineHeight: 1.5 }}>
              {ticket.solicitud}
            </div>
          </div>
          {ticket.descargoTecnico && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 4 }}>Descargo técnico</div>
              <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "10px 12px", fontSize: "0.88rem", lineHeight: 1.5 }}>
                {ticket.descargoTecnico}
              </div>
            </div>
          )}
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
          <h4 style={{ margin: "0 0 16px", fontWeight: 800, fontSize: "0.95rem", color: "#111827" }}>🖥️ Equipo</h4>
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

// ─── Fila de ticket ───────────────────────────────────────────────────────────
function FilaTicket({ ticket, onVerDetalle, onAsignar, onCerrar }) {
  return (
    <div
      role="button" tabIndex={0}
      onClick={onVerDetalle}
      onKeyDown={e => { if (e.key === "Enter") onVerDetalle(); }}
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
          {ticket.usuarioSolicitanteNombre ?? "—"} · {ticket.equipoNombre ?? "Sin equipo"}
        </div>
        {ticket.usuarioTecnicoNombre && (
          <div style={{ color: "#4c7318", fontSize: "0.76rem", marginTop: 1 }}>
            🔧 {ticket.usuarioTecnicoNombre}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
        <BadgePrioridad value={ticket.prioridad} />
        <BadgeEstado    value={ticket.estado}    />
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
        {ticket.estado === "ABIERTO" && (
          <button onClick={() => onAsignar(ticket)}
            style={{ ...btnBase, background: "#4338ca", color: "#fff" }}>
            👷 Asignar
          </button>
        )}
        {ticket.estado === "EN_PROCESO" && (
          <button onClick={() => onCerrar(ticket)}
            style={{ ...btnBase, background: "#dc2626", color: "#fff" }}>
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Sección principal admin ──────────────────────────────────────────────────
export default function SeccionAdmin({
  todos, loading,
  onCrear, onAsignar, onCerrar,
}) {
  const [ticketAbierto, setTicketAbierto] = useState(null);
  const [filtro,        setFiltro]        = useState("TODOS");

  const FILTROS = ["TODOS", "ABIERTO", "EN_PROCESO", "CERRADO"];

  const lista = filtro === "TODOS" ? todos : todos.filter(t => t.estado === filtro);

  if (ticketAbierto) {
    return (
      <VistaDetalle
        ticket={ticketAbierto}
        onVolver={() => setTicketAbierto(null)}
        onAsignar={(t) => { setTicketAbierto(null); onAsignar(t); }}
        onCerrar={(t)  => { setTicketAbierto(null); onCerrar(t); }}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {FILTROS.map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: "6px 14px", borderRadius: 7, border: "none",
              fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
              background: filtro === f ? "#4c7318" : "#f3f4f6",
              color: filtro === f ? "#fff" : "#374151",
            }}>
              {f === "TODOS" ? "Todos" : f.replace("_", " ")}
            </button>
          ))}
        </div>
        <button onClick={onCrear} style={{
          marginLeft: "auto", padding: "8px 20px", borderRadius: 8, border: "none",
          background: "#4c7318", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
        }}>
          ➕ Nuevo ticket
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ color: "#9ca3af", padding: "20px 0" }}>Cargando tickets...</div>
      ) : !lista.length ? (
        <div style={{ color: "#9ca3af", fontSize: "0.9rem", textAlign: "center", padding: "32px 0" }}>
          No hay tickets {filtro !== "TODOS" ? `con estado ${filtro.replace("_", " ")}` : ""}.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lista.map(t => (
            <FilaTicket
              key={t.ticketId} ticket={t}
              onVerDetalle={() => setTicketAbierto(t)}
              onAsignar={onAsignar}
              onCerrar={onCerrar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
