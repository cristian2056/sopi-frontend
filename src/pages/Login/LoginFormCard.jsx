// src/pages/Login/LoginFormCard.jsx — Tarjeta del formulario de login
import goreaLogo from "../../assets/Imagenes/gorea_logo.png";

const INP_STYLE = {
  width: "100%", padding: "13px 14px", borderRadius: 12,
  border: "1.5px solid rgba(160,215,68,0.30)", fontSize: "0.96rem",
  boxSizing: "border-box", outline: "none",
  background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)", color: "#fff", fontFamily: "inherit",
  transition: "border-color 0.18s, box-shadow 0.18s",
};

const LABEL_STYLE = {
  display: "block", fontWeight: 600, marginBottom: 8,
  color: "rgba(255,255,255,0.85)", fontSize: "0.875rem", letterSpacing: "0.02em",
};

const onFocus = e => {
  e.currentTarget.style.borderColor = "#a0d744";
  e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(160,215,68,0.22)";
};
const onBlur = e => {
  e.currentTarget.style.borderColor = "rgba(160,215,68,0.30)";
  e.currentTarget.style.boxShadow   = "none";
};

export default function LoginFormCard({ userName, password, showPass, loading, error, onUserChange, onPassChange, onTogglePass, onSubmit }) {
  return (
    <div style={{ width: "100%", maxWidth: 420, animation: "fadeSlideIn 0.5s ease both" }}>
      {/* Logo mobile (solo visible en pantallas pequeñas via CSS) */}
      <div className="login-mobile-header" style={{ textAlign: "center", marginBottom: 32, display: "none" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.22)", margin: "0 auto 14px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img src={goreaLogo} alt="Logo" style={{ width: 44, height: 44, objectFit: "contain" }} />
        </div>
        <h2 style={{ margin: 0, color: "#fff", fontWeight: 800, fontSize: "1.4rem" }}>
          Parque Informático
        </h2>
      </div>

      {/* Tarjeta glass */}
      <div style={{
        background: "rgba(255,255,255,0.09)", backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)", borderRadius: 24, padding: "2.5rem 2rem",
        boxShadow: "0 32px 80px rgba(5,18,2,0.55), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.18)",
      }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
            Bienvenido 👋
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: "rgba(255,255,255,0.55)" }}>
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate>
          {/* Usuario */}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="login-user" style={LABEL_STYLE}>👤 Usuario</label>
            <input id="login-user" type="text" placeholder="Tu nombre de usuario"
              value={userName} onChange={onUserChange}
              required autoComplete="username"
              style={INP_STYLE} onFocus={onFocus} onBlur={onBlur} />
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: 28 }}>
            <label htmlFor="login-pass" style={LABEL_STYLE}>🔑 Contraseña</label>
            <div style={{ position: "relative" }}>
              <input id="login-pass" type={showPass ? "text" : "password"} placeholder="Tu contraseña"
                value={password} onChange={onPassChange}
                required autoComplete="current-password"
                style={{ ...INP_STYLE, paddingRight: 48 }} onFocus={onFocus} onBlur={onBlur} />
              <button type="button" onClick={onTogglePass}
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                style={{
                  position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem",
                  color: "rgba(255,255,255,0.55)", padding: 4, lineHeight: 1, transition: "color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#a0d744"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(220,38,38,0.15)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(252,165,165,0.3)", borderRadius: 10,
              padding: "10px 14px", color: "#fca5a5", fontSize: "0.87rem",
              marginBottom: 18, fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Botón submit */}
          <button type="submit" disabled={loading}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
              background: loading ? "rgba(100,120,80,0.4)" : "linear-gradient(135deg, #a0d744 0%, #5a8a1a 60%, #3e5b19 100%)",
              color: loading ? "rgba(255,255,255,0.5)" : "#fff",
              fontWeight: 800, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 6px 24px rgba(76,115,24,0.50), 0 0 0 1px rgba(160,215,68,0.2)",
              transition: "opacity 0.15s, transform 0.12s, box-shadow 0.15s", letterSpacing: "0.03em",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(76,115,24,0.60), 0 0 0 1px rgba(160,215,68,0.3)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = loading ? "none" : "0 6px 24px rgba(76,115,24,0.50), 0 0 0 1px rgba(160,215,68,0.2)"; }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", display: "inline-block", animation: "spinSlow 0.8s linear infinite" }} />
                Ingresando...
              </span>
            ) : "Ingresar →"}
          </button>
        </form>
      </div>

      <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.8rem", color: "rgba(255,255,255,0.38)" }}>
        Sistema de Gestión de Parque Informático · {new Date().getFullYear()}
      </p>
    </div>
  );
}
