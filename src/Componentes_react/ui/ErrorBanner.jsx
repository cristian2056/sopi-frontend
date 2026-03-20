// src/components/ui/ErrorBanner.jsx
import React from "react";

export default function ErrorBanner({ mensaje }) {
  if (!mensaje) return null;
  return (
    <div style={{
      color: "#dc2626",
      background: "rgba(254, 226, 226, 0.85)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      border: "1px solid rgba(252, 165, 165, 0.6)",
      padding: "10px 16px",
      borderRadius: 10,
      marginBottom: 14,
      fontSize: "0.9rem",
      fontWeight: 500,
    }}>
      ⚠️ {mensaje}
    </div>
  );
}
