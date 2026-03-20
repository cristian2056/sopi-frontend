// src/pages/Login/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../stores/authSlice";
import { setMenu } from "../../stores/menuSlice";
import { authApi } from "../../api/auth.api";
import goreaLogo from "../../assets/Imagenes/gorea_logo.png";

/* ─── Keyframes inyectados una sola vez ────────────────────────────── */
const CSS_KEYFRAMES = `
  @keyframes floatOrb {
    0%,100% { transform: translateY(0px) scale(1);   }
    50%      { transform: translateY(-28px) scale(1.05); }
  }
  @keyframes floatOrb2 {
    0%,100% { transform: translateY(0px) scale(1);   }
    50%      { transform: translateY(22px) scale(0.96); }
  }
  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseDot {
    0%,100% { opacity: 0.5; transform: scale(1);    }
    50%      { opacity: 1;   transform: scale(1.25); }
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userName,   setUserName]   = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const resultado = await authApi.login(userName, password);
      if (!resultado.exito) {
        setError(resultado.mensaje || "Credenciales incorrectas.");
        return;
      }
      const { accessToken, usuario } = resultado.datos;
      dispatch(setCredentials({ accessToken, usuario }));
      try {
        const menuResult = await authApi.obtenerMenu(usuario.usuarioId, accessToken);
        const menus = menuResult?.datos?.menus ?? [];
        const rawPermisos = menuResult?.datos?.permisos ?? {};
        const permisos = {};
        for (const [key, val] of Object.entries(rawPermisos)) {
          permisos[key.toLowerCase()] = val;
        }
        dispatch(setMenu({ menus, permisos }));
      } catch {
        console.warn("[Login] No se pudieron cargar los menus o permisos.");
      }
      navigate("/", { replace: true });
    } catch {
      setError("Error de conexión. Verifique que el servidor esté activo.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Estilos reutilizables ─────────────────────────────────────── */
  const inp = {
    width: "100%", padding: "13px 14px", borderRadius: 12,
    border: "1.5px solid rgba(160,215,68,0.30)",
    fontSize: "0.96rem", boxSizing: "border-box", outline: "none",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
    color: "#fff", fontFamily: "inherit",
    transition: "border-color 0.18s, box-shadow 0.18s",
  };

  const labelStyle = {
    display: "block", fontWeight: 600, marginBottom: 8,
    color: "rgba(255,255,255,0.85)", fontSize: "0.875rem",
    letterSpacing: "0.02em",
  };

  const onFocus = (e) => {
    e.currentTarget.style.borderColor = "#a0d744";
    e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(160,215,68,0.22)";
  };
  const onBlur = (e) => {
    e.currentTarget.style.borderColor = "rgba(160,215,68,0.30)";
    e.currentTarget.style.boxShadow   = "none";
  };

  return (
    <>
      {/* Inyectar keyframes */}
      <style>{CSS_KEYFRAMES}</style>

      {/* Página completa */}
      <div style={{
        minHeight: "100vh", width: "100vw",
        display: "flex", alignItems: "stretch",
        position: "relative", overflow: "hidden",
        zIndex: 1,
      }}>

        {/* ── Panel izquierdo decorativo (oculto en móvil) ─────────── */}
        <div className="login-panel-left" style={{
          flex: "0 0 48%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "3rem 2.5rem",
          position: "relative", overflow: "hidden",
          borderRight: "1px solid rgba(255,255,255,0.10)",
        }}>
          {/* Orbs flotantes decorativos */}
          <div style={{
            position: "absolute", width: 320, height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(160,215,68,0.22) 0%, transparent 70%)",
            top: "10%", left: "-8%",
            animation: "floatOrb 7s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", width: 260, height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(100,151,25,0.28) 0%, transparent 70%)",
            bottom: "8%", right: "-5%",
            animation: "floatOrb2 9s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", width: 180, height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,240,106,0.15) 0%, transparent 70%)",
            top: "55%", left: "60%",
            animation: "floatOrb 11s ease-in-out infinite 2s",
          }} />

          {/* Aro giratorio detrás del logo */}
          <div style={{
            position: "relative", marginBottom: "2rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              position: "absolute",
              width: 140, height: 140, borderRadius: "50%",
              border: "2px dashed rgba(160,215,68,0.35)",
              animation: "spinSlow 20s linear infinite",
            }} />
            <div style={{
              position: "absolute",
              width: 110, height: 110, borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.12)",
              animation: "spinSlow 14s linear infinite reverse",
            }} />
            <div style={{
              width: 88, height: 88, borderRadius: 22,
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(16px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 12px 40px rgba(10,30,6,0.4), 0 0 0 8px rgba(160,215,68,0.08)",
              position: "relative", zIndex: 2,
            }}>
              <img src={goreaLogo} alt="Logo"
                style={{ width: 60, height: 60, objectFit: "contain" }} />
            </div>
          </div>

          {/* Texto decorativo */}
          <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
            <h1 style={{
              margin: 0, fontSize: "2rem", fontWeight: 900,
              color: "#fff", letterSpacing: "-0.01em",
              textShadow: "0 2px 20px rgba(10,30,6,0.5)",
              lineHeight: 1.15,
            }}>
              Parque<br />
              <span style={{ color: "#a0d744" }}>Informático</span>
            </h1>
            <p style={{
              margin: "14px 0 0", fontSize: "0.95rem",
              color: "rgba(255,255,255,0.60)",
              lineHeight: 1.6,
            }}>
              Sistema de Gestión de<br />Activos y Soporte TI
            </p>

            {/* Puntos decorativos animados */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 28 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#a0d744",
                  animation: `pulseDot 2s ease-in-out infinite ${i * 0.4}s`,
                }} />
              ))}
            </div>

            {/* Badges de módulos */}
            <div style={{
              marginTop: 32, display: "flex", flexWrap: "wrap",
              gap: 8, justifyContent: "center", maxWidth: 300,
            }}>
              {["Inventario", "Equipos", "Soporte", "Seguridad", "Reportes"].map(m => (
                <span key={m} style={{
                  background: "rgba(160,215,68,0.12)",
                  border: "1px solid rgba(160,215,68,0.25)",
                  borderRadius: 20, padding: "4px 14px",
                  fontSize: "0.78rem", color: "rgba(255,255,255,0.75)",
                  fontWeight: 500, letterSpacing: "0.02em",
                }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Panel derecho: formulario ────────────────────────────── */}
        <div className="login-panel-right" style={{
          flex: 1,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "2rem 1.5rem",
        }}>
          <div style={{
            width: "100%", maxWidth: 420,
            animation: "fadeSlideIn 0.5s ease both",
          }}>
            {/* Encabezado del form — solo visible en móvil (oculto en desktop via CSS) */}
            <div className="login-mobile-header" style={{
              textAlign: "center", marginBottom: 32, display: "none",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.22)",
                margin: "0 auto 14px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img src={goreaLogo} alt="Logo"
                  style={{ width: 44, height: 44, objectFit: "contain" }} />
              </div>
              <h2 style={{
                margin: 0, color: "#fff", fontWeight: 800, fontSize: "1.4rem",
              }}>
                Parque Informático
              </h2>
            </div>

            {/* Tarjeta glass del formulario */}
            <div style={{
              background: "rgba(255,255,255,0.09)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              borderRadius: 24,
              padding: "2.5rem 2rem",
              boxShadow:
                "0 32px 80px rgba(5,18,2,0.55), " +
                "0 0 0 1px rgba(255,255,255,0.12), " +
                "inset 0 1px 0 rgba(255,255,255,0.18)",
            }}>
              {/* Título */}
              <div style={{ marginBottom: 28 }}>
                <h2 style={{
                  margin: 0, fontSize: "1.35rem", fontWeight: 800,
                  color: "#fff", letterSpacing: "-0.01em",
                }}>
                  Bienvenido 👋
                </h2>
                <p style={{
                  margin: "6px 0 0", fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.55)",
                }}>
                  Ingresa tus credenciales para acceder
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Campo usuario */}
                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="login-user" style={labelStyle}>
                    👤 Usuario
                  </label>
                  <input
                    id="login-user"
                    type="text"
                    placeholder="Tu nombre de usuario"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    required
                    autoComplete="username"
                    style={inp}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                {/* Campo contraseña con toggle show/hide */}
                <div style={{ marginBottom: 28 }}>
                  <label htmlFor="login-pass" style={labelStyle}>
                    🔑 Contraseña
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="login-pass"
                      type={showPass ? "text" : "password"}
                      placeholder="Tu contraseña"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      style={{ ...inp, paddingRight: 48 }}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                      style={{
                        position: "absolute", right: 13, top: "50%",
                        transform: "translateY(-50%)",
                        background: "none", border: "none",
                        cursor: "pointer", fontSize: "1.1rem",
                        color: "rgba(255,255,255,0.55)",
                        padding: 4, lineHeight: 1,
                        transition: "color 0.15s",
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
                    background: "rgba(220,38,38,0.15)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(252,165,165,0.3)",
                    borderRadius: 10, padding: "10px 14px",
                    color: "#fca5a5", fontSize: "0.87rem",
                    marginBottom: 18, fontWeight: 500,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span>⚠️</span> {error}
                  </div>
                )}

                {/* Botón submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", padding: "14px 0", borderRadius: 12,
                    border: "none",
                    background: loading
                      ? "rgba(100,120,80,0.4)"
                      : "linear-gradient(135deg, #a0d744 0%, #5a8a1a 60%, #3e5b19 100%)",
                    color: loading ? "rgba(255,255,255,0.5)" : "#fff",
                    fontWeight: 800, fontSize: "1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading
                      ? "none"
                      : "0 6px 24px rgba(76,115,24,0.50), 0 0 0 1px rgba(160,215,68,0.2)",
                    transition: "opacity 0.15s, transform 0.12s, box-shadow 0.15s",
                    letterSpacing: "0.03em",
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 32px rgba(76,115,24,0.60), 0 0 0 1px rgba(160,215,68,0.3)";
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = loading
                      ? "none"
                      : "0 6px 24px rgba(76,115,24,0.50), 0 0 0 1px rgba(160,215,68,0.2)";
                  }}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        display: "inline-block",
                        animation: "spinSlow 0.8s linear infinite",
                      }} />
                      Ingresando...
                    </span>
                  ) : "Ingresar →"}
                </button>
              </form>
            </div>

            {/* Footer del form */}
            <p style={{
              textAlign: "center", marginTop: 20,
              fontSize: "0.8rem", color: "rgba(255,255,255,0.38)",
            }}>
              Sistema de Gestión de Parque Informático · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
