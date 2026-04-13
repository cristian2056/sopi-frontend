// src/pages/Login/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../stores/authSlice";
import { setMenu } from "../../stores/menuSlice";
import { authApi } from "../../api/auth.api";
import LoginLeftPanel from "./LoginLeftPanel";
import LoginFormCard  from "./LoginFormCard";

const CSS_KEYFRAMES = `
  @keyframes floatOrb  { 0%,100% { transform: translateY(0px) scale(1); }   50% { transform: translateY(-28px) scale(1.05); } }
  @keyframes floatOrb2 { 0%,100% { transform: translateY(0px) scale(1); }   50% { transform: translateY(22px) scale(0.96); } }
  @keyframes spinSlow  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulseDot  { 0%,100% { opacity: 0.5; transform: scale(1); }    50% { opacity: 1; transform: scale(1.25); } }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

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
        // Normalizar claves a minúsculas para comparación consistente
        const permisos = Object.fromEntries(
          Object.entries(rawPermisos).map(([k, v]) => [k.toLowerCase(), v])
        );
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

  return (
    <>
      <style>{CSS_KEYFRAMES}</style>
      <div style={{
        minHeight: "100vh", width: "100vw",
        display: "flex", alignItems: "stretch",
        position: "relative", overflow: "hidden", zIndex: 1,
      }}>
        <LoginLeftPanel />

        {/* Panel derecho: formulario */}
        <div className="login-panel-right" style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "2rem 1.5rem",
        }}>
          <LoginFormCard
            userName={userName}
            password={password}
            showPass={showPass}
            loading={loading}
            error={error}
            onUserChange={e => setUserName(e.target.value)}
            onPassChange={e => setPassword(e.target.value)}
            onTogglePass={() => setShowPass(v => !v)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
