// src/pages/Equipo/EquipoForm.jsx
import React, { useState, useEffect } from "react";
import { marcasApi } from "../../api/marcas.api";
import { tiposActivosApi, proveedoresApi } from "../../api/administracion.api";
import EquipoFormCampos from "./components/EquipoFormCampos";

const COLOR = {
  primary:      "#4c7318",
  primaryHover: "#3e5b19",
  disabled:     "#9ca3af",
};

export default function EquipoForm({ initialData = {}, onSubmit, loading, onCancel }) {
  const [form, setForm] = useState({
    codigoPatrimonial:           initialData.codigoPatrimonial           ?? "",
    codigoInterno:               initialData.codigoInterno               ?? "",
    serial:                      initialData.serial                      ?? "",
    nombre:                      initialData.nombre                      ?? "",
    tipoActivoId:                initialData.tipoActivoId                ?? "",
    marcaId:                     initialData.marcaId                     ?? "",
    proveedorId:                 initialData.proveedorId                 ?? "",
    estado:                      initialData.estado                      ?? "ACTIVO",
    fechaGarantia:               initialData.fechaGarantia               ?? "",
    numeroFactura:               initialData.numeroFactura               ?? "",
    mantenimientoProximaFecha:   initialData.mantenimientoProximaFecha   ?? "",
    mantenimientoFrecuenciaDias: initialData.mantenimientoFrecuenciaDias ?? "",
    observaciones:               initialData.observaciones               ?? "",
    activo:                      initialData.activo                      ?? true,
    fotoId:                      initialData.fotoId                      ?? 1,
  });

  const [marcas,      setMarcas]      = useState([]);
  const [tiposActivo, setTiposActivo] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loadingListas, setLoadingListas] = useState(true);

  useEffect(() => {
    const cargarListas = async () => {
      try {
        const [rMarcas, rTipos, rProveedores] = await Promise.all([
          marcasApi.listar(),
          tiposActivosApi.listar(),
          proveedoresApi.listar(),
        ]);
        setMarcas(rMarcas.datos      ?? []);
        setTiposActivo(rTipos.datos  ?? []);
        setProveedores(rProveedores.datos ?? []);
      } catch (e) {
        console.error("Error cargando listas:", e);
      } finally {
        setLoadingListas(false);
      }
    };
    cargarListas();
  }, []);

  const set = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      tipoActivoId:                parseInt(form.tipoActivoId)                || 0,
      marcaId:                     form.marcaId     ? parseInt(form.marcaId)  : null,
      proveedorId:                 form.proveedorId ? parseInt(form.proveedorId) : null,
      mantenimientoFrecuenciaDias: form.mantenimientoFrecuenciaDias ? parseInt(form.mantenimientoFrecuenciaDias) : null,
      fechaGarantia:               form.fechaGarantia            || null,
      mantenimientoProximaFecha:   form.mantenimientoProximaFecha || null,
      observaciones:               form.observaciones.trim()      || null,
      codigoInterno:               form.codigoInterno.trim()      || null,
      serial:                      form.serial.trim()             || null,
      nombre:                      form.nombre.trim()             || null,
      numeroFactura:               form.numeroFactura.trim()      || null,
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 3000, overflowY: "auto", padding: "24px 0",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        padding: "36px 40px", width: "100%", maxWidth: 640,
        boxShadow: "0 12px 48px rgba(0,0,0,0.22)",
        border: "2px solid #e5e7eb", margin: "auto",
      }}>

        <h3 style={{ margin: "0 0 24px", fontSize: "1.2rem", fontWeight: 800, color: "#232946", textAlign: "center" }}>
          {initialData.equipoId ? "✏️ Editar equipo" : "➕ Nuevo equipo"}
        </h3>

        {loadingListas ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
            Cargando datos...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <EquipoFormCampos
              form={form}
              set={set}
              setForm={setForm}
              marcas={marcas}
              tiposActivo={tiposActivo}
              proveedores={proveedores}
            />

            {/* Botones */}
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={onCancel}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 9,
                  border: "1.5px solid #d1d5db", background: "#fff",
                  fontWeight: 600, fontSize: "0.97rem", cursor: "pointer", color: "#374151",
                }}>
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 9, border: "none",
                  background: loading ? COLOR.disabled : COLOR.primary,
                  color: "#fff", fontWeight: 700, fontSize: "0.97rem",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = COLOR.primaryHover; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = COLOR.primary; }}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
