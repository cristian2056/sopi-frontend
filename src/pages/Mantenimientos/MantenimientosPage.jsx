// src/pages/Mantenimientos/MantenimientosPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { mantenimientosApi } from "../../api/mantenimientos.api";
import DataTable      from "../../Componentes_react/ui/DataTable";
import ModalDialog    from "../../Componentes_react/ui/ModalDialog";
import Overlay        from "../../Componentes_react/ui/Overlay";
import { usePermiso } from "../../stores/menuSlice";
import { selectUsuario } from "../../stores/authSlice";
import MantenimientoForm from "../../Componentes_react/mantenimientos/MantenimientoForm";

const TIPOS   = ["PREVENTIVO", "CORRECTIVO"];
const ESTADOS = ["ABIERTO", "EN_PROCESO", "CERRADO"];

const TIPO_BADGE = {
  PREVENTIVO: { bg: "#dbeafe", color: "#1d4ed8" },
  CORRECTIVO: { bg: "#fee2e2", color: "#dc2626" },
};
const ESTADO_BADGE = {
  ABIERTO:    { bg: "#dcfce7", color: "#16a34a" },
  EN_PROCESO: { bg: "#fef9c3", color: "#a16207" },
  CERRADO:    { bg: "#f3f4f6", color: "#6b7280" },
};

function Badge({ value, map }) {
  const s = map[value?.toUpperCase()] ?? { bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20,
      padding: "2px 10px", fontWeight: 700, fontSize: "0.8rem" }}>
      {value?.replace("_", " ") ?? "—"}
    </span>
  );
}

const columnas = [
  { key: "mantenimientoId",  label: "ID",          ancho: 70,
    render: m => `#${m.mantenimientoId}` },
  { key: "tipoMantenimiento", label: "Tipo",        ancho: 120,
    render: m => <Badge value={m.tipoMantenimiento} map={TIPO_BADGE} /> },
  { key: "descripcion",      label: "Descripción",  ancho: 280,
    render: m => m.descripcion?.length > 70 ? `${m.descripcion.substring(0, 70)}…` : m.descripcion },
  { key: "estado",           label: "Estado",       ancho: 120,
    render: m => <Badge value={m.estado} map={ESTADO_BADGE} /> },
  { key: "fechaProgramada",  label: "Fecha prog.",  ancho: 120,
    render: m => m.fechaProgramada ?? "—" },
];

const FORM_VACIO = {
  tipoMantenimiento: "PREVENTIVO",
  descripcion:       "",
  fechaProgramada:   "",
  estado:            "ABIERTO",
  responsableId:     "",
  equipoId:          "",
};

export default function MantenimientosPage() {
  const { crear, modificar, eliminar } = usePermiso("Mantenimientos");
  const usuarioActual = useSelector(selectUsuario);

  const [items,        setItems]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [busqueda,     setBusqueda]     = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTipo,   setFiltroTipo]   = useState("");
  const [modal,        setModal]        = useState({ open: false, variant: "error", message: "" });
  const [confirm,      setConfirm]      = useState({ open: false, id: null, loading: false });
  const [form,         setForm]         = useState(null);
  const [formLoading,  setFormLoading]  = useState(false);

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await mantenimientosApi.listar();
      setItems(Array.isArray(data.datos) ? data.datos : data.datos ? [data.datos] : []);
    } catch (e) {
      setModal({ open: true, variant: "error", message: e.message || "Error al cargar mantenimientos." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleGuardar = async (valores) => {
    setFormLoading(true);
    try {
      const payload = {
        ...valores,
        creadoPorId: form?.mantenimientoId ? undefined : (usuarioActual?.usuarioId ?? 0),
      };

      if (form?.mantenimientoId) {
        const res = await mantenimientosApi.actualizar(form.mantenimientoId, payload);
        if (res?.exito === false) throw new Error(res.mensaje || "No se pudo actualizar.");
        setModal({ open: true, variant: "success", message: "Mantenimiento actualizado correctamente." });
      } else {
        const res = await mantenimientosApi.crear({ ...payload, creadoPorId: usuarioActual?.usuarioId ?? 0 });
        if (res?.exito === false) throw new Error(res.mensaje || "No se pudo crear.");
        setModal({ open: true, variant: "success", message: "Mantenimiento creado correctamente." });
      }
      setForm(null);
      cargar();
    } catch (e) {
      setModal({ open: true, variant: "error", message: e.message || "No se pudo guardar." });
    } finally {
      setFormLoading(false);
    }
  };

  const confirmarEliminar = async () => {
    setConfirm(p => ({ ...p, loading: true }));
    try {
      const res = await mantenimientosApi.eliminar(confirm.id);
      if (res?.exito === false) throw new Error(res.mensaje || "No se pudo eliminar.");
      setConfirm({ open: false, id: null, loading: false });
      setModal({ open: true, variant: "success", message: "Mantenimiento eliminado correctamente." });
      cargar();
    } catch (e) {
      setConfirm(p => ({ ...p, loading: false }));
      setModal({ open: true, variant: "error", message: e.message || "No se pudo eliminar." });
    }
  };

  const abrirEditar = m => setForm({
    mantenimientoId:   m.mantenimientoId,
    tipoMantenimiento: m.tipoMantenimiento ?? "PREVENTIVO",
    descripcion:       m.descripcion ?? "",
    fechaProgramada:   m.fechaProgramada ?? "",
    estado:            m.estado ?? "ABIERTO",
    responsableId:     m.responsableId ?? "",
    equipoId:          m.equipoId ?? "",
  });

  const filtrados = items.filter(m =>
    (filtroEstado ? m.estado?.toUpperCase() === filtroEstado : true) &&
    (filtroTipo   ? m.tipoMantenimiento?.toUpperCase() === filtroTipo : true) &&
    (m.descripcion ?? "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ width: "100%", maxWidth: 1100 }}>

      <div className="page-toolbar">
        <h2>🔧 Mantenimientos</h2>
        <input className="search-input" type="text" placeholder="🔍 Buscar por descripción..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db",
            fontSize: "0.93rem", cursor: "pointer" }}>
          <option value="">Todos los tipos</option>
          {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db",
            fontSize: "0.93rem", cursor: "pointer" }}>
          <option value="">Todos los estados</option>
          {ESTADOS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
        {crear && (
          <button className="btn-primary" onClick={() => setForm({ ...FORM_VACIO })}>
            + Nuevo mantenimiento
          </button>
        )}
      </div>

      <DataTable
        columnas={columnas} datos={filtrados} loading={loading}
        keyField="mantenimientoId" mensajeVacio="No hay mantenimientos registrados."
        onEdit={modificar ? abrirEditar : undefined}
        onDelete={eliminar ? m => setConfirm({ open: true, id: m.mantenimientoId, loading: false }) : undefined}
      />

      {form !== null && (
        <Overlay onCerrar={() => setForm(null)}>
          <div style={{ width: "100%", maxWidth: 560 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "1.15rem", fontWeight: 800,
              color: "#232946", textAlign: "center" }}>
              {form.mantenimientoId ? "✏️ Editar mantenimiento" : "🔧 Nuevo mantenimiento"}
            </h3>
            <MantenimientoForm
              initial={form}
              onGuardar={handleGuardar}
              onCancelar={() => setForm(null)}
              loading={formLoading}
            />
          </div>
        </Overlay>
      )}

      <ModalDialog open={modal.open} variant={modal.variant} message={modal.message}
        onClose={() => setModal({ open: false, variant: "error", message: "" })} />

      <ModalDialog
        open={confirm.open} variant="confirm" title="Eliminar mantenimiento"
        message="¿Seguro que deseas eliminar este mantenimiento? Esta acción no se puede deshacer."
        loading={confirm.loading} confirmText="Sí, eliminar" cancelText="Cancelar"
        onConfirm={confirmarEliminar}
        onClose={() => setConfirm({ open: false, id: null, loading: false })}
      />
    </div>
  );
}
