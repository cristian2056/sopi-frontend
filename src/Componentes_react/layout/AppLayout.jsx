// src/components/layout/AppLayout.jsx
import React, { useMemo, useState, useEffect } from "react";
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

  // Estado del menú en móvil
  const [menuMovil, setMenuMovil] = useState(false);

  // Cierra el menú móvil al cambiar de ruta
  useEffect(() => { setMenuMovil(false); }, [location.pathname]);

  const title = useMemo(() => {
    const ruta = location.pathname;
    const encontrado = menus.find(m => m.url === ruta);
    if (encontrado) return encontrado.nombre;
    for (const m of menus) {
      const sub = m.subMenus?.find(s => s.url === ruta);
      if (sub) return sub.nombre;
    }
    if (ruta.startsWith("/equipos/"))  return "Detalle de Equipo";
    if (ruta.startsWith("/personal/")) return "Detalle de Personal";
    return TITULOS_FALLBACK[ruta] ?? "Parque Informático";
  }, [location.pathname, menus]);

  const nombreUsuario = usuario?.nombreCompleto ?? "Usuario";
  const tipoUsuario   = usuario?.tipoUsuario    ?? "";

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", position: "relative", zIndex: 1 }}>

      {/* Sidebar — en móvil es overlay */}
      <Sidebar menuMovil={menuMovil} onCerrarMovil={() => setMenuMovil(false)} />

      {/* Backdrop oscuro en móvil cuando el menú está abierto */}
      {menuMovil && (
        <div
          onClick={() => setMenuMovil(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(5,20,2,0.55)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            zIndex: 1100,
          }}
        />
      )}

      {/* Columna derecha */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header
          title={title}
          nombreUsuario={nombreUsuario}
          tipoUsuario={tipoUsuario}
          onMenuToggle={() => setMenuMovil(v => !v)}
        />

        {/* Área de contenido — estilos en index.css (.content-scroll / .content-glass) */}
        <div className="content-scroll">
          <div className="content-glass">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
