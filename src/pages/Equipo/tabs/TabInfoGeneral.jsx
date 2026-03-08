// src/pages/Equipos/tabs/TabInfoGeneral.jsx
import React from "react";

// Muestra los datos del equipo en una grilla de campos
// Por ahora es solo lectura — después agregamos el formulario de edición

function Campo({ label, valor }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 600, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{
        padding: "9px 12px",
        background: "#f9fafb",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        fontSize: "0.95rem",
        color: valor ? "#111827" : "#9ca3af",
      }}>
        {valor ?? "—"}
      </div>
    </div>
  );
}

export default function TabInfoGeneral({ equipo }) {
  return (
    <div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "0 24px",
      }}>
        <Campo label="Código Patrimonial" valor={equipo.codigoPatrimonial} />
        <Campo label="Código Interno"     valor={equipo.codigoInterno} />
        <Campo label="Nombre"             valor={equipo.nombre} />
        <Campo label="Serial"             valor={equipo.serial} />
        <Campo label="Estado"             valor={equipo.estado} />
        <Campo label="Tipo de Activo ID"  valor={equipo.tipoActivoId} />
        <Campo label="Marca ID"           valor={equipo.marcaId} />
        <Campo label="Proveedor ID"       valor={equipo.proveedorId} />
        <Campo label="Nº Factura"         valor={equipo.numeroFactura} />
        <Campo label="Garantía hasta"     valor={equipo.fechaGarantia} />
        <Campo label="Próx. Mantenimiento" valor={equipo.mantenimientoProximaFecha} />
        <Campo label="Frec. Mantenimiento (días)" valor={equipo.mantenimientoFrecuenciaDias} />
        <Campo label="Activo"             valor={equipo.activo ? "Sí" : "No"} />
      </div>

      {/* Observaciones ocupa todo el ancho */}
      <Campo label="Observaciones" valor={equipo.observaciones} />
    </div>
  );
}