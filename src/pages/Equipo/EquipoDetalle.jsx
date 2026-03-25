// src/pages/Equipo/EquipoDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { equiposApi } from "../../api/equipos.api";
import { usePermiso } from "../../stores/menuSlice";
import TabInfoGeneral from "../../Componentes_react/equipo/tabs/TabInfoGeneral";
import TabComponentes from "../../Componentes_react/equipo/tabs/TabComponentes";
import TabSoftware    from "../../Componentes_react/equipo/tabs/TabSoftware";
import TabRed         from "../../Componentes_react/equipo/tabs/TabRed";
import TabFotos       from "../../Componentes_react/equipo/tabs/TabFotos";
import TabAsignacion  from "../../Componentes_react/equipo/tabs/TabAsignacion";

const TABS = [
  { key: "info",        label: "📋 Info General" },
  { key: "componentes", label: "🔧 Componentes"  },
  { key: "software",    label: "💿 Software"      },
  { key: "red",         label: "🌐 Red"           },
  { key: "fotos",       label: "📷 Fotos"         },
  { key: "asignacion",  label: "👤 Asignación"    },
];

export default function EquipoDetalle() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { crear, modificar, eliminar } = usePermiso("Equipos");
  const [equipo,    setEquipo]   = useState(null);
  const [loading,   setLoading]  = useState(true);
  const [error,     setError]    = useState("");
  const [tabActiva, setTabActiva] = useState("info");

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const data = await equiposApi.obtener(id);
        if (data.exito) setEquipo(data.datos);
        else setError(data.mensaje || "No se pudo cargar el equipo.");
      } catch (e) {
        setError(e.message || "Error de conexión.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  if (loading) return <div style={{ padding: 40, color: "#888" }}>Cargando equipo...</div>;

  if (error) return (
    <div style={{ padding: 40 }}>
      <div style={{ color: "#dc2626", marginBottom: 16 }}>{error}</div>
      <button onClick={() => navigate("/equipos")}
        style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#4c7318", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
        ← Volver a equipos
      </button>
    </div>
  );

  return (
    <div style={{ width: "100%", maxWidth: 1100 }}>

      <div className="page-toolbar" style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("/equipos")}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#4c7318", padding: "0 4px" }}>
          ←
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>
            {equipo.nombre ?? equipo.codigoPatrimonial}
          </h2>
          <span style={{ color: "#649719", fontSize: "0.85rem", fontWeight: 500 }}>
            Cód. Patrimonial: {equipo.codigoPatrimonial}
            {equipo.serial ? ` · Serial: ${equipo.serial}` : ""}
          </span>
        </div>
        <span style={{
          padding: "4px 14px", borderRadius: 20,
          background: equipo.activo ? "rgba(220,252,231,0.8)" : "rgba(254,226,226,0.8)",
          color: equipo.activo ? "#16a34a" : "#dc2626",
          fontWeight: 700, fontSize: "0.83rem",
          border: `1px solid ${equipo.activo ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"}`,
        }}>
          {equipo.estado}
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "2px solid rgba(100,151,25,0.2)", marginBottom: 20, overflowX: "auto" }}>
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setTabActiva(tab.key)}
            style={{
              padding: "9px 16px", border: "none",
              borderBottom: tabActiva === tab.key ? "3px solid #4c7318" : "3px solid transparent",
              background: tabActiva === tab.key ? "rgba(160,215,68,0.12)" : "none",
              cursor: "pointer",
              fontWeight: tabActiva === tab.key ? 700 : 500,
              color: tabActiva === tab.key ? "#3e5b19" : "#6b7280",
              fontSize: "0.9rem", marginBottom: -2, whiteSpace: "nowrap",
              borderRadius: "8px 8px 0 0",
              transition: "background 0.15s, color 0.15s",
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {tabActiva === "info"        && <TabInfoGeneral  equipo={equipo} equipoId={id} onActualizado={setEquipo} modificar={modificar} />}
        {tabActiva === "componentes" && <TabComponentes  equipoId={id} crear={crear} modificar={modificar} eliminar={eliminar} />}
        {tabActiva === "software"    && <TabSoftware     equipoId={id} crear={crear} modificar={modificar} eliminar={eliminar} />}
        {tabActiva === "red"         && <TabRed          equipoId={id} crear={crear} modificar={modificar} eliminar={eliminar} />}
        {tabActiva === "fotos"       && <TabFotos        equipoId={id} crear={crear} eliminar={eliminar} />}
        {tabActiva === "asignacion"  && <TabAsignacion   equipoId={id} crear={crear} modificar={modificar} eliminar={eliminar} />}
      </div>
    </div>
  );
}