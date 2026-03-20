// src/pages/Personal/PersonaDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { personalApi } from "../../api/personal.api";
import TabInfoPersonal  from "./tabs/TabInfoPersonal";
import TabRolesPermisos from "./tabs/TabRolesPermisos";
import TabHistorial     from "./tabs/TabHistorial";

const TABS = [
  { key: "info",    label: "📋 Info Personal"     },
  { key: "roles",   label: "🔐 Roles y Permisos"  },
  { key: "historial", label: "📜 Historial"        },
];

export default function PersonaDetalle() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [persona,   setPersona]  = useState(null);
  const [loading,   setLoading]  = useState(true);
  const [error,     setError]    = useState("");
  const [tabActiva, setTabActiva] = useState("info");

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const data = await personalApi.obtenerPersona(id);
        if (data.exito) setPersona(data.datos);
        else setError(data.mensaje || "No se pudo cargar la persona.");
      } catch (e) {
        setError(e.message || "Error de conexión.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  if (loading) return <div style={{ padding: 40, color: "#888" }}>Cargando persona...</div>;

  if (error) return (
    <div style={{ padding: 40 }}>
      <div style={{ color: "#dc2626", marginBottom: 16 }}>{error}</div>
      <button onClick={() => navigate("/personal")}
        style={{ padding: "8px 18px", borderRadius: 8, border: "none",
          background: "#4c7318", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
        ← Volver a personal
      </button>
    </div>
  );

  const nombreCompleto = `${persona.nombres} ${persona.apellidosPaterno} ${persona.apellidosMaterno}`;

  return (
    <div style={{ width: "100%", maxWidth: 1100 }}>

      {/* Cabecera */}
      <div className="page-toolbar" style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("/personal")}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#4c7318", padding: "0 4px" }}>
          ←
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{nombreCompleto}</h2>
          <span style={{ color: "#649719", fontSize: "0.85rem", fontWeight: 500 }}>
            {persona.tipoDocumento}: {persona.numeroDocumento}
            {persona.usuario ? ` · Usuario: ${persona.usuario.userName}` : " · Sin usuario"}
          </span>
        </div>
        <span style={{
          padding: "4px 14px", borderRadius: 20,
          background: persona.activo ? "rgba(220,252,231,0.8)" : "rgba(254,226,226,0.8)",
          color: persona.activo ? "#16a34a" : "#dc2626",
          fontWeight: 700, fontSize: "0.83rem",
          border: `1px solid ${persona.activo ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"}`,
        }}>
          {persona.activo ? "ACTIVO" : "INACTIVO"}
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

      {/* Contenido de cada tab */}
      <div>
        {tabActiva === "info"     && <TabInfoPersonal  persona={persona} personaId={id} onActualizado={setPersona} />}
        {tabActiva === "roles"    && <TabRolesPermisos persona={persona} personaId={id} />}
        {tabActiva === "historial"&& <TabHistorial     personaId={id} />}
      </div>
    </div>
  );
}