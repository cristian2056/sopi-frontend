// src/components/layout/AppLayout.jsx
// Sin appLayout.css — estilos inline
import React, { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../stores/authSlice";
import { selectMenus } from "../../stores/menuSlice";
import Sidebar from "./Menu";
import Header  from "./Header";

const TITULOS_FALLBACK = {
  "/":               "Dashboard",
  "/marcas":         "Marcas",
  "/equipos":        "Equipos",
  "/componentes":    "Componentes",
  "/software":       "Software",
  "/equipos-red":    "Equipos Red",
  "/tipos-activos":  "Tipos de Activo",
  "/proveedores":    "Proveedores",
  "/dependencias":   "Dependencias",
  "/tickets":        "Tickets",
  "/mantenimientos": "Mantenimientos",
  "/usuarios":       "Usuarios",
  "/roles":          "Roles",
};

export default function AppLayout() {
  const location = useLocation();
  const usuario  = useSelector(selectUsuario);
  const menus    = useSelector(selectMenus);

  const title = useMemo(() => {
    const ruta = location.pathname;

    // Busca en menús principales del backend
    const encontrado = menus.find(m => m.url === ruta);
    if (encontrado) return encontrado.nombre;

    // Busca en submenús
    for (const m of menus) {
      const sub = m.subMenus?.find(s => s.url === ruta);
      if (sub) return sub.nombre;
    }

    // Rutas con parámetros
    if (ruta.startsWith("/equipos/"))  return "Detalle de Equipo";
    if (ruta.startsWith("/personal/")) return "Detalle de Personal";

    return TITULOS_FALLBACK[ruta] ?? "Parque Informático";
  }, [location.pathname, menus]);

  const nombreUsuario = usuario?.nombreCompleto ?? "Usuario";
  const tipoUsuario   = usuario?.tipoUsuario    ?? "";

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#f5f6fa",
      width: "100vw",
    }}>
      <Sidebar />

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        maxWidth: "100vw",
      }}>
        <Header
          title={title}
          nombreUsuario={nombreUsuario}
          tipoUsuario={tipoUsuario}
        />

        <div style={{
          flex: 1,
          padding: "2.5rem 2.5rem 2.5rem 2rem",
          background: "#f5f6fa",
          overflow: "auto",
          color: "#232946",
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}