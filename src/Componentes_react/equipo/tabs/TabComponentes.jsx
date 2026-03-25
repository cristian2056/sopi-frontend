// src/pages/Equipo/tabs/TabComponentes.jsx
// Lista y gestiona los componentes físicos instalados en un equipo.
import React, { useEffect, useState } from "react";
import { componentesApi, composicionesApi } from "../../../api/componentes.api";
import EstadoBadge   from "../../ui/EstadoBadge";
import ConfirmInline from "../../ui/ConfirmInline";
import ErrorBanner   from "../../ui/ErrorBanner";
import ComponenteForm, { FORM_VACIO_COMPONENTE } from "../../components/ComponenteForm";

export default function TabComponentes({ equipoId, crear, modificar, eliminar }) {
  const [lista,       setLista]       = useState([]);
  const [catalogo,    setCatalogo]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando,    setEditando]    = useState(null);
  const [guardando,   setGuardando]   = useState(false);
  const [confirmElim, setConfirmElim] = useState(null);

  const cargar = async () => {
    setLoading(true); setError("");

    try {
      const rCat = await componentesApi.listar();
      setCatalogo(Array.isArray(rCat.datos) ? rCat.datos : []);
    } catch { /* si falla el catálogo, seguimos con [] */ }

    try {
      try {
        const rComp = await composicionesApi.listarPorEquipo(equipoId);
        setLista(Array.isArray(rComp.datos) ? rComp.datos : []);
      } catch {
        const rComp = await composicionesApi.listar();
        const todas = Array.isArray(rComp.datos) ? rComp.datos : [];
        setLista(todas.filter(c => String(c.equipoId) === String(equipoId)));
      }
    } catch (e) {
      setLista([]);
      setError(e.message || "Error al cargar componentes.");
    }

    setLoading(false);
  };

  useEffect(() => { cargar(); }, [equipoId]);

  const resolverComponenteId = async (nombre) => {
    const existente = catalogo.find(c => c.nombre.toLowerCase() === nombre.toLowerCase());
    if (existente) return parseInt(existente.componenteId);
    const res = await componentesApi.crear({ nombre });
    if (!res.exito) throw new Error(res.mensaje || "No se pudo crear el componente.");
    return parseInt(res.datos.componenteId);
  };

  const handleGuardar = async (valores) => {
    setGuardando(true); setError("");
    try {
      const componenteId = await resolverComponenteId(valores.nombre);
      const payload = {
        equipoId:         parseInt(equipoId),
        componenteId:     parseInt(componenteId),
        marcaId:          valores.marcaId          || null,
        codigo:           valores.codigo           || null,
        numeroSerie:      valores.numeroSerie      || null,
        especificaciones: valores.especificaciones || null,
        estado:           valores.estado,
        fechaInstalacion: valores.fechaInstalacion || null,
        fechaRetiro:      valores.fechaRetiro      || null,
        motivoRetiro:     valores.motivoRetiro     || null,
      };
      if (editando) {
        const res = await composicionesApi.actualizar(editando.composicionId, payload);
        if (!res.exito) throw new Error(res.mensaje || "No se pudo actualizar.");
      } else {
        const res = await composicionesApi.crear(payload);
        if (!res.exito) throw new Error(res.mensaje || "No se pudo guardar.");
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
      await composicionesApi.eliminar(id);
      setConfirmElim(null);
      cargar();
    } catch (e) {
      setError(e.message || "No se pudo eliminar.");
    }
  };

  const cerrarForm = () => { setMostrarForm(false); setEditando(null); };

  const initialEditar = editando ? {
    nombre:           catalogo.find(c => c.componenteId === editando.componenteId)?.nombre ?? editando.componenteNombre ?? "",
    marcaId:          editando.marcaId          ?? "",
    codigo:           editando.codigo           ?? "",
    numeroSerie:      editando.numeroSerie      ?? "",
    especificaciones: editando.especificaciones ?? "",
    estado:           editando.estado           ?? "INSTALADO",
    fechaInstalacion: editando.fechaInstalacion ?? "",
    fechaRetiro:      editando.fechaRetiro      ?? "",
    motivoRetiro:     editando.motivoRetiro     ?? "",
  } : FORM_VACIO_COMPONENTE;

  return (
    <div>
      <ErrorBanner mensaje={error} />

      {!mostrarForm && crear && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setMostrarForm(true)}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#4c7318", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
            + Agregar componente
          </button>
        </div>
      )}

      {mostrarForm && (
        <div style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
          <h4 style={{ margin: "0 0 16px", fontSize: "0.97rem", fontWeight: 700, color: "#232946" }}>
            {editando ? "✏️ Editar componente" : "➕ Nuevo componente"}
          </h4>
          <ComponenteForm initial={initialEditar} onGuardar={handleGuardar} onCancelar={cerrarForm} loading={guardando} />
        </div>
      )}

      {loading ? (
        <div style={{ color: "#888", padding: "16px 0" }}>Cargando componentes...</div>
      ) : lista.length === 0 ? (
        <div style={{ color: "#9ca3af", padding: "24px 0", textAlign: "center", fontSize: "0.93rem" }}>
          🔧 No hay componentes registrados para este equipo.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {lista.map((comp) => {
            const nombre = catalogo.find(c => c.componenteId === comp.componenteId)?.nombre
              ?? comp.componenteNombre ?? `Componente #${comp.componenteId}`;
            return (
              <div key={comp.composicionId} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.97rem", color: "#232946" }}>
                    {nombre}
                    {comp.marcaNombre && <span style={{ color: "#6b7280", fontWeight: 400 }}> · {comp.marcaNombre}</span>}
                  </div>
                  <div style={{ fontSize: "0.83rem", color: "#6b7280", marginTop: 3, display: "flex", flexWrap: "wrap", gap: "0 12px" }}>
                    {comp.especificaciones  && <span>{comp.especificaciones}</span>}
                    {comp.numeroSerie       && <span>S/N: {comp.numeroSerie}</span>}
                    {comp.codigo           && <span>Cód: {comp.codigo}</span>}
                    {comp.fechaInstalacion && <span>Instalado: {comp.fechaInstalacion}</span>}
                  </div>
                </div>

                <EstadoBadge estado={comp.estado} tipo="componente" />

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {modificar && (
                    <button onClick={() => { setEditando(comp); setMostrarForm(true); }}
                      style={{ padding: "5px 12px", borderRadius: 7, border: "1.5px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "0.85rem" }}>✏️</button>
                  )}
                  {eliminar && (confirmElim === comp.composicionId ? (
                    <ConfirmInline
                      onConfirmar={() => handleEliminar(comp.composicionId)}
                      onCancelar={() => setConfirmElim(null)}
                    />
                  ) : (
                    <button onClick={() => setConfirmElim(comp.composicionId)}
                      style={{ padding: "5px 12px", borderRadius: 7, border: "1.5px solid #fca5a5", background: "#fff", cursor: "pointer", color: "#dc2626", fontSize: "0.85rem" }}>🗑️</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
