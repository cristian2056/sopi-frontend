// src/components/layout/Header.jsx
// Sin header.css — estilos inline
import React from "react";

export default function Header({ title, nombreUsuario, tipoUsuario }) {
  const inicial = nombreUsuario?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#fff",
      borderBottom: "1px solid #eaeaea",
      padding: "0.75rem 2rem",
      minHeight: 60,
      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      flexShrink: 0,
    }}>

      {/* Título de la página */}
      <div style={{
        fontSize: "1.35rem",
        fontWeight: 800,
        color: "#232946",
        letterSpacing: "0.01em",
      }}>
        {title}
      </div>

      {/* Usuario + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 600, color: "#222", fontSize: "0.95rem" }}>
            {nombreUsuario}
          </div>
          <div style={{ fontSize: "0.82rem", color: "#888" }}>
            {tipoUsuario}
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "linear-gradient(135deg, #a0d744, #3e5b19)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 700, fontSize: "1rem", flexShrink: 0,
        }}>
          {inicial}
        </div>
      </div>

    </header>
  );
}