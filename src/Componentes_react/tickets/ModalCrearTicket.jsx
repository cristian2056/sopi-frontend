import { useState } from "react";
import Overlay from "../ui/Overlay";
import { inputStyle, labelStyle } from "../ui/formStyles";

const PRIORIDADES = ["BAJA", "MEDIA", "ALTA", "URGENTE"];
const EMPTY_EQUIPOS = [];

export default function ModalCrearTicket({ equipo, equipos = EMPTY_EQUIPOS, onCrear, onCerrar, loading }) {
  const primeraOpcion = equipo ?? (equipos.length === 1 ? equipos[0] : null);

  const [equipoId,  setEquipoId]  = useState(primeraOpcion?.equipoId ?? "");
  const [prioridad, setPrioridad] = useState("MEDIA");
  const [solicitud, setSolicitud] = useState("");
  const [error,     setError]     = useState("");

  const listaDisponible = equipo ? [equipo] : equipos;
  const equipoActual    = listaDisponible.find(e => e.equipoId === Number(equipoId)) ?? null;
  const bloqueado       = equipoActual?.tieneTicketAbierto ?? false;

  const handleSubmit = () => {
    if (!equipoId) { setError("Seleccioná un equipo."); return; }
    if (bloqueado)  { setError("Este equipo ya tiene un ticket abierto."); return; }
    if (!solicitud.trim() || solicitud.trim().length < 10) {
      setError("La solicitud debe tener al menos 10 caracteres."); return;
    }
    setError("");
    onCrear({ equipoId: Number(equipoId), prioridad, solicitud: solicitud.trim() });
  };

  return (
    <Overlay onCerrar={onCerrar}>
      <div style={{ maxWidth: 480, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, color: "#111827" }}>🎫 Crear ticket</h3>
            {equipoActual && (
              <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.85rem" }}>
                {equipoActual.nombre} — <span style={{ fontWeight: 600 }}>{equipoActual.codigoPatrimonial}</span>
              </p>
            )}
          </div>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#9ca3af" }}>×</button>
        </div>

        {!equipo && (
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="mt-equipo" style={labelStyle}>Equipo <span style={{ color: "#ef4444" }}>*</span></label>
            {!equipos.length ? (
              <div style={{ color: "#9ca3af", fontSize: "0.88rem", padding: "8px 0" }}>
                No tienes equipos asignados. Contactá al administrador.
              </div>
            ) : (
              <select id="mt-equipo" style={{ ...inputStyle, background: "#fff", cursor: "pointer" }}
                value={equipoId} onChange={e => setEquipoId(e.target.value)}>
                <option value="">— Seleccioná un equipo —</option>
                {equipos.map(e => (
                  <option key={e.equipoId} value={e.equipoId} disabled={e.tieneTicketAbierto}>
                    {e.nombre ?? e.codigoPatrimonial}{e.tieneTicketAbierto ? " (ticket abierto)" : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="mt-prior" style={labelStyle}>Prioridad</label>
          <select id="mt-prior" style={{ ...inputStyle, background: "#fff", cursor: "pointer" }}
            value={prioridad} onChange={e => setPrioridad(e.target.value)}>
            {PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="mt-desc" style={labelStyle}>Descripción del problema <span style={{ color: "#ef4444" }}>*</span></label>
          <textarea id="mt-desc" rows={4} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
            placeholder="Describe el problema con detalle (mínimo 10 caracteres)..."
            value={solicitud} onChange={e => setSolicitud(e.target.value)} />
        </div>

        {error && (
          <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(252,165,165,0.4)", borderRadius: 8, padding: "9px 12px", color: "#dc2626", fontSize: "0.87rem", marginBottom: 14 }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onCerrar} disabled={loading}
            style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading || (!equipo && !equipos.length)}
            style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: "#4c7318", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Enviando..." : "Crear ticket"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
