// src/pages/Equipo/tabs/TabFotos.jsx
// Muestra y gestiona las fotos de un equipo.
import React, { useEffect, useState } from "react";
import { fotosApi } from "../../../api/equipoExtras.api";
import ErrorBanner from "../../ui/ErrorBanner";
import ConfirmInline from "../../ui/ConfirmInline";
import FormFoto from "../../components/FormFoto";

const API_BASE = import.meta.env.VITE_API_BASE_URI;

export default function TabFotos({ equipoId, crear, eliminar }) {
  const [lista,        setLista]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [mostrarForm,  setMostrarForm]  = useState(false);
  const [guardando,    setGuardando]    = useState(false);
  const [confirmElim,  setConfirmElim]  = useState(null);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);

  const cargar = async () => {
    setLoading(true); setError("");
    try {
      const data = await fotosApi.listar();
      const todas = Array.isArray(data.datos) ? data.datos : data.datos ? [data.datos] : [];
      setLista(todas.filter(f => String(f.equipoId) === String(equipoId)));
    } catch (e) {
      setError(e.message || "Error al cargar fotos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [equipoId]);

  const handleGuardar = async ({ archivo, nombre }) => {
    setGuardando(true);
    try {
      const { store } = await import("../../../stores/store");
      const state     = store.getState();
      const token     = state.auth.accessToken;
      const usuario   = state.auth.usuario;

      const formData = new FormData();
      formData.append("archivo",        archivo);
      formData.append("equipoId",       String(equipoId));
      formData.append("nombre",         nombre || archivo.name);
      if (usuario?.id ?? usuario?.usuarioId) {
        formData.append("usuarioSubioId", String(usuario?.id ?? usuario?.usuarioId));
      }

      const res = await fetch(`${API_BASE}/api/Fotos/upload`, {
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
    try {
      await fotosApi.eliminar(id);
      setConfirmElim(null);
      cargar();
    } catch (e) {
      setError(e.message || "No se pudo eliminar.");
    }
  };

  return (
    <div>
      <ErrorBanner mensaje={error} />

      {!mostrarForm && crear && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setMostrarForm(true)}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#4c7318", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
            + Agregar foto
          </button>
        </div>
      )}

      {mostrarForm && (
        <div style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
          <h4 style={{ margin: "0 0 16px", fontSize: "0.97rem", fontWeight: 700, color: "#232946" }}>📷 Agregar foto</h4>
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
              <div
                role="button"
                tabIndex={0}
                style={{ height: 120, background: "#f3f4f6", overflow: "hidden", cursor: "pointer" }}
                onClick={() => setFotoAmpliada(foto)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setFotoAmpliada(foto); }}
              >
                <img src={`${API_BASE}${foto.url}`} alt={foto.nombre ?? "Foto"}
                  onError={e => { e.target.src = ""; e.target.style.display = "none"; }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 8, wordBreak: "break-word" }}>
                  {foto.nombre ?? "Sin nombre"}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {eliminar && (confirmElim === foto.fotoId ? (
                    <ConfirmInline
                      onConfirmar={() => handleEliminar(foto.fotoId)}
                      onCancelar={() => setConfirmElim(null)}
                    />
                  ) : (
                    <button onClick={() => setConfirmElim(foto.fotoId)}
                      style={{ flex: 1, padding: "4px 0", borderRadius: 6, border: "1.5px solid #fca5a5", background: "#fff", cursor: "pointer", color: "#dc2626", fontSize: "0.8rem" }}>
                      🗑️ Eliminar
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {fotoAmpliada && (
        <div
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          onClick={() => setFotoAmpliada(null)}
          onKeyDown={e => { if (e.key === "Escape") setFotoAmpliada(null); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, cursor: "zoom-out", padding: 24 }}
        >
          <img src={`${API_BASE}${fotoAmpliada.url}`} alt={fotoAmpliada.nombre ?? "Foto"}
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 12, objectFit: "contain" }} />
          <button onClick={() => setFotoAmpliada(null)}
            style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: "1.5rem", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
      )}
    </div>
  );
}
