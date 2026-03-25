// src/components/ui/Overlay.jsx — glassmorphism modal overlay
import React from "react";

export default function Overlay({ children, onCerrar, maxWidth }) {
  return (
    <div
      onClick={onCerrar}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(10, 30, 6, 0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 5000, padding: "24px 16px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "rgba(255, 255, 255, 0.93)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderRadius: 20,
          padding: "32px 36px",
          boxShadow: "0 20px 60px rgba(15, 40, 6, 0.35)",
          border: "1.5px solid rgba(255,255,255,0.6)",
          width: "100%",
          maxWidth: maxWidth ?? 620,
        }}
      >
        {children}
      </div>
    </div>
  );
}
