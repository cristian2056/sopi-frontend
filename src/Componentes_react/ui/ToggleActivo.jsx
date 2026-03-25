export default function ToggleActivo({ activo, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: activo ? "#f0fdf4" : "#fef2f2",
      border: `1.5px solid ${activo ? "#86efac" : "#fca5a5"}`,
      borderRadius: 10, padding: "12px 16px",
    }}>
      <div>
        <div style={{ fontWeight: 700, color: activo ? "#15803d" : "#dc2626" }}>
          {activo ? "✅ Usuario activo" : "🚫 Usuario deshabilitado"}
        </div>
        <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: 2 }}>
          {activo ? "Puede iniciar sesión" : "No puede iniciar sesión"}
        </div>
      </div>
      <div
        role="switch"
        aria-checked={activo}
        tabIndex={0}
        onClick={onChange}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChange(); } }}
        style={{
          width: 48, height: 26, borderRadius: 13, cursor: "pointer",
          position: "relative", flexShrink: 0,
          background: activo ? "#4c7318" : "#d1d5db", transition: "background .2s",
        }}
      >
        <div style={{
          position: "absolute", top: 3, left: activo ? 25 : 3,
          width: 20, height: 20, borderRadius: "50%",
          background: "#fff", transition: "left .2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        }} />
      </div>
    </div>
  );
}
