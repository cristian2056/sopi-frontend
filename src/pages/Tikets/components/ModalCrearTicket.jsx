import { useState } from "react";

const PRIORIDADES = ["BAJA", "MEDIA", "ALTA", "URGENTE"];

const S = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 },
  box:     { background: "#fff", borderRadius: 14, width: "100%", maxWidth: 480, padding: "28px 32px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" },
  label:   { fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 },
  input:   { padding: "8px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: "0.95rem", width: "100%", boxSizing: "border-box", outline: "none" },
  field:   { marginBottom: 14 },
  error:   { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "9px 12px", color: "#dc2626", fontSize: "0.87rem", marginTop: 12 },
};

export default function ModalCrearTicket({ equipo, onCrear, onCerrar, loading }) {
  const [form, setForm] = useState({ prioridad: "MEDIA", solicitud: "" });
  const [error, setError] = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.solicitud.trim() || form.solicitud.trim().length < 10) {
      setError("La solicitud debe tener al menos 10 caracteres."); return;
    }
    setError("");
    onCrear({ equipoId: equipo.equipoId, prioridad: form.prioridad, solicitud: form.solicitud.trim() });
  };

  return (
    <div style={S.overlay}>
      <div style={S.box}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, color: "#111827" }}>🎫 Crear ticket</h3>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.85rem" }}>
              {equipo.nombre} — <span style={{ fontWeight: 600 }}>{equipo.codigoPatrimonial}</span>
            </p>
          </div>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#9ca3af" }}>×</button>
        </div>

        <div style={S.field}>
          <label style={S.label}>Prioridad</label>
          <select style={{ ...S.input, background: "#fff", cursor: "pointer" }}
            value={form.prioridad} onChange={e => set("prioridad", e.target.value)}>
            {PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div style={S.field}>
          <label style={S.label}>Descripción del problema <span style={{ color: "#ef4444" }}>*</span></label>
          <textarea rows={4} style={{ ...S.input, resize: "vertical", fontFamily: "inherit" }}
            placeholder="Describe el problema con detalle (mínimo 10 caracteres)..."
            value={form.solicitud} onChange={e => set("solicitud", e.target.value)} />
        </div>

        {error && <div style={S.error}>⚠️ {error}</div>}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onCerrar} disabled={loading}
            style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading}
            style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: "#4c7318", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Enviando..." : "Crear ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}
