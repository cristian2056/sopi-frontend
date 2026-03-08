// src/pages/Equipo/tabs/TabSoftware.jsx
import React, { useEffect, useState } from "react";
import { equipoSoftwareApi } from "../../../api/equipoExtras.api";
import { http } from "../../../services/http";

const inputStyle = {
  width: "100%", padding: "9px 11px", borderRadius: 8,
  border: "1.5px solid #d1d5db", fontSize: "0.93rem",
  boxSizing: "border-box", background: "#fff", color: "#111", outline: "none",
};
const labelStyle = {
  display: "block", fontWeight: 600, marginBottom: 5,
  color: "#374151", fontSize: "0.87rem",
};

const FORM_VACIO = { softwareId: "", codigoLicencia: "", fechaExpiracion: "" };

function FormSoftware({ equipoId, initial = FORM_VACIO, onGuardar, onCancelar, loading }) {
  const [form, setForm]       = useState(initial);
  const [softwares, setSoftwares] = useState([]);
  const [cargando, setCargando]   = useState(true);

  useEffect(() => {
    http("/api/Softwares")
      .then(r => setSoftwares(r.datos ?? []))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({
      ...form,
      equipoId:        parseInt(equipoId),
      softwareId:      parseInt(form.softwareId) || 0,
      codigoLicencia:  form.codigoLicencia.trim() || null,
      fechaExpiracion: form.fechaExpiracion || null,
    });
  };

  if (cargando) return <div style={{ color: "#888" }}>Cargando...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Software <span style={{ color: "#ef4444" }}>*</span></label>
          <select value={form.softwareId} onChange={set("softwareId")} required
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">-- Seleccionar --</option>
            {softwares.map(s => (
              <option key={s.softwareId} value={s.softwareId}>{s.nombre}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Código de Licencia</label>
          <input type="text" placeholder="Ej: XXXX-XXXX-XXXX" value={form.codigoLicencia}
            onChange={set("codigoLicencia")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Fecha de Expiración</label>
          <input type="date" value={form.fechaExpiracion}
            onChange={set("fechaExpiracion")} style={inputStyle} />
        </div>

      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button type="button" onClick={onCancelar}
          style={{
            flex: 1, padding: "9px 0", borderRadius: 8,
            border: "1.5px solid #d1d5db", background: "#fff",
            fontWeight: 600, fontSize: "0.93rem", cursor: "pointer", color: "#374151",
          }}>
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          style={{
            flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
            background: loading ? "#9ca3af" : "#4c7318",
            color: "#fff", fontWeight: 700, fontSize: "0.93rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}>
          {loading ? "Guardando..." : "Guardar software"}
        </button>
      </div>
    </form>
  );
}

export default function TabSoftware({ equipoId }) {
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
      const data = await equipoSoftwareApi.listar();
      const todas = Array.isArray(data.datos) ? data.datos : [];
      setLista(todas.filter(s => String(s.equipoId) === String(equipoId)));
    } catch (e) {
      setError(e.message || "Error al cargar software.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [equipoId]);

  const handleGuardar = async (valores) => {
    setGuardando(true);
    try {
      if (editando) {
        await equipoSoftwareApi.actualizar(editando.equipoSoftwareId, valores);
      } else {
        await equipoSoftwareApi.crear(valores);
      }
      setMostrarForm(false); setEditando(null);
      cargar();
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

  return (
    <div>
      {error && (
        <div style={{ color: "#dc2626", background: "#fee2e2", padding: "8px 14px", borderRadius: 8, marginBottom: 14, fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      {!mostrarForm && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setMostrarForm(true)}
            style={{
              padding: "8px 18px", borderRadius: 8, border: "none",
              background: "#4c7318", color: "#fff",
              fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
            }}>
            + Agregar software
          </button>
        </div>
      )}

      {mostrarForm && (
        <div style={{
          background: "#f9fafb", border: "1.5px solid #e5e7eb",
          borderRadius: 12, padding: "20px 22px", marginBottom: 20,
        }}>
          <h4 style={{ margin: "0 0 16px", fontSize: "0.97rem", fontWeight: 700, color: "#232946" }}>
            {editando ? "✏️ Editar software" : "➕ Nuevo software"}
          </h4>
          <FormSoftware
            equipoId={equipoId}
            initial={editando ? {
              softwareId:      editando.softwareId      ?? "",
              codigoLicencia:  editando.codigoLicencia  ?? "",
              fechaExpiracion: editando.fechaExpiracion ?? "",
            } : FORM_VACIO}
            onGuardar={handleGuardar}
            onCancelar={cerrarForm}
            loading={guardando}
          />
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
          {lista.map((sw) => (
            <div key={sw.equipoSoftwareId} style={{
              background: "#fff", border: "1.5px solid #e5e7eb",
              borderRadius: 10, padding: "14px 18px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.97rem", color: "#232946" }}>
                  {sw.softwareNombre ?? `Software #${sw.softwareId}`}
                </div>
                <div style={{ fontSize: "0.83rem", color: "#6b7280", marginTop: 3 }}>
                  {sw.codigoLicencia  && <span>Licencia: {sw.codigoLicencia}</span>}
                  {sw.fechaExpiracion && <span> · Expira: {sw.fechaExpiracion}</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => { setEditando(sw); setMostrarForm(true); }} title="Editar"
                  style={{
                    padding: "5px 12px", borderRadius: 7, border: "1.5px solid #d1d5db",
                    background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                  }}>✏️</button>
                {confirmElim === sw.equipoSoftwareId ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "#dc2626" }}>¿Eliminar?</span>
                    <button onClick={() => handleEliminar(sw.equipoSoftwareId)}
                      style={{ padding: "4px 10px", borderRadius: 7, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem" }}>Sí</button>
                    <button onClick={() => setConfirmElim(null)}
                      style={{ padding: "4px 10px", borderRadius: 7, border: "1.5px solid #d1d5db", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>No</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmElim(sw.equipoSoftwareId)} title="Eliminar"
                    style={{
                      padding: "5px 12px", borderRadius: 7, border: "1.5px solid #fca5a5",
                      background: "#fff", cursor: "pointer", color: "#dc2626", fontSize: "0.85rem",
                    }}>🗑️</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}