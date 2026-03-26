// src/components/layout/Header.jsx
import React from "react";
import NotificacionesBell from "../ui/NotificacionesBell";

export default function Header({ title, nombreUsuario, tipoUsuario, onMenuToggle }) {
  const inicial = nombreUsuario?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "rgba(255,255,255,0.18)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.25)",
      boxShadow: "0 2px 20px rgba(15,40,6,0.20)",
      padding: "0 1.5rem",
      minHeight: 62,
      flexShrink: 0,
      gap: "1rem",
    }}>

      {/* Hamburguesa — solo visible en móvil via CSS */}
      <button
        className="hamburger-btn"
        onClick={onMenuToggle}
        aria-label="Abrir menú"
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 9,
          color: "#fff",
          width: 38, height: 38,
          display: "none",          /* CSS media query lo muestra en móvil */
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          cursor: "pointer",
          flexShrink: 0,
          padding: 0,
        }}
      >
        ☰
      </button>

      {/* Título */}
      <div style={{
        fontSize: "1.25rem",
        fontWeight: 800,
        color: "#fff",
        letterSpacing: "0.01em",
        textShadow: "0 1px 6px rgba(0,0,0,0.25)",
        flex: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {title}
      </div>

      {/* Notificaciones + usuario */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
        <NotificacionesBell />
        {/* Nombre — oculto en móvil pequeño via CSS */}
        <div className="header-user-info" style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem", textShadow: "0 1px 4px rgba(0,0,0,0.2)", whiteSpace: "nowrap" }}>
            {nombreUsuario}
          </div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.72)", fontWeight: 500 }}>
            {tipoUsuario}
          </div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #a0d744, #3e5b19)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: "0.95rem", flexShrink: 0,
          boxShadow: "0 2px 12px rgba(76,115,24,0.5), 0 0 0 2px rgba(255,255,255,0.3)",
        }}>
          {inicial}
        </div>
      </div>
    </header>
  );
}
