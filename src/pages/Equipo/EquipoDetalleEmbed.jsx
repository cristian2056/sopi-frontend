// src/pages/Equipo/EquipoDetalleEmbed.jsx
// Versión embebida del detalle de equipo — solo lectura, sin navegación
import { useEffect, useState } from "react";
import { equiposApi } from "../../api/equipos.api";
import TabInfoGeneral from "./tabs/TabInfoGeneral";
import TabComponentes from "./tabs/TabComponentes";
import TabSoftware    from "./tabs/TabSoftware";
import TabRed         from "./tabs/TabRed";
import TabFotos       from "./tabs/TabFotos";
import TabAsignacion  from "./tabs/TabAsignacion";

const TABS = [
  { key: "info",        label: "📋 Info General" },
  { key: "componentes", label: "🔧 Componentes"  },
  { key: "software",    label: "💿 Software"      },
  { key: "red",         label: "🌐 Red"           },
  { key: "fotos",       label: "📷 Fotos"         },
  { key: "asignacion",  label: "👤 Asignación"    },
];

export default function EquipoDetalleEmbed({ equipoId }) {
  const [equipo,    setEquipo]   = useState(null);
  const [loading,   setLoading]  = useState(true);
  const [error,     setError]    = useState("");
  const [tabActiva, setTabActiva] = useState("info");

  useEffect(() => {
    if (!equipoId) return;
    setLoading(true);
    setError("");
    setTabActiva("info");
    equiposApi.obtener(equipoId)
      .then(data => {
        if (data.exito) setEquipo(data.datos);
        else setError(data.mensaje || "No se pudo cargar el equipo.");
      })
      .catch(() => setError("Error de conexión."))
      .finally(() => setLoading(false));
  }, [equipoId]);

  if (loading) return <div style={{ color: "#9ca3af", padding: 20 }}>Cargando equipo...</div>;
  if (error)   return <div style={{ color: "#dc2626", padding: 20 }}>{error}</div>;
  if (!equipo) return null;

  const id = String(equipoId);

  return (
    <div style={{ width: "100%" }}>
      {/* Cabecera */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>
            {equipo.nombre ?? equipo.codigoPatrimonial}
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.82rem" }}>
            Cód: {equipo.codigoPatrimonial}
            {equipo.serial ? ` · Serial: ${equipo.serial}` : ""}
          </div>
        </div>
        <span style={{
          marginLeft: "auto", padding: "3px 12px", borderRadius: 20,
          background: equipo.activo ? "#dcfce7" : "#fee2e2",
          color: equipo.activo ? "#16a34a" : "#dc2626",
          fontWeight: 700, fontSize: "0.8rem",
        }}>
          {equipo.estado}
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, borderBottom: "2px solid #e5e7eb", marginBottom: 16, overflowX: "auto" }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setTabActiva(tab.key)} style={{
            padding: "8px 12px", border: "none",
            borderBottom: tabActiva === tab.key ? "3px solid #4c7318" : "3px solid transparent",
            background: "none", cursor: "pointer",
            fontWeight: tabActiva === tab.key ? 700 : 500,
            color: tabActiva === tab.key ? "#4c7318" : "#6b7280",
            fontSize: "0.82rem", marginBottom: -2, whiteSpace: "nowrap",
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido — todo read-only */}
      <div>
        {tabActiva === "info"        && <TabInfoGeneral  equipo={equipo} equipoId={id} onActualizado={() => {}} modificar={false} />}
        {tabActiva === "componentes" && <TabComponentes  equipoId={id} crear={false} modificar={false} eliminar={false} />}
        {tabActiva === "software"    && <TabSoftware     equipoId={id} crear={false} modificar={false} eliminar={false} />}
        {tabActiva === "red"         && <TabRed          equipoId={id} crear={false} modificar={false} eliminar={false} />}
        {tabActiva === "fotos"       && <TabFotos        equipoId={id} crear={false} eliminar={false} />}
        {tabActiva === "asignacion"  && <TabAsignacion   equipoId={id} crear={false} modificar={false} eliminar={false} />}
      </div>
    </div>
  );
}
