// src/components/layout/Menu.jsx
// Sin menu.css — todos los estilos son inline
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutLocal } from "../../stores/authSlice";
import { clearMenu, selectMenus, selectMenuCargado } from "../../stores/menuSlice";
import { authApi } from "../../api/auth.api";
import { menuItems as menuFallback } from "../../app/menuItems";
import goreaLogo from "../../assets/Imagenes/gorea_logo.png";

// ─── Colores ──────────────────────────────────────────────────────────────────
const LIMA = {
  400: "#a0d744",
  600: "#649719",
  800: "#3e5b19",
};

// ─── Iconos por módulo ────────────────────────────────────────────────────────
const ICONOS = {
  "dashboard":      "🏠",
  "inventario":     "📦",
  "equipos":        "💻",
  "marcas":         "🏷️",
  "tickets":        "🎫",
  "usuarios":       "👥",
  "reportes":       "📊",
  "configuracion":  "⚙️",
  "mantenimiento":  "🔧",
  "mantenimientos": "🔧",
  "proveedores":    "🏭",
  "software":       "💿",
  "componentes":    "🔩",
  "dependencias":   "🏢",
  "seguridad":      "🔒",
  "administración": "⚙️",
  "soporte":        "🛠️",
  "equipos red":    "🌐",
  "tipos de activo":"📋",
  "roles":          "🎭",
};
const getIcono = (nombre) => ICONOS[nombre?.toLowerCase()] ?? "📄";

function filtrarMenu(items) {
  return items.map(item => ({ ...item, subMenus: item.subMenus?.length ? filtrarMenu(item.subMenus) : [] }));
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const sidebarBase = {
  width: 230,
  /* Glass oscuro verde — visible sobre el fondo verde del body */
  background: "rgba(12, 32, 5, 0.72)",
  backdropFilter: "blur(30px)",
  WebkitBackdropFilter: "blur(30px)",
  height: "100vh",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  boxShadow: "6px 0 40px rgba(5,20,2,0.50)",
  zIndex: 1200,
  overflow: "hidden",
  flexShrink: 0,
  transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
  borderRight: "1px solid rgba(160,215,68,0.18)",
};

const itemBase = {
  background: "none",
  border: "none",
  borderLeft: "3px solid transparent",
  color: "rgba(255,255,255,0.82)",
  textAlign: "left",
  padding: "0.62rem 0.85rem",
  fontSize: "0.9rem",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: "0.72rem",
  borderRadius: 10,
  cursor: "pointer",
  whiteSpace: "nowrap",
  overflow: "hidden",
  width: "100%",
  transition: "background 0.14s, color 0.14s",
};

export default function Sidebar({ menuMovil = false, onCerrarMovil }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();

  const menusRedux  = useSelector(selectMenus);
  const menuCargado = useSelector(selectMenuCargado);

  const items = filtrarMenu(
    menuCargado && menusRedux.length > 0
      ? [...menusRedux].sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99))
      : menuFallback.map(m => ({ nombre: m.name, url: m.path, orden: 99, subMenus: [], _icon: m.icon }))
  );

  const [collapsed, setCollapsed] = useState(false);
  const [hovered,   setHovered]   = useState(false);
  const [abiertos,  setAbiertos]  = useState({});
  const [hoveredId, setHoveredId] = useState(null);

  // En desktop: cierra al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (!document.getElementById("app-sidebar")?.contains(e.target)) {
        setCollapsed(true);
        setHovered(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const expanded = !collapsed || hovered;

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    dispatch(logoutLocal());
    dispatch(clearMenu());
    navigate("/login");
  };

  const toggle = (id) => setAbiertos(p => ({ ...p, [id]: !p[id] }));
  const isActive     = (url) => url && location.pathname === url;
  const isParentActive = (item) => item.subMenus?.some(s => isActive(s.url));

  const renderItem = (item, nivel = 0) => {
    const tieneHijos = item.subMenus?.length > 0;
    const key        = item.menuId ?? item.url ?? item.nombre;
    const abierto    = abiertos[key];
    const activo     = isActive(item.url) || isParentActive(item);
    const itemIcono  = item._icon ?? getIcono(item.nombre);
    const isHov      = hoveredId === key;

    const estilo = {
      ...itemBase,
      paddingLeft: nivel > 0 ? 34 : 12,
      fontSize: nivel > 0 ? "0.85rem" : "0.9rem",
      borderLeft: activo ? "3px solid #a0d744" : "3px solid transparent",
      background: activo
        ? "linear-gradient(90deg, rgba(160,215,68,0.25), rgba(160,215,68,0.08))"
        : isHov
          ? "rgba(255,255,255,0.08)"
          : "none",
      fontWeight: activo ? 700 : 500,
      color: activo ? "#c8f06a" : "rgba(255,255,255,0.80)",
      boxShadow: activo ? "inset 0 0 12px rgba(160,215,68,0.12)" : "none",
    };

    return (
      <React.Fragment key={key}>
        <button
          style={estilo}
          onMouseEnter={() => setHoveredId(key)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => {
            if (tieneHijos) toggle(key);
            else if (item.url) navigate(item.url);
          }}
        >
          <span style={{ fontSize: "1.15rem", flexShrink: 0 }}>{itemIcono}</span>
          {expanded && (
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.nombre ?? item.name}
            </span>
          )}
          {tieneHijos && expanded && (
            <span style={{ fontSize: "0.65rem", opacity: 0.6, marginLeft: "auto" }}>
              {abierto ? "▲" : "▼"}
            </span>
          )}
        </button>

        {tieneHijos && abierto && expanded && (
          <div>
            {[...item.subMenus]
              .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99))
              .map(sub => renderItem(sub, nivel + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <aside
      id="app-sidebar"
      className={`app-sidebar${menuMovil ? " sidebar-movil-abierto" : ""}`}
      style={{ ...sidebarBase, width: expanded ? 230 : 64 }}
      onMouseEnter={() => collapsed && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header / logo */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setCollapsed(v => !v)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCollapsed(v => !v); } }}
        style={{
          display: "flex", alignItems: "center", gap: "0.8rem",
          padding: "1rem 0.9rem", minHeight: 64,
          borderBottom: "1px solid rgba(160,215,68,0.15)",
          cursor: "pointer", userSelect: "none", overflow: "hidden",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(160,215,68,0.10)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        {/* Logo con fondo glass lima */}
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: "rgba(160,215,68,0.18)",
          border: "1px solid rgba(160,215,68,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}>
          <img src={goreaLogo} alt="Logo"
            style={{ width: 28, height: 28, objectFit: "contain" }} />
        </div>
        {expanded && (
          <div style={{ overflow: "hidden" }}>
            <div style={{
              fontWeight: 800, fontSize: "0.95rem",
              whiteSpace: "nowrap", color: "#fff",
              letterSpacing: "0.01em",
            }}>
              Parque Informático
            </div>
            <div style={{
              fontSize: "0.72rem", color: "rgba(160,215,68,0.9)",
              fontWeight: 600, letterSpacing: "0.04em",
              marginTop: 1,
            }}>
              SISTEMA DE GESTIÓN
            </div>
          </div>
        )}
      </div>

      {/* Nav scrolleable */}
      <nav style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        padding: "0.6rem 0.55rem",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(160,215,68,0.25) transparent",
      }}>
        {items.map(item => renderItem(item))}
      </nav>

      {/* Cerrar sesión */}
      <div style={{
        flexShrink: 0,
        borderTop: "1px solid rgba(160,215,68,0.12)",
        padding: "0.55rem",
      }}>
        <button
          style={{ ...itemBase, borderLeft: "3px solid transparent" }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(220,38,38,0.22)";
            e.currentTarget.style.color = "#fca5a5";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "rgba(255,255,255,0.80)";
          }}
          onClick={handleLogout}
        >
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>🚪</span>
          {expanded && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}