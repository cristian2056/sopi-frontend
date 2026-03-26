// src/pages/Proveedores/ProveedoresPage.jsx
import React, { useEffect, useState } from "react";
import { proveedoresApi } from "../../api/administracion.api";
import DataTable  from "../../Componentes_react/ui/DataTable";
import ModalDialog from "../../Componentes_react/ui/ModalDialog";
import FormModal   from "../../Componentes_react/ui/FormModal";
import { usePermiso } from "../../stores/menuSlice";

const CALIFICACIONES = [
  { value: "1", label: "1 - Pésimo" },
  { value: "2", label: "2 - Regular" },
  { value: "3", label: "3 - Aceptable" },
  { value: "4", label: "4 - Bueno" },
  { value: "5", label: "5 - Excelente" },
];

const FIELDS = [
  { name: "nombre",            label: "Nombre",           type: "text",     required: true, placeholder: "Razón social" },
  { name: "ruc",               label: "RUC / NIT",        type: "text",     placeholder: "20123456789" },
  { name: "rubro",             label: "Rubro",            type: "text",     placeholder: "Ej: Tecnología" },
  { name: "calificacion",      label: "Calificación",     type: "select",   options: CALIFICACIONES },
  { name: "telefono",          label: "Teléfono",         type: "tel",      placeholder: "+51 999 999 999" },
  { name: "email",             label: "Email",            type: "email",    placeholder: "contacto@empresa.com" },
  { name: "direccion",         label: "Dirección",        type: "text",     placeholder: "Av. Principal 123", span: 2 },
  { name: "contactoPrincipal", label: "Contacto principal", type: "text",   placeholder: "Nombre del contacto", span: 2 },
  { name: "observaciones",     label: "Observaciones",    type: "textarea", placeholder: "Notas adicionales...", rows: 3, span: 2 },
];

const BADGE_CAL = {
  "1": { bg: "#fee2e2", color: "#dc2626", label: "1 - Pésimo" },
  "2": { bg: "#fef9c3", color: "#a16207", label: "2 - Regular" },
  "3": { bg: "#e0f2fe", color: "#0369a1", label: "3 - Aceptable" },
  "4": { bg: "#dcfce7", color: "#16a34a", label: "4 - Bueno" },
  "5": { bg: "#d1fae5", color: "#059669", label: "5 - Excelente" },
};

const columnas = [
  { key: "proveedorId", label: "ID",     ancho: 70,  render: p => `#${p.proveedorId}` },
  { key: "nombre",      label: "Nombre", ancho: 220 },
  { key: "ruc",         label: "RUC",    ancho: 130, render: p => p.ruc ?? "—" },
  { key: "rubro",       label: "Rubro",  ancho: 140, render: p => p.rubro ?? "—" },
  { key: "telefono",    label: "Teléfono", ancho: 130, render: p => p.telefono ?? "—" },
  {
    key: "calificacion", label: "Calificación", ancho: 110,
    render: p => {
      if (!p.calificacion) return <span style={{ color: "#d1d5db" }}>—</span>;
      const s = BADGE_CAL[String(p.calificacion)] ?? { bg: "#f3f4f6", color: "#6b7280", label: p.calificacion };
      return (
        <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.8rem" }}>
          {s.label}
        </span>
      );
    },
  },
];

export default function ProveedoresPage() {
  const { crear, modificar, eliminar } = usePermiso("Proveedores");
  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [busqueda,    setBusqueda]    = useState("");
  const [form,        setForm]        = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [modal,       setModal]       = useState({ open: false, variant: "error", message: "" });
  const [confirm,     setConfirm]     = useState({ open: false, id: null, loading: false });

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await proveedoresApi.listar();
      const raw = data.datos;
      setItems(Array.isArray(raw) ? raw : raw ? [raw] : []);
    } catch (e) {
      setModal({ open: true, variant: "error", message: e.message || "Error al cargar." });
    } finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const handleGuardar = async (valores) => {
    setFormLoading(true);
    try {
      if (form?.proveedorId) {
        const res = await proveedoresApi.actualizar(form.proveedorId, valores);
        if (res?.exito === false) throw new Error(res.mensaje || "No se pudo actualizar.");
        setModal({ open: true, variant: "success", message: "Proveedor actualizado correctamente." });
      } else {
        const res = await proveedoresApi.crear(valores);
        if (res?.exito === false) throw new Error(res.mensaje || "No se pudo crear.");
        setModal({ open: true, variant: "success", message: "Proveedor creado correctamente." });
      }
      setForm(null);
      cargar();
    } catch (e) {
      setModal({ open: true, variant: "error", message: e.message || "No se pudo guardar." });
    } finally { setFormLoading(false); }
  };

  const confirmarEliminar = async () => {
    setConfirm(p => ({ ...p, loading: true }));
    try {
      const res = await proveedoresApi.eliminar(confirm.id);
      if (res?.exito === false) throw new Error(res.mensaje || "No se pudo eliminar.");
      setConfirm({ open: false, id: null, loading: false });
      setModal({ open: true, variant: "success", message: "Proveedor eliminado correctamente." });
      cargar();
    } catch (e) {
      setConfirm(p => ({ ...p, loading: false }));
      setModal({ open: true, variant: "error", message: e.message || "No se pudo eliminar." });
    }
  };

  const filtrados = items.filter(p =>
    [p.nombre, p.ruc, p.rubro, p.email, p.contactoPrincipal]
      .some(v => (v ?? "").toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div style={{ width: "100%", maxWidth: 1100 }}>
      <div className="page-toolbar">
        <h2>🏢 Proveedores</h2>
        <input className="search-input" type="text" placeholder="🔍 Buscar por nombre, RUC, rubro..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        {crear && (
          <button className="btn-primary" onClick={() => setForm({})}>
            + Nuevo proveedor
          </button>
        )}
      </div>

      <DataTable
        columnas={columnas} datos={filtrados} loading={loading}
        keyField="proveedorId" mensajeVacio="No hay proveedores registrados."
        onEdit={modificar ? p => setForm({ ...p }) : undefined}
        onDelete={eliminar ? p => setConfirm({ open: true, id: p.proveedorId, loading: false }) : undefined}
      />

      {form !== null && (
        <FormModal
          title={form.proveedorId ? "✏️ Editar proveedor" : "➕ Nuevo proveedor"}
          fields={FIELDS} initialData={form} cols={2} maxWidth={600}
          onSubmit={handleGuardar} loading={formLoading} onCancel={() => setForm(null)}
        />
      )}

      <ModalDialog open={modal.open} variant={modal.variant} message={modal.message}
        onClose={() => setModal({ open: false, variant: "error", message: "" })} />

      <ModalDialog
        open={confirm.open} variant="confirm" title="Eliminar proveedor"
        message="¿Seguro que deseas eliminar este proveedor? Esta acción no se puede deshacer."
        loading={confirm.loading} confirmText="Sí, eliminar" cancelText="Cancelar"
        onConfirm={confirmarEliminar}
        onClose={() => setConfirm({ open: false, id: null, loading: false })}
      />
    </div>
  );
}
