// src/pages/Equipo/EquipoWizard.jsx
// Wizard flotante para crear un equipo nuevo paso a paso.
// Paso 1: Datos del equipo (obligatorio)
// Pasos 2-6: Componentes, Software, Red, Fotos, Asignación (opcionales)
import { useState } from "react";
import PasoIndicador from "./wizard/PasoIndicador";
import PasoEquipo    from "./wizard/PasoEquipo";
import PasoDetalle   from "./wizard/PasoDetalle";
import { COLOR, PASOS } from "./wizard/wizardConstants";

const DESCRIPCIONES = {
  1: () => "Completa los datos principales del equipo para continuar.",
  2: (equipo) => `Agrega los componentes instalados en "${equipo?.nombre ?? equipo?.codigoPatrimonial}". Puedes saltar este paso.`,
  3: () => "Registra el software instalado en el equipo. Puedes saltar este paso.",
  4: () => "Configura los datos de red del equipo. Puedes saltar este paso.",
  5: () => "Agrega fotos del equipo. Puedes saltar este paso.",
  6: () => "Asigna el equipo a un usuario y dependencia. Puedes saltar este paso.",
};

export default function EquipoWizard({ onCerrar, onEquipoCreado }) {
  const [pasoActual,   setPasoActual]   = useState(1);
  const [equipoCreado, setEquipoCreado] = useState(null);
  const [pasoMaximo,   setPasoMaximo]   = useState(1);

  const handleEquipoCreado = (equipo) => {
    setEquipoCreado(equipo);
    setPasoActual(2);
    setPasoMaximo(2);
    onEquipoCreado?.(equipo);
  };

  const irA = (num) => {
    if (num < 1) return;
    if (num > PASOS.length) { onCerrar(); return; }
    setPasoActual(num);
    setPasoMaximo(p => Math.max(p, num));
  };

  const tituloPaso = PASOS[pasoActual - 1];

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 3000, padding: "16px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        width: "100%", maxWidth: 560,
        maxHeight: "95vh", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        border: "2px solid #e5e7eb",
      }}>

        {/* Header */}
        <div style={{ padding: "16px 22px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#232946" }}>
              {tituloPaso.icon} {pasoActual === 1 ? "Nuevo equipo" : tituloPaso.label}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: "0.82rem", color: "#9ca3af" }}>
                Paso {pasoActual} de {PASOS.length}
              </span>
              <button onClick={onCerrar}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.4rem", color: "#9ca3af", lineHeight: 1, padding: 0 }}>
                ×
              </button>
            </div>
          </div>

          <PasoIndicador pasoActual={pasoActual} pasoCompletado={pasoMaximo} />

          <p style={{ margin: "14px 0 0", color: "#6b7280", fontSize: "0.85rem" }}>
            {DESCRIPCIONES[pasoActual]?.(equipoCreado)}
          </p>
        </div>

        {/* Barra de progreso */}
        <div style={{ height: 4, background: "#f3f4f6", margin: "14px 0 0" }}>
          <div style={{
            height: "100%", borderRadius: 2,
            background: COLOR.primary,
            width: `${((pasoActual - 1) / (PASOS.length - 1)) * 100}%`,
            transition: "width 0.4s ease",
          }} />
        </div>

        {/* Contenido scrolleable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px 22px" }}>
          {pasoActual === 1 && (
            <PasoEquipo onCreado={handleEquipoCreado} onCancelar={onCerrar} />
          )}
          {pasoActual >= 2 && equipoCreado && (
            <PasoDetalle
              paso={pasoActual}
              equipoId={equipoCreado.equipoId}
              onSiguiente={() => irA(pasoActual + 1)}
              onAnterior={() => irA(pasoActual - 1)}
              esFinal={pasoActual === PASOS.length}
            />
          )}
        </div>

      </div>
    </div>
  );
}
