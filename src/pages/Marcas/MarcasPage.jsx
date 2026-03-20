// src/pages/Marcas/MarcasPage.jsx
import React, { useEffect, useState } from "react";
import { marcasApi } from "../../api/marcas.api";
import ModalDialog from "../../Componentes_react/ui/ModalDialog";
import DataTable   from "../../Componentes_react/ui/DataTable";
import MarcaForm   from "./MarcaForm";
import { usePermiso } from "../../stores/menuSlice";

const FIELDS = [
  { name: "nombre", label: "Nombre", type: "text", required: true, placeholder: "Ej: Samsung", span: 2 },
  { name: "modelo", label: "Modelo", type: "text", placeholder: "Ej: Galaxy S23", span: 2 },
];


// Definición de columnas para la tabla de marcas
// Cuando uses DataTable en otras páginas, solo cambiás este array
const columnas = [
  { key: "marcaId", label: "ID",     ancho: 80,  render: (m) => `#${m.marcaId}` },
  { key: "nombre",  label: "Nombre", ancho: 250 },
  { key: "modelo",  label: "Modelo", ancho: 250 },
];

export default function MarcasPage() {
  const { crear, modificar, eliminar } = usePermiso("Marcas");
  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [busqueda,    setBusqueda]    = useState("");
  const [modal,       setModal]       = useState({ open: false, variant: "error", message: "" });
  const [confirm,     setConfirm]     = useState({ open: false, marcaId: null, loading: false });
  const [form,        setForm]        = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await marcasApi.listar();
      setItems(Array.isArray(data.datos) ? data.datos : data.datos ? [data.datos] : []);
    } catch (e) {
      setModal({ open: true, variant: "error", message: e.message || "Error al listar marcas." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleGuardar = async (valores) => {
    setFormLoading(true);
    try {
      if (form?.marcaId) {
        const res = await marcasApi.actualizar(form.marcaId, valores);
        if (res?.exito === false) throw new Error(res.mensaje || "No se pudo actualizar.");
        setModal({ open: true, variant: "success", message: "Marca actualizada correctamente." });
      } else {
        const res = await marcasApi.crear(valores);
        if (res?.exito === false) throw new Error(res.mensaje || "No se pudo crear.");
        setModal({ open: true, variant: "success", message: "Marca creada correctamente." });
      }
      setForm(null);
      load();
    } catch (e) {
      setModal({ open: true, variant: "error", message: e.message || "No se pudo guardar." });
    } finally {
      setFormLoading(false);
    }
  };

  const confirmarEliminar = async () => {
    setConfirm((p) => ({ ...p, loading: true }));
    try {
      const res = await marcasApi.eliminar(confirm.marcaId);
      if (res?.exito === false) throw new Error(res.mensaje || "No se pudo eliminar.");
      setConfirm({ open: false, marcaId: null, loading: false });
      setModal({ open: true, variant: "success", message: "Marca eliminada correctamente." });
      load();
    } catch (e) {
      setConfirm((p) => ({ ...p, loading: false }));
      setModal({ open: true, variant: "error", message: e.message || "No se pudo eliminar." });
    }
  };

  const itemsFiltrados = items.filter((m) =>
    (m.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (m.modelo ?? "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ width: "100%", maxWidth: 980 }}>

      {/* Barra superior */}
      <div className="page-toolbar">
        <h2>Marcas</h2>
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Buscar por nombre o modelo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {crear && (
          <button className="btn-primary" onClick={() => setForm({})}>
            + Nueva marca
          </button>
        )}
      </div>

      {/* Tabla genérica */}
      <DataTable
        columnas={columnas}
        datos={itemsFiltrados}
        loading={loading}
        keyField="marcaId"
        mensajeVacio="No hay marcas registradas."
        onEdit={modificar ? (m) => setForm({ marcaId: m.marcaId, nombre: m.nombre, modelo: m.modelo }) : undefined}
        onDelete={eliminar ? (m) => setConfirm({ open: true, marcaId: m.marcaId, loading: false }) : undefined}
      />

      {/* Modal formulario */}
      {form !== null && (
        <MarcaForm
          initialData={form}
          onSubmit={handleGuardar}
          loading={formLoading}
          onCancel={() => setForm(null)}
        />
      )}

      {/* Modal éxito/error */}
      <ModalDialog
        open={modal.open}
        variant={modal.variant}
        message={modal.message}
        onClose={() => setModal({ open: false, variant: "error", message: "" })}
      />

      {/* Modal confirmar eliminar */}
      <ModalDialog
        open={confirm.open}
        variant="confirm"
        title="Eliminar marca"
        message="¿Seguro que deseas eliminar esta marca? Esta acción no se puede deshacer."
        loading={confirm.loading}
        onConfirm={confirmarEliminar}
        onClose={() => setConfirm({ open: false, marcaId: null, loading: false })}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}