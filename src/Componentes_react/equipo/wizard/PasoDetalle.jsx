// src/pages/Equipo/wizard/PasoDetalle.jsx
// Wrapper de navegación para los pasos 2-6 (tabs existentes).
import TabComponentes from "../tabs/TabComponentes";
import TabSoftware    from "../tabs/TabSoftware";
import TabRed         from "../tabs/TabRed";
import TabFotos       from "../tabs/TabFotos";
import TabAsignacion  from "../tabs/TabAsignacion";
import { COLOR, PASOS } from "./wizardConstants";

export default function PasoDetalle({ paso, equipoId, onSiguiente, onAnterior, esFinal }) {
  return (
    <div>
      <div style={{ minHeight: 200 }}>
        {paso === 2 && <TabComponentes equipoId={equipoId} crear modificar eliminar />}
        {paso === 3 && <TabSoftware    equipoId={equipoId} crear modificar eliminar />}
        {paso === 4 && <TabRed         equipoId={equipoId} crear modificar eliminar />}
        {paso === 5 && <TabFotos       equipoId={equipoId} crear eliminar />}
        {paso === 6 && <TabAsignacion  equipoId={equipoId} crear modificar eliminar />}
      </div>

      <div style={{
        display: "flex", gap: 10, marginTop: 24,
        paddingTop: 16, borderTop: "1px solid #e5e7eb",
      }}>
        <button type="button" onClick={onAnterior}
          style={{
            flex: 1, padding: "10px 0", borderRadius: 9,
            border: "1.5px solid #d1d5db", background: "#fff",
            fontWeight: 600, fontSize: "0.97rem", cursor: "pointer", color: "#374151",
          }}>
          ← Anterior
        </button>
        <button type="button" onClick={onSiguiente}
          style={{
            flex: 2, padding: "10px 0", borderRadius: 9, border: "none",
            background: COLOR.primary, color: "#fff",
            fontWeight: 700, fontSize: "0.97rem", cursor: "pointer",
          }}
          onMouseEnter={e => e.currentTarget.style.background = COLOR.primaryHover}
          onMouseLeave={e => e.currentTarget.style.background = COLOR.primary}
        >
          {esFinal ? "✅ Finalizar" : `Continuar → ${PASOS[paso]?.label ?? ""}`}
        </button>
      </div>
    </div>
  );
}
