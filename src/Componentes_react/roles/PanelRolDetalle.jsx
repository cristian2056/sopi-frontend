import { C, btnSt } from "../../pages/Seguridad/constants";
import Spinner from "../ui/Spinner";

const TABS = [
  { key: "objetos",  label: "🔐 Permisos" },
  { key: "menus",    label: "📋 Menús"    },
  { key: "usuarios", label: "👥 Usuarios" },
];

export default function PanelRolDetalle({ rolActivo, tab, onTabChange, loadingRol, children }) {
  return (
    <div style={{
      background: C.white, borderRadius: 14,
      border: `1px solid ${C.gray200}`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden",
    }}>
      {/* Header con nombre del rol y tabs */}
      <div style={{
        padding: "16px 24px", borderBottom: `1px solid ${C.gray200}`,
        background: C.gray50, display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: "1.05rem", color: C.gray900 }}>
            {rolActivo.nombre}
          </div>
          <div style={{ fontSize: "0.82rem", color: C.gray400, marginTop: 2 }}>
            {rolActivo.descripcion || "Sin descripción"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 3, background: C.gray200, borderRadius: 9, padding: 3 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => onTabChange(t.key)}
              style={btnSt({
                background: tab === t.key ? C.white : "transparent",
                color:      tab === t.key ? C.gray900 : C.gray600,
                padding: "6px 14px", borderRadius: 7, fontSize: "0.82rem",
                boxShadow: tab === t.key ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
              })}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Contenido del tab activo */}
      {loadingRol ? <Spinner /> : children}
    </div>
  );
}
