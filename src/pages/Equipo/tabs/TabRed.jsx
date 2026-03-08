// src/pages/Equipo/tabs/TabRed.jsx
import React, { useEffect, useState } from "react";
import { equipoRedApi } from "../../../api/equipoExtras.api";

const inputStyle = {
  width: "100%", padding: "9px 11px", borderRadius: 8,
  border: "1.5px solid #d1d5db", fontSize: "0.93rem",
  boxSizing: "border-box", background: "#fff", color: "#111", outline: "none",
};
const labelStyle = {
  display: "block", fontWeight: 600, marginBottom: 5,
  color: "#374151", fontSize: "0.87rem",
};

const FORM_VACIO = {
  ipAddress: "", macAddress: "", gateway: "", vlan: "", comentarios: "",
};

function FormRed({ equipoId, initial = FORM_VACIO, onGuardar, onCancelar, loading }) {
  const [form, setForm] = useState(initial);
  const set = (campo) => (e) => setForm(p => ({ ...p, [campo]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({
      ...form,
      equipoId:    parseInt(equipoId),
      vlan:        form.vlan ? parseInt(form.vlan) : null,
      gateway:     form.gateway.trim()     || null,
      comentarios: form.comentarios.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>IP Address <span style={{ color: "#ef4444" }}>*</span></label>
          <input type="text" placeholder="Ej: 192.168.1.100" value={form.ipAddress}
            onChange={set("ipAddress")} required style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>MAC Address <span style={{ color: "#ef4444" }}>*</span></label>
          <input type="text" placeholder="Ej: AA:BB:CC:DD:EE:FF" value={form.macAddress}
            onChange={set("macAddress")} required style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Gateway</label>
          <input type="text" placeholder="Ej: 192.168.1.1" value={form.gateway}
            onChange={set("gateway")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>VLAN</label>
          <input type="number" placeholder="Ej: 10" value={form.vlan}
            onChange={set("vlan")} min={1} max={4094} style={inputStyle} />
        </div>

      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Comentarios</label>
        <textarea placeholder="Notas adicionales de red..."
          value={form.comentarios} onChange={set("comentarios")}
          rows={2} style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
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
          {loading ? "Guardando..." : "Guardar red"}
        </button>
      </div>
    </form>
  );
}

export default function TabRed({ equipoId }) {
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
      const data = await equipoRedApi.listar();
      const todas = Array.isArray(data.datos) ? data.datos : [];
      setLista(todas.filter(r => String(r.equipoId) === String(equipoId)));
    } catch (e) {
      setError(e.message || "Error al cargar configuración de red.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [equipoId]);

  const handleGuardar = async (valores) => {
    setGuardando(true);
    try {
      if (editando) {
        await equipoRedApi.actualizar(editando.equipoRedId, valores);
      } else {
        await equipoRedApi.crear(valores);
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
      await equipoRedApi.eliminar(id);
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
            + Agregar configuración de red
          </button>
        </div>
      )}

      {mostrarForm && (
        <div style={{
          background: "#f9fafb", border: "1.5px solid #e5e7eb",
          borderRadius: 12, padding: "20px 22px", marginBottom: 20,
        }}>
          <h4 style={{ margin: "0 0 16px", fontSize: "0.97rem", fontWeight: 700, color: "#232946" }}>
            {editando ? "✏️ Editar red" : "➕ Nueva configuración de red"}
          </h4>
          <FormRed
            equipoId={equipoId}
            initial={editando ? {
              ipAddress:   editando.ipAddress   ?? "",
              macAddress:  editando.macAddress  ?? "",
              gateway:     editando.gateway     ?? "",
              vlan:        editando.vlan        ?? "",
              comentarios: editando.comentarios ?? "",
            } : FORM_VACIO}
            onGuardar={handleGuardar}
            onCancelar={cerrarForm}
            loading={guardando}
          />
        </div>
      )}

      {loading ? (
        <div style={{ color: "#888", padding: "16px 0" }}>Cargando configuración de red...</div>
      ) : lista.length === 0 ? (
        <div style={{ color: "#9ca3af", padding: "24px 0", textAlign: "center", fontSize: "0.93rem" }}>
          🌐 No hay configuración de red para este equipo.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {lista.map((red) => (
            <div key={red.equipoRedId} style={{
              background: "#fff", border: "1.5px solid #e5e7eb",
              borderRadius: 10, padding: "14px 18px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.97rem", color: "#232946" }}>
                  {red.ipAddress}
                  {red.vlan && <span style={{ color: "#6b7280", fontWeight: 400 }}> · VLAN {red.vlan}</span>}
                </div>
                <div style={{ fontSize: "0.83rem", color: "#6b7280", marginTop: 3 }}>
                  MAC: {red.macAddress}
                  {red.gateway && <span> · GW: {red.gateway}</span>}
                  {red.comentarios && <span> · {red.comentarios}</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => { setEditando(red); setMostrarForm(true); }} title="Editar"
                  style={{
                    padding: "5px 12px", borderRadius: 7, border: "1.5px solid #d1d5db",
                    background: "#fff", cursor: "pointer", fontSize: "0.85rem",
                  }}>✏️</button>
                {confirmElim === red.equipoRedId ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "#dc2626" }}>¿Eliminar?</span>
                    <button onClick={() => handleEliminar(red.equipoRedId)}
                      style={{ padding: "4px 10px", borderRadius: 7, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem" }}>Sí</button>
                    <button onClick={() => setConfirmElim(null)}
                      style={{ padding: "4px 10px", borderRadius: 7, border: "1.5px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: "0.82rem" }}>No</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmElim(red.equipoRedId)} title="Eliminar"
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