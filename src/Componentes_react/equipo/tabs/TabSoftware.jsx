// src/pages/Equipo/tabs/TabSoftware.jsx
// Lista y gestiona el software instalado en un equipo.
import React, { useEffect, useState } from "react";
import { softwaresApi } from "../../../api/administracion.api";
import { equipoSoftwareApi } from "../../../api/equipoExtras.api";
import ConfirmInline from "../../ui/ConfirmInline";
import ErrorBanner   from "../../ui/ErrorBanner";
import FormSoftware, { FORM_VACIO_SOFTWARE } from "../../components/FormSoftware";

export default function TabSoftware({ equipoId, crear, modificar, eliminar }) {
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
      const [rSw, rCat] = await Promise.all([
        equipoSoftwareApi.listar(),
        softwaresApi.listar(),
      ]);
      const todas = Array.isArray(rSw.datos) ? rSw.datos : [];
      setLista(todas.filter(s => String(s.equipoId) === String(equipoId)));
      setCatalogo(Array.isArray(rCat.datos) ? rCat.datos : []);
    } catch (e) {
      setError(e.message || "Error al cargar software.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [equipoId]);

  const resolverSoftwareId = async (nombre) => {
    const existente = catalogo.find(s => s.nombre.toLowerCase() === nombre.toLowerCase());
    if (existente) return existente.softwareId;
    const res = await softwaresApi.crear({ nombre });
    return res.datos?.softwareId ?? res.datos;
  };

  const handleGuardar = async (valores) => {
    setGuardando(true); setError("");
    try {
      const softwareId = await resolverSoftwareId(valores.nombre);
      const payload = {
        equipoId:        parseInt(equipoId),
        softwareId,
        codigoLicencia:  valores.codigoLicencia  || null,
        fechaExpiracion: valores.fechaExpiracion || null,
      };
      if (editando) {
        await equipoSoftwareApi.actualizar(editando.equipoSoftwareId, payload);
      } else {
        await equipoSoftwareApi.crear(payload);
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
      await equipoSoftwareApi.eliminar(id);
      setConfirmElim(null);
      cargar();
    } catch (e) {
      setError(e.message || "No se pudo eliminar.");
    }
  };

  const cerrarForm = () => { setMostrarForm(false); setEditando(null); };

  const initialEditar = editando ? {
    nombre:          catalogo.find(s => s.softwareId === editando.softwareId)?.nombre ?? editando.softwareNombre ?? "",
    version:         catalogo.find(s => s.softwareId === editando.softwareId)?.version ?? "",
    codigoLicencia:  editando.codigoLicencia  ?? "",
    fechaExpiracion: editando.fechaExpiracion ?? "",
  } : FORM_VACIO_SOFTWARE;

  return (
    <div>
      <ErrorBanner mensaje={error} />

      {!mostrarForm && crear && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setMostrarForm(true)}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#4c7318", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
            + Agregar software
          </button>
        </div>
      )}

      {mostrarForm && (
        <div style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
          <h4 style={{ margin: "0 0 16px", fontSize: "0.97rem", fontWeight: 700, color: "#232946" }}>
            {editando ? "✏️ Editar software" : "➕ Nuevo software"}
          </h4>
          <FormSoftware initial={initialEditar} onGuardar={handleGuardar} onCancelar={cerrarForm} loading={guardando} />
        </div>
      )}

      {loading ? (
        <div style={{ color: "#888", padding: "16px 0" }}>Cargando software...</div>
      ) : lista.length === 0 ? (
        <div style={{ color: "#9ca3af", padding: "24px 0", textAlign: "center", fontSize: "0.93rem" }}>
          💿 No hay software registrado para este equipo.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {lista.map((sw) => {
            const entry  = catalogo.find(s => s.softwareId === sw.softwareId);
            const nombre = entry?.nombre  ?? sw.softwareNombre ?? `Software #${sw.softwareId}`;
            const version = entry?.version ?? null;
            return (
              <div key={sw.equipoSoftwareId} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.97rem", color: "#232946" }}>
                    {nombre}
                    {version && <span style={{ color: "#6b7280", fontWeight: 400 }}> · {version}</span>}
                  </div>
                  <div style={{ fontSize: "0.83rem", color: "#6b7280", marginTop: 3, display: "flex", flexWrap: "wrap", gap: "0 12px" }}>
                    {sw.codigoLicencia  && <span>Licencia: {sw.codigoLicencia}</span>}
                    {sw.fechaExpiracion && <span>Expira: {sw.fechaExpiracion}</span>}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {modificar && (
                    <button onClick={() => { setEditando(sw); setMostrarForm(true); }}
                      style={{ padding: "5px 12px", borderRadius: 7, border: "1.5px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "0.85rem" }}>✏️</button>
                  )}
                  {eliminar && (confirmElim === sw.equipoSoftwareId ? (
                    <ConfirmInline
                      onConfirmar={() => handleEliminar(sw.equipoSoftwareId)}
                      onCancelar={() => setConfirmElim(null)}
                    />
                  ) : (
                    <button onClick={() => setConfirmElim(sw.equipoSoftwareId)}
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
