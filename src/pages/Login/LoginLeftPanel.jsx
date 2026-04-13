// src/pages/Login/LoginLeftPanel.jsx — Panel decorativo izquierdo
import goreaLogo from "../../assets/Imagenes/gorea_logo.png";

const MODULES = ["Inventario", "Equipos", "Soporte", "Seguridad", "Reportes"];

export default function LoginLeftPanel() {
  return (
    <div className="login-panel-left" style={{
      flex: "0 0 48%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "3rem 2.5rem", position: "relative", overflow: "hidden",
      borderRight: "1px solid rgba(255,255,255,0.10)",
    }}>
      {/* Orbs flotantes */}
      <div style={{
        position: "absolute", width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(160,215,68,0.22) 0%, transparent 70%)",
        top: "10%", left: "-8%", animation: "floatOrb 7s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 260, height: 260, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(100,151,25,0.28) 0%, transparent 70%)",
        bottom: "8%", right: "-5%", animation: "floatOrb2 9s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 180, height: 180, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,240,106,0.15) 0%, transparent 70%)",
        top: "55%", left: "60%", animation: "floatOrb 11s ease-in-out infinite 2s",
      }} />

      {/* Aro giratorio + logo */}
      <div style={{ position: "relative", marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "absolute", width: 140, height: 140, borderRadius: "50%",
          border: "2px dashed rgba(160,215,68,0.35)",
          animation: "spinSlow 20s linear infinite",
        }} />
        <div style={{
          position: "absolute", width: 110, height: 110, borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.12)",
          animation: "spinSlow 14s linear infinite reverse",
        }} />
        <div style={{
          width: 88, height: 88, borderRadius: 22, position: "relative", zIndex: 2,
          background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 12px 40px rgba(10,30,6,0.4), 0 0 0 8px rgba(160,215,68,0.08)",
        }}>
          <img src={goreaLogo} alt="Logo" style={{ width: 60, height: 60, objectFit: "contain" }} />
        </div>
      </div>

      {/* Texto */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <h1 style={{
          margin: 0, fontSize: "2rem", fontWeight: 900, color: "#fff",
          letterSpacing: "-0.01em", textShadow: "0 2px 20px rgba(10,30,6,0.5)", lineHeight: 1.15,
        }}>
          Parque<br />
          <span style={{ color: "#a0d744" }}>Informático</span>
        </h1>
        <p style={{ margin: "14px 0 0", fontSize: "0.95rem", color: "rgba(255,255,255,0.60)", lineHeight: 1.6 }}>
          Sistema de Gestión de<br />Activos y Soporte TI
        </p>

        {/* Puntos animados */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 28 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%", background: "#a0d744",
              animation: `pulseDot 2s ease-in-out infinite ${i * 0.4}s`,
            }} />
          ))}
        </div>

        {/* Badges de módulos */}
        <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 300 }}>
          {MODULES.map(m => (
            <span key={m} style={{
              background: "rgba(160,215,68,0.12)", border: "1px solid rgba(160,215,68,0.25)",
              borderRadius: 20, padding: "4px 14px", fontSize: "0.78rem",
              color: "rgba(255,255,255,0.75)", fontWeight: 500, letterSpacing: "0.02em",
            }}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
