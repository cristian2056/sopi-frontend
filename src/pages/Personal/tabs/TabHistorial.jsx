// src/pages/Personal/tabs/TabHistorial.jsx
import React from "react";

// Por ahora muestra un historial estático representativo.
// Cuando el backend tenga tabla de auditoría, se conecta a /api/Personas/{id}/historial

const EVENTOS_DEMO = [
  { fecha: "2026-02-15", tipo: "creacion",    texto: "Persona registrada en el sistema."         },
  { fecha: "2026-02-15", tipo: "usuario",     texto: "Usuario del sistema creado (admin)."        },
  { fecha: "2026-02-20", tipo: "edicion",     texto: "Datos personales actualizados."             },
  { fecha: "2026-03-01", tipo: "rol",         texto: "Rol 'Técnico' asignado al usuario."         },
];

const COLORES = {
  creacion: { bg: "#dcfce7", color: "#16a34a", icono: "➕" },
  usuario:  { bg: "#dbeafe", color: "#2563eb", icono: "👤" },
  edicion:  { bg: "#fef9c3", color: "#ca8a04", icono: "✏️" },
  rol:      { bg: "#f3e8ff", color: "#7c3aed", icono: "🔐" },
};

export default function TabHistorial() {
  return (
    <div>
      <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: 20 }}>
        Registro de cambios y acciones realizadas sobre esta persona.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {EVENTOS_DEMO.map((ev) => {
          const estilo = COLORES[ev.tipo] ?? COLORES.edicion;
          return (
            <div key={`${ev.fecha}-${ev.tipo}`} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 16px", borderRadius: 10,
              background: "#f9fafb", border: "1px solid #e5e7eb",
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: "50%",
                background: estilo.bg, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "1rem", flexShrink: 0,
              }}>
                {estilo.icono}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.92rem" }}>
                  {ev.texto}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: 2 }}>
                  {ev.fecha}
                </div>
              </div>
              <span style={{
                padding: "3px 10px", borderRadius: 20,
                background: estilo.bg, color: estilo.color,
                fontSize: "0.75rem", fontWeight: 700,
              }}>
                {ev.tipo}
              </span>
            </div>
          );
        })}
      </div>

      <p style={{ color: "#9ca3af", fontSize: "0.82rem", marginTop: 20, fontStyle: "italic" }}>
        * El historial completo estará disponible cuando se implemente la auditoría en el backend.
      </p>
    </div>
  );
}
