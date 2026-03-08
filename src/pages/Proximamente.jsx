// src/pages/Proximamente.jsx
// Pantalla genérica para módulos aún no implementados
import React from "react";
import { useLocation } from "react-router-dom";

const NOMBRES = {
  "/componentes":    "Componentes",
  "/software":       "Software",
  "/equipos-red":    "Equipos Red",
  "/tipos-activos":  "Tipos de Activo",
  "/proveedores":    "Proveedores",
  "/dependencias":   "Dependencias",
  "/mantenimientos": "Mantenimientos",
  "/usuarios":       "Usuarios",
  "/roles":          "Roles",
};

export default function Proximamente() {
  const { pathname } = useLocation();
  const nombre = NOMBRES[pathname] ?? "Este módulo";

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: "60vh", gap: 16, textAlign: "center",
      padding: "40px 24px",
    }}>
      <div style={{ fontSize: "4rem" }}>🚧</div>
      <h2 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#232946" }}>
        {nombre}
      </h2>
      <p style={{ margin: 0, color: "#6b7280", fontSize: "1rem", maxWidth: 400 }}>
        Este módulo está en desarrollo y estará disponible próximamente.
      </p>
      <div style={{
        background: "#f0fdf4", border: "1.5px solid #bbf7d0",
        borderRadius: 10, padding: "10px 24px",
        color: "#16a34a", fontWeight: 600, fontSize: "0.9rem",
      }}>
        Próximamente disponible
      </div>
    </div>
  );
}