import { useState } from "react";

const S = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 },
  box:     { background: "#fff", borderRadius: 14, width: "100%", maxWidth: 500, padding: "28px 32px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" },
  label:   { fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 },
  input:   { padding: "8px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: "0.95rem", width: "100%", boxSizing: "border-box", outline: "none" },
  field:   { marginBottom: 14 },
  error:   { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "9px 12px", color: "#dc2626", fontSize: "0.87rem", marginTop: 12 },
};

export default function ModalCerrarTicket({ ticket, onCerrar, onConfirmar, loading }) {
  const [form, setForm] = useState({ descargoTecnico: "", huboCambioPiezas: false, descripcionCambioPiezas: "" });
  const [error, setError] = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.descargoTecnico.trim()) { setError("El descargo es obligatorio."); return; }
    if (form.huboCambioPiezas && !form.descripcionCambioPiezas.trim()) {
      setError("Debe describir las piezas reemplazadas."); return;
    }
    setError("");
    onConfirmar({
      descargoTecnico:         form.descargoTecnico.trim(),
      huboCambioPiezas:        form.huboCambioPiezas,
      descripcionCambioPiezas: form.huboCambioPiezas ? form.descripcionCambioPiezas.trim() : null,
    });
  };

  return (
    <div style={S.overlay}>
      <div style={S.box}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, color: "#111827" }}>🔧 Cerrar ticket</h3>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.85rem" }}>
              {ticket.serie} — <span style={{ fontWeight: 600 }}>{ticket.equipoNombre}</span>
            </p>
          </div>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#9ca3af" }}>×</button>
        </div>

        <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: "0.85rem", color: "#374151" }}>
          <strong>Solicitud:</strong> {ticket.solicitud}
        </div>

        <div style={S.field}>
          <label style={S.label}>Descargo técnico <span style={{ color: "#ef4444" }}>*</span></label>
          <textarea rows={4} style={{ ...S.input, resize: "vertical", fontFamily: "inherit" }}
            placeholder="Describe el diagnóstico y la solución aplicada..."
            value={form.descargoTecnico} onChange={e => set("descargoTecnico", e.target.value)} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, cursor: "pointer" }}
          onClick={() => set("huboCambioPiezas", !form.huboCambioPiezas)}>
          <input type="checkbox" checked={form.huboCambioPiezas} readOnly
            style={{ width: 16, height: 16, cursor: "pointer" }} />
          <span style={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem" }}>
            Hubo cambio o reemplazo de piezas
          </span>
        </div>

        {form.huboCambioPiezas && (
          <div style={S.field}>
            <label style={S.label}>Descripción de piezas <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea rows={2} style={{ ...S.input, resize: "vertical", fontFamily: "inherit" }}
              placeholder="Ej: Fuente de poder 500W EVGA, disco duro 1TB..."
              value={form.descripcionCambioPiezas} onChange={e => set("descripcionCambioPiezas", e.target.value)} />
          </div>
        )}

        {error && <div style={S.error}>⚠️ {error}</div>}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onCerrar} disabled={loading}
            style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading}
            style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: "#dc2626", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Cerrando..." : "Cerrar ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}
