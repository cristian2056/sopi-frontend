// src/components/layout/AppLayout.jsx
import React, { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../stores/authSlice";
import { selectMenus } from "../../stores/menuSlice";
import Sidebar from "./Menu";
import Header  from "./Header";
import "./appLayout.css";

// Títulos fijos como fallback por si el menú no cargó aún
const TITULOS_FALLBACK = {
  "/":       "Dashboard",
  "/marcas": "Marcas",
  "/equipos": "Equipos",
};

export default function AppLayout() {
  const location = useLocation();
  const usuario  = useSelector(selectUsuario);
  const menus    = useSelector(selectMenus);

  // Busca el título en los menús del backend según la ruta actual
  // Si no encuentra → usa fallback hardcodeado
  const title = useMemo(() => {
    const ruta = location.pathname;

    // Busca en menús principales
    const encontrado = menus.find(m => m.url === ruta);
    if (encontrado) return encontrado.nombre;

    // Busca en submenús
    for (const m of menus) {
      const sub = m.subMenus?.find(s => s.url === ruta);
      if (sub) return sub.nombre;
    }

    // Fallback para rutas con parámetros como /equipos/:id
    if (ruta.startsWith("/equipos/")) return "Detalle de Equipo";

    return TITULOS_FALLBACK[ruta] ?? "Parque Informático";
  }, [location.pathname, menus]);

  const nombreUsuario = usuario?.nombreCompleto ?? "Usuario";
  const tipoUsuario   = usuario?.tipoUsuario    ?? "";

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <Header
          title={title}
          nombreUsuario={nombreUsuario}
          tipoUsuario={tipoUsuario}
        />
        <div className="zona-trabajo">
          <Outlet />
        </div>
      </div>
    </div>
  );
}