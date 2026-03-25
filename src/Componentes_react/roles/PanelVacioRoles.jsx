import { C } from "../../pages/Seguridad/constants";

export default function PanelVacioRoles() {
  return (
    <div style={{
      background: C.white, borderRadius: 14, border: `2px dashed ${C.gray200}`,
      padding: "70px 40px", textAlign: "center",
    }}>
      <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎭</div>
      <div style={{ fontWeight: 700, fontSize: "1.05rem", color: C.gray700, marginBottom: 6 }}>
        Seleccioná un rol
      </div>
      <div style={{ color: C.gray400, fontSize: "0.88rem" }}>
        Hacé clic en un rol para gestionar sus permisos y usuarios
      </div>
    </div>
  );
}
