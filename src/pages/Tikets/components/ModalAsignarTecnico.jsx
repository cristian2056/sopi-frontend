// src/pages/Tikets/components/ModalAsignarTecnico.jsx
import { useState } from "react";

const S = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 },
  box:     { background: "#fff", borderRadius: 14, width: "100%", maxWidth: 420, padding: "28px 32px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" },
  label:   { fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 },
  input:   { padding: "8px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: "0.95rem", width: "100%", boxSizing: "border-box", outline: "none" },
  error:   { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "9px 12px", color: "#dc2626", fontSize: "0.87rem", marginTop: 12 },
};

export default function ModalAsignarTecnico({ ticket, tecnicos = [], onAsignar, onCerrar, loading }) {
  const [tecnicoId, setTecnicoId] = useState(ticket?.usuarioTecnicoId ? String(ticket.usuarioTecnicoId) : "");
  const [error,     setError]     = useState("");

  const handleSubmit = () => {
    if (!tecnicoId) { setError("Seleccioná un técnico."); return; }
    setError("");
    onAsignar({ usuarioTecnicoId: Number(tecnicoId) });
  };

  return (
    <div style={S.overlay}>
      <div style={S.box}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, color: "#111827" }}>👷 Asignar técnico</h3>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.84rem" }}>
              {ticket?.serie}
            </p>
          </div>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#9ca3af" }}>×</button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Técnico <span style={{ color: "#ef4444" }}>*</span></label>
          <select style={{ ...S.input, background: "#fff", cursor: "pointer" }}
            value={tecnicoId} onChange={e => setTecnicoId(e.target.value)}>
            <option value="">— Seleccioná un técnico —</option>
            {tecnicos.map(u => (
              <option key={u.usuarioId} value={u.usuarioId}>
                {u.nombreCompleto ?? u.userName ?? `Usuario #${u.usuarioId}`}
              </option>
            ))}
          </select>
        </div>

        {error && <div style={S.error}>⚠️ {error}</div>}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onCerrar} disabled={loading}
            style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading}
            style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: "#4c7318", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Asignando..." : "Asignar"}
          </button>
        </div>
      </div>
    </div>
  );
}
