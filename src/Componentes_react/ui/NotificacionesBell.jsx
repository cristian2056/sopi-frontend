// src/Componentes_react/ui/NotificacionesBell.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { notificacionesApi } from "../../api/notificaciones.api";

export default function NotificacionesBell() {
  const [notifs,   setNotifs]   = useState([]);
  const [abierto,  setAbierto]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [pos,      setPos]      = useState({ top: 0, right: 0 });
  const ref    = useRef(null);
  const btnRef = useRef(null);

  const noLeidas = notifs.filter(n => !n.leida).length;

  const cargar = async () => {
    setLoading(true);
    try {
      const r = await notificacionesApi.listar();
      const lista = Array.isArray(r.datos) ? r.datos : r.datos ? [r.datos] : [];
      setNotifs(lista);
    } catch {
      // Si el backend no tiene el endpoint aún, no rompemos
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    const id = setInterval(cargar, 60000); // refresca cada 1 min
    return () => clearInterval(id);
  }, []);

  // Cierra al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const marcarLeida = async (id) => {
    try {
      await notificacionesApi.marcarLeida(id);
      setNotifs(p => p.map(n => n.notificacionId === id ? { ...n, leida: true } : n));
    } catch {}
  };

  const marcarTodas = async () => {
    try {
      await notificacionesApi.marcarTodas();
      setNotifs(p => p.map(n => ({ ...n, leida: true })));
    } catch {}
  };

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>

      {/* Botón campana */}
      <button
        ref={btnRef}
        onClick={() => {
          if (!abierto && btnRef.current) {
            const r = btnRef.current.getBoundingClientRect();
            setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
          }
          setAbierto(v => !v);
        }}
        style={{
          position: "relative", background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)", borderRadius: 9,
          width: 38, height: 38, display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", fontSize: "1.15rem",
          color: "#fff", flexShrink: 0,
        }}
        title="Notificaciones"
      >
        🔔
        {noLeidas > 0 && (
          <span style={{
            position: "absolute", top: 4, right: 4,
            width: 16, height: 16, borderRadius: "50%",
            background: "#ef4444", color: "#fff",
            fontSize: "0.65rem", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid rgba(12,32,5,0.6)",
          }}>
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </button>

      {/* Dropdown — portal al body para sobreponerse a todo */}
      {abierto && createPortal(
        <div ref={ref} style={{
          position: "fixed", top: pos.top, right: pos.right,
          width: 320, background: "#fff", borderRadius: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)", zIndex: 99999,
          border: "1px solid #e5e7eb", overflow: "hidden",
        }}>

          {/* Cabecera */}
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid #f3f4f6",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111827" }}>
              Notificaciones {noLeidas > 0 && (
                <span style={{
                  background: "#ef4444", color: "#fff", borderRadius: 20,
                  padding: "1px 7px", fontSize: "0.72rem", marginLeft: 6,
                }}>
                  {noLeidas}
                </span>
              )}
            </span>
            {noLeidas > 0 && (
              <button onClick={marcarTodas} style={{
                background: "none", border: "none", color: "#4c7318",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", padding: 0,
              }}>
                Marcar todas leídas
              </button>
            )}
          </div>

          {/* Lista */}
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "24px 0", textAlign: "center", color: "#9ca3af", fontSize: "0.88rem" }}>
                Cargando...
              </div>
            ) : !notifs.length ? (
              <div style={{ padding: "32px 0", textAlign: "center", color: "#9ca3af", fontSize: "0.88rem" }}>
                🔔 Sin notificaciones
              </div>
            ) : (
              notifs.map(n => (
                <div
                  key={n.notificacionId}
                  onClick={() => !n.leida && marcarLeida(n.notificacionId)}
                  style={{
                    padding: "12px 16px", borderBottom: "1px solid #f9fafb",
                    background: n.leida ? "#fff" : "#f0fdf4",
                    cursor: n.leida ? "default" : "pointer",
                    display: "flex", gap: 10, alignItems: "flex-start",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (!n.leida) e.currentTarget.style.background = "#dcfce7"; }}
                  onMouseLeave={e => { if (!n.leida) e.currentTarget.style.background = "#f0fdf4"; }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                    background: n.leida ? "transparent" : "#4c7318", marginTop: 5,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: n.leida ? 500 : 700, fontSize: "0.87rem", color: "#111827" }}>
                      {n.titulo ?? n.mensaje}
                    </div>
                    {n.titulo && n.mensaje && (
                      <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 2 }}>
                        {n.mensaje}
                      </div>
                    )}
                    <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: 4 }}>
                      {n.fechaCreacion ? String(n.fechaCreacion).substring(0, 16).replace("T", " ") : ""}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>,
        document.body
      )}
    </div>
  );
}
