import { BadgePrioridad, BadgeEstado } from "./TicketBadges";

const btnBase = { padding: "6px 14px", borderRadius: 7, border: "none", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" };

function FilaTicket({ ticket, accion }) {
  return (
    <div style={{
      border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 16px",
      display: "flex", alignItems: "center", gap: 12, background: "#fff",
    }}>
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
        <BadgeEstado    value={ticket.estado} />
      </div>
      {accion}
    </div>
  );
}

export default function SeccionTecnico({ pendientes, asignados, loadingPendientes, loadingAsignados, onTomar, onCerrar, tomarLoading }) {
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
              <FilaTicket key={t.ticketId} ticket={t} accion={
                <button
                  onClick={() => onTomar(t.ticketId)}
                  disabled={tomarLoading === t.ticketId}
                  style={{ ...btnBase, background: "#4c7318", color: "#fff", flexShrink: 0 }}
                >
                  {tomarLoading === t.ticketId ? "..." : "Tomar"}
                </button>
              } />
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
              <FilaTicket key={t.ticketId} ticket={t} accion={
                <button
                  onClick={() => onCerrar(t)}
                  style={{ ...btnBase, background: "#dc2626", color: "#fff", flexShrink: 0 }}
                >
                  Cerrar
                </button>
              } />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
