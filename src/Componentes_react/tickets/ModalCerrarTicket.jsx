import { useState } from "react";
import Overlay from "../ui/Overlay";
import { inputStyle, labelStyle } from "../ui/formStyles";

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
    <Overlay onCerrar={onCerrar}>
      <div style={{ maxWidth: 500, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, color: "#111827" }}>🔧 Cerrar ticket</h3>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.85rem" }}>
              {ticket.serie} — <span style={{ fontWeight: 600 }}>{ticket.equipoNombre}</span>
            </p>
          </div>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#9ca3af" }}>×</button>
        </div>

        <div style={{ background: "rgba(160,215,68,0.08)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: "0.85rem", color: "#374151", border: "1px solid rgba(160,215,68,0.2)" }}>
          <strong>Solicitud:</strong> {ticket.solicitud}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Descargo técnico <span style={{ color: "#ef4444" }}>*</span></label>
          <textarea rows={4} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
            placeholder="Describe el diagnóstico y la solución aplicada..."
            value={form.descargoTecnico} onChange={e => set("descargoTecnico", e.target.value)} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, cursor: "pointer" }}
          onClick={() => set("huboCambioPiezas", !form.huboCambioPiezas)}>
          <input type="checkbox" checked={form.huboCambioPiezas} readOnly style={{ width: 16, height: 16, cursor: "pointer" }} />
          <span style={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem" }}>Hubo cambio o reemplazo de piezas</span>
        </div>

        {form.huboCambioPiezas && (
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Descripción de piezas <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea rows={2} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
              placeholder="Ej: Fuente de poder 500W EVGA, disco duro 1TB..."
              value={form.descripcionCambioPiezas} onChange={e => set("descripcionCambioPiezas", e.target.value)} />
          </div>
        )}

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
          <button onClick={handleSubmit} disabled={loading}
            style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: "#dc2626", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Cerrando..." : "Cerrar ticket"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
