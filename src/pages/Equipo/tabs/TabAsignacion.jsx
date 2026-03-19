// src/pages/Equipo/tabs/TabAsignacion.jsx
// Asigna el equipo a un usuario responsable y dependencia.
import React, { useEffect, useState } from "react";
import { equipoAsignacionApi } from "../../../api/equipoExtras.api";
import ConfirmInline from "../../../Componentes_react/ui/ConfirmInline";
import ErrorBanner   from "../../../Componentes_react/ui/ErrorBanner";
import FormAsignacion, { FORM_VACIO_ASIGNACION } from "../components/FormAsignacion";

function TipoUsuarioBadge({ tipo }) {
  if (!tipo) return null;
  const esJefe = tipo === "jefe";
  return (
    <span style={{
      background: esJefe ? "#e0e7ff" : "#dcfce7",
      color:      esJefe ? "#4338ca" : "#16a34a",
      padding: "1px 8px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700,
    }}>
      {tipo}
    </span>
  );
}

export default function TabAsignacion({ equipoId, crear, modificar, eliminar }) {
  const [lista,       setLista]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando,    setEditando]    = useState(null);
  const [guardando,   setGuardando]   = useState(false);
  const [confirmElim, setConfirmElim] = useState(null);

  const cargar = async () => {
    setLoading(true); setError("");
    try {
      const data = await equipoAsignacionApi.listar();
      const todas = Array.isArray(data.datos) ? data.datos : data.datos ? [data.datos] : [];
      setLista(todas.filter(a => String(a.equipoId) === String(equipoId)));
    } catch (e) {
      setError(e.message || "Error al cargar asignaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [equipoId]);

  const handleGuardar = async (valores) => {
    setGuardando(true);
    try {
      if (editando) {
        await equipoAsignacionApi.actualizar(editando.equipoAsignacionId, valores);
      } else {
        await equipoAsignacionApi.crear(valores);
      }
      setMostrarForm(false); setEditando(null);
      await cargar();
    } catch (e) {
      setError(e.message || "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await equipoAsignacionApi.eliminar(id);
      setConfirmElim(null);
      cargar();
    } catch (e) {
      setError(e.message || "No se pudo eliminar.");
    }
  };

  const cerrarForm = () => { setMostrarForm(false); setEditando(null); };

  return (
    <div>
      <ErrorBanner mensaje={error} />

      {!mostrarForm && crear && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setMostrarForm(true)}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#4c7318", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
            + Nueva asignación
          </button>
        </div>
      )}

      {mostrarForm && (
        <div style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
          <h4 style={{ margin: "0 0 16px", fontSize: "0.97rem", fontWeight: 700, color: "#232946" }}>
            {editando ? "✏️ Editar asignación" : "➕ Nueva asignación"}
          </h4>
          <FormAsignacion
            equipoId={equipoId}
            initial={editando ? {
              usuarioResponsableId: editando.usuarioResponsableId ?? "",
              fechaAsignacion:      editando.fechaAsignacion      ?? "",
              fechaDevolucion:      editando.fechaDevolucion      ?? "",
              observaciones:        editando.observaciones        ?? "",
              dependeciaId:         editando.dependeciaId         ?? "",
            } : FORM_VACIO_ASIGNACION}
            onGuardar={handleGuardar}
            onCancelar={cerrarForm}
            loading={guardando}
          />
        </div>
      )}

      {loading ? (
        <div style={{ color: "#888", padding: "16px 0" }}>Cargando asignaciones...</div>
      ) : lista.length === 0 ? (
        <div style={{ color: "#9ca3af", padding: "24px 0", textAlign: "center", fontSize: "0.93rem" }}>
          👤 No hay asignaciones registradas para este equipo.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {lista.map((asig) => (
            <div key={asig.equipoAsignacionId} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.97rem", color: "#232946", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {asig.usuarioNombre ?? `Usuario #${asig.usuarioResponsableId}`}
                  <TipoUsuarioBadge tipo={asig.tipoUsuario} />
                  {asig.dependenciaNombre && <span style={{ color: "#6b7280", fontWeight: 400 }}>· {asig.dependenciaNombre}</span>}
                </div>
                <div style={{ fontSize: "0.83rem", color: "#6b7280", marginTop: 3 }}>
                  Desde: {asig.fechaAsignacion}
                  {asig.fechaDevolucion && <span> · Hasta: {asig.fechaDevolucion}</span>}
                  {asig.observaciones   && <span> · {asig.observaciones}</span>}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {modificar && (
                  <button onClick={() => { setEditando(asig); setMostrarForm(true); }}
                    style={{ padding: "5px 12px", borderRadius: 7, border: "1.5px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "0.85rem" }}>✏️</button>
                )}
                {eliminar && (confirmElim === asig.equipoAsignacionId ? (
                  <ConfirmInline
                    onConfirmar={() => handleEliminar(asig.equipoAsignacionId)}
                    onCancelar={() => setConfirmElim(null)}
                  />
                ) : (
                  <button onClick={() => setConfirmElim(asig.equipoAsignacionId)}
                    style={{ padding: "5px 12px", borderRadius: 7, border: "1.5px solid #fca5a5", background: "#fff", cursor: "pointer", color: "#dc2626", fontSize: "0.85rem" }}>🗑️</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
