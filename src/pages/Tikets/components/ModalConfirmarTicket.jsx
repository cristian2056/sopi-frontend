import { useState, useEffect } from "react";
import { fotosApi } from "../../../api/equipoExtras.api";

const API_BASE = import.meta.env.VITE_API_BASE_URI;
const S = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, padding: 16 },
  box:     { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520, padding: "28px 30px", boxShadow: "0 8px 48px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" },
  label:   { fontSize: "0.78rem", color: "#6b7280", marginBottom: 4, display: "block" },
  input:   { padding: "8px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: "0.93rem", width: "100%", boxSizing: "border-box", outline: "none" },
  error:   { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "9px 12px", color: "#dc2626", fontSize: "0.85rem", marginTop: 8 },
};

export default function ModalConfirmarTicket({ ticket, onCerrar, onConfirmar, onReclamar, loading }) {
  const [modo,   setModo]   = useState("ver");    // "ver" | "reclamar"
  const [motivo, setMotivo] = useState("");
  const [error,  setError]  = useState("");
  const [cambios, setCambios] = useState([]);

  useEffect(() => {
    if (!ticket?.equipoId || !ticket?.huboCambioPiezas) return;
    fotosApi.piezasCambiadas(ticket.equipoId)
      .then(r => {
        const todos = Array.isArray(r.datos) ? r.datos : [];
        setCambios(todos.filter(c => c.ticketId === ticket.ticketId));
      })
      .catch(() => setCambios([]));
  }, [ticket]);

  const handleReclamar = () => {
    if (!motivo.trim() || motivo.trim().length < 10) {
      setError("El motivo debe tener al menos 10 caracteres."); return;
    }
    setError("");
    onReclamar({ motivoReclamo: motivo.trim() });
  };

  if (!ticket) return null;

  return (
    <div style={S.overlay}>
      <div style={S.box}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, color: "#111827" }}>🔍 Revisión de ticket</h3>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.83rem" }}>
              {ticket.serie} — <strong>{ticket.equipoNombre}</strong>
            </p>
          </div>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#9ca3af" }}>×</button>
        </div>

        {/* Solicitud */}
        <div style={{ marginBottom: 14 }}>
          <span style={S.label}>Tu solicitud</span>
          <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px", fontSize: "0.88rem", lineHeight: 1.5, color: "#374151" }}>
            {ticket.solicitud}
          </div>
        </div>

        {/* Descargo del técnico */}
        {ticket.descargoTecnico && (
          <div style={{ marginBottom: 14 }}>
            <span style={S.label}>Respuesta del técnico</span>
            <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "10px 12px", fontSize: "0.88rem", lineHeight: 1.5, color: "#15803d", border: "1px solid #bbf7d0" }}>
              {ticket.descargoTecnico}
            </div>
          </div>
        )}

        {/* Piezas cambiadas */}
        {ticket.huboCambioPiezas && (
          <div style={{ marginBottom: 14 }}>
            <span style={S.label}>🔧 Cambio de pieza — {ticket.descripcionCambioPiezas}</span>
            {cambios.length > 0 ? (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                {cambios.map(c => (
                  <div key={c.fotoCambioId} style={{ display: "flex", gap: 8, background: "#fefce8", border: "1px solid #fde68a", borderRadius: 10, padding: "8px 10px", alignItems: "center" }}>
                    {c.fotoReemplazadaUrl && (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginBottom: 2 }}>Antes</div>
                        <img src={c.fotoReemplazadaUrl} alt="antes" style={{ width: 64, height: 56, objectFit: "cover", borderRadius: 6, border: "1.5px solid #fca5a5" }} onError={e => e.target.style.display = "none"} />
                      </div>
                    )}
                    <div style={{ fontSize: "1rem", color: "#9ca3af" }}>→</div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginBottom: 2 }}>Instalada</div>
                      <img src={c.fotoNuevaUrl} alt="instalada" style={{ width: 64, height: 56, objectFit: "cover", borderRadius: 6, border: "1.5px solid #bbf7d0" }} onError={e => e.target.style.display = "none"} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#9ca3af", fontSize: "0.82rem", marginTop: 4 }}>Sin foto de cambio adjunta.</div>
            )}
          </div>
        )}

        {modo === "ver" && (
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => setModo("reclamar")} disabled={loading}
              style={{ flex: 1, padding: "10px 0", borderRadius: 9, border: "2px solid #dc2626", background: "#fff", color: "#dc2626", fontWeight: 700, fontSize: "0.93rem", cursor: "pointer" }}>
              ⚠️ Reclamar
            </button>
            <button onClick={() => { setError(""); onConfirmar(); }} disabled={loading}
              style={{ flex: 1, padding: "10px 0", borderRadius: 9, border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: "0.93rem", cursor: "pointer" }}>
              {loading ? "Procesando..." : "✅ Conforme"}
            </button>
          </div>
        )}

        {modo === "reclamar" && (
          <div style={{ marginTop: 16 }}>
            <label style={{ ...S.label, fontWeight: 600, color: "#374151" }}>
              ✍️ Motivo del reclamo <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea rows={4}
              style={{ ...S.input, resize: "vertical", fontFamily: "inherit" }}
              placeholder="Explica por qué no estás conforme con la solución..."
              value={motivo} onChange={e => setMotivo(e.target.value)} />
            <div style={{ fontSize: "0.77rem", color: "#9ca3af", marginTop: 4 }}>
              Mínimo 10 caracteres · Máximo 500
            </div>
            {error && <div style={S.error}>⚠️ {error}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={() => { setModo("ver"); setError(""); }}
                style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", fontWeight: 600, cursor: "pointer" }}>
                Volver
              </button>
              <button onClick={handleReclamar} disabled={loading}
                style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: "#dc2626", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {loading ? "Enviando..." : "Enviar reclamo"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
