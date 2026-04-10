import { useState, useEffect } from "react";
import { fotosApi } from "../../../api/equipoExtras.api";
import { useSelector } from "react-redux";

const API_BASE = import.meta.env.VITE_API_BASE_URI;
const S = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, padding: 16 },
  box:     { background: "#fff", borderRadius: 14, width: "100%", maxWidth: 540, padding: "24px 28px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", maxHeight: "90vh", overflowY: "auto" },
  label:   { fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 },
  input:   { padding: "8px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: "0.93rem", width: "100%", boxSizing: "border-box", outline: "none" },
  field:   { marginBottom: 14 },
  error:   { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "9px 12px", color: "#dc2626", fontSize: "0.85rem", marginTop: 8 },
  info:    { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", color: "#15803d", fontSize: "0.82rem" },
};

export default function ModalCerrarTicket({ ticket, onCerrar, onConfirmar, loading }) {
  const token   = useSelector(s => s.auth?.accessToken);
  const usuario = useSelector(s => s.auth?.usuario);

  const [form, setForm]         = useState({ descargoTecnico: "", huboCambioPiezas: false, descripcionCambioPiezas: "" });
  const [error, setError]       = useState("");
  const [fotosEquipo, setFotos] = useState([]);
  const [subiendoFoto, setSubiendo] = useState(false);
  const [fotoNuevaId,  setFotoNuevaId]  = useState(null);
  const [fotoNuevaUrl, setFotoNuevaUrl] = useState(null);
  const [fotoReemplazadaId, setFotoReemplazadaId] = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Cargar fotos activas del equipo cuando se activa cambio de piezas
  useEffect(() => {
    if (!form.huboCambioPiezas || !ticket.equipoId) return;
    fotosApi.listarActivasByEquipo(ticket.equipoId)
      .then(r => setFotos(Array.isArray(r.datos) ? r.datos : []))
      .catch(() => setFotos([]));
  }, [form.huboCambioPiezas, ticket.equipoId]);

  const handleUploadFoto = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setSubiendo(true); setError("");
    try {
      const fd = new FormData();
      fd.append("archivo",  archivo);
      fd.append("equipoId", String(ticket.equipoId));
      fd.append("nombre",   `Pieza cambiada - ${archivo.name}`);
      const uid = usuario?.id ?? usuario?.usuarioId;
      if (uid != null) fd.append("usuarioSubioId", String(uid));

      const res = await fetch(`${API_BASE}/api/Fotos/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!data.exito) throw new Error(data.mensaje || "No se pudo subir la foto.");
      setFotoNuevaId(data.datos.fotoId);
      setFotoNuevaUrl(`${API_BASE}${data.datos.url}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubiendo(false);
    }
  };

  const handleSubmit = () => {
    if (!form.descargoTecnico.trim())           { setError("El descargo es obligatorio."); return; }
    if (form.descargoTecnico.trim().length < 10) { setError("El descargo debe tener al menos 10 caracteres."); return; }
    if (form.huboCambioPiezas && !form.descripcionCambioPiezas.trim()) { setError("Describe las piezas reemplazadas."); return; }
    if (form.huboCambioPiezas && !fotoNuevaId) { setError("Debes subir la foto de la pieza instalada."); return; }
    setError("");
    onConfirmar({
      descargoTecnico:         form.descargoTecnico.trim(),
      huboCambioPiezas:        form.huboCambioPiezas,
      descripcionCambioPiezas: form.huboCambioPiezas ? form.descripcionCambioPiezas.trim() : null,
      fotoNuevaId:             form.huboCambioPiezas ? fotoNuevaId : null,
      fotoReemplazadaId:       form.huboCambioPiezas ? fotoReemplazadaId : null,
    });
  };

  return (
    <div style={S.overlay}>
      <div style={S.box}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, color: "#111827" }}>🔧 Cerrar ticket</h3>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.83rem" }}>
              {ticket.serie} — <strong>{ticket.equipoNombre}</strong>
            </p>
          </div>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#9ca3af" }}>×</button>
        </div>

        <div style={{ ...S.info, marginBottom: 14 }}>
          📋 Al cerrar, el cliente recibirá una notificación para confirmar o reclamar.
        </div>

        <div style={{ background: "#f9fafb", borderRadius: 8, padding: "8px 12px", marginBottom: 14, fontSize: "0.83rem", color: "#374151" }}>
          <strong>Solicitud:</strong> {ticket.solicitud}
        </div>

        <div style={S.field}>
          <label style={S.label}>Descargo técnico <span style={{ color: "#ef4444" }}>*</span></label>
          <textarea rows={4} style={{ ...S.input, resize: "vertical", fontFamily: "inherit" }}
            placeholder="Diagnóstico y solución aplicada..."
            value={form.descargoTecnico} onChange={e => set("descargoTecnico", e.target.value)} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, cursor: "pointer" }}
          onClick={() => { set("huboCambioPiezas", !form.huboCambioPiezas); setFotoNuevaId(null); setFotoNuevaUrl(null); setFotoReemplazadaId(null); }}>
          <input type="checkbox" checked={form.huboCambioPiezas} readOnly style={{ width: 16, height: 16, cursor: "pointer" }} />
          <span style={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem" }}>Hubo cambio o reemplazo de pieza</span>
        </div>

        {form.huboCambioPiezas && (
          <>
            <div style={S.field}>
              <label style={S.label}>¿Qué pieza se cambió? <span style={{ color: "#ef4444" }}>*</span></label>
              <textarea rows={2} style={{ ...S.input, resize: "vertical", fontFamily: "inherit" }}
                placeholder="Ej: Fuente de poder 500W, disco duro 1TB..."
                value={form.descripcionCambioPiezas} onChange={e => set("descripcionCambioPiezas", e.target.value)} />
            </div>

            <div style={S.field}>
              <label style={S.label}>📷 Foto de la pieza instalada <span style={{ color: "#ef4444" }}>*</span></label>
              {fotoNuevaUrl ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={fotoNuevaUrl} alt="pieza nueva" style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8, border: "1.5px solid #bbf7d0" }} onError={e => e.target.style.display = "none"} />
                  <div style={{ fontSize: "0.82rem", color: "#15803d" }}>✅ Foto subida correctamente</div>
                  <button onClick={() => { setFotoNuevaId(null); setFotoNuevaUrl(null); }}
                    style={{ background: "none", border: "1px solid #fca5a5", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#dc2626", fontSize: "0.78rem" }}>
                    Cambiar
                  </button>
                </div>
              ) : (
                <label style={{ display: "block", padding: "8px 14px", borderRadius: 8, border: "1.5px dashed #d1d5db", background: "#f9fafb", cursor: "pointer", fontSize: "0.85rem", color: "#6b7280", textAlign: "center" }}>
                  {subiendoFoto ? "⏳ Subiendo..." : "📤 Seleccionar foto..."}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleUploadFoto} disabled={subiendoFoto} />
                </label>
              )}
            </div>

            {fotosEquipo.length > 0 && (
              <div style={S.field}>
                <label style={S.label}>🔄 ¿Reemplaza a cuál foto del equipo? (opcional)</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {fotosEquipo.map(f => (
                    <div key={f.fotoId}
                      onClick={() => setFotoReemplazadaId(prev => prev === f.fotoId ? null : f.fotoId)}
                      style={{ cursor: "pointer", border: `2.5px solid ${fotoReemplazadaId === f.fotoId ? "#dc2626" : "#e5e7eb"}`, borderRadius: 8, overflow: "hidden", width: 70 }}>
                      <img src={`${API_BASE}${f.url}`} alt={f.nombre ?? "foto"} style={{ width: 70, height: 60, objectFit: "cover", display: "block" }} onError={e => e.target.style.display = "none"} />
                      <div style={{ fontSize: "0.7rem", padding: "2px 4px", textAlign: "center", color: fotoReemplazadaId === f.fotoId ? "#dc2626" : "#6b7280", fontWeight: fotoReemplazadaId === f.fotoId ? 700 : 400 }}>
                        {fotoReemplazadaId === f.fotoId ? "✖ Reemplazar" : f.nombre?.slice(0, 10) ?? "Foto"}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: "0.76rem", color: "#9ca3af", marginTop: 4 }}>La foto seleccionada se desactivará (queda en historial, no se borra).</div>
              </div>
            )}
          </>
        )}

        {error && <div style={S.error}>⚠️ {error}</div>}

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button onClick={onCerrar} disabled={loading}
            style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading || subiendoFoto}
            style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: "#dc2626", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Enviando..." : "Enviar al cliente"}
          </button>
        </div>
      </div>
    </div>
  );
}
