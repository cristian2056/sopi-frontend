// src/App.jsx
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./stores/authSlice";
import { setMenu } from "./stores/menuSlice";
import { authApi } from "./api/auth.api";
import { router } from "./app/routes";


export default function App() {
  const dispatch = useDispatch();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const recuperarSesion = async () => {
      try {
        const resultado = await authApi.refresh();

        if (resultado?.exito) {
          const { accessToken, usuario } = resultado.datos;

          dispatch(setCredentials({ accessToken, usuario }));

          // Cargar menus y permisos — GET /api/Menu/usuario/{usuarioId}
          const menuResult = await authApi.obtenerMenu(usuario.usuarioId, accessToken);

          const menus = menuResult?.datos?.menus ?? [];

          const rawPermisos = menuResult?.datos?.permisos ?? {};
          const permisos = {};
          for (const [key, val] of Object.entries(rawPermisos)) {
            permisos[key.toLowerCase()] = val;
          }

          dispatch(setMenu({ menus, permisos }));
        }
      } catch {
        // Sin cookie o expirada → el router redirige al login
      } finally {
        setChecking(false);
      }
    };

    recuperarSesion();
  }, [dispatch]);

  // Mientras verifica la sesión mostramos una pantalla de carga simple
  if (checking) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 20,
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1.5px solid rgba(255,255,255,0.22)",
          borderRadius: 20,
          padding: "36px 48px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          boxShadow: "0 16px 48px rgba(10,30,6,0.4)",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg, #a0d744, #3e5b19)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem",
            boxShadow: "0 4px 16px rgba(76,115,24,0.4)",
          }}>🖥️</div>
          <div style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, opacity: 0.9 }}>
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}