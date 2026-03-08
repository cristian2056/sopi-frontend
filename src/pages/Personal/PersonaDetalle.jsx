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
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate("/personal")}
          style={{ background: "none", border: "none", cursor: "pointer",
            fontSize: "1.3rem", color: "#4c7318" }}>
          ←
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.3rem" }}>{nombreCompleto}</h2>
          <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            {persona.tipoDocumento}: {persona.numeroDocumento}
            {persona.usuario ? ` · Usuario: ${persona.usuario.userName}` : " · Sin usuario"}
          </span>
        </div>
        <span style={{
          marginLeft: "auto", padding: "4px 14px", borderRadius: 20,
          background: persona.activo ? "#dcfce7" : "#fee2e2",
          color: persona.activo ? "#16a34a" : "#dc2626",
          fontWeight: 700, fontSize: "0.85rem",
        }}>
          {persona.activo ? "ACTIVO" : "INACTIVO"}
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "2px solid #e5e7eb",
        marginBottom: 24, overflowX: "auto" }}>
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setTabActiva(tab.key)}
            style={{
              padding: "10px 18px", border: "none",
              borderBottom: tabActiva === tab.key ? "3px solid #4c7318" : "3px solid transparent",
              background: "none", cursor: "pointer",
              fontWeight: tabActiva === tab.key ? 700 : 500,
              color: tabActiva === tab.key ? "#4c7318" : "#6b7280",
              fontSize: "0.93rem", marginBottom: -2, whiteSpace: "nowrap",
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