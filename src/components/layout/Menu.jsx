// src/components/layout/Menu.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutLocal } from "../../stores/authSlice";
import { clearMenu, selectMenus, selectMenuCargado } from "../../stores/menuSlice";
import { authApi } from "../../api/auth.api";
import { menuItems as menuFallback } from "../../app/menuItems"; // fallback si el backend falla
import "./menu.css";
import goreaLogo from "../../assets/Imagenes/gorea_logo.png";

// Mapa de iconos por nombre de módulo
// Si el backend devuelve un campo "icono" en el futuro, se usa ese directamente
const ICONOS = {
  "dashboard":  "🏠",
  "marcas":     "🏷️",
  "equipos":    "💻",
  "equipo":     "💻",
  "tickets":    "🎫",
  "tikets":     "🎫",
  "usuarios":   "👥",
  "reportes":   "📊",
  "configuracion": "⚙️",
  "mantenimiento": "🔧",
  "proveedores": "🏭",
  "software":   "💿",
  "componentes":"🔩",
  "dependencias":"🏢",
};

const getIcono = (nombre) => {
  if (!nombre) return "📄";
  return ICONOS[nombre.toLowerCase()] ?? "📄";
};

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();

  // Menús desde Redux (vienen del backend)
  const menusRedux  = useSelector(selectMenus);
  const menuCargado = useSelector(selectMenuCargado);

  // Si el menú del backend cargó → usarlo; si no → usar fallback hardcodeado
  const items = menuCargado && menusRedux.length > 0
    ? menusRedux.map(m => ({
        path:  m.url,
        name:  m.nombre,
        icon:  m.icono ?? getIcono(m.nombre),   // usa icono del backend o lo deduce por nombre
        orden: m.orden ?? 99,
        subMenus: m.subMenus ?? [],
      })).sort((a, b) => a.orden - b.orden)
    : menuFallback;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered,   setIsHovered]   = useState(false);
  const [subMenuAbierto, setSubMenuAbierto] = useState(null); // nombre del menú con submenu abierto

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar && !sidebar.contains(event.target)) {
        setIsCollapsed(true);
        setIsHovered(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const expanded = !isCollapsed || isHovered;
  const sidebarClass = `sidebar${isCollapsed ? " collapsed" : ""}${isHovered ? " hovered" : ""}`;

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* igual limpiamos */ }
    dispatch(logoutLocal());
    dispatch(clearMenu());
    navigate("/login");
  };

  const handleItemClick = (item) => {
    if (item.subMenus && item.subMenus.length > 0) {
      // Tiene submenús → toggle
      setSubMenuAbierto(p => p === item.name ? null : item.name);
    } else {
      navigate(item.path);
      setSubMenuAbierto(null);
    }
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (item) =>
    item.subMenus?.some(s => location.pathname === s.url);

  return (
    <aside
      className={sidebarClass}
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sidebar-header" onClick={() => setIsCollapsed(v => !v)}>
        <img src={goreaLogo} alt="Logo" className="logo-img" />
        {expanded && <span className="logo-text">Parque Informático</span>}
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const tieneSubMenus = item.subMenus && item.subMenus.length > 0;
          const abierto       = subMenuAbierto === item.name;
          const activo        = isActive(item.path) || isParentActive(item);

          return (
            <React.Fragment key={item.path ?? item.name}>
              <button
                className={`sidebar-item${activo ? " active" : ""}`}
                onClick={() => handleItemClick(item)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.name}</span>
                {tieneSubMenus && expanded && (
                  <span style={{ marginLeft: "auto", fontSize: "0.75rem", opacity: 0.7 }}>
                    {abierto ? "▲" : "▼"}
                  </span>
                )}
              </button>

              {/* Submenús desplegables */}
              {tieneSubMenus && abierto && expanded && (
                <div style={{ paddingLeft: 12 }}>
                  {item.subMenus.map(sub => (
                    <button
                      key={sub.url ?? sub.nombre}
                      className={`sidebar-item${isActive(sub.url) ? " active" : ""}`}
                      onClick={() => navigate(sub.url)}
                      style={{ fontSize: "0.88rem", paddingLeft: 28 }}
                    >
                      <span className="sidebar-icon">{sub.icono ?? getIcono(sub.nombre)}</span>
                      <span className="sidebar-label">{sub.nombre}</span>
                    </button>
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-item sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}