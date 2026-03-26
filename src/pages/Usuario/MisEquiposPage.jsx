// src/pages/Usuario/MisEquiposPage.jsx
// Página de equipos asignados al usuario — solo lectura
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketsApi } from "../../api/tickets.api";
import EquipoDetalleEmbed from "../Equipo/EquipoDetalleEmbed";

export default function MisEquiposPage() {
  const navigate = useNavigate();
  const [equipos,  setEquipos]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    ticketsApi.misEquipos()
      .then(r => {
        const lista = Array.isArray(r.datos) ? r.datos : r.datos ? [r.datos] : [];
        setEquipos(lista);
        if (lista.length === 1) setSelected(lista[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 1100 }}>
      <div className="page-toolbar">
        <button onClick={() => navigate("/")} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#6b7280", fontWeight: 700, fontSize: "0.9rem", padding: 0,
        }}>
          ← Inicio
        </button>
        <h2 style={{ margin: "0 0 0 14px", flex: 1 }}>🖥️ Mis equipos</h2>
      </div>

      {loading ? (
        <div style={{ color: "#9ca3af", padding: "32px 0", textAlign: "center" }}>Cargando equipos...</div>
      ) : !equipos.length ? (
        <div style={{ color: "#9ca3af", padding: "48px 0", textAlign: "center", fontSize: "0.95rem" }}>
          No tienes equipos asignados. Contactá al administrador.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: equipos.length > 1 ? "220px 1fr" : "1fr", gap: 20, alignItems: "start" }}>

          {/* Lista lateral (solo si tiene más de 1) */}
          {equipos.length > 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {equipos.map(e => (
                <button
                  key={e.equipoId}
                  onClick={() => setSelected(e)}
                  style={{
                    padding: "12px 14px", borderRadius: 10, border: "none", textAlign: "left",
                    cursor: "pointer", fontWeight: 600, fontSize: "0.88rem",
                    background: selected?.equipoId === e.equipoId ? "#4c7318" : "#fff",
                    color:      selected?.equipoId === e.equipoId ? "#fff"    : "#111827",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    transition: "background 0.15s",
                  }}
                >
                  <div>🖥️ {e.nombre ?? e.codigoPatrimonial}</div>
                  <div style={{
                    fontSize: "0.76rem", marginTop: 3,
                    color: selected?.equipoId === e.equipoId ? "rgba(255,255,255,0.75)" : "#6b7280",
                  }}>
                    {e.codigoPatrimonial}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Detalle del equipo seleccionado */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, background: "#fff" }}>
            {selected
              ? <EquipoDetalleEmbed equipoId={selected.equipoId} />
              : <div style={{ color: "#9ca3af", textAlign: "center", padding: "40px 0" }}>
                  Seleccioná un equipo para ver sus detalles.
                </div>
            }
          </div>

        </div>
      )}
    </div>
  );
}
