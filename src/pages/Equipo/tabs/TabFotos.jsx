// src/pages/Equipo/tabs/TabFotos.jsx
import React, { useEffect, useState } from "react";
import { fotosApi } from "../../../api/equipoExtras.api";
import ErrorBanner from "../../../Componentes_react/ui/ErrorBanner";
import ConfirmInline from "../../../Componentes_react/ui/ConfirmInline";
import FormFoto from "../components/FormFoto";

const API_BASE = import.meta.env.VITE_API_BASE_URI;

// ─── Modal historial piezas cambiadas ────────────────────────────────────────
function ModalPiezas({ equipoId, onCerrar }) {
  const [lista,   setLista]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fotosApi.piezasCambiadas(equipoId)
      .then(r => setLista(Array.isArray(r.datos) ? r.datos : []))
      .catch(() => setLista([]))
      .finally(() => setLoading(false));
  }, [equipoId]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9500, padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 14, maxWidth: 620, width: "100%", maxHeight: "85vh", overflow: "auto", padding: "24px 26px", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontWeight: 800 }}>🔄 Historial de piezas cambiadas</h3>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#9ca3af" }}>×</button>
        </div>
        {loading ? <div style={{ color: "#9ca3af" }}>Cargando...</div> : lista.length === 0 ? (
          <div style={{ color: "#9ca3af", textAlign: "center", padding: "24px 0" }}>No hay piezas cambiadas registradas.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {lista.map(c => (
              <div key={c.fotoCambioId} style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.82rem", color: "#6b7280" }}>
                    Ticket: <strong>{c.ticketSerie}</strong> · {new Date(c.fechaCambio).toLocaleDateString("es-PE")}
                  </div>
                  {c.descripcion && <div style={{ fontSize: "0.88rem", marginTop: 4, color: "#374151" }}>{c.descripcion}</div>}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                  {c.fotoReemplazadaUrl && (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "0.68rem", color: "#9ca3af", marginBottom: 2 }}>Antes</div>
                      <img src={c.fotoReemplazadaUrl} alt="antes" style={{ width: 64, height: 56, objectFit: "cover", borderRadius: 6, border: "1.5px solid #fca5a5", opacity: 0.8 }} onError={e => e.target.style.display = "none"} />
                    </div>
                  )}
                  {c.fotoReemplazadaUrl && <div style={{ color: "#9ca3af" }}>→</div>}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.68rem", color: "#9ca3af", marginBottom: 2 }}>Instalada</div>
                    <img src={c.fotoNuevaUrl} alt="instalada" style={{ width: 64, height: 56, objectFit: "cover", borderRadius: 6, border: "1.5px solid #bbf7d0" }} onError={e => e.target.style.display = "none"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab principal ────────────────────────────────────────────────────────────
export default function TabFotos({ equipoId, crear, eliminar }) {
  const [lista,        setLista]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [mostrarForm,  setMostrarForm]  = useState(false);
  const [guardando,    setGuardando]    = useState(false);
  const [confirmElim,  setConfirmElim]  = useState(null);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [verPiezas,    setVerPiezas]    = useState(false);

  const cargar = async () => {
    setLoading(true); setError("");
    try {
      const data = await fotosApi.listarActivasByEquipo(equipoId);
      setLista(Array.isArray(data.datos) ? data.datos : []);
    } catch (e) {
      setError(e.message || "Error al cargar fotos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (equipoId) cargar(); }, [equipoId]);

  const handleGuardar = async ({ archivo, nombre }) => {
    setGuardando(true);
    try {
      const { store } = await import("../../../stores/store");
      const state     = store.getState();
      const token     = state.auth.accessToken;
      const usuario   = state.auth.usuario;
      const formData  = new FormData();
      formData.append("archivo",  archivo);
      formData.append("equipoId", String(equipoId));
      formData.append("nombre",   nombre || archivo.name);
      const uid = usuario?.id ?? usuario?.usuarioId;
      if (uid != null) formData.append("usuarioSubioId", String(uid));
      const res  = await fetch(`${API_BASE}/api/Fotos/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!data.exito) throw new Error(data.mensaje || "No se pudo subir la foto.");
      setMostrarForm(false);
      cargar();
    } catch (e) {
      setError(e.message || "Error al subir la foto.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    try { await fotosApi.eliminar(id); setConfirmElim(null); cargar(); }
    catch (e) { setError(e.message || "No se pudo eliminar."); }
  };

  return (
    <div>
      <ErrorBanner mensaje={error} />

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {!mostrarForm && crear && (
          <button onClick={() => setMostrarForm(true)}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#4c7318", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
            + Agregar foto
          </button>
        )}
        <button onClick={() => setVerPiezas(true)}
          style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", color: "#374151" }}>
          🔄 Piezas cambiadas
        </button>
      </div>

      {mostrarForm && (
        <div style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
          <h4 style={{ margin: "0 0 16px", fontSize: "0.97rem", fontWeight: 700 }}>📷 Agregar foto</h4>
          <FormFoto onGuardar={handleGuardar} onCancelar={() => setMostrarForm(false)} loading={guardando} />
        </div>
      )}

      {loading ? (
        <div style={{ color: "#888", padding: "16px 0" }}>Cargando fotos...</div>
      ) : lista.length === 0 ? (
        <div style={{ color: "#9ca3af", padding: "24px 0", textAlign: "center", fontSize: "0.93rem" }}>
          📷 No hay fotos registradas para este equipo.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
          {lista.map((foto) => (
            <div key={foto.fotoId} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div role="button" tabIndex={0}
                style={{ height: 120, background: "#f3f4f6", overflow: "hidden", cursor: "pointer" }}
                onClick={() => setFotoAmpliada(foto)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setFotoAmpliada(foto); }}>
                <img src={`${API_BASE}${foto.url}`} alt={foto.nombre ?? "Foto"}
                  onError={e => { e.target.src = ""; e.target.style.display = "none"; }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 8, wordBreak: "break-word" }}>
                  {foto.nombre ?? "Sin nombre"}
                </div>
                {eliminar && (confirmElim === foto.fotoId ? (
                  <ConfirmInline onConfirmar={() => handleEliminar(foto.fotoId)} onCancelar={() => setConfirmElim(null)} />
                ) : (
                  <button onClick={() => setConfirmElim(foto.fotoId)}
                    style={{ width: "100%", padding: "4px 0", borderRadius: 6, border: "1.5px solid #fca5a5", background: "#fff", cursor: "pointer", color: "#dc2626", fontSize: "0.8rem" }}>
                    🗑️ Eliminar
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {fotoAmpliada && (
        <div role="dialog" aria-modal="true" tabIndex={0}
          onClick={() => setFotoAmpliada(null)}
          onKeyDown={e => { if (e.key === "Escape") setFotoAmpliada(null); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, cursor: "zoom-out", padding: 24 }}>
          <img src={`${API_BASE}${fotoAmpliada.url}`} alt={fotoAmpliada.nombre ?? "Foto"}
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 12, objectFit: "contain" }} />
          <button onClick={() => setFotoAmpliada(null)}
            style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: "1.5rem", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
      )}

      {verPiezas && <ModalPiezas equipoId={equipoId} onCerrar={() => setVerPiezas(false)} />}
    </div>
  );
}
