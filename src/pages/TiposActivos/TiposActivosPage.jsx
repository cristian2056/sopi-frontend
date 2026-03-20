// src/pages/TiposActivos/TiposActivosPage.jsx
import React, { useEffect, useState } from "react";
import { tiposActivosApi } from "../../api/administracion.api";
import DataTable  from "../../Componentes_react/ui/DataTable";
import ModalDialog from "../../Componentes_react/ui/ModalDialog";
import FormModal   from "../../Componentes_react/ui/FormModal";
import { usePermiso } from "../../stores/menuSlice";

const FIELDS = [
  { name: "nombre", label: "Nombre", type: "text", required: true, placeholder: "Ej: Laptop, Impresora, Monitor...", span: 2 },
];

const columnas = [
  { key: "tipoActivoId", label: "ID",     ancho: 80,  render: (t) => `#${t.tipoActivoId}` },
  { key: "nombre",       label: "Nombre", ancho: 400 },
];

export default function TiposActivosPage() {
  const { crear, modificar, eliminar } = usePermiso("TiposActivos");
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
      const data = await tiposActivosApi.listar();
      setItems(Array.isArray(data.datos) ? data.datos : data.datos ? [data.datos] : []);
    } catch (e) {
      setModal({ open: true, variant: "error", message: e.message || "Error al cargar." });
    } finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const handleGuardar = async (valores) => {
    setFormLoading(true);
    try {
      if (form?.tipoActivoId) {
        const res = await tiposActivosApi.actualizar(form.tipoActivoId, valores);
        if (res?.exito === false) throw new Error(res.mensaje || "No se pudo actualizar.");
        setModal({ open: true, variant: "success", message: "Tipo actualizado correctamente." });
      } else {
        const res = await tiposActivosApi.crear(valores);
        if (res?.exito === false) throw new Error(res.mensaje || "No se pudo crear.");
        setModal({ open: true, variant: "success", message: "Tipo creado correctamente." });
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
      const res = await tiposActivosApi.eliminar(confirm.id);
      if (res?.exito === false) throw new Error(res.mensaje || "No se pudo eliminar.");
      setConfirm({ open: false, id: null, loading: false });
      setModal({ open: true, variant: "success", message: "Tipo eliminado correctamente." });
      cargar();
    } catch (e) {
      setConfirm(p => ({ ...p, loading: false }));
      setModal({ open: true, variant: "error", message: e.message || "No se pudo eliminar." });
    }
  };

  const filtrados = items.filter(t =>
    (t.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ width: "100%", maxWidth: 780 }}>
      <div className="page-toolbar">
        <h2>🗂️ Tipos de Activos</h2>
        <input className="search-input" type="text" placeholder="🔍 Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        {crear && (
          <button className="btn-primary" onClick={() => setForm({})}>
            + Nuevo tipo
          </button>
        )}
      </div>

      <DataTable
        columnas={columnas} datos={filtrados} loading={loading}
        keyField="tipoActivoId" mensajeVacio="No hay tipos de activos registrados."
        onEdit={modificar ? t => setForm({ tipoActivoId: t.tipoActivoId, nombre: t.nombre }) : undefined}
        onDelete={eliminar ? t => setConfirm({ open: true, id: t.tipoActivoId, loading: false }) : undefined}
      />

      {form !== null && (
        <FormModal
          title={form.tipoActivoId ? "✏️ Editar tipo de activo" : "➕ Nuevo tipo de activo"}
          fields={FIELDS} initialData={form} cols={1} maxWidth={420}
          onSubmit={handleGuardar} loading={formLoading} onCancel={() => setForm(null)}
        />
      )}

      <ModalDialog open={modal.open} variant={modal.variant} message={modal.message}
        onClose={() => setModal({ open: false, variant: "error", message: "" })} />

      <ModalDialog
        open={confirm.open} variant="confirm" title="Eliminar tipo de activo"
        message="¿Seguro que deseas eliminar este tipo? Esta acción no se puede deshacer."
        loading={confirm.loading} confirmText="Sí, eliminar" cancelText="Cancelar"
        onConfirm={confirmarEliminar}
        onClose={() => setConfirm({ open: false, id: null, loading: false })}
      />
    </div>
  );
}
